"use client";

import { use, useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Copy,
  CheckCircle2,
  AlertCircle,
  Mail,
  MessageSquare,
  Info,
  Check,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface PageProps {
  params: Promise<{ id: string; updateId: string }>;
}

export default function UpdateDetailPage({ params }: PageProps) {
  const { id: projectId, updateId } = use(params);
  const [emailCopied, setEmailCopied] = useState(false);
  const [slackCopied, setSlackCopied] = useState(false);

  const { data: update, isLoading } = trpc.updates.get.useQuery({ id: updateId });

  const copyToClipboard = async (text: string, type: "email" | "slack") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "email") {
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
      } else {
        setSlackCopied(true);
        setTimeout(() => setSlackCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!update) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-lg font-medium">Update non trouvé</p>
          <Button asChild className="mt-4">
            <Link href={`/projects/${projectId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au projet
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/projects/${projectId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {update.emailSubject}
              </h1>
              <p className="text-sm text-muted-foreground">
                {update.project.name} • Semaine {update.weekNumber}, {update.year}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">{update.situationType}</Badge>
          {update.wasSent && <Badge variant="secondary">Envoyé</Badge>}
          {update.wasCopied && !update.wasSent && <Badge variant="secondary">Copié</Badge>}
        </div>
      </div>

      {/* Metadata Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Info className="h-4 w-4" />
            Informations
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm md:grid-cols-4">
          <div>
            <p className="font-medium">Créé par</p>
            <p className="text-muted-foreground">
              {update.createdBy.name || update.createdBy.email}
            </p>
          </div>
          <div>
            <p className="font-medium">Date</p>
            <p className="text-muted-foreground">
              {formatDistanceToNow(new Date(update.createdAt), {
                addSuffix: true,
                locale: fr,
              })}
            </p>
          </div>
          <div>
            <p className="font-medium">Généré avec</p>
            <p className="text-muted-foreground">{update.generatedWith}</p>
          </div>
          {update.tokensUsed && (
            <div>
              <p className="font-medium">Tokens utilisés</p>
              <p className="text-muted-foreground">{update.tokensUsed.toLocaleString()}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="email" className="space-y-4">
        <TabsList>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="slack">
            <MessageSquare className="mr-2 h-4 w-4" />
            Slack
          </TabsTrigger>
          <TabsTrigger value="extracted">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Extraits ({update.extractedDecisions.length + update.extractedRisks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Email</CardTitle>
                <CardDescription>Prêt à copier et envoyer</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(`${update.emailSubject}\n\n${update.emailBody}`, "email")}
              >
                {emailCopied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copier
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">Objet</p>
                <p className="font-semibold">{update.emailSubject}</p>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">Corps</p>
                <div className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-4">
                  {update.emailBody}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slack" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Message Slack</CardTitle>
                <CardDescription>Version condensée pour Slack</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(update.slackMessage, "slack")}
              >
                {slackCopied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copier
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-4">
                {update.slackMessage}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="extracted" className="space-y-4">
          {/* Decisions */}
          {update.extractedDecisions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Décisions extraites ({update.extractedDecisions.length})
                </CardTitle>
                <CardDescription>
                  Décisions identifiées automatiquement dans cet update
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {update.extractedDecisions.map((decision) => (
                  <div key={decision.id} className="rounded-lg border p-4">
                    <p className="font-medium">{decision.description}</p>
                    {decision.context && (
                      <p className="mt-2 text-sm text-muted-foreground">{decision.context}</p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant={decision.status === "DECIDED" ? "default" : "outline"}>
                        {decision.status}
                      </Badge>
                      {decision.tags.length > 0 && (
                        <div className="flex gap-1">
                          {decision.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Risks */}
          {update.extractedRisks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Risques extraits ({update.extractedRisks.length})
                </CardTitle>
                <CardDescription>
                  Risques identifiés automatiquement dans cet update
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {update.extractedRisks.map((risk) => (
                  <div key={risk.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <p className="font-medium">{risk.description}</p>
                      <Badge
                        variant={
                          risk.severity === "CRITICAL" || risk.severity === "HIGH"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {risk.severity}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Impact:</span> {risk.impact}
                    </p>
                    {risk.mitigation && (
                      <p className="mt-1 text-sm">
                        <span className="font-medium">Mitigation:</span> {risk.mitigation}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant={risk.status === "RESOLVED" ? "default" : "outline"}>
                        {risk.status}
                      </Badge>
                      {risk.tags.length > 0 && (
                        <div className="flex gap-1">
                          {risk.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {update.extractedDecisions.length === 0 && update.extractedRisks.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">
                  Aucune décision ou risque extrait automatiquement
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
