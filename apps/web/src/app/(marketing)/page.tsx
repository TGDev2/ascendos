import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto flex flex-col items-center gap-8 px-4 py-16 text-center md:py-24 lg:py-32">
          <div className="flex max-w-4xl flex-col items-center gap-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Updates sponsor-ready
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                en 2 minutes
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Transformez vos notes brutes en updates hebdomadaires
              professionnels pour sponsors non-tech. Avec dossier de continuité
              intégré pour les moments critiques.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="text-base">
                <Link href="/generator">Essayer gratuitement</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link href="#demo">Voir un exemple</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Sans carte bancaire. Résultat instantané.
            </p>
          </div>

          {/* Preview mockup */}
          <div className="relative mt-8 w-full max-w-4xl">
            <div className="rounded-xl border bg-card p-4 shadow-2xl">
              <div className="flex items-center gap-2 border-b pb-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-muted-foreground">
                  ascendos.app/generator
                </span>
              </div>
              <div className="grid gap-4 pt-4 md:grid-cols-2">
                <div className="space-y-2 rounded-lg bg-muted/50 p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    VOS NOTES BRUTES
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PR #182 merged, bug 231 fixé, attente GO prod, risque Legal
                    CGV...
                  </p>
                </div>
                <div className="space-y-2 rounded-lg bg-primary/5 p-4">
                  <p className="text-xs font-medium text-primary">
                    UPDATE SPONSOR-READY
                  </p>
                  <p className="text-sm">
                    "Bonjour Sophie, conformément à l'arbitrage sur le parcours
                    de paiement..."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="probleme" className="border-b py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">
              Le problème
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Le reporting hebdo vous coûte cher
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              En agence ou en mission longue, communiquer avec un sponsor
              non-tech est chronophage et politiquement risqué.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold text-destructive">
                  1-2h
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  perdues chaque semaine à reconstruire "ce qui compte" depuis
                  plusieurs sources
                </p>
              </CardContent>
            </Card>
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold text-destructive">
                  30-60m
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  de réunions supplémentaires quand l'update est vague ou trop
                  technique
                </p>
              </CardContent>
            </Card>
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold text-destructive">
                  1-3j
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  de retard sur les validations faute de décision correctement
                  cadrée
                </p>
              </CardContent>
            </Card>
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold text-destructive">
                  Risque
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  perte de confiance, escalade, réduction de scope, churn,
                  retainer renégocié
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="comment" className="border-b bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">
              Comment ça marche
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              3 étapes, 2 minutes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              De vos notes brutes à un update professionnel prêt à envoyer.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-3">
            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mt-6 text-xl font-semibold">Collez vos notes</h3>
              <p className="mt-2 text-muted-foreground">
                Faits, décisions attendues, risques. En vrac ou structuré,
                Ascendos s'adapte.
              </p>
              <div className="absolute right-0 top-8 hidden h-0.5 w-1/2 bg-border lg:block" />
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mt-6 text-xl font-semibold">
                Choisissez la situation
              </h3>
              <p className="mt-2 text-muted-foreground">
                Semaine normale, validation attendue, risque, retard, arbitrage,
                pré-COPIL...
              </p>
              <div className="absolute left-0 top-8 hidden h-0.5 w-1/2 bg-border lg:block" />
              <div className="absolute right-0 top-8 hidden h-0.5 w-1/2 bg-border lg:block" />
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mt-6 text-xl font-semibold">Envoyez</h3>
              <p className="mt-2 text-muted-foreground">
                Email + Slack prêts. Copiez-collez ou envoyez directement. Le
                dossier s'enrichit automatiquement.
              </p>
              <div className="absolute left-0 top-8 hidden h-0.5 w-1/2 bg-border lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fonctionnalites" className="border-b py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">
              Fonctionnalités
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Tout ce qu'il faut pour un reporting sans stress
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-lg">2 minutes chrono</CardTitle>
                <CardDescription>
                  Plus de 1-2h à rédiger. Générez un update complet en quelques
                  clics. Vos vendredis vous remercieront.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-lg">Politiquement safe</CardTitle>
                <CardDescription>
                  Ton adapté à votre sponsor. Ne fait jamais d'ombre au
                  décideur. Formulations orientées décisions et contrôle.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-lg">Dossier 1 page</CardTitle>
                <CardDescription>
                  Log décisions + risques. Consultable en 30 secondes quand ça
                  chauffe. Export PDF pour COPIL ou escalade.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <CardTitle className="text-lg">Profils "Maître"</CardTitle>
                <CardDescription>
                  Définissez le profil de votre sponsor une fois. Ascendos
                  adapte le ton, le niveau de détail et le vocabulaire.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-lg">Historique & rappels</CardTitle>
                <CardDescription>
                  Rappel hebdo pour ne jamais oublier. Historique complet par
                  projet. Recherche par date, décision ou risque.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-lg">
                  Standard équipe
                </CardTitle>
                <CardDescription>
                  Même format et mêmes garde-fous pour toute l'agence.
                  Onboarding simplifié des nouveaux.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="border-b bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">
              Démonstration
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Avant / Après
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Voyez la transformation de vos notes brutes en communication
              professionnelle.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-5xl">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Before */}
              <Card className="border-muted">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">
                    Entrée : vos notes
                  </Badge>
                  <CardTitle className="text-lg">Notes brutes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Faits :
                    </p>
                    <p className="mt-1 text-sm">
                      PR #182 règles livraison merged ; bug 231 erreurs 500
                      corrigé
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Décisions attendues :
                    </p>
                    <p className="mt-1 text-sm">
                      GO mise en prod ; arbitrage tracking
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Risques :
                    </p>
                    <p className="mt-1 text-sm">
                      retour Legal CGV pas reçu ; prestataire paiement
                      indisponible jeudi
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* After */}
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <Badge className="w-fit">Sortie : prêt à envoyer</Badge>
                  <CardTitle className="text-lg">Email sponsor-ready</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-background p-4">
                    <p className="text-sm font-medium">
                      Objet : COPIL — Avancement sous contrôle + décisions
                      attendues (S50)
                    </p>
                    <div className="mt-4 space-y-3 text-sm">
                      <p>Bonjour Sophie,</p>
                      <p>
                        Conformément à l'arbitrage sur le parcours de paiement,
                        nous avons sécurisé cette semaine : intégration des
                        règles de livraison et correction du pic d'erreurs
                        observé mardi.
                      </p>
                      <p>
                        <strong>Décision attendue avant jeudi 17h :</strong>{" "}
                        validation GO mise en production (fenêtre vendredi 16h)
                        + arbitrage tracking option A/B.
                      </p>
                      <p>
                        <strong>Risques surveillés :</strong> retour Legal CGV
                        (impact : validation bloquée) ; plan : proposer version
                        A conservative, revue jeudi 12h.
                      </p>
                      <p>
                        <strong>Prochaines 48h :</strong> finaliser tracking,
                        obtenir validation Legal, préparer rollback.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dossier preview */}
            <Card className="mt-6 border-primary/30">
              <CardHeader>
                <Badge variant="outline" className="w-fit">
                  Bonus
                </Badge>
                <CardTitle className="text-lg">
                  Dossier de continuité (auto-généré)
                </CardTitle>
                <CardDescription>
                  Consultable en 30 secondes. Export 1 page pour COPIL,
                  escalade, renewal, handover.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 rounded-lg bg-muted p-4 font-mono text-sm">
                  <p>
                    <span className="text-muted-foreground">S49</span> —
                    Décision : fenêtre de déploiement vendredi 16h
                  </p>
                  <p>
                    <span className="text-muted-foreground">S50</span> — Risque
                    : Legal CGV (impact validation) ; plan : version A ; revue :
                    jeudi 12h
                  </p>
                  <p>
                    <span className="text-muted-foreground">S50</span> —
                    Décision attendue : GO prod + arbitrage tracking A/B
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Situations Section */}
      <section id="situations" className="border-b py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">
              Templates
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              6 situations politiques couvertes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Pas juste "mieux écrire" — des templates pour chaque contexte
              sensible.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "📅",
                title: "Semaine normale",
                desc: "Continuité + prochaine décision",
              },
              {
                icon: "✅",
                title: "Validation attendue",
                desc: "Call-to-action + échéance claire",
              },
              {
                icon: "⚠️",
                title: "Semaine de risque",
                desc: "Risque cadré + plan + date de revue",
              },
              {
                icon: "🕐",
                title: "Retard",
                desc: "Cause factuelle + options + arbitrage",
              },
              {
                icon: "⚖️",
                title: "Arbitrage scope/budget",
                desc: "Options A/B/C + recommandation neutre",
              },
              {
                icon: "📊",
                title: "Pré-COPIL",
                desc: "Résumé + décisions + risques + questions",
              },
            ].map((situation) => (
              <div
                key={situation.title}
                className="flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <span className="text-2xl">{situation.icon}</span>
                <div>
                  <h3 className="font-semibold">{situation.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {situation.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target audience */}
      <section id="pour-qui" className="border-b bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">
              Pour qui
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Conçu pour les pros du delivery
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Agences/studios de 5 à 30 personnes, consultants en mission
              longue.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
            {[
              {
                title: "Head of Delivery",
                desc: "Standardisez le reporting de toute l'équipe. Gagnez en visibilité sur tous les projets.",
              },
              {
                title: "Chef de projet / PM",
                desc: "Communiquez efficacement avec des sponsors non-tech. Accélérez les validations.",
              },
              {
                title: "CTO / Lead Dev",
                desc: "Traduisez le technique en langage décideur. Protégez votre équipe des escalades.",
              },
              {
                title: "Consultant indépendant",
                desc: "Sécurisez votre retainer. Documentez les décisions pour vous protéger.",
              },
            ].map((persona) => (
              <Card key={persona.title} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{persona.title}</CardTitle>
                  <CardDescription>{persona.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
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
              7 jours d'essai gratuit. Sans carte bancaire.
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
                  {[
                    "Jusqu'à 5 utilisateurs",
                    "10 projets actifs",
                    "Templates toutes situations",
                    "Dossier 1 page exportable",
                    "Historique 12 mois",
                    "Rappels hebdomadaires",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/generator">Essayer 7 jours gratuit</Link>
                </Button>
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
                  {[
                    "Jusqu'à 15 utilisateurs",
                    "Projets illimités",
                    "Templates toutes situations",
                    "Dossier 1 page exportable",
                    "Historique 24 mois",
                    "Exports multi-projets",
                    "Presets standard interne",
                    "Support prioritaire",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/generator">Essayer 7 jours gratuit</Link>
                </Button>
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

      {/* FAQ */}
      <section id="faq" className="border-b bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Questions fréquentes
            </h2>
          </div>
          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {[
              {
                q: "Mes données sont-elles en sécurité ?",
                a: "Oui. Hébergement UE, minimisation des données, purge automatique configurable. Option BYOK disponible pour les données les plus sensibles. DPA disponible sur demande.",
              },
              {
                q: "Puis-je tester avant de payer ?",
                a: "Absolument. Le générateur est gratuit et sans inscription. Pour sauvegarder vos projets et accéder à l'historique, 7 jours d'essai gratuit sans carte bancaire.",
              },
              {
                q: "Ça remplace Jira / Linear / Notion ?",
                a: "Non. Ascendos ne gère pas les tâches. Il transforme ce que vous avez déjà (notes, tickets, PR) en communication adaptée à votre sponsor.",
              },
              {
                q: "Et si mon sponsor est technique ?",
                a: "Les profils 'Maître' s'adaptent. Vous pouvez configurer le niveau de détail technique selon le profil de votre interlocuteur.",
              },
              {
                q: "Comment fonctionne le dossier de continuité ?",
                a: "À chaque génération, Ascendos extrait automatiquement les décisions et risques. Vous obtenez une timeline consultable en 30 secondes, exportable en 1 page PDF.",
              },
            ].map((faq) => (
              <Card key={faq.q}>
                <CardHeader>
                  <CardTitle className="text-base">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Prêt à gagner 2h chaque semaine ?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Rejoignez les équipes qui ont déjà transformé leur reporting.
              Résultat instantané, sans inscription.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="text-base">
                <Link href="/generator">Essayer gratuitement</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link href="mailto:contact@ascendos.app">Nous contacter</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Sans carte bancaire. Résultat en moins de 2 minutes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
