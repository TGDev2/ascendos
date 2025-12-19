"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePaywall } from "@/hooks/use-paywall";
import { Download, FileText, Loader2, Lock } from "lucide-react";

interface ExportDossierProps {
  projectId: string;
  projectName: string;
}

export function ExportDossier({ projectId, projectName }: ExportDossierProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { canExportPDF } = usePaywall();

  const handleExport = async () => {
    if (!canExportPDF) {
      setError("L'export du dossier nécessite un plan TEAM ou AGENCY.");
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/export-html`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'export");
      }

      // Download the HTML file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dossier-${projectName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export error:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'export");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exporter le dossier de continuité</CardTitle>
        <CardDescription>
          Générez un dossier complet en HTML avec l'historique des updates, décisions et risques
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
          <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">Dossier 1 page HTML</p>
            <p className="text-sm text-muted-foreground">
              Export HTML consultable en 30 secondes avec toutes les informations du projet.
              Idéal pour les COPIL, escalades, renouvellements ou handovers.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Le dossier inclut :</h4>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• Informations du projet et sponsor</li>
            <li>• Historique des 20 derniers updates</li>
            <li>• Registre complet des décisions</li>
            <li>• Registre complet des risques</li>
            <li>• Timeline et tags pour navigation rapide</li>
          </ul>
        </div>

        {!canExportPDF && (
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <Lock className="h-4 w-4 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">
                Fonctionnalité réservée
              </p>
              <p className="text-sm text-amber-700 mt-0.5">
                L'export du dossier nécessite un plan TEAM ou AGENCY.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">Erreur</p>
              <p className="text-sm text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <Button
          onClick={handleExport}
          disabled={isExporting || !canExportPDF}
          className="w-full"
          size="lg"
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Export en cours...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Exporter le dossier HTML
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Le fichier HTML peut être ouvert dans n'importe quel navigateur et imprimé si besoin
        </p>
      </CardContent>
    </Card>
  );
}
