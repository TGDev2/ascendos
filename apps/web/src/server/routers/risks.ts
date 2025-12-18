import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  createRiskSchema,
  updateRiskSchema,
  listRisksSchema,
} from "@ascendos/validators";

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
      const where: any = {
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

  create: protectedProcedure
    .input(createRiskSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify the project belongs to the organization
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          organizationId: ctx.orgId,
        },
      });

      if (!project) {
        throw new Error("Project not found");
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

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }).merge(updateRiskSchema)
    )
    .mutation(async ({ ctx, input }) => {
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
        throw new Error("Risk not found");
      }

      if (risk.project.organizationId !== ctx.orgId) {
        throw new Error("Unauthorized");
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

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
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
        throw new Error("Risk not found");
      }

      if (risk.project.organizationId !== ctx.orgId) {
        throw new Error("Unauthorized");
      }

      return ctx.db.risk.delete({
        where: { id: input.id },
      });
    }),
});
