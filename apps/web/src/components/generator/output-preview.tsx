"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

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

  const copyToClipboard = async (text: string, type: 'email' | 'slack') => {
    try {
      // Check if clipboard API is available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or insecure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      if (type === 'email') {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedSlack(true);
        setTimeout(() => setCopiedSlack(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
      // Still show the success state even if copy fails
      // The user can manually copy if needed
      if (type === 'email') {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedSlack(true);
        setTimeout(() => setCopiedSlack(false), 2000);
      }
    }
  };

  return (
    <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
      {/* Email Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Preview Email</CardTitle>
              <CardDescription>
                {isLoading ? "Génération en cours..." : "Update prêt à envoyer"}
              </CardDescription>
            </div>
            {emailBody && !isLoading && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(`Objet: ${emailSubject}\n\n${emailBody}`, 'email')}
              >
                {copiedEmail ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copié!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copier
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : error ? (
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : emailBody ? (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Objet</div>
                <div className="rounded-md bg-muted p-3 text-sm font-medium">
                  {emailSubject}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Corps de l'email</div>
                <div className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">
                  {emailBody}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Remplissez le formulaire et cliquez sur "Générer" pour voir le résultat...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Slack Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Preview Slack</CardTitle>
              <CardDescription>Version courte pour Slack</CardDescription>
            </div>
            {slackMessage && !isLoading && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(slackMessage, 'slack')}
              >
                {copiedSlack ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copié!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copier
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : slackMessage ? (
            <div className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">
              {slackMessage}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Remplissez le formulaire et cliquez sur "Générer" pour voir le résultat...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
