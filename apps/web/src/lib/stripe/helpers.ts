import Stripe from "stripe";
import { stripe, STRIPE_PLANS, type StripePlanType } from "./client";
import { db, type Plan } from "@ascendos/database";

/**
 * Crée ou récupère un client Stripe pour une organisation
 */
export async function getOrCreateStripeCustomer(
  organizationId: string,
  email: string,
  name: string
): Promise<string> {
  const org = await db.organization.findUnique({
    where: { id: organizationId },
    select: { stripeCustomerId: true },
  });

  // Si le customer existe déjà, le retourner
  if (org?.stripeCustomerId) {
    return org.stripeCustomerId;
  }

  // Créer un nouveau customer Stripe
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      organizationId,
    },
  });

  // Sauvegarder le customer ID dans la DB
  await db.organization.update({
    where: { id: organizationId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

/**
 * Crée une session de checkout Stripe
 */
export async function createCheckoutSession(
  organizationId: string,
  plan: StripePlanType,
  customerEmail: string,
  organizationName: string
): Promise<Stripe.Checkout.Session> {
  const customerId = await getOrCreateStripeCustomer(
    organizationId,
    customerEmail,
    organizationName
  );

  const planConfig = STRIPE_PLANS[plan];

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: planConfig.priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
    metadata: {
      organizationId,
      plan,
    },
    subscription_data: {
      metadata: {
        organizationId,
        plan,
      },
    },
  });

  return session;
}

/**
 * Crée une session de portail client Stripe
 */
export async function createPortalSession(
  stripeCustomerId: string
): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  });

  return session;
}

/**
 * Convertit un plan Stripe en Plan Prisma
 */
export function stripePlanToPrisma(plan: StripePlanType): Plan {
  return plan as Plan;
}

/**
 * Récupère les détails de la subscription Stripe
 */
export async function getSubscriptionDetails(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
}

/**
 * Annule une subscription à la fin de la période de facturation
 */
export async function cancelSubscriptionAtPeriodEnd(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return subscription;
}

/**
 * Réactive une subscription annulée (avant la fin de la période)
 */
export async function reactivateSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });

  return subscription;
}

/**
 * Vérifie si une subscription est active
 */
export function isSubscriptionActive(
  subscription: Stripe.Subscription
): boolean {
  return (
    subscription.status === "active" || subscription.status === "trialing"
  );
}

/**
 * Formatte un montant en cents en euros
 */
export function formatPrice(amountInCents: number): string {
  const euros = amountInCents / 100;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(euros);
}
