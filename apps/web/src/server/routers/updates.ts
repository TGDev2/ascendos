import { z } from "zod";
import { SituationType } from "@ascendos/database";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { extractEntitiesFromUpdate } from "@ascendos/ai";

export const updatesRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      // Vérifier que le projet appartient à l'organisation
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          organizationId: ctx.orgId,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      return ctx.db.update.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              extractedDecisions: true,
              extractedRisks: true,
            },
          },
        },
        orderBy: [
          { year: "desc" },
          { weekNumber: "desc" },
        ],
        take: input.limit,
      });
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const update = await ctx.db.update.findUnique({
        where: {
          id: input.id,
        },
        include: {
          project: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          extractedDecisions: {
            orderBy: {
              createdAt: "desc",
            },
          },
          extractedRisks: {
            orderBy: {
              severity: "desc",
            },
          },
        },
      });

      if (!update) {
        throw new Error("Update not found");
      }

      // Vérifier que le projet appartient à l'organisation
      const project = await ctx.db.project.findFirst({
        where: {
          id: update.projectId,
          organizationId: ctx.orgId,
        },
      });

      if (!project) {
        throw new Error("Unauthorized");
      }

      return update;
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        weekNumber: z.string(),
        year: z.number(),
        facts: z.array(
          z.object({
            text: z.string(),
            source: z.string().optional(),
          })
        ),
        decisionsNeeded: z.array(
          z.object({
            description: z.string(),
            deadline: z.string().optional(),
          })
        ),
        risksInput: z.array(
          z.object({
            description: z.string(),
            impact: z.string(),
            mitigation: z.string().optional(),
          })
        ),
        rawInput: z.string().optional(),
        situationType: z.nativeEnum(SituationType),
        emailSubject: z.string(),
        emailBody: z.string(),
        slackMessage: z.string(),
        generatedWith: z.string(),
        tokensUsed: z.number().optional(),
        generationTimeMs: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Vérifier que le projet appartient à l'organisation
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          organizationId: ctx.orgId,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      // Créer l'update
      const update = await ctx.db.update.create({
        data: {
          projectId: input.projectId as string,
          createdById: ctx.userId,
          weekNumber: input.weekNumber as string,
          year: input.year as number,
          facts: input.facts as any,
          decisionsNeeded: input.decisionsNeeded as any,
          risksInput: input.risksInput as any,
          rawInput: input.rawInput as string | undefined,
          situationType: input.situationType as any,
          emailSubject: input.emailSubject as string,
          emailBody: input.emailBody as string,
          slackMessage: input.slackMessage as string,
          generatedWith: input.generatedWith as string,
          tokensUsed: input.tokensUsed as number | undefined,
          generationTimeMs: input.generationTimeMs as number | undefined,
        },
      });

      // Logger l'usage
      await ctx.db.usageLog.create({
        data: {
          organizationId: project.organizationId,
          userId: ctx.userId,
          action: 'generate_update',
          tokensUsed: input.tokensUsed || 0,
          modelUsed: input.generatedWith,
          metadata: {
            projectId: input.projectId,
            updateId: update.id,
          },
        },
      });

      // Incrémenter le compteur trial si l'organisation est en TRIAL
      const org = await ctx.db.organization.findUnique({
        where: { id: project.organizationId },
        select: { plan: true },
      });

      if (org?.plan === 'TRIAL') {
        await ctx.db.organization.update({
          where: { id: project.organizationId },
          data: {
            trialGenerations: {
              increment: 1,
            },
          },
        });
      }

      // Extraction automatique des décisions et risques en arrière-plan
      // Ne pas bloquer la réponse si l'extraction échoue
      extractEntitiesFromUpdate(input.emailBody as string, input.slackMessage as string)
        .then(async (entities) => {
          // Créer les décisions extraites
          for (const decision of entities.decisions) {
            await ctx.db.decision.create({
              data: {
                projectId: input.projectId as string,
                updateId: update.id,
                description: decision.description,
                context: decision.context,
                decidedBy: decision.decidedBy,
                tags: decision.tags || [],
                status: decision.isPending ? "PENDING" : "DECIDED",
                decidedAt: decision.isPending ? undefined : new Date(),
              },
            });
          }

          // Créer les risques extraits
          for (const risk of entities.risks) {
            await ctx.db.risk.create({
              data: {
                projectId: input.projectId as string,
                updateId: update.id,
                description: risk.description,
                impact: risk.impact,
                mitigation: risk.mitigation,
                severity: risk.severity,
                status: "OPEN",
                tags: risk.tags || [],
              },
            });
          }
        })
        .catch((error) => {
          console.error("Error extracting entities:", error);
          // Ne pas faire échouer la création de l'update si l'extraction échoue
        });

      return ctx.db.update.findUnique({
        where: { id: update.id },
        include: {
          project: true,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const update = await ctx.db.update.findUnique({
        where: { id: input.id },
        include: { project: true },
      });

      if (!update) {
        throw new Error("Update not found");
      }

      // Vérifier que le projet appartient à l'organisation
      if (update.project.organizationId !== ctx.orgId) {
        throw new Error("Unauthorized");
      }

      return ctx.db.update.delete({
        where: { id: input.id },
      });
    }),

  markAsCopied: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership before updating
      const update = await ctx.db.update.findUnique({
        where: { id: input.id },
        include: { project: { select: { organizationId: true } } },
      });

      if (!update) {
        throw new Error("Update not found");
      }

      if (update.project.organizationId !== ctx.orgId) {
        throw new Error("Unauthorized");
      }

      return ctx.db.update.update({
        where: { id: input.id },
        data: { wasCopied: true },
      });
    }),

  markAsSent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership before updating
      const update = await ctx.db.update.findUnique({
        where: { id: input.id },
        include: { project: { select: { organizationId: true } } },
      });

      if (!update) {
        throw new Error("Update not found");
      }

      if (update.project.organizationId !== ctx.orgId) {
        throw new Error("Unauthorized");
      }

      return ctx.db.update.update({
        where: { id: input.id },
        data: {
          wasSent: true,
          sentAt: new Date(),
        },
      });
    }),
});
