"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useReadOnlyMode } from "@/hooks/use-read-only-mode";
import { Button } from "@/components/ui/button";

/**
 * Bannière persistante affichée quand le mode lecture seule est actif
 * (trial expiré)
 *
 * Cette bannière:
 * - Est fixée en haut de l'écran
 * - Ne peut pas être fermée
 * - Contient un CTA vers la page de facturation
 */
export function ReadOnlyBanner() {
  const { isReadOnly, isLoading, message, upgradeUrl } = useReadOnlyMode();

  // Ne rien afficher pendant le chargement ou si le mode lecture seule n'est pas actif
  if (isLoading || !isReadOnly) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 w-full bg-amber-500 text-amber-950 py-3 px-4 shadow-md">
      <div className="container max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            <span className="font-semibold">Mode lecture seule</span>
            {" - "}
            {message}
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-amber-950 text-amber-50 hover:bg-amber-900 flex-shrink-0"
        >
          <Link href={upgradeUrl}>
            Passer au plan TEAM
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

/**
 * Version compacte de la bannière pour les espaces réduits
 */
export function ReadOnlyBannerCompact() {
  const { isReadOnly, isLoading, upgradeUrl } = useReadOnlyMode();

  if (isLoading || !isReadOnly) {
    return null;
  }

  return (
    <div className="bg-amber-100 text-amber-800 rounded-md p-3 mb-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">Mode lecture seule</span>
        </div>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="text-amber-800 border-amber-300 hover:bg-amber-200"
        >
          <Link href={upgradeUrl}>Passer au plan TEAM</Link>
        </Button>
      </div>
    </div>
  );
}
