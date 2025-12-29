"use client";

import { trpc } from "@/lib/trpc/react";

/**
 * Hook pour gérer le paywall et les limites de plan
 *
 * Retourne:
 * - canExportPDF: Si l'utilisateur peut exporter en PDF (TEAM ou AGENCY)
 * - canGenerate: Si l'utilisateur peut générer (trial non expiré et limite non atteinte)
 * - trialDaysRemaining: Nombre de jours restants du trial
 * - isTrialExpired: Si le trial est expiré
 * - upgradeRequired: Si l'upgrade est requis (plan TRIAL)
 * - generationsRemaining: Nombre de générations restantes
 * - isLoading: Si les données sont en cours de chargement
 * - quotas: Informations sur les quotas (projets, etc.)
 */
export function usePaywall() {
  const { data: org, isLoading } = trpc.billing.getStatus.useQuery(undefined, {
    refetchInterval: 30000, // Refresh toutes les 30s
  });

  if (isLoading || !org) {
    return {
      canExportPDF: false,
      canGenerate: false,
      trialDaysRemaining: 0,
      isTrialExpired: false,
      upgradeRequired: false,
      generationsRemaining: 0,
      isLoading: true,
      plan: null as "TRIAL" | "TEAM" | "AGENCY" | null,
      todayGenerations: 0,
      trialGenerations: 0,
      quotas: {
        currentProjects: 0,
        maxProjects: 1,
        isProjectLimitReached: false,
      },
    };
  }

  const trialDaysRemaining = org.trialDaysRemaining || 0;
  const isTrialExpired = trialDaysRemaining <= 0 && org.plan === "TRIAL";
  const generationsRemaining = org.generationsRemaining || 0;

  // Quotas
  const currentProjects = org.currentProjects || 0;
  const maxProjects = org.maxProjects || 1;
  const isProjectLimitReached =
    maxProjects !== -1 && currentProjects >= maxProjects;

  return {
    canExportPDF: org.plan !== "TRIAL",
    canGenerate: !isTrialExpired && generationsRemaining > 0,
    trialDaysRemaining,
    isTrialExpired,
    upgradeRequired: org.plan === "TRIAL",
    generationsRemaining:
      generationsRemaining === Infinity ? Infinity : generationsRemaining,
    isLoading: false,
    plan: org.plan as "TRIAL" | "TEAM" | "AGENCY",
    todayGenerations: org.todayGenerations || 0,
    trialGenerations: org.trialGenerations || 0,
    quotas: {
      currentProjects,
      maxProjects,
      isProjectLimitReached,
    },
  };
}
