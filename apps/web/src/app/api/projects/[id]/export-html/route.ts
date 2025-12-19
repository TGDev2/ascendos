import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@ascendos/database";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Export HTML du dossier de continuité 1 page
 * GET /api/projects/:id/export-html
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify organization plan (only TEAM and AGENCY can export)
    const org = await db.organization.findUnique({
      where: { id: orgId },
    });

    if (!org || org.plan === "TRIAL") {
      return NextResponse.json(
        { error: "Export requires TEAM or AGENCY plan" },
        { status: 403 }
      );
    }

    // Verify project belongs to organization
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        organizationId: orgId,
      },
      include: {
        masterProfile: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Fetch all data for the export
    const [updates, decisions, risks] = await Promise.all([
      db.update.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        take: 20, // Last 20 updates
      }),
      db.decision.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      db.risk.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    // Log usage
    await db.usageLog.create({
      data: {
        organizationId: orgId,
        userId,
        action: "export_pdf", // Keep same action name for consistency
        metadata: {
          projectId,
          format: "html",
          updatesCount: updates.length,
          decisionsCount: decisions.length,
          risksCount: risks.length,
        },
      },
    });

    // Generate HTML
    const html = generateDossierHTML({
      project,
      updates,
      decisions,
      risks,
      exportDate: new Date(),
    });

    // Return HTML file
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="dossier-${project.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${format(new Date(), "yyyy-MM-dd")}.html"`,
      },
    });
  } catch (error) {
    console.error("[Export HTML] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Generate the HTML dossier
 */
function generateDossierHTML({
  project,
  updates,
  decisions,
  risks,
  exportDate,
}: {
  project: any;
  updates: any[];
  decisions: any[];
  risks: any[];
  exportDate: Date;
}): string {
  const statusLabels: Record<string, string> = {
    PENDING: "En attente",
    DECIDED: "Décidée",
    CANCELLED: "Annulée",
    OPEN: "Ouvert",
    MONITORING: "Surveillance",
    MITIGATED: "Mitigé",
    RESOLVED: "Résolu",
  };

  const severityLabels: Record<string, string> = {
    LOW: "Faible",
    MEDIUM: "Moyen",
    HIGH: "Élevé",
    CRITICAL: "Critique",
  };

  const situationLabels: Record<string, string> = {
    NORMAL: "Normal",
    VALIDATION: "Validation",
    RISK: "Risque",
    DELAY: "Retard",
    ARBITRAGE: "Arbitrage",
    PRE_COPIL: "Pré-COPIL",
  };

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dossier de continuité - ${escapeHtml(project.name)}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: #ffffff;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    header {
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .meta {
      display: flex;
      gap: 2rem;
      margin-top: 1rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 0.5rem;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
    }

    .meta-label {
      font-size: 0.75rem;
      color: #6b7280;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    .meta-value {
      font-size: 0.875rem;
      color: #111827;
      margin-top: 0.25rem;
    }

    section {
      margin-bottom: 2.5rem;
      page-break-inside: avoid;
    }

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 0.75rem;
    }

    .card-title {
      font-weight: 600;
      font-size: 1rem;
      color: #111827;
    }

    .card-date {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      margin-right: 0.5rem;
    }

    .badge-status {
      background: #dbeafe;
      color: #1e40af;
    }

    .badge-severity-LOW {
      background: #d1fae5;
      color: #065f46;
    }

    .badge-severity-MEDIUM {
      background: #fef3c7;
      color: #92400e;
    }

    .badge-severity-HIGH {
      background: #fed7aa;
      color: #9a3412;
    }

    .badge-severity-CRITICAL {
      background: #fee2e2;
      color: #991b1b;
    }

    .card-body {
      font-size: 0.875rem;
      color: #374151;
    }

    .card-body p {
      margin-bottom: 0.5rem;
    }

    .tags {
      margin-top: 0.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .tag {
      background: #f3f4f6;
      color: #4b5563;
      padding: 0.125rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #9ca3af;
      font-style: italic;
    }

    footer {
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 0.75rem;
    }

    @media print {
      body {
        padding: 0;
      }

      .card {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(project.name)}</h1>
    ${project.description ? `<p class="subtitle">${escapeHtml(project.description)}</p>` : ""}

    <div class="meta">
      <div class="meta-item">
        <span class="meta-label">Exporté le</span>
        <span class="meta-value">${format(exportDate, "d MMMM yyyy 'à' HH:mm", { locale: fr })}</span>
      </div>
      ${project.sponsorName ? `
      <div class="meta-item">
        <span class="meta-label">Sponsor</span>
        <span class="meta-value">${escapeHtml(project.sponsorName)}${project.sponsorRole ? ` (${escapeHtml(project.sponsorRole)})` : ""}</span>
      </div>
      ` : ""}
      <div class="meta-item">
        <span class="meta-label">Updates</span>
        <span class="meta-value">${updates.length}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Décisions</span>
        <span class="meta-value">${decisions.length}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Risques</span>
        <span class="meta-value">${risks.length}</span>
      </div>
    </div>
  </header>

  <main>
    <!-- Recent Updates -->
    <section>
      <h2>📅 Historique des updates (${updates.length} derniers)</h2>
      ${
        updates.length === 0
          ? '<div class="empty-state">Aucun update pour ce projet</div>'
          : updates
              .map(
                (update: any) => `
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">${escapeHtml(update.emailSubject)}</div>
              <span class="badge badge-status">${situationLabels[update.situationType] || update.situationType}</span>
              <span class="card-date">${update.weekNumber} ${update.year}</span>
            </div>
            <div class="card-date">${format(new Date(update.createdAt), "d MMM yyyy", { locale: fr })}</div>
          </div>
          <div class="card-body">
            <p>${escapeHtml(update.emailBody.substring(0, 300))}${update.emailBody.length > 300 ? "..." : ""}</p>
          </div>
        </div>
      `
              )
              .join("")
      }
    </section>

    <!-- Decisions Register -->
    <section>
      <h2>✓ Registre des décisions (${decisions.length})</h2>
      ${
        decisions.length === 0
          ? '<div class="empty-state">Aucune décision enregistrée</div>'
          : decisions
              .map(
                (decision: any) => `
        <div class="card">
          <div class="card-header">
            <div class="card-title">${escapeHtml(decision.description)}</div>
            <span class="badge badge-status">${statusLabels[decision.status] || decision.status}</span>
          </div>
          <div class="card-body">
            ${decision.context ? `<p><strong>Contexte:</strong> ${escapeHtml(decision.context)}</p>` : ""}
            ${decision.outcome ? `<p><strong>Résultat:</strong> ${escapeHtml(decision.outcome)}</p>` : ""}
            ${decision.decidedBy ? `<p><strong>Décidé par:</strong> ${escapeHtml(decision.decidedBy)}</p>` : ""}
            ${decision.decidedAt ? `<p><strong>Date:</strong> ${format(new Date(decision.decidedAt), "d MMMM yyyy", { locale: fr })}</p>` : ""}
            ${
              decision.tags && decision.tags.length > 0
                ? `
              <div class="tags">
                ${decision.tags.map((tag: string) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
              </div>
            `
                : ""
            }
          </div>
        </div>
      `
              )
              .join("")
      }
    </section>

    <!-- Risks Register -->
    <section>
      <h2>⚠️ Registre des risques (${risks.length})</h2>
      ${
        risks.length === 0
          ? '<div class="empty-state">Aucun risque enregistré</div>'
          : risks
              .map(
                (risk: any) => `
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">${escapeHtml(risk.description)}</div>
              <span class="badge badge-severity-${risk.severity}">${severityLabels[risk.severity] || risk.severity}</span>
              <span class="badge badge-status">${statusLabels[risk.status] || risk.status}</span>
            </div>
            <div class="card-date">${format(new Date(risk.identifiedAt), "d MMM yyyy", { locale: fr })}</div>
          </div>
          <div class="card-body">
            <p><strong>Impact:</strong> ${escapeHtml(risk.impact)}</p>
            ${risk.mitigation ? `<p><strong>Mitigation:</strong> ${escapeHtml(risk.mitigation)}</p>` : ""}
            ${risk.reviewDate ? `<p><strong>Date de revue:</strong> ${format(new Date(risk.reviewDate), "d MMMM yyyy", { locale: fr })}</p>` : ""}
            ${
              risk.tags && risk.tags.length > 0
                ? `
              <div class="tags">
                ${risk.tags.map((tag: string) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
              </div>
            `
                : ""
            }
          </div>
        </div>
      `
              )
              .join("")
      }
    </section>
  </main>

  <footer>
    <p>Dossier de continuité généré avec Ascendos — ${format(exportDate, "d MMMM yyyy 'à' HH:mm", { locale: fr })}</p>
    <p>Ce document contient les informations principales du projet pour faciliter la continuité et la traçabilité.</p>
  </footer>
</body>
</html>`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m] || m);
}
