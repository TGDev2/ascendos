import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const searchRouter = createTRPCRouter({
  /**
   * Search in updates
   */
  searchUpdates: protectedProcedure
    .input(
      z.object({
        projectId: z.string().cuid(),
        query: z.string().min(1).max(200),
        dateFrom: z.date().optional(),
        dateTo: z.date().optional(),
        situationType: z.string().max(50).optional(),
        tags: z.array(z.string().max(50)).max(10).optional(),
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

  /**
   * Search in decisions
   */
  searchDecisions: protectedProcedure
    .input(
      z.object({
        projectId: z.string().cuid(),
        query: z.string().min(1).max(200),
        status: z.enum(["PENDING", "DECIDED", "CANCELLED"]).optional(),
        tags: z.array(z.string().max(50)).max(10).optional(),
        dateFrom: z.date().optional(),
        dateTo: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify project belongs to organization
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          organizationId: ctx.orgId,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      // Build where clause
      const where: any = {
        projectId: input.projectId,
      };

      // Full-text search on description, context, and outcome
      where.OR = [
        {
          description: {
            contains: input.query,
            mode: "insensitive",
          },
        },
        {
          context: {
            contains: input.query,
            mode: "insensitive",
          },
        },
        {
          outcome: {
            contains: input.query,
            mode: "insensitive",
          },
        },
      ];

      // Status filter
      if (input.status) {
        where.status = input.status;
      }

      // Tags filter
      if (input.tags && input.tags.length > 0) {
        where.tags = { hasSome: input.tags };
      }

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

      const decisions = await ctx.db.decision.findMany({
        where,
        select: {
          id: true,
          description: true,
          context: true,
          outcome: true,
          status: true,
          tags: true,
          decidedBy: true,
          decidedAt: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      });

      return decisions.map((decision) => ({
        id: decision.id,
        description: decision.description,
        snippet: decision.context?.substring(0, 150) + (decision.context && decision.context.length > 150 ? "..." : "") || "",
        status: decision.status,
        tags: decision.tags,
        decidedBy: decision.decidedBy,
        decidedAt: decision.decidedAt,
        createdAt: decision.createdAt,
      }));
    }),

  /**
   * Search in risks
   */
  searchRisks: protectedProcedure
    .input(
      z.object({
        projectId: z.string().cuid(),
        query: z.string().min(1).max(200),
        status: z.enum(["OPEN", "MONITORING", "MITIGATED", "RESOLVED", "CANCELLED"]).optional(),
        severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
        tags: z.array(z.string().max(50)).max(10).optional(),
        dateFrom: z.date().optional(),
        dateTo: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify project belongs to organization
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          organizationId: ctx.orgId,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      // Build where clause
      const where: any = {
        projectId: input.projectId,
      };

      // Full-text search on description, impact, and mitigation
      where.OR = [
        {
          description: {
            contains: input.query,
            mode: "insensitive",
          },
        },
        {
          impact: {
            contains: input.query,
            mode: "insensitive",
          },
        },
        {
          mitigation: {
            contains: input.query,
            mode: "insensitive",
          },
        },
      ];

      // Status filter
      if (input.status) {
        where.status = input.status;
      }

      // Severity filter
      if (input.severity) {
        where.severity = input.severity;
      }

      // Tags filter
      if (input.tags && input.tags.length > 0) {
        where.tags = { hasSome: input.tags };
      }

      // Date filters
      if (input.dateFrom || input.dateTo) {
        where.identifiedAt = {};
        if (input.dateFrom) {
          where.identifiedAt.gte = input.dateFrom;
        }
        if (input.dateTo) {
          where.identifiedAt.lte = input.dateTo;
        }
      }

      const risks = await ctx.db.risk.findMany({
        where,
        select: {
          id: true,
          description: true,
          impact: true,
          mitigation: true,
          severity: true,
          status: true,
          tags: true,
          identifiedAt: true,
          reviewDate: true,
          resolvedAt: true,
        },
        orderBy: {
          identifiedAt: "desc",
        },
        take: 20,
      });

      return risks.map((risk) => ({
        id: risk.id,
        description: risk.description,
        impact: risk.impact,
        snippet: risk.mitigation?.substring(0, 150) + (risk.mitigation && risk.mitigation.length > 150 ? "..." : "") || risk.impact.substring(0, 150),
        severity: risk.severity,
        status: risk.status,
        tags: risk.tags,
        identifiedAt: risk.identifiedAt,
        reviewDate: risk.reviewDate,
        resolvedAt: risk.resolvedAt,
      }));
    }),
});
