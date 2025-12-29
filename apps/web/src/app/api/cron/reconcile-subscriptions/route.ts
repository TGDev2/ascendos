import { NextRequest, NextResponse } from "next/server";
import { db, type Plan } from "@ascendos/database";
import { stripe } from "@/lib/stripe/client";
import { isSubscriptionActive } from "@/lib/stripe/helpers";
import {
  loggers,
  logError,
  logSecurityEvent,
  logBusinessEvent,
} from "@/lib/logger";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const maxDuration = 120; // 2 minutes max for processing many orgs

interface ReconciliationResult {
  organizationId: string;
  organizationName: string;
  issue: string;
  action: string;
  details: Record<string, unknown>;
}

interface ReconciliationSummary {
  totalChecked: number;
  consistentCount: number;
  fixedCount: number;
  errorCount: number;
  issues: ReconciliationResult[];
}

/**
 * GET /api/cron/reconcile-subscriptions
 *
 * Cron job that reconciles subscription status between Stripe and our database.
 * This serves as a backup mechanism to ensure consistency even if webhooks fail.
 *
 * Runs hourly and:
 * - Verifies all organizations with Stripe subscription IDs
 * - Checks if DB status matches Stripe reality
 * - Fixes inconsistencies automatically
 * - Alerts on anomalies
 *
 * Security: Protected by CRON_SECRET
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security (MANDATORY)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      loggers.cron.error(
        "CRON_SECRET is not configured - endpoint disabled for security",
      );
      return NextResponse.json(
        { error: "Server configuration error: CRON_SECRET required" },
        { status: 500 },
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      logSecurityEvent("unauthorized_cron_access", {
        endpoint: "reconcile-subscriptions",
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    loggers.cron.info("Starting Stripe subscription reconciliation job");

    const summary: ReconciliationSummary = {
      totalChecked: 0,
      consistentCount: 0,
      fixedCount: 0,
      errorCount: 0,
      issues: [],
    };

    // Fetch all organizations with Stripe subscriptions
    const organizations = await db.organization.findMany({
      where: {
        stripeSubscriptionId: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
        plan: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripePriceId: true,
        stripeCurrentPeriodEnd: true,
        cancelAtPeriodEnd: true,
        trialEndsAt: true,
        maxProjects: true,
        maxDecisionsPerProject: true,
        maxRisksPerProject: true,
      },
    });

    loggers.cron.info(
      { count: organizations.length },
      "Found organizations with subscriptions",
    );

    for (const org of organizations) {
      summary.totalChecked++;

      try {
        if (!org.stripeSubscriptionId) continue;

        // Fetch subscription from Stripe
        let subscription: Stripe.Subscription;
        try {
          subscription = await stripe.subscriptions.retrieve(
            org.stripeSubscriptionId,
          );
        } catch (stripeError) {
          // Subscription doesn't exist in Stripe - major issue
          const error = stripeError as { code?: string };
          if (error.code === "resource_missing") {
            summary.issues.push({
              organizationId: org.id,
              organizationName: org.name,
              issue: "subscription_not_found",
              action: "reset_to_trial",
              details: { subscriptionId: org.stripeSubscriptionId },
            });

            // Reset to TRIAL since subscription is gone
            await db.organization.update({
              where: { id: org.id },
              data: {
                plan: "TRIAL",
                stripeSubscriptionId: null,
                stripePriceId: null,
                stripeCurrentPeriodEnd: null,
                cancelAtPeriodEnd: false,
                trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
                maxProjects: 1,
                maxDecisionsPerProject: 10,
                maxRisksPerProject: 10,
              },
            });

            logBusinessEvent("subscription_reconciliation_fix", {
              organizationId: org.id,
              issue: "subscription_not_found",
              action: "reset_to_trial",
            });

            summary.fixedCount++;
            continue;
          }
          throw stripeError;
        }

        const issues: string[] = [];
        const fixes: Partial<{
          plan: Plan;
          stripePriceId: string | null;
          stripeCurrentPeriodEnd: Date | null;
          cancelAtPeriodEnd: boolean;
          trialEndsAt: Date | null;
          maxProjects: number;
          maxDecisionsPerProject: number;
          maxRisksPerProject: number;
        }> = {};

        // Check 1: Subscription status
        const isActive = isSubscriptionActive(subscription);
        const dbPlanIsPaid = org.plan !== "TRIAL";

        if (!isActive && dbPlanIsPaid) {
          // Stripe subscription is not active but DB shows paid plan
          issues.push("subscription_inactive_but_db_paid");
          fixes.plan = "TRIAL";
          fixes.trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days grace period
          fixes.maxProjects = 1;
          fixes.maxDecisionsPerProject = 10;
          fixes.maxRisksPerProject = 10;
        }

        // Check 2: Plan mismatch
        const stripePriceId = subscription.items.data[0]?.price?.id;
        const expectedPlan = getPlanFromPriceId(stripePriceId);

        if (isActive && expectedPlan && org.plan !== expectedPlan) {
          issues.push("plan_mismatch");
          fixes.plan = expectedPlan;
          // Update limits based on plan
          const limits = getPlanLimits(expectedPlan);
          fixes.maxProjects = limits.maxProjects;
          fixes.maxDecisionsPerProject = limits.maxDecisionsPerProject;
          fixes.maxRisksPerProject = limits.maxRisksPerProject;
        }

        // Check 3: Period end date mismatch
        const stripeEndDate = new Date(subscription.current_period_end * 1000);
        if (
          org.stripeCurrentPeriodEnd &&
          Math.abs(
            stripeEndDate.getTime() - org.stripeCurrentPeriodEnd.getTime(),
          ) >
            60 * 60 * 1000 // 1 hour tolerance
        ) {
          issues.push("period_end_mismatch");
          fixes.stripeCurrentPeriodEnd = stripeEndDate;
        }

        // Check 4: Cancel at period end mismatch
        if (org.cancelAtPeriodEnd !== subscription.cancel_at_period_end) {
          issues.push("cancel_flag_mismatch");
          fixes.cancelAtPeriodEnd = subscription.cancel_at_period_end;
        }

        // Check 5: Price ID mismatch
        if (stripePriceId && org.stripePriceId !== stripePriceId) {
          issues.push("price_id_mismatch");
          fixes.stripePriceId = stripePriceId;
        }

        // Apply fixes if any
        if (Object.keys(fixes).length > 0) {
          await db.organization.update({
            where: { id: org.id },
            data: fixes,
          });

          summary.issues.push({
            organizationId: org.id,
            organizationName: org.name,
            issue: issues.join(","),
            action: "fixed",
            details: { dbBefore: org, fixes },
          });

          logBusinessEvent("subscription_reconciliation_fix", {
            organizationId: org.id,
            issues,
            fixes,
          });

          summary.fixedCount++;
        } else {
          summary.consistentCount++;
        }
      } catch (error) {
        logError(error, {
          context: "reconcile-subscriptions",
          organizationId: org.id,
        });

        summary.issues.push({
          organizationId: org.id,
          organizationName: org.name,
          issue: "processing_error",
          action: "skipped",
          details: { error: String(error) },
        });

        summary.errorCount++;
      }
    }

    // Also check for organizations without subscriptions that claim to be paid
    const orphanedPaidOrgs = await db.organization.findMany({
      where: {
        plan: { in: ["TEAM", "AGENCY"] },
        stripeSubscriptionId: null,
      },
      select: {
        id: true,
        name: true,
        plan: true,
        createdAt: true,
      },
    });

    for (const org of orphanedPaidOrgs) {
      // Skip if recently created (might be in checkout flow)
      const isRecent = Date.now() - org.createdAt.getTime() < 60 * 60 * 1000; // 1 hour
      if (isRecent) continue;

      summary.issues.push({
        organizationId: org.id,
        organizationName: org.name,
        issue: "paid_plan_without_subscription",
        action: "reset_to_trial",
        details: { plan: org.plan },
      });

      await db.organization.update({
        where: { id: org.id },
        data: {
          plan: "TRIAL",
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days grace
          maxProjects: 1,
          maxDecisionsPerProject: 10,
          maxRisksPerProject: 10,
        },
      });

      logBusinessEvent("subscription_reconciliation_fix", {
        organizationId: org.id,
        issue: "paid_plan_without_subscription",
        action: "reset_to_trial",
      });

      summary.fixedCount++;
    }

    // Log summary
    loggers.cron.info(
      {
        totalChecked: summary.totalChecked,
        consistentCount: summary.consistentCount,
        fixedCount: summary.fixedCount,
        errorCount: summary.errorCount,
        issueCount: summary.issues.length,
      },
      "Stripe subscription reconciliation completed",
    );

    // Alert if there were significant issues
    if (summary.fixedCount > 0 || summary.errorCount > 0) {
      logBusinessEvent("subscription_reconciliation_alert", {
        fixedCount: summary.fixedCount,
        errorCount: summary.errorCount,
        issues: summary.issues.slice(0, 10), // Log first 10 issues
      });
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalChecked: summary.totalChecked,
        consistentCount: summary.consistentCount,
        fixedCount: summary.fixedCount,
        errorCount: summary.errorCount,
      },
      issues: summary.issues,
    });
  } catch (error) {
    logError(error, { context: "reconcile-subscriptions", fatal: true });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * Maps Stripe price ID to our Plan enum
 */
function getPlanFromPriceId(priceId: string | undefined): Plan | null {
  if (!priceId) return null;

  if (priceId === process.env.STRIPE_TEAM_PRICE_ID) {
    return "TEAM";
  }
  if (priceId === process.env.STRIPE_AGENCY_PRICE_ID) {
    return "AGENCY";
  }

  return null;
}

/**
 * Returns the limits for a given plan
 */
function getPlanLimits(plan: Plan): {
  maxProjects: number;
  maxDecisionsPerProject: number;
  maxRisksPerProject: number;
} {
  switch (plan) {
    case "TEAM":
      return {
        maxProjects: 10,
        maxDecisionsPerProject: 100,
        maxRisksPerProject: 100,
      };
    case "AGENCY":
      return {
        maxProjects: -1, // unlimited
        maxDecisionsPerProject: -1,
        maxRisksPerProject: -1,
      };
    case "TRIAL":
    default:
      return {
        maxProjects: 1,
        maxDecisionsPerProject: 10,
        maxRisksPerProject: 10,
      };
  }
}
