import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not defined in environment variables. Please add it to .env.local"
  );
}

/**
 * Client Stripe configuré pour l'API Stripe
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

/**
 * Configuration des plans Stripe
 */
export const STRIPE_PLANS = {
  TEAM: {
    name: "Team",
    priceId: process.env.STRIPE_TEAM_PRICE_ID!,
    price: 8900, // €89.00 in cents
    currency: "eur",
    generationsPerDay: 10,
    features: [
      "10 générations par jour par utilisateur",
      "5 utilisateurs inclus",
      "Export PDF illimité",
      "10 projets maximum",
      "Historique 12 mois",
    ],
  },
  AGENCY: {
    name: "Agency",
    priceId: process.env.STRIPE_AGENCY_PRICE_ID!,
    price: 16900, // €169.00 in cents
    currency: "eur",
    generationsPerDay: 50,
    features: [
      "50 générations par jour par utilisateur",
      "15 utilisateurs inclus",
      "Export PDF illimité",
      "Projets illimités",
      "Historique 24 mois",
      "Support prioritaire",
    ],
  },
} as const;

export type StripePlanType = keyof typeof STRIPE_PLANS;

/**
 * Vérifie que les environment variables Stripe sont configurées
 */
export function validateStripeConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!process.env.STRIPE_SECRET_KEY) {
    errors.push("STRIPE_SECRET_KEY is missing");
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    errors.push("STRIPE_WEBHOOK_SECRET is missing");
  }

  if (!process.env.STRIPE_TEAM_PRICE_ID) {
    errors.push("STRIPE_TEAM_PRICE_ID is missing");
  }

  if (!process.env.STRIPE_AGENCY_PRICE_ID) {
    errors.push("STRIPE_AGENCY_PRICE_ID is missing");
  }

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    errors.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
