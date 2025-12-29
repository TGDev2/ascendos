import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  limitedProcedure,
  isLimitReached,
} from "../trpc";

export const projectsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        archived: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findMany({
        where: {
          organizationId: ctx.orgId,
          archived: input.archived ?? false,
        },
        include: {
          masterProfile: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              updates: true,
              decisions: true,
              risks: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUnique({
        where: {
          id: input.id,
          organizationId: ctx.orgId,
        },
        include: {
          masterProfile: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              updates: true,
              decisions: true,
              risks: true,
            },
          },
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      return project;
    }),

  create: limitedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        masterProfileId: z.string(),
        objectives: z.array(z.string()),
        sponsorName: z.string().optional(),
        sponsorRole: z.string().optional(),
        sponsorEmail: z.string().email().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Vérifier le mode lecture seule (trial expiré)
      if (ctx.limits.isReadOnly) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Votre période d'essai a expiré. Passez au plan TEAM pour continuer à créer des projets.",
        });
      }

      // Vérifier la limite de projets
      if (isLimitReached(ctx.limits.currentProjects, ctx.limits.maxProjects)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Limite de ${ctx.limits.maxProjects} projet(s) atteinte. Passez au plan supérieur pour créer plus de projets.`,
        });
      }

      return ctx.db.project.create({
        data: {
          ...input,
          organizationId: ctx.orgId,
          createdById: ctx.userId,
        },
        include: {
          masterProfile: true,
        },
      });
    }),

  update: limitedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        masterProfileId: z.string().optional(),
        objectives: z.array(z.string()).optional(),
        sponsorName: z.string().optional(),
        sponsorRole: z.string().optional(),
        sponsorEmail: z.string().email().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Vérifier le mode lecture seule
      if (ctx.limits.isReadOnly) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Votre période d'essai a expiré. Passez au plan TEAM pour modifier vos projets.",
        });
      }

      const { id, ...data } = input;

      return ctx.db.project.update({
        where: {
          id,
          organizationId: ctx.orgId,
        },
        data,
        include: {
          masterProfile: true,
        },
      });
    }),

  archive: limitedProcedure
    .input(z.object({ id: z.string(), archived: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      // Vérifier le mode lecture seule
      if (ctx.limits.isReadOnly) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Votre période d'essai a expiré. Passez au plan TEAM pour archiver vos projets.",
        });
      }

      return ctx.db.project.update({
        where: {
          id: input.id,
          organizationId: ctx.orgId,
        },
        data: {
          archived: input.archived,
        },
      });
    }),

  delete: limitedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Vérifier le mode lecture seule
      if (ctx.limits.isReadOnly) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Votre période d'essai a expiré. Passez au plan TEAM pour supprimer vos projets.",
        });
      }

      return ctx.db.project.delete({
        where: {
          id: input.id,
          organizationId: ctx.orgId,
        },
      });
    }),
});
