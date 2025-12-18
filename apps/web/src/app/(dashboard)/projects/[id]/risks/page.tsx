"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, X } from "lucide-react";
import { RisksList } from "@/components/projects/risks-list";
import { CreateRiskDialog } from "@/components/projects/create-risk-dialog";
import { Badge } from "@/components/ui/badge";

type RiskStatus = "OPEN" | "MONITORING" | "MITIGATED" | "RESOLVED" | "CANCELLED";
type RiskSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RisksPage({ params }: PageProps) {
  const { id } = use(params);
  const [statusFilter, setStatusFilter] = useState<RiskStatus[]>([]);
  const [severityFilter, setSeverityFilter] = useState<RiskSeverity[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleStatusToggle = (status: RiskStatus) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };

  const handleSeverityToggle = (severity: RiskSeverity) => {
    if (severityFilter.includes(severity)) {
      setSeverityFilter(severityFilter.filter((s) => s !== severity));
    } else {
      setSeverityFilter([...severityFilter, severity]);
    }
  };

  const clearFilters = () => {
    setStatusFilter([]);
    setSeverityFilter([]);
  };

  const hasFilters = statusFilter.length > 0 || severityFilter.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/projects/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Registre des risques</h1>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau risque
        </Button>
      </div>

      {/* Filters Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Filtres</h3>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="mr-1 h-3 w-3" />
                  Effacer
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {/* Severity Filter */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Sévérité</label>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={severityFilter.includes("CRITICAL") ? "default" : "outline"}
                    className="cursor-pointer bg-red-600 hover:bg-red-700 text-white border-red-600"
                    onClick={() => handleSeverityToggle("CRITICAL")}
                  >
                    Critique
                  </Badge>
                  <Badge
                    variant={severityFilter.includes("HIGH") ? "default" : "outline"}
                    className="cursor-pointer bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
                    onClick={() => handleSeverityToggle("HIGH")}
                  >
                    Élevé
                  </Badge>
                  <Badge
                    variant={severityFilter.includes("MEDIUM") ? "default" : "outline"}
                    className="cursor-pointer bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600"
                    onClick={() => handleSeverityToggle("MEDIUM")}
                  >
                    Moyen
                  </Badge>
                  <Badge
                    variant={severityFilter.includes("LOW") ? "default" : "outline"}
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    onClick={() => handleSeverityToggle("LOW")}
                  >
                    Faible
                  </Badge>
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Status</label>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={statusFilter.includes("OPEN") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleStatusToggle("OPEN")}
                  >
                    Ouvert
                  </Badge>
                  <Badge
                    variant={statusFilter.includes("MONITORING") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleStatusToggle("MONITORING")}
                  >
                    Surveillance
                  </Badge>
                  <Badge
                    variant={statusFilter.includes("MITIGATED") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleStatusToggle("MITIGATED")}
                  >
                    Mitigé
                  </Badge>
                  <Badge
                    variant={statusFilter.includes("RESOLVED") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleStatusToggle("RESOLVED")}
                  >
                    Résolu
                  </Badge>
                  <Badge
                    variant={statusFilter.includes("CANCELLED") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleStatusToggle("CANCELLED")}
                  >
                    Annulé
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risks List */}
      <RisksList
        projectId={id}
        statusFilter={statusFilter.length > 0 ? statusFilter : undefined}
        severityFilter={severityFilter.length > 0 ? severityFilter : undefined}
        limit={50}
      />

      <CreateRiskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projectId={id}
      />
    </div>
  );
}
