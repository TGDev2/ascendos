"use client";

import { trpc } from "@/lib/trpc/react";

/**
 * Hook pour gérer le mode lecture seule
 *
 * Le mode lecture seule est activé quand:
 * - L'utilisateur est en plan TRIAL
 * - ET la période d'essai a expiré (trialEndsAt < now)
 *
 * Dans ce mode, l'utilisateur peut:
 * - Consulter ses données (projets, décisions, risques)
 * - Naviguer dans le dashboard
 *
 * Mais ne peut PAS:
 * - Créer de nouveaux projets, décisions ou risques
 * - Modifier les données existantes
 * - Générer de nouveaux updates
 * - Supprimer des données
 *
 * @returns {Object} État du mode lecture seule et informations associées
 */
export function useReadOnlyMode() {
  const { data: org, isLoading } = trpc.billing.getStatus.useQuery(undefined, {
    refetchInterval: 30000, // Refresh toutes les 30s
  });

  if (isLoading || !org) {
    return {
      isReadOnly: false,
      isLoading: true,
      message: "",
      upgradeUrl: "/settings/billing",
      plan: null,
      trialExpired: false,
      trialDaysRemaining: 0,
    };
  }

  const trialDaysRemaining = org.trialDaysRemaining || 0;
  const trialExpired = trialDaysRemaining <= 0 && org.plan === "TRIAL";
  const isReadOnly = trialExpired;

  return {
    isReadOnly,
    isLoading: false,
    message: isReadOnly
      ? "Votre période d'essai a expiré. Passez au plan TEAM pour continuer à créer et modifier vos données."
      : "",
    upgradeUrl: "/settings/billing",
    plan: org.plan,
    trialExpired,
    trialDaysRemaining,
  };
}

/**
 * Hook simplifié pour vérifier rapidement si le mode lecture seule est actif
 */
export function useIsReadOnly(): boolean {
  const { isReadOnly } = useReadOnlyMode();
  return isReadOnly;
}
