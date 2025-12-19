import { NextRequest, NextResponse } from "next/server";
import { db } from "@ascendos/database";
import { subDays } from "date-fns";

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
      console.error("[Data Purge] CRON_SECRET is not configured - endpoint disabled for security");
      return NextResponse.json(
        { error: "Server configuration error: CRON_SECRET required" },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error("[Data Purge] Unauthorized cron request - invalid or missing authorization header");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Data Purge] Starting data purge job...");

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

    console.log(`[Data Purge] Found ${organizations.length} organizations`);

    for (const org of organizations) {
      try {
        const settings = org.settings;
        if (!settings) {
          continue; // Skip if no settings configured
        }

        const retentionDays = settings.dataRetentionDays;
        const cutoffDate = subDays(now, retentionDays);

        console.log(
          `[Data Purge] Processing org ${org.id} (retention: ${retentionDays} days, cutoff: ${cutoffDate.toISOString()})`
        );

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

        console.log(
          `[Data Purge] Org ${org.id}: ${deletedUpdates.count} updates, ${deletedDecisions.count} decisions, ${deletedRisks.count} risks, ${deletedLogs.count} logs deleted`
        );
      } catch (error) {
        console.error(`[Data Purge] Error processing org ${org.id}:`, error);
        results.errors++;
      }
    }

    console.log("[Data Purge] Job completed:", results);

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("[Data Purge] Fatal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
