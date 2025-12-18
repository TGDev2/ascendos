"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, CheckCircle2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DecisionStatus = "PENDING" | "DECIDED" | "CANCELLED";

interface DecisionsListProps {
  projectId: string;
  limit?: number;
  statusFilter?: DecisionStatus[];
  tagsFilter?: string[];
}

export function DecisionsList({
  projectId,
  limit = 50,
  statusFilter,
  tagsFilter,
}: DecisionsListProps) {
  const utils = trpc.useUtils();
  const { data: decisions, isLoading } = trpc.decisions.list.useQuery({
    projectId,
    status: statusFilter,
    tags: tagsFilter,
    limit,
    offset: 0,
  });

  const updateDecision = trpc.decisions.update.useMutation({
    onSuccess: () => {
      utils.decisions.list.invalidate({ projectId });
    },
  });

  const [expandedOutcome, setExpandedOutcome] = useState<string | null>(null);
  const [outcomeValues, setOutcomeValues] = useState<Record<string, string>>({});

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

  if (!decisions || decisions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle2 className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">Aucune décision</p>
          <p className="text-sm text-muted-foreground">
            Les décisions identifiées apparaîtront ici
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group by year and month
  type GroupedDecisions = Record<string, { year: number; month: string; decisions: typeof decisions }>;
  const groupedDecisions = decisions.reduce<GroupedDecisions>((acc, decision) => {
    const date = new Date(decision.createdAt);
    const year = date.getFullYear();
    const month = date.toLocaleDateString("fr-FR", { month: "long" });
    const key = `${year}-${month}`;
    if (!acc[key]) {
      acc[key] = { year, month, decisions: [] };
    }
    acc[key].decisions.push(decision);
    return acc;
  }, {});

  const handleStatusChange = (decisionId: string, status: DecisionStatus) => {
    updateDecision.mutate({
      id: decisionId,
      status,
    });
  };

  const handleOutcomeUpdate = (decisionId: string) => {
    const outcome = outcomeValues[decisionId] || "";
    updateDecision.mutate({
      id: decisionId,
      outcome,
    });
    setExpandedOutcome(null);
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedDecisions).map(([key, group]) => (
        <div key={key} className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold capitalize">
              {group.month} {group.year}
            </h3>
          </div>

          <div className="space-y-3">
            {group.decisions.map((decision) => (
              <Card key={decision.id} className="transition-colors hover:bg-muted/50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <CardTitle className="text-base">
                        {decision.description}
                      </CardTitle>
                      {decision.context && (
                        <CardDescription className="text-sm">
                          {decision.context}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={decision.status}
                        onValueChange={(value) => handleStatusChange(decision.id, value as DecisionStatus)}
                        disabled={updateDecision.isPending}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">En attente</SelectItem>
                          <SelectItem value="DECIDED">Décidée</SelectItem>
                          <SelectItem value="CANCELLED">Annulée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Outcome Section */}
                  {decision.status === "DECIDED" && (
                    <div className="space-y-2">
                      {expandedOutcome === decision.id ? (
                        <div className="space-y-2">
                          <textarea
                            className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                            placeholder="Quelle décision a été prise?"
                            value={outcomeValues[decision.id] ?? decision.outcome ?? ""}
                            onChange={(e) => setOutcomeValues({ ...outcomeValues, [decision.id]: e.target.value })}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleOutcomeUpdate(decision.id)}
                              disabled={updateDecision.isPending}
                            >
                              Enregistrer
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setExpandedOutcome(null)}
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : decision.outcome ? (
                        <div
                          className="rounded-md border border-muted bg-muted/50 p-3 cursor-pointer hover:bg-muted"
                          onClick={() => setExpandedOutcome(decision.id)}
                        >
                          <p className="text-sm">
                            <span className="font-medium">Décision: </span>
                            {decision.outcome}
                          </p>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setExpandedOutcome(decision.id)}
                        >
                          Ajouter la décision prise
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {decision.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {decision.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(decision.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </div>
                    {decision.decidedBy && (
                      <div>Décidé par: {decision.decidedBy}</div>
                    )}
                    {decision.decidedAt && (
                      <div>le {new Date(decision.decidedAt).toLocaleDateString("fr-FR")}</div>
                    )}
                  </div>

                  {/* Source Update Link */}
                  {decision.updateId && decision.update && (
                    <div className="pt-2 border-t">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/projects/${projectId}/updates/${decision.updateId}`}>
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Voir l'update source: {decision.update.emailSubject}
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
