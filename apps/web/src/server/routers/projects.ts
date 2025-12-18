import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        archived: z.boolean().optional(),
      })
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

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        masterProfileId: z.string(),
        objectives: z.array(z.string()),
        sponsorName: z.string().optional(),
        sponsorRole: z.string().optional(),
        sponsorEmail: z.string().email().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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

  update: protectedProcedure
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
      })
    )
    .mutation(async ({ ctx, input }) => {
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

  archive: protectedProcedure
    .input(z.object({ id: z.string(), archived: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
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

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.delete({
        where: {
          id: input.id,
          organizationId: ctx.orgId,
        },
      });
    }),
});
