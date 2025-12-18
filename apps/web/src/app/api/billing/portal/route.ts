import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@ascendos/database";
import { createPortalSession } from "@/lib/stripe/helpers";

/**
 * POST /api/billing/portal
 * Crée une session de portail Stripe pour gérer l'abonnement
 *
 * Returns: { url: string }
 */
export async function POST(_req: NextRequest) {
  try {
    // 1. Authentifier l'utilisateur
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // 2. Récupérer l'utilisateur et son organisation
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        organization: true,
      },
    });

    if (!user || !user.organization) {
      return NextResponse.json(
        { error: "User or organization not found" },
        { status: 404 }
      );
    }

    // 3. Vérifier que l'utilisateur a les droits (OWNER ou ADMIN)
    if (user.role !== "OWNER" && user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "Only organization owners and admins can manage billing",
        },
        { status: 403 }
      );
    }

    // 4. Vérifier que l'organisation a un customer Stripe
    if (!user.organization.stripeCustomerId) {
      return NextResponse.json(
        {
          error: "No Stripe customer",
          message: "Organization does not have a Stripe customer. Please subscribe first.",
        },
        { status: 400 }
      );
    }

    // 5. Créer la session de portail Stripe
    const session = await createPortalSession(
      user.organization.stripeCustomerId
    );

    // 6. Retourner l'URL du portail
    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating portal session:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
