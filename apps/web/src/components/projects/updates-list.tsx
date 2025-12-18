"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, AlertCircle, Clock, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface UpdatesListProps {
  projectId: string;
}

export function UpdatesList({ projectId }: UpdatesListProps) {
  const { data: updates, isLoading } = trpc.updates.list.useQuery({
    projectId,
    limit: 50,
  });

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

  if (!updates || updates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">Aucun update</p>
          <p className="text-sm text-muted-foreground">
            Créez votre premier update hebdomadaire
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group by week/year
  const groupedUpdates = updates.reduce((acc, update) => {
    const key = `${update.year}-${update.weekNumber}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(update);
    return acc;
  }, {} as Record<string, typeof updates>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedUpdates).map(([weekKey, weekUpdates]) => {
        const [year, weekNumber] = weekKey.split("-");
        return (
          <div key={weekKey} className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">
                Semaine {weekNumber}, {year}
              </h3>
            </div>

            <div className="space-y-3">
              {weekUpdates.map((update) => (
                <Link key={update.id} href={`/projects/${projectId}/updates/${update.id}`}>
                  <Card className="transition-colors hover:bg-muted/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">
                            {update.emailSubject}
                          </CardTitle>
                          <CardDescription>
                            Par {update.createdBy.name || update.createdBy.email} •{" "}
                            {formatDistanceToNow(new Date(update.createdAt), {
                              addSuffix: true,
                              locale: fr,
                            })}
                          </CardDescription>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Situation Type */}
                      <Badge variant="outline">{update.situationType}</Badge>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          {update._count.extractedDecisions} décisions
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {update._count.extractedRisks} risques
                        </div>
                        {update.wasSent && (
                          <Badge variant="secondary" className="text-xs">
                            Envoyé
                          </Badge>
                        )}
                        {update.wasCopied && !update.wasSent && (
                          <Badge variant="secondary" className="text-xs">
                            Copié
                          </Badge>
                        )}
                      </div>

                      {/* Preview */}
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {update.emailBody.substring(0, 200)}...
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
