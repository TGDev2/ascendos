import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  createDecisionSchema,
  updateDecisionSchema,
  listDecisionsSchema,
} from "@ascendos/validators";

export const decisionsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(listDecisionsSchema)
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

      if (input.tags && input.tags.length > 0) {
        where.tags = { hasSome: input.tags };
      }

      return ctx.db.decision.findMany({
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
          { decidedAt: "desc" },
          { createdAt: "desc" },
        ],
        take: input.limit,
        skip: input.offset,
      });
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const decision = await ctx.db.decision.findUnique({
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

      if (!decision) {
        throw new Error("Decision not found");
      }

      // Verify the decision belongs to the organization
      if (decision.project.organizationId !== ctx.orgId) {
        throw new Error("Unauthorized");
      }

      return decision;
    }),

  create: protectedProcedure
    .input(createDecisionSchema)
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

      return ctx.db.decision.create({
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
      }).merge(updateDecisionSchema)
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // First fetch the decision to verify ownership
      const decision = await ctx.db.decision.findUnique({
        where: { id },
        include: {
          project: {
            select: {
              organizationId: true,
            },
          },
        },
      });

      if (!decision) {
        throw new Error("Decision not found");
      }

      if (decision.project.organizationId !== ctx.orgId) {
        throw new Error("Unauthorized");
      }

      return ctx.db.decision.update({
        where: { id },
        data,
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
      // First fetch the decision to verify ownership
      const decision = await ctx.db.decision.findUnique({
        where: { id: input.id },
        include: {
          project: {
            select: {
              organizationId: true,
            },
          },
        },
      });

      if (!decision) {
        throw new Error("Decision not found");
      }

      if (decision.project.organizationId !== ctx.orgId) {
        throw new Error("Unauthorized");
      }

      return ctx.db.decision.delete({
        where: { id: input.id },
      });
    }),
});
