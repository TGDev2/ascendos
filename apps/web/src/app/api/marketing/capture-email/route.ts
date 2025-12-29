import { NextRequest, NextResponse } from "next/server";
import { db } from "@ascendos/database";
import { logBusinessEvent } from "@/lib/logger";
import { z } from "zod";

const captureEmailSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  source: z.enum(["generator", "landing", "blog"]).default("generator"),
  newsletter: z.boolean().default(false),
});

/**
 * POST /api/marketing/capture-email
 * Capture l'email d'un visiteur pour le funnel marketing
 *
 * Body: { email: string, source?: string, newsletter?: boolean }
 * Returns: { success: boolean }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source, newsletter } = captureEmailSchema.parse(body);

    // Vérifier si l'email existe déjà dans les leads
    const existingLead = await db.marketingLead.findUnique({
      where: { email },
    });

    if (existingLead) {
      // Mettre à jour les informations
      await db.marketingLead.update({
        where: { email },
        data: {
          lastSeenAt: new Date(),
          newsletter: newsletter || existingLead.newsletter,
        },
      });
    } else {
      // Créer un nouveau lead
      await db.marketingLead.create({
        data: {
          email,
          source,
          newsletter,
          capturedAt: new Date(),
          lastSeenAt: new Date(),
        },
      });
    }

    // Logger l'événement pour analytics
    logBusinessEvent("email_captured", {
      email,
      source,
      newsletter,
      isNew: !existingLead,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.errors[0]?.message || "Données invalides",
        },
        { status: 400 },
      );
    }

    console.error("Error capturing email:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne" },
      { status: 500 },
    );
  }
}
