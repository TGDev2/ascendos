"use client";

import { trpc } from "@/lib/trpc/react";
import { usePaywall } from "@/hooks/use-paywall";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, CreditCard } from "lucide-react";
export default function BillingSettingsPage() {
  const { data: org, isLoading } = trpc.billing.getStatus.useQuery();
  const createCheckout = trpc.billing.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      // Rediriger vers Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });
  const getPortal = trpc.billing.getPortalUrl.useMutation({
    onSuccess: (data) => {
      // Rediriger vers le portail Stripe
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  const { trialDaysRemaining, trialGenerations, plan, todayGenerations } = usePaywall();

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-10">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Facturation</h1>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = plan === "TEAM" || plan === "AGENCY";

  return (
    <div className="container max-w-6xl py-10">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Facturation</h1>
          <p className="text-muted-foreground">Gérez votre abonnement et votre facturation</p>
        </div>

        {/* Plan actuel */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Plan actuel</CardTitle>
                <CardDescription>
                  {plan === "TRIAL" && `${trialDaysRemaining} jours restants`}
                  {plan === "TEAM" && "Abonnement Team"}
                  {plan === "AGENCY" && "Abonnement Agency"}
                </CardDescription>
              </div>
              <Badge variant={plan === "TRIAL" ? "secondary" : "default"} className="text-lg px-4 py-1">
                {plan}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {plan === "TRIAL" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Générations utilisées</p>
                    <p className="text-sm text-muted-foreground">
                      {trialGenerations} / 5 générations
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{5 - trialGenerations}</p>
                    <p className="text-sm text-muted-foreground">restantes</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Votre période d'essai se termine dans {trialDaysRemaining} jours. Upgradez pour continuer à utiliser Ascendos.
                </p>
              </div>
            )}

            {isPaid && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Générations aujourd'hui</p>
                    <p className="text-sm text-muted-foreground">
                      {plan === "TEAM" && `${todayGenerations} / 10 générations`}
                      {plan === "AGENCY" && `${todayGenerations} / 50 générations`}
                    </p>
                  </div>
                </div>

                <Button onClick={() => getPortal.mutate()} variant="outline" className="w-full" disabled={getPortal.isPending}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Gérer mon abonnement
                </Button>

                {org?.cancelAtPeriodEnd && (
                  <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
                    <p className="text-sm font-medium text-destructive">
                      Votre abonnement sera annulé le {org.stripeCurrentPeriodEnd ? new Date(org.stripeCurrentPeriodEnd).toLocaleDateString('fr-FR') : ''}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plans disponibles (uniquement si TRIAL) */}
        {plan === "TRIAL" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Team Plan */}
            <Card className="relative">
              <CardHeader>
                <CardTitle>Team</CardTitle>
                <CardDescription>Pour les petites équipes</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">89€</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    10 générations/jour/utilisateur
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    5 utilisateurs inclus
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Export PDF illimité
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    10 projets maximum
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Historique 12 mois
                  </li>
                </ul>
                <Button
                  onClick={() => createCheckout.mutate({ plan: "TEAM" })}
                  className="w-full"
                  disabled={createCheckout.isPending}
                >
                  Choisir Team
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Agency Plan */}
            <Card className="relative border-primary">
              <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-bl rounded-tr">
                Populaire
              </div>
              <CardHeader>
                <CardTitle>Agency</CardTitle>
                <CardDescription>Pour les agences et grandes équipes</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">169€</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    50 générations/jour/utilisateur
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    15 utilisateurs inclus
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Export PDF illimité
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Projets illimités
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Historique 24 mois
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Support prioritaire
                  </li>
                </ul>
                <Button
                  onClick={() => createCheckout.mutate({ plan: "AGENCY" })}
                  className="w-full"
                  disabled={createCheckout.isPending}
                >
                  Choisir Agency
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
