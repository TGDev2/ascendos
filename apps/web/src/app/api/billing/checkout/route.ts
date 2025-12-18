import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@ascendos/database";
import { createCheckoutSession } from "@/lib/stripe/helpers";
import { STRIPE_PLANS, type StripePlanType } from "@/lib/stripe/client";

/**
 * POST /api/billing/checkout
 * Crée une session de checkout Stripe pour upgrader un plan
 *
 * Body: { plan: "TEAM" | "AGENCY" }
 * Returns: { sessionId: string, url: string }
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authentifier l'utilisateur
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // 2. Parser le body
    const body = await req.json();
    const { plan } = body as { plan: StripePlanType };

    // 3. Valider le plan
    if (!plan || !STRIPE_PLANS[plan]) {
      return NextResponse.json(
        {
          error: "Invalid plan",
          message: 'Plan must be "TEAM" or "AGENCY"',
        },
        { status: 400 }
      );
    }

    // 4. Récupérer l'utilisateur et son organisation
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

    // 5. Vérifier que l'utilisateur a les droits (OWNER ou ADMIN)
    if (user.role !== "OWNER" && user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "Only organization owners and admins can manage billing",
        },
        { status: 403 }
      );
    }

    // 6. Vérifier que l'organisation est en TRIAL
    if (user.organization.plan !== "TRIAL") {
      return NextResponse.json(
        {
          error: "Already subscribed",
          message: `Organization is already on ${user.organization.plan} plan`,
        },
        { status: 400 }
      );
    }

    // 7. Créer la session de checkout Stripe
    const session = await createCheckoutSession(
      user.organization.id,
      plan,
      user.email,
      user.organization.name
    );

    // 8. Retourner l'URL de checkout
    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);

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
