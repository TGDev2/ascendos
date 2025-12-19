import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

/**
 * Router tRPC pour les paramètres d'organisation
 */
export const settingsRouter = createTRPCRouter({
  /**
   * Récupère les paramètres de l'organisation
   */
  get: protectedProcedure.query(async ({ ctx }) => {
    let settings = await ctx.db.organizationSettings.findUnique({
      where: { organizationId: ctx.orgId },
    });

    // Create default settings if they don't exist
    if (!settings) {
      settings = await ctx.db.organizationSettings.create({
        data: {
          organizationId: ctx.orgId,
        },
      });
    }

    return settings;
  }),

  /**
   * Met à jour les paramètres de l'organisation
   */
  update: protectedProcedure
    .input(
      z.object({
        // Reminder settings
        weeklyReminderEnabled: z.boolean().optional(),
        weeklyReminderDay: z.number().min(0).max(6).optional(),
        weeklyReminderHour: z.number().min(0).max(23).optional(),

        // RGPD settings
        dataRetentionDays: z.number().min(30).max(3650).optional(),
        autoRedaction: z.boolean().optional(),
        storeRawInput: z.boolean().optional(),

        // LLM settings
        customApiKey: z.string().optional().nullable(),
        preferredProvider: z.enum(["anthropic", "openai"]).optional(),

        // Branding
        exportBranding: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user has permission to update settings (only OWNER and ADMIN)
      const user = await ctx.db.user.findFirst({
        where: {
          id: ctx.userId,
          organizationId: ctx.orgId,
        },
      });

      if (!user || (user.role !== "OWNER" && user.role !== "ADMIN")) {
        throw new Error("Only organization owners and admins can update settings");
      }

      // Upsert settings
      const settings = await ctx.db.organizationSettings.upsert({
        where: { organizationId: ctx.orgId },
        create: {
          organizationId: ctx.orgId,
          ...input,
        },
        update: input,
      });

      return settings;
    }),
});
