import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { startOfDay, startOfWeek, startOfMonth, subDays } from "date-fns";
import {
  createCheckoutSession,
  createPortalSession,
} from "@/lib/stripe/helpers";
import { type StripePlanType } from "@/lib/stripe/client";

/**
 * Router tRPC pour la gestion de la facturation et des abonnements
 */
export const billingRouter = createTRPCRouter({
  /**
   * Récupère le statut de facturation de l'organisation
   * Inclut: plan, trial, usage du jour, stripe info
   */
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const org = await ctx.db.organization.findUnique({
      where: { id: ctx.orgId },
    });

    if (!org) {
      throw new Error("Organization not found");
    }

    // Calculer l'usage du jour
    const todayUsage = await ctx.db.usageLog.count({
      where: {
        organizationId: ctx.orgId,
        action: "generate_update",
        createdAt: { gte: startOfDay(new Date()) },
      },
    });

    // Calculer le nombre de jours restants du trial
    let trialDaysRemaining = 0;
    if (org.trialEndsAt) {
      const now = new Date();
      const diff = new Date(org.trialEndsAt).getTime() - now.getTime();
      trialDaysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    // Calculer les générations restantes pour le trial
    let generationsRemaining = Infinity;
    if (org.plan === "TRIAL") {
      generationsRemaining = Math.max(0, 5 - org.trialGenerations);
    }

    return {
      ...org,
      todayGenerations: todayUsage,
      trialDaysRemaining,
      generationsRemaining,
    };
  }),

  /**
   * Récupère l'historique d'usage pour une période donnée
   */
  getUsage: protectedProcedure
    .input(
      z.object({
        period: z.enum(["day", "week", "month"]),
        userId: z.string().optional(), // Optionnel: filtrer par user
      }),
    )
    .query(async ({ ctx, input }) => {
      // Calculer la date de début en fonction de la période
      let startDate: Date;
      switch (input.period) {
        case "day":
          startDate = startOfDay(new Date());
          break;
        case "week":
          startDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Lundi
          break;
        case "month":
          startDate = startOfMonth(new Date());
          break;
      }

      // Query les logs d'usage
      const logs = await ctx.db.usageLog.findMany({
        where: {
          organizationId: ctx.orgId,
          userId: input.userId,
          action: "generate_update",
          createdAt: { gte: startDate },
        },
        orderBy: { createdAt: "desc" },
        take: 100, // Limiter à 100 entrées
      });

      // Grouper par jour pour les stats
      const byDay = logs.reduce(
        (acc, log) => {
          const day = log.createdAt.toISOString().split("T")[0]!;
          if (!acc[day]) {
            acc[day] = { count: 0, tokens: 0 };
          }
          acc[day]!.count++;
          acc[day]!.tokens += log.tokensUsed || 0;
          return acc;
        },
        {} as Record<string, { count: number; tokens: number }>,
      );

      return {
        logs,
        byDay,
        total: logs.length,
        totalTokens: logs.reduce((sum, log) => sum + (log.tokensUsed || 0), 0),
      };
    }),

  /**
   * Récupère l'historique complet pour un graph
   * Retourne les 30 derniers jours
   */
  getUsageHistory: protectedProcedure.query(async ({ ctx }) => {
    const thirtyDaysAgo = subDays(new Date(), 30);

    const logs = await ctx.db.usageLog.findMany({
      where: {
        organizationId: ctx.orgId,
        action: "generate_update",
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: "asc" },
    });

    // Grouper par jour
    const byDay = logs.reduce(
      (acc, log) => {
        const day = log.createdAt.toISOString().split("T")[0]!;
        if (!acc[day]) {
          acc[day] = 0;
        }
        acc[day]++;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Convertir en array pour le graph
    const chartData = Object.entries(byDay).map(([date, count]) => ({
      date,
      count,
    }));

    return chartData;
  }),

  /**
   * Crée une session de checkout Stripe
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        plan: z.enum(["TEAM", "AGENCY"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Récupérer l'utilisateur avec son organisation
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId },
        include: { organization: true },
      });

      if (!user || (user.role !== "OWNER" && user.role !== "ADMIN")) {
        throw new Error(
          "Only organization owners and admins can manage billing",
        );
      }

      if (!user.organization) {
        throw new Error("Organization not found");
      }

      // Vérifier que l'organisation est en TRIAL
      if (user.organization.plan !== "TRIAL") {
        throw new Error(
          `Organization is already on ${user.organization.plan} plan`,
        );
      }

      // Créer la session de checkout Stripe directement
      const session = await createCheckoutSession(
        user.organization.id,
        input.plan as StripePlanType,
        user.email,
        user.organization.name,
      );

      return {
        sessionId: session.id,
        url: session.url,
      };
    }),

  /**
   * Récupère l'URL du portail Stripe
   */
  getPortalUrl: protectedProcedure.mutation(async ({ ctx }) => {
    // Récupérer l'utilisateur avec son organisation
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.userId },
      include: { organization: true },
    });

    if (!user || (user.role !== "OWNER" && user.role !== "ADMIN")) {
      throw new Error("Only organization owners and admins can manage billing");
    }

    if (!user.organization) {
      throw new Error("Organization not found");
    }

    // Vérifier que l'organisation a un customer Stripe
    if (!user.organization.stripeCustomerId) {
      throw new Error(
        "Organization does not have a Stripe customer. Please subscribe first.",
      );
    }

    // Créer la session de portail Stripe directement
    const session = await createPortalSession(
      user.organization.stripeCustomerId,
    );

    return {
      url: session.url,
    };
  }),
});
