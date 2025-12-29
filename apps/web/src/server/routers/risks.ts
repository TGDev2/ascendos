import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  limitedProcedure,
  isLimitReached,
} from "../trpc";
import {
  createRiskSchema,
  updateRiskSchema,
  listRisksSchema,
} from "@ascendos/validators";
import type { Prisma } from "@ascendos/database";

export const risksRouter = createTRPCRouter({
  list: protectedProcedure
    .input(listRisksSchema)
    .query(async ({ ctx, input }) => {
      // First verify the project belongs to the organization
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          organizationId: ctx.orgId,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      // Build the where clause with filters
      const where: Prisma.RiskWhereInput = {
        projectId: input.projectId,
      };

      if (input.status && input.status.length > 0) {
        where.status = { in: input.status };
      }

      if (input.severity && input.severity.length > 0) {
        where.severity = { in: input.severity };
      }

      return ctx.db.risk.findMany({
        where,
        include: {
          update: {
            select: {
              id: true,
              emailSubject: true,
            },
          },
        },
        orderBy: [
          { severity: "desc" }, // CRITICAL > HIGH > MEDIUM > LOW
          { identifiedAt: "desc" },
        ],
        take: input.limit,
        skip: input.offset,
      });
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const risk = await ctx.db.risk.findUnique({
        where: {
          id: input.id,
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              organizationId: true,
            },
          },
          update: {
            select: {
              id: true,
              emailSubject: true,
            },
          },
        },
      });

      if (!risk) {
        throw new Error("Risk not found");
      }

      // Verify the risk belongs to the organization
      if (risk.project.organizationId !== ctx.orgId) {
        throw new Error("Unauthorized");
      }

      return risk;
    }),

  create: limitedProcedure
    .input(createRiskSchema)
    .mutation(async ({ ctx, input }) => {
      // Vérifier le mode lecture seule
      if (ctx.limits.isReadOnly) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Votre période d'essai a expiré. Passez au plan TEAM pour créer des risques.",
        });
      }

      // Verify the project belongs to the organization
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          organizationId: ctx.orgId,
        },
        include: {
          _count: {
            select: { risks: true },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      // Vérifier la limite de risques par projet
      if (isLimitReached(project._count.risks, ctx.limits.maxRisksPerProject)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Limite de ${ctx.limits.maxRisksPerProject} risques par projet atteinte. Passez au plan supérieur.`,
        });
      }

      return ctx.db.risk.create({
        data: input,
        include: {
          update: {
            select: {
              id: true,
              emailSubject: true,
            },
          },
        },
      });
    }),

  update: limitedProcedure
    .input(
      z
        .object({
          id: z.string(),
        })
        .merge(updateRiskSchema),
    )
    .mutation(async ({ ctx, input }) => {
      // Vérifier le mode lecture seule
      if (ctx.limits.isReadOnly) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Votre période d'essai a expiré. Passez au plan TEAM pour modifier des risques.",
        });
      }

      const { id, ...data } = input;

      // First fetch the risk to verify ownership
      const risk = await ctx.db.risk.findUnique({
        where: { id },
        include: {
          project: {
            select: {
              organizationId: true,
            },
          },
        },
      });

      if (!risk) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Risk not found" });
      }

      if (risk.project.organizationId !== ctx.orgId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Unauthorized" });
      }

      // Auto-set resolvedAt when status changes to RESOLVED
      const updatedData = { ...data };
      if (data.status === "RESOLVED" && !risk.resolvedAt) {
        updatedData.resolvedAt = new Date();
      }

      return ctx.db.risk.update({
        where: { id },
        data: updatedData,
        include: {
          update: {
            select: {
              id: true,
              emailSubject: true,
            },
          },
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
            "Votre période d'essai a expiré. Passez au plan TEAM pour supprimer des risques.",
        });
      }

      // First fetch the risk to verify ownership
      const risk = await ctx.db.risk.findUnique({
        where: { id: input.id },
        include: {
          project: {
            select: {
              organizationId: true,
            },
          },
        },
      });

      if (!risk) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Risk not found" });
      }

      if (risk.project.organizationId !== ctx.orgId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Unauthorized" });
      }

      return ctx.db.risk.delete({
        where: { id: input.id },
      });
    }),
});
