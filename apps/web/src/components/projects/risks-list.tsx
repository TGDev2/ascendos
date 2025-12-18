"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, AlertTriangle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RiskSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type RiskStatus = "OPEN" | "MONITORING" | "MITIGATED" | "RESOLVED" | "CANCELLED";

interface RisksListProps {
  projectId: string;
  limit?: number;
  statusFilter?: RiskStatus[];
  severityFilter?: RiskSeverity[];
}

export function RisksList({
  projectId,
  limit = 50,
  statusFilter,
  severityFilter,
}: RisksListProps) {
  const utils = trpc.useUtils();
  const { data: risks, isLoading } = trpc.risks.list.useQuery({
    projectId,
    status: statusFilter,
    severity: severityFilter,
    limit,
    offset: 0,
  });

  const updateRisk = trpc.risks.update.useMutation({
    onSuccess: () => {
      utils.risks.list.invalidate({ projectId });
    },
  });

  const [expandedMitigation, setExpandedMitigation] = useState<string | null>(null);
  const [mitigationValues, setMitigationValues] = useState<Record<string, string>>({});

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!risks || risks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">Aucun risque</p>
          <p className="text-sm text-muted-foreground">
            Les risques identifiés apparaîtront ici
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group by severity (CRITICAL > HIGH > MEDIUM > LOW)
  const severityOrder = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
  type GroupedRisks = Record<RiskSeverity, typeof risks>;
  const groupedRisks = risks.reduce<GroupedRisks>((acc, risk) => {
    if (!acc[risk.severity]) {
      acc[risk.severity] = [];
    }
    acc[risk.severity].push(risk);
    return acc;
  }, {} as GroupedRisks);

  const handleStatusChange = (riskId: string, status: RiskStatus) => {
    updateRisk.mutate({
      id: riskId,
      status,
    });
  };

  const handleMitigationUpdate = (riskId: string) => {
    const mitigation = mitigationValues[riskId] || "";
    updateRisk.mutate({
      id: riskId,
      mitigation,
    });
    setExpandedMitigation(null);
  };

  const getSeverityBadge = (severity: RiskSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return <Badge className="bg-red-600 text-white">Critique</Badge>;
      case "HIGH":
        return <Badge className="bg-orange-600 text-white">Élevé</Badge>;
      case "MEDIUM":
        return <Badge className="bg-yellow-600 text-white">Moyen</Badge>;
      case "LOW":
        return <Badge className="bg-blue-600 text-white">Faible</Badge>;
    }
  };

  const getSeverityBorderColor = (severity: RiskSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return "border-l-red-500";
      case "HIGH":
        return "border-l-orange-500";
      case "MEDIUM":
        return "border-l-yellow-500";
      case "LOW":
        return "border-l-blue-500";
    }
  };

  return (
    <div className="space-y-6">
      {severityOrder.map((severity) => {
        const severityRisks = groupedRisks[severity as RiskSeverity];
        if (!severityRisks || severityRisks.length === 0) return null;

        return (
          <div key={severity} className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">
                {severity === "CRITICAL" && "Risques Critiques"}
                {severity === "HIGH" && "Risques Élevés"}
                {severity === "MEDIUM" && "Risques Moyens"}
                {severity === "LOW" && "Risques Faibles"}
                <span className="ml-2 text-muted-foreground font-normal">
                  ({severityRisks.length})
                </span>
              </h3>
            </div>

            <div className="space-y-3">
              {severityRisks.map((risk) => (
                <Card
                  key={risk.id}
                  className={`transition-colors hover:bg-muted/50 border-l-4 ${getSeverityBorderColor(risk.severity)}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">
                            {risk.description}
                          </CardTitle>
                          {getSeverityBadge(risk.severity)}
                        </div>
                        <CardDescription className="text-sm text-muted-foreground">
                          Impact: {risk.impact}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={risk.status}
                          onValueChange={(value) => handleStatusChange(risk.id, value as RiskStatus)}
                          disabled={updateRisk.isPending}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OPEN">Ouvert</SelectItem>
                            <SelectItem value="MONITORING">Surveillance</SelectItem>
                            <SelectItem value="MITIGATED">Mitigé</SelectItem>
                            <SelectItem value="RESOLVED">Résolu</SelectItem>
                            <SelectItem value="CANCELLED">Annulé</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Mitigation Section */}
                    <div className="space-y-2">
                      {expandedMitigation === risk.id ? (
                        <div className="space-y-2">
                          <textarea
                            className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                            placeholder="Plan de mitigation..."
                            value={mitigationValues[risk.id] ?? risk.mitigation ?? ""}
                            onChange={(e) => setMitigationValues({ ...mitigationValues, [risk.id]: e.target.value })}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleMitigationUpdate(risk.id)}
                              disabled={updateRisk.isPending}
                            >
                              Enregistrer
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setExpandedMitigation(null)}
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : risk.mitigation ? (
                        <div
                          className="rounded-md border border-muted bg-muted/50 p-3 cursor-pointer hover:bg-muted"
                          onClick={() => setExpandedMitigation(risk.id)}
                        >
                          <p className="text-sm">
                            <span className="font-medium">Mitigation: </span>
                            {risk.mitigation}
                          </p>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setExpandedMitigation(risk.id)}
                        >
                          Ajouter plan de mitigation
                        </Button>
                      )}
                    </div>

                    {/* Tags */}
                    {risk.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {risk.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Identifié {formatDistanceToNow(new Date(risk.identifiedAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </div>
                      {risk.reviewDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Revue: {new Date(risk.reviewDate).toLocaleDateString("fr-FR")}
                        </div>
                      )}
                      {risk.resolvedAt && (
                        <div className="text-green-600">
                          Résolu le {new Date(risk.resolvedAt).toLocaleDateString("fr-FR")}
                        </div>
                      )}
                    </div>

                    {/* Source Update Link */}
                    {risk.updateId && risk.update && (
                      <div className="pt-2 border-t">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/projects/${projectId}/updates/${risk.updateId}`}>
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Voir l'update source: {risk.update.emailSubject}
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
