import { NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { db, rateLimiter, type Plan } from "@ascendos/database";

/**
 * POST /api/webhooks/stripe
 * Webhook Stripe pour gérer les événements de subscription
 *
 * Events gérés:
 * - checkout.session.completed
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.payment_failed
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return new Response("No signature provided", { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    // Vérifier la signature du webhook
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      { status: 400 }
    );
  }

  try {
    // Gérer les différents types d'événements
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      `Webhook handler failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 }
    );
  }
}

/**
 * Gère l'événement checkout.session.completed
 * Appelé quand un utilisateur complète le checkout
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const organizationId = session.metadata?.organizationId;
  const plan = session.metadata?.plan as Plan | undefined;

  if (!organizationId || !plan) {
    console.error("Missing metadata in checkout session:", session.id);
    return;
  }

  console.log(`Checkout completed for org ${organizationId}, plan: ${plan}`);

  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;

  // Récupérer les détails de la subscription
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Mettre à jour l'organisation
  await db.organization.update({
    where: { id: organizationId },
    data: {
      plan,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: subscription.items.data[0]?.price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: false,
      // Reset le trial
      trialEndsAt: null,
      trialGenerations: 0,
    },
  });

  // Reset le rate limiter pour cette organisation (passer de TRIAL à TEAM/AGENCY)
  await rateLimiter.resetOrganizationLimit(organizationId);

  console.log(`✅ Organization ${organizationId} upgraded to ${plan}`);
}

/**
 * Gère l'événement customer.subscription.updated
 * Appelé quand une subscription est mise à jour (changement de plan, renouvellement, etc.)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const organizationId = subscription.metadata?.organizationId;

  if (!organizationId) {
    console.error("Missing organizationId in subscription metadata:", subscription.id);
    return;
  }

  console.log(`Subscription updated for org ${organizationId}`);

  // Déterminer le nouveau plan
  const priceId = subscription.items.data[0]?.price.id;
  let plan: Plan = "TRIAL";

  if (priceId === process.env.STRIPE_TEAM_PRICE_ID) {
    plan = "TEAM";
  } else if (priceId === process.env.STRIPE_AGENCY_PRICE_ID) {
    plan = "AGENCY";
  }

  // Mettre à jour l'organisation
  await db.organization.update({
    where: { id: organizationId },
    data: {
      plan,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  console.log(`✅ Organization ${organizationId} subscription updated to ${plan}`);
}

/**
 * Gère l'événement customer.subscription.deleted
 * Appelé quand une subscription est annulée ou expire
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const organizationId = subscription.metadata?.organizationId;

  if (!organizationId) {
    console.error("Missing organizationId in subscription metadata:", subscription.id);
    return;
  }

  console.log(`Subscription deleted for org ${organizationId}`);

  // Downgrade l'organisation vers TRIAL avec trial expiré
  await db.organization.update({
    where: { id: organizationId },
    data: {
      plan: "TRIAL",
      stripeSubscriptionId: null,
      stripePriceId: null,
      stripeCurrentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      // Trial expiré immédiatement
      trialEndsAt: new Date(),
      trialGenerations: 5, // Max atteint pour forcer l'upgrade
    },
  });

  console.log(`✅ Organization ${organizationId} downgraded to expired TRIAL`);
}

/**
 * Gère l'événement invoice.payment_failed
 * Appelé quand un paiement échoue
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string | null;

  if (!subscriptionId) {
    console.error("No subscription ID in failed invoice:", invoice.id);
    return;
  }

  // Récupérer la subscription pour obtenir l'organizationId
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const organizationId = subscription.metadata?.organizationId;

  if (!organizationId) {
    console.error("Missing organizationId in subscription metadata:", subscriptionId);
    return;
  }

  console.log(`Payment failed for org ${organizationId}, invoice ${invoice.id}`);

  // Marquer l'organisation pour annulation à la fin de la période
  await db.organization.update({
    where: { id: organizationId },
    data: {
      cancelAtPeriodEnd: true,
    },
  });

  // TODO: Envoyer une notification par email à l'utilisateur
  console.warn(`⚠️  Payment failed for org ${organizationId}. Subscription will cancel at period end.`);
}
