"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy, Mail, MessageSquare, Loader2, AlertCircle } from "lucide-react";

interface OutputPreviewProps {
  emailSubject?: string;
  emailBody?: string;
  slackMessage?: string;
  isLoading?: boolean;
  error?: string;
}

export function OutputPreview({
  emailSubject,
  emailBody,
  slackMessage,
  isLoading,
  error,
}: OutputPreviewProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedSlack, setCopiedSlack] = useState(false);

  const copyToClipboard = async (text: string, type: "email" | "slack") => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }

      if (type === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedSlack(true);
        setTimeout(() => setCopiedSlack(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text:", err);
      if (type === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedSlack(true);
        setTimeout(() => setCopiedSlack(false), 2000);
      }
    }
  };

  const hasOutput = emailBody || slackMessage;

  // État de chargement
  if (isLoading) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-sm font-medium">Génération en cours...</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Cela prend généralement moins de 30 secondes
          </p>
        </CardContent>
      </Card>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <p className="mt-4 text-sm font-medium text-destructive">
            Une erreur est survenue
          </p>
          <p className="mt-1 max-w-md text-center text-xs text-muted-foreground">
            {error}
          </p>
        </CardContent>
      </Card>
    );
  }

  // État vide
  if (!hasOutput) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Mail className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="mt-4 text-sm font-medium">Votre update apparaîtra ici</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Remplissez le formulaire ci-dessus et cliquez sur "Générer"
          </p>
        </CardContent>
      </Card>
    );
  }

  // État avec résultat
  return (
    <Card>
      <Tabs defaultValue="email" className="w-full">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-[300px] grid-cols-2">
              <TabsTrigger value="email" className="gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="slack" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Slack
              </TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <TabsContent value="email" className="mt-0 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Prêt à copier-coller dans votre client email
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(
                    `Objet: ${emailSubject}\n\n${emailBody}`,
                    "email"
                  )
                }
                className="gap-2"
              >
                {copiedEmail ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copier tout
                  </>
                )}
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="mb-1.5 text-xs font-medium text-muted-foreground">
                  OBJET
                </div>
                <div className="rounded-lg border bg-muted/50 p-3 text-sm font-medium">
                  {emailSubject}
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-xs font-medium text-muted-foreground">
                  CORPS DU MESSAGE
                </div>
                <div className="max-h-[400px] overflow-y-auto rounded-lg border bg-muted/50 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {emailBody}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="slack" className="mt-0 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Version courte optimisée pour Slack
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(slackMessage || "", "slack")}
                className="gap-2"
              >
                {copiedSlack ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copier
                  </>
                )}
              </Button>
            </div>
            <div className="max-h-[400px] overflow-y-auto rounded-lg border bg-muted/50 p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {slackMessage}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
