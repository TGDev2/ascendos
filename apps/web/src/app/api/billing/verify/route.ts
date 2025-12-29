import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe/client";
import { db, rateLimiter, type Plan } from "@ascendos/database";
import { loggers, logBusinessEvent } from "@/lib/logger";

/**
 * POST /api/billing/verify
 * Vérification synchrone du paiement Stripe après checkout
 *
 * Cet endpoint est appelé immédiatement après le retour de Stripe (success_url)
 * pour vérifier le paiement et mettre à jour le plan sans attendre le webhook.
 * Le webhook reste le backup pour garantir la cohérence.
 *
 * Body: { sessionId: string }
 * Returns: { success: boolean, plan?: string, error?: string }
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authentifier l'utilisateur
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Please sign in" },
        { status: 401 },
      );
    }

    // 2. Parser le body
    const body = await req.json();
    const { sessionId } = body as { sessionId: string };

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing sessionId" },
        { status: 400 },
      );
    }

    // 3. Récupérer l'utilisateur et son organisation
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        organization: true,
      },
    });

    if (!user || !user.organization) {
      return NextResponse.json(
        { success: false, error: "User or organization not found" },
        { status: 404 },
      );
    }

    // 4. Récupérer la session Stripe
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["subscription"],
      });
    } catch (stripeError) {
      loggers.billing.error(
        { sessionId, error: stripeError },
        "Failed to retrieve Stripe session",
      );
      return NextResponse.json(
        { success: false, error: "Invalid session ID" },
        { status: 400 },
      );
    }

    // 5. Vérifier que la session appartient à cette organisation
    if (session.metadata?.organizationId !== user.organization.id) {
      loggers.billing.warn(
        {
          sessionId,
          expectedOrgId: user.organization.id,
          actualOrgId: session.metadata?.organizationId,
        },
        "Session organization mismatch",
      );
      return NextResponse.json(
        {
          success: false,
          error: "Session does not belong to this organization",
        },
        { status: 403 },
      );
    }

    // 6. Vérifier le statut de la session
    if (session.payment_status !== "paid") {
      loggers.billing.info(
        { sessionId, paymentStatus: session.payment_status },
        "Payment not completed",
      );
      return NextResponse.json({
        success: false,
        error: "Payment not completed",
        paymentStatus: session.payment_status,
      });
    }

    // 7. Vérifier si l'organisation est déjà mise à jour (idempotence)
    if (
      user.organization.plan !== "TRIAL" &&
      user.organization.stripeSubscriptionId
    ) {
      loggers.billing.info(
        { organizationId: user.organization.id, plan: user.organization.plan },
        "Organization already upgraded (idempotent)",
      );
      return NextResponse.json({
        success: true,
        plan: user.organization.plan,
        message: "Already upgraded",
      });
    }

    // 8. Extraire les détails de la subscription
    const subscription =
      session.subscription as import("stripe").Stripe.Subscription;
    const plan = session.metadata?.plan as Plan;

    if (!subscription || !plan) {
      loggers.billing.error(
        { sessionId },
        "Missing subscription or plan in session",
      );
      return NextResponse.json(
        { success: false, error: "Invalid session data" },
        { status: 400 },
      );
    }

    // 9. Définir les limites en fonction du plan
    const planLimits =
      plan === "AGENCY"
        ? {
            maxProjects: -1,
            maxDecisionsPerProject: -1,
            maxRisksPerProject: -1,
          }
        : {
            maxProjects: 10,
            maxDecisionsPerProject: 100,
            maxRisksPerProject: 100,
          }; // TEAM

    // 10. Mettre à jour l'organisation (identique au webhook pour cohérence)
    await db.organization.update({
      where: { id: user.organization.id },
      data: {
        plan,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
        cancelAtPeriodEnd: false,
        // Reset le trial
        trialEndsAt: null,
        trialGenerations: 0,
        // Appliquer les limites du plan
        ...planLimits,
      },
    });

    // 10. Reset le rate limiter
    await rateLimiter.resetOrganizationLimit(user.organization.id);

    loggers.billing.info(
      { organizationId: user.organization.id, plan, source: "sync_verify" },
      "Subscription upgraded via sync verification",
    );

    logBusinessEvent("subscription_upgraded", {
      organizationId: user.organization.id,
      plan,
      source: "sync_verify",
    });

    return NextResponse.json({
      success: true,
      plan,
      message: "Subscription upgraded successfully",
    });
  } catch (error) {
    loggers.billing.error({ error }, "Error in billing verification");

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
