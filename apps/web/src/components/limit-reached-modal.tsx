"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, AlertTriangle, Check } from "lucide-react";

export type LimitType = "projects" | "decisions" | "risks" | "generations";

interface LimitReachedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limitType: LimitType;
  currentPlan: "TRIAL" | "TEAM" | "AGENCY" | null;
}

const limitMessages: Record<LimitType, { title: string; description: string }> =
  {
    projects: {
      title: "Limite de projets atteinte",
      description:
        "Vous avez atteint la limite de projets pour votre plan actuel.",
    },
    decisions: {
      title: "Limite de décisions atteinte",
      description: "Vous avez atteint la limite de décisions pour ce projet.",
    },
    risks: {
      title: "Limite de risques atteinte",
      description: "Vous avez atteint la limite de risques pour ce projet.",
    },
    generations: {
      title: "Limite de générations atteinte",
      description:
        "Vous avez atteint la limite de générations pour aujourd'hui.",
    },
  };

const planFeatures = {
  TEAM: {
    name: "Team",
    price: "89€/mois",
    features: [
      "10 projets maximum",
      "100 décisions par projet",
      "100 risques par projet",
      "10 générations/jour par utilisateur",
      "Export PDF illimité",
      "5 utilisateurs inclus",
    ],
  },
  AGENCY: {
    name: "Agency",
    price: "169€/mois",
    features: [
      "Projets illimités",
      "Décisions illimitées",
      "Risques illimités",
      "50 générations/jour par utilisateur",
      "Export PDF illimité",
      "15 utilisateurs inclus",
      "Support prioritaire",
    ],
  },
};

/**
 * Modal affiché quand un utilisateur atteint une limite de son plan
 *
 * Ce modal:
 * - Explique la limite atteinte
 * - Montre les avantages du plan supérieur
 * - Propose un CTA vers la page de facturation
 */
export function LimitReachedModal({
  open,
  onOpenChange,
  limitType,
  currentPlan,
}: LimitReachedModalProps) {
  const message = limitMessages[limitType];

  // Déterminer le plan suggéré
  const suggestedPlan = currentPlan === "TRIAL" ? "TEAM" : "AGENCY";
  const suggestedPlanInfo = planFeatures[suggestedPlan];

  // Si déjà sur AGENCY, pas de suggestion possible
  if (currentPlan === "AGENCY") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
              <AlertTriangle className="h-7 w-7 text-orange-600 dark:text-orange-400" />
            </div>
            <DialogTitle className="text-center">{message.title}</DialogTitle>
            <DialogDescription className="text-center">
              {message.description} Vous êtes déjà sur le plan Agency, notre
              plan le plus complet. Contactez-nous si vous avez besoin de
              limites personnalisées.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            <Button asChild>
              <a href="mailto:support@ascendos.co">Nous contacter</a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
            <AlertTriangle className="h-7 w-7 text-orange-600 dark:text-orange-400" />
          </div>
          <DialogTitle className="text-center">{message.title}</DialogTitle>
          <DialogDescription className="text-center">
            {message.description} Passez au plan {suggestedPlanInfo.name} pour
            débloquer plus de capacité.
          </DialogDescription>
        </DialogHeader>

        {/* Plan comparison */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <span className="font-semibold">{suggestedPlanInfo.name}</span>
            </div>
            <span className="text-lg font-bold">{suggestedPlanInfo.price}</span>
          </div>
          <ul className="space-y-2">
            {suggestedPlanInfo.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 shrink-0 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Plus tard
          </Button>
          <Button asChild>
            <Link href="/settings/billing">
              <Crown className="mr-2 h-4 w-4" />
              Passer au plan {suggestedPlanInfo.name}
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
