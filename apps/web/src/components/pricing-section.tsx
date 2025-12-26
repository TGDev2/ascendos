"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";

const teamFeatures = [
  "Jusqu'à 5 utilisateurs",
  "10 projets actifs",
  "Templates toutes situations",
  "Dossier 1 page exportable",
  "Historique 12 mois",
  "Rappels hebdomadaires",
];

const agencyFeatures = [
  "Jusqu'à 15 utilisateurs",
  "Projets illimités",
  "Templates toutes situations",
  "Dossier 1 page exportable",
  "Historique 24 mois",
  "Exports multi-projets",
  "Presets standard interne",
  "Support prioritaire",
];

function PricingButton({ plan }: { plan: "team" | "agency" }) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <Button className="w-full" size="lg" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Chargement...
      </Button>
    );
  }

  if (isSignedIn) {
    return (
      <Button className="w-full" size="lg" asChild>
        <Link href="/settings/billing">Gérer mon abonnement</Link>
      </Button>
    );
  }

  return (
    <Button className="w-full" size="lg" asChild>
      <Link href={`/sign-up?plan=${plan}`}>Essayer 7 jours gratuit</Link>
    </Button>
  );
}

export function PricingSection() {
  return (
    <section id="tarifs" className="border-b py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-4">
            Tarifs
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple et transparent
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            7 jours d&apos;essai gratuit. Sans carte bancaire.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-2">
          {/* Team Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Team
                <Badge variant="secondary">Populaire</Badge>
              </CardTitle>
              <CardDescription>
                Pour les petites équipes qui veulent professionnaliser leur
                reporting.
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">89€</span>
                <span className="text-muted-foreground"> HT/mois</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                {teamFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <PricingButton plan="team" />
            </CardContent>
          </Card>

          {/* Agency Plan */}
          <Card className="relative border-primary">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge>Recommandé pour les agences</Badge>
            </div>
            <CardHeader className="pt-8">
              <CardTitle>Agency</CardTitle>
              <CardDescription>
                Pour les agences qui veulent un standard de reporting unifié.
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">169€</span>
                <span className="text-muted-foreground"> HT/mois</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                {agencyFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <PricingButton plan="agency" />
            </CardContent>
          </Card>
        </div>

        {/* Add-on */}
        <div className="mx-auto mt-8 max-w-4xl">
          <Card className="bg-muted/50">
            <CardHeader className="flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background">
                <svg
                  className="h-6 w-6 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">
                  Add-on Confidentiel — 19€ HT/mois
                </CardTitle>
                <CardDescription>
                  BYOK (Bring Your Own Key) + redaction renforcée + options
                  purge. Pour les données sensibles.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}
