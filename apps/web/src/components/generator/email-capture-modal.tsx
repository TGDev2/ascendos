"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Mail, Sparkles } from "lucide-react";

interface EmailCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmailCaptured: (email: string) => void;
}

const EMAIL_STORAGE_KEY = "ascendos_generator_email";

/**
 * Vérifie si un email a déjà été capturé dans localStorage
 */
export function hasEmailCaptured(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(EMAIL_STORAGE_KEY);
}

/**
 * Récupère l'email capturé depuis localStorage
 */
export function getCapturedEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(EMAIL_STORAGE_KEY);
}

/**
 * Sauvegarde l'email dans localStorage
 */
export function saveCapturedEmail(email: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(EMAIL_STORAGE_KEY, email);
}

/**
 * Modal de capture d'email avant la première génération
 *
 * Ce modal:
 * - Demande l'email de l'utilisateur
 * - Optionnellement inscrit à la newsletter
 * - Envoie l'email au backend pour tracking/funnel
 * - Sauvegarde l'email dans localStorage pour ne pas redemander
 */
export function EmailCaptureModal({
  open,
  onOpenChange,
  onEmailCaptured,
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setIsSubmitting(true);

    try {
      // Valider l'email côté client
      if (!email || !email.includes("@")) {
        throw new Error("Veuillez entrer une adresse email valide");
      }

      // Envoyer au backend
      const response = await fetch("/api/marketing/capture-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "generator",
          newsletter,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de l'enregistrement");
      }

      // Sauvegarder dans localStorage
      saveCapturedEmail(email);

      // Callback et fermer le modal
      onEmailCaptured(email);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <DialogTitle className="text-center">
            Une dernière chose avant de générer
          </DialogTitle>
          <DialogDescription className="text-center">
            Entrez votre email pour accéder au générateur gratuit et recevoir
            des conseils pour améliorer vos communications sponsors.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Adresse email</Label>
            <Input
              id="email"
              type="email"
              placeholder="vous@entreprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="newsletter"
              checked={newsletter}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                setNewsletter(checked === true)
              }
              disabled={isSubmitting}
            />
            <Label
              htmlFor="newsletter"
              className="text-sm text-muted-foreground"
            >
              Je souhaite recevoir des conseils sur la communication projet (1
              email/semaine max, désabonnement facile)
            </Label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Générer mon update
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
