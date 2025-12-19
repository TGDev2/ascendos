import { NextRequest, NextResponse } from "next/server";
import { db } from "@ascendos/database";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Weekly reminder cron job
 * Sends email reminders to organizations based on their settings
 *
 * This endpoint should be called by a cron scheduler (e.g., Vercel Cron)
 *
 * Security: Verify the request is from Vercel Cron using CRON_SECRET
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.error("[Weekly Reminders] Unauthorized cron request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Weekly Reminders] Starting weekly reminder job...");

    // Get current day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getUTCHours();

    console.log(
      `[Weekly Reminders] Current day: ${currentDay}, hour: ${currentHour}`
    );

    // Find organizations that have reminders enabled for this day/hour
    const organizations = await db.organization.findMany({
      where: {
        plan: {
          in: ["TEAM", "AGENCY"], // Only paid plans get reminders
        },
      },
      include: {
        settings: true,
        users: true,
      },
    });

    console.log(
      `[Weekly Reminders] Found ${organizations.length} organizations with paid plans`
    );

    const results = {
      total: organizations.length,
      sent: 0,
      skipped: 0,
      errors: 0,
    };

    for (const org of organizations) {
      try {
        const settings = org.settings;

        // Skip if reminders are disabled
        if (!settings?.weeklyReminderEnabled) {
          results.skipped++;
          continue;
        }

        // Check if it's the right day (convert Sunday=0 to Monday=0 format)
        const reminderDay = settings.weeklyReminderDay ?? 5; // Default Friday
        const adjustedCurrentDay = currentDay === 0 ? 6 : currentDay - 1; // Convert to Monday=0

        if (adjustedCurrentDay !== reminderDay) {
          results.skipped++;
          continue;
        }

        // Check if it's approximately the right hour (allow 1 hour window)
        const reminderHour = settings.weeklyReminderHour ?? 9; // Default 9 AM
        if (Math.abs(currentHour - reminderHour) > 1) {
          results.skipped++;
          continue;
        }

        // Get active projects for this organization
        const projects = await db.project.findMany({
          where: {
            organizationId: org.id,
            archived: false,
          },
        });

        if (projects.length === 0) {
          results.skipped++;
          continue;
        }

        // Send reminder email to organization owners/admins
        const owners = org.users.filter(
          (u) => u.role === "OWNER" || u.role === "ADMIN"
        );

        for (const user of owners) {
          await sendReminderEmail({
            to: user.email,
            userName: user.name || user.email,
            organizationName: org.name,
            projectCount: projects.length,
            projects: projects.slice(0, 5), // Show max 5 projects
          });
        }

        results.sent++;

        console.log(
          `[Weekly Reminders] Sent reminder to ${org.name} (${owners.length} recipients)`
        );
      } catch (error) {
        console.error(
          `[Weekly Reminders] Error sending reminder to org ${org.id}:`,
          error
        );
        results.errors++;
      }
    }

    console.log("[Weekly Reminders] Job completed:", results);

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("[Weekly Reminders] Fatal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Send reminder email using Resend
 */
async function sendReminderEmail({
  to,
  userName,
  organizationName,
  projectCount,
  projects,
}: {
  to: string;
  userName: string;
  organizationName: string;
  projectCount: number;
  projects: any[];
}) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn(
      "[Weekly Reminders] RESEND_API_KEY not configured, skipping email"
    );
    return;
  }

  const projectsList = projects
    .map((p) => `• ${p.name}${p.description ? ` - ${p.description}` : ""}`)
    .join("\n");

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 30px 20px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      background: white;
      padding: 30px 20px;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
    .cta-button {
      display: inline-block;
      background: #3b82f6;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .projects-list {
      background: #f9fafb;
      padding: 15px;
      border-radius: 6px;
      margin: 15px 0;
      white-space: pre-line;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📅 Rappel hebdomadaire Ascendos</h1>
  </div>
  <div class="content">
    <p>Bonjour ${userName},</p>

    <p>C'est le moment de créer vos updates hebdomadaires pour <strong>${organizationName}</strong>.</p>

    <p>Vous avez <strong>${projectCount} projet${projectCount > 1 ? "s" : ""} actif${projectCount > 1 ? "s" : ""}</strong> qui ${projectCount > 1 ? "attendent" : "attend"} un update :</p>

    <div class="projects-list">${projectsList}</div>

    <p><strong>Pourquoi maintenant ?</strong></p>
    <ul>
      <li>Créer l'update pendant que c'est frais (moins de 10 minutes)</li>
      <li>Maintenir le rituel hebdomadaire avec vos sponsors</li>
      <li>Enrichir automatiquement votre dossier de continuité</li>
    </ul>

    <center>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://app.ascendos.co"}/projects" class="cta-button">
        Créer mes updates
      </a>
    </center>

    <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
      💡 Astuce : Collez vos notes brutes (tickets, PR, messages) et Ascendos génère un update "sponsor-ready" en 2 minutes.
    </p>
  </div>
  <div class="footer">
    <p>Vous recevez cet email car les rappels hebdomadaires sont activés pour votre organisation.</p>
    <p>Pour modifier vos préférences, rendez-vous dans les paramètres de votre organisation.</p>
  </div>
</body>
</html>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ascendos <notifications@ascendos.co>",
        to: [to],
        subject: "📅 Rappel hebdomadaire - Créez vos updates",
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await response.json();
    console.log(`[Weekly Reminders] Email sent to ${to}:`, data.id);
  } catch (error) {
    console.error(`[Weekly Reminders] Failed to send email to ${to}:`, error);
    throw error;
  }
}
