import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@clerk/nextjs/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@ascendos/database";

/**
 * Contexte tRPC
 * Contient la DB et l'authentification Clerk
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const { userId, orgId } = await auth();

  return {
    db,
    userId,
    orgId,
    ...opts,
  };
};

/**
 * Initialisation tRPC avec SuperJSON pour la sérialisation
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Router builder
 */
export const createTRPCRouter = t.router;

/**
 * Procédure publique (pas d'auth requise)
 */
export const publicProcedure = t.procedure;

/**
 * Procédure protégée (auth requise)
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId || !ctx.orgId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // userId et orgId sont maintenant garantis non-null
      db: ctx.db,
      userId: ctx.userId,
      orgId: ctx.orgId,
    },
  });
});

/**
 * Interface pour les limites du contexte
 */
export interface OrganizationLimits {
  maxProjects: number;
  maxDecisionsPerProject: number;
  maxRisksPerProject: number;
  currentProjects: number;
  isReadOnly: boolean;
  plan: "TRIAL" | "TEAM" | "AGENCY";
  trialExpired: boolean;
}

/**
 * Procédure avec limites (pour les actions de création/modification)
 * Vérifie le statut du trial et les limites du plan
 */
export const limitedProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    // Récupérer l'organisation avec les limites
    const org = await ctx.db.organization.findUnique({
      where: { id: ctx.orgId },
      select: {
        plan: true,
        trialEndsAt: true,
        maxProjects: true,
        maxDecisionsPerProject: true,
        maxRisksPerProject: true,
        _count: {
          select: { projects: { where: { archived: false } } },
        },
      },
    });

    if (!org) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Organization not found",
      });
    }

    // Vérifier si le trial est expiré
    const now = new Date();
    const trialExpired =
      org.plan === "TRIAL" &&
      org.trialEndsAt &&
      now > new Date(org.trialEndsAt);

    // Mode lecture seule si trial expiré
    const isReadOnly = !!trialExpired;

    const limits: OrganizationLimits = {
      maxProjects: org.maxProjects,
      maxDecisionsPerProject: org.maxDecisionsPerProject,
      maxRisksPerProject: org.maxRisksPerProject,
      currentProjects: org._count.projects,
      isReadOnly,
      plan: org.plan,
      trialExpired: !!trialExpired,
    };

    return next({
      ctx: {
        ...ctx,
        limits,
      },
    });
  },
);

/**
 * Helper pour vérifier si une limite est atteinte
 * -1 signifie illimité
 */
export function isLimitReached(current: number, max: number): boolean {
  return max !== -1 && current >= max;
}
