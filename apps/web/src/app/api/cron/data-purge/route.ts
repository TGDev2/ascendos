import { NextRequest, NextResponse } from "next/server";
import { db } from "@ascendos/database";
import { subDays } from "date-fns";
import { loggers, logError, logSecurityEvent } from "@/lib/logger";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes for large purges

/**
 * Data purge cron job (GDPR compliance)
 * Deletes old data based on organization retention settings
 *
 * This endpoint should be called by a cron scheduler (e.g., Vercel Cron)
 * Security: Verify the request is from Vercel Cron using CRON_SECRET
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security (MANDATORY)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      loggers.cron.error("CRON_SECRET is not configured - endpoint disabled for security");
      return NextResponse.json(
        { error: "Server configuration error: CRON_SECRET required" },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      logSecurityEvent("unauthorized_cron_access", { endpoint: "data-purge" });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    loggers.cron.info("Starting data purge job");

    const now = new Date();
    const results = {
      organizationsProcessed: 0,
      updatesDeleted: 0,
      decisionsDeleted: 0,
      risksDeleted: 0,
      usageLogsDeleted: 0,
      errors: 0,
    };

    // Get all organizations with settings
    const organizations = await db.organization.findMany({
      include: {
        settings: true,
      },
    });

    loggers.cron.info({ count: organizations.length }, "Found organizations to process");

    for (const org of organizations) {
      try {
        const settings = org.settings;
        if (!settings) {
          continue; // Skip if no settings configured
        }

        const retentionDays = settings.dataRetentionDays;
        const cutoffDate = subDays(now, retentionDays);

        loggers.cron.debug({ organizationId: org.id, retentionDays, cutoffDate: cutoffDate.toISOString() }, "Processing organization");

        // Get all projects for this organization
        const projects = await db.project.findMany({
          where: { organizationId: org.id },
          select: { id: true },
        });

        const projectIds = projects.map((p) => p.id);

        if (projectIds.length === 0) {
          results.organizationsProcessed++;
          continue;
        }

        // Delete old updates (only if storeRawInput is false or data is older than retention)
        const deletedUpdates = await db.update.deleteMany({
          where: {
            projectId: { in: projectIds },
            createdAt: { lt: cutoffDate },
          },
        });

        results.updatesDeleted += deletedUpdates.count;

        // Delete old decisions (resolved/cancelled only)
        const deletedDecisions = await db.decision.deleteMany({
          where: {
            projectId: { in: projectIds },
            createdAt: { lt: cutoffDate },
            status: { in: ["DECIDED", "CANCELLED"] },
          },
        });

        results.decisionsDeleted += deletedDecisions.count;

        // Delete old risks (resolved/cancelled only)
        const deletedRisks = await db.risk.deleteMany({
          where: {
            projectId: { in: projectIds },
            identifiedAt: { lt: cutoffDate },
            status: { in: ["RESOLVED", "CANCELLED"] },
          },
        });

        results.risksDeleted += deletedRisks.count;

        // Delete old usage logs
        const deletedLogs = await db.usageLog.deleteMany({
          where: {
            organizationId: org.id,
            createdAt: { lt: cutoffDate },
          },
        });

        results.usageLogsDeleted += deletedLogs.count;

        results.organizationsProcessed++;

        loggers.cron.info({
          organizationId: org.id,
          updatesDeleted: deletedUpdates.count,
          decisionsDeleted: deletedDecisions.count,
          risksDeleted: deletedRisks.count,
          logsDeleted: deletedLogs.count,
        }, "Organization purge completed");
      } catch (error) {
        logError(error, { context: "data-purge", organizationId: org.id });
        results.errors++;
      }
    }

    loggers.cron.info(results, "Data purge job completed");

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    logError(error, { context: "data-purge", fatal: true });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
