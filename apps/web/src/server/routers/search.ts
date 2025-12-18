import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const searchRouter = createTRPCRouter({
  searchUpdates: protectedProcedure
    .input(
      z.object({
        projectId: z.string().cuid(),
        query: z.string().min(1),
        dateFrom: z.date().optional(),
        dateTo: z.date().optional(),
        situationType: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
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

      // Build the where clause
      const where: any = {
        projectId: input.projectId,
      };

      // Full-text search on subject and body
      where.OR = [
        {
          emailSubject: {
            contains: input.query,
            mode: "insensitive",
          },
        },
        {
          emailBody: {
            contains: input.query,
            mode: "insensitive",
          },
        },
      ];

      // Date filters
      if (input.dateFrom || input.dateTo) {
        where.createdAt = {};
        if (input.dateFrom) {
          where.createdAt.gte = input.dateFrom;
        }
        if (input.dateTo) {
          where.createdAt.lte = input.dateTo;
        }
      }

      // Situation type filter
      if (input.situationType) {
        where.situationType = input.situationType;
      }

      // Tags filter
      if (input.tags && input.tags.length > 0) {
        where.tags = { hasSome: input.tags };
      }

      const updates = await ctx.db.update.findMany({
        where,
        select: {
          id: true,
          emailSubject: true,
          emailBody: true,
          createdAt: true,
          situationType: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20, // Limit results for performance
      });

      // Add snippet (first 200 chars of emailBody)
      return updates.map((update) => ({
        id: update.id,
        emailSubject: update.emailSubject,
        snippet: update.emailBody.substring(0, 200) + (update.emailBody.length > 200 ? "..." : ""),
        createdAt: update.createdAt,
        situationType: update.situationType,
      }));
    }),
});
