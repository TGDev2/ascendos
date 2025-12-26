import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  BookOpen,
  Briefcase,
  CreditCard,
  Clock,
  Shield,
  Brain,
  AlertTriangle,
  Scale,
  RefreshCw,
  Mail,
  Users,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation | Ascendos",
  description:
    "Conditions générales d'utilisation du service Ascendos - Génération d'updates sponsor-ready.",
};

const sections = [
  { id: "objet", title: "1. Objet", icon: FileText },
  { id: "definitions", title: "2. Définitions", icon: BookOpen },
  { id: "description", title: "3. Description du Service", icon: Briefcase },
  { id: "inscription", title: "4. Inscription et Compte", icon: Users },
  { id: "tarifs", title: "5. Tarifs et Paiement", icon: CreditCard },
  { id: "duree", title: "6. Durée et Résiliation", icon: Clock },
  { id: "utilisation", title: "7. Utilisation Acceptable", icon: Shield },
  { id: "propriete", title: "8. Propriété Intellectuelle", icon: Scale },
  { id: "ia", title: "9. Utilisation de l'IA", icon: Brain },
  {
    id: "responsabilite",
    title: "10. Limitation de Responsabilité",
    icon: AlertTriangle,
  },
  { id: "donnees", title: "11. Données Personnelles", icon: Shield },
  { id: "modifications", title: "12. Modifications", icon: RefreshCw },
  { id: "droit", title: "13. Droit Applicable", icon: Scale },
  { id: "contact", title: "14. Contact", icon: Mail },
];

export default function TermsPage() {
  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  Conditions Générales d&apos;Utilisation
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Dernière mise à jour : 19 décembre 2025
                </p>
              </div>
            </div>
            <Badge variant="outline">Version 1.0</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Table of Contents */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Sommaire</CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="grid gap-1 sm:grid-cols-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{section.title}</span>
                </a>
              );
            })}
          </nav>
        </CardContent>
      </Card>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Section 1: Objet */}
        <section id="objet" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">1. Objet</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <p>
                Les présentes Conditions Générales d&apos;Utilisation (CGU)
                régissent l&apos;accès et l&apos;utilisation du service Ascendos
                (le &quot;Service&quot;), une plateforme SaaS de génération
                d&apos;updates hebdomadaires destinés aux sponsors
                non-techniques, avec dossier de continuité intégré.
              </p>
              <p>
                En utilisant le Service, vous acceptez les présentes CGU dans
                leur intégralité.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 2: Définitions */}
        <section id="definitions" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">2. Définitions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {[
                  {
                    term: "Ascendos",
                    definition:
                      "Le service SaaS de génération d'updates sponsor-ready.",
                  },
                  {
                    term: "Client",
                    definition:
                      "L'organisation ou la personne physique qui souscrit au Service.",
                  },
                  {
                    term: "Utilisateur",
                    definition:
                      "Toute personne autorisée par le Client à utiliser le Service.",
                  },
                  {
                    term: "Update",
                    definition:
                      "Message hebdomadaire généré par le Service à destination d'un sponsor.",
                  },
                  {
                    term: "Dossier de Continuité",
                    definition:
                      "Compilation exportable des décisions et risques d'un projet.",
                  },
                ].map((item) => (
                  <div
                    key={item.term}
                    className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:gap-3"
                  >
                    <span className="font-medium text-foreground shrink-0 sm:w-40">
                      {item.term}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {item.definition}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 3: Description du Service */}
        <section id="description" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  3. Description du Service
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <p>Ascendos propose :</p>
              <ul>
                <li>
                  Un générateur d&apos;updates hebdomadaires
                  &quot;sponsor-ready&quot; basé sur l&apos;IA
                </li>
                <li>
                  Des profils &quot;Maître&quot; configurables (ton,
                  contraintes, vocabulaire)
                </li>
                <li>Des templates de situations politiques prédéfinis</li>
                <li>Un registre de décisions avec suivi des statuts</li>
                <li>Un registre de risques avec niveaux de sévérité</li>
                <li>Un export &quot;Dossier de Continuité&quot; en 1 page</li>
                <li>Des rappels hebdomadaires configurables</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Section 4: Inscription et Compte */}
        <section id="inscription" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  4. Inscription et Compte
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <h4>4.1 Création de compte</h4>
              <p>
                L&apos;utilisation complète du Service nécessite la création
                d&apos;un compte. Vous vous engagez à fournir des informations
                exactes et à les maintenir à jour.
              </p>

              <h4>4.2 Sécurité du compte</h4>
              <p>
                Vous êtes responsable de la confidentialité de vos identifiants
                et de toutes les activités réalisées sous votre compte. En cas
                de suspicion d&apos;utilisation non autorisée, vous devez nous
                en informer immédiatement.
              </p>

              <h4>4.3 Utilisation anonyme</h4>
              <p>
                Le générateur gratuit peut être utilisé sans compte, dans la
                limite de 3 générations par heure et par adresse IP.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 5: Tarifs et Paiement */}
        <section id="tarifs" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">5. Tarifs et Paiement</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">5.1 Plans disponibles</h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="font-medium">Essai gratuit</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      7 jours, 5 générations max
                    </div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="font-medium">Plan TEAM</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      89€ HT/mois - 5 utilisateurs
                    </div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="font-medium">Plan AGENCY</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      169€ HT/mois - 15 utilisateurs
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose prose-slate max-w-none dark:prose-invert">
                <h4>5.2 Facturation</h4>
                <p>
                  Les abonnements sont facturés mensuellement à l&apos;avance.
                  La TVA applicable sera ajoutée au tarif HT selon la
                  législation en vigueur.
                </p>

                <h4>5.3 Moyens de paiement</h4>
                <p>
                  Les paiements sont effectués par carte bancaire via notre
                  prestataire Stripe. Les données de paiement sont traitées
                  directement par Stripe et ne sont pas stockées par Ascendos.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 6: Durée et Résiliation */}
        <section id="duree" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  6. Durée et Résiliation
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <h4>6.1 Durée</h4>
              <p>
                L&apos;abonnement est conclu pour une durée d&apos;un mois,
                renouvelable tacitement.
              </p>

              <h4>6.2 Résiliation par le Client</h4>
              <p>
                Vous pouvez résilier votre abonnement à tout moment depuis les
                paramètres de votre compte. La résiliation prend effet à la fin
                de la période de facturation en cours.
              </p>

              <h4>6.3 Résiliation par Ascendos</h4>
              <p>
                Nous nous réservons le droit de suspendre ou résilier votre
                compte en cas de violation des présentes CGU, notamment :
              </p>
              <ul>
                <li>Utilisation abusive ou frauduleuse du Service</li>
                <li>Non-paiement des factures après mise en demeure</li>
                <li>Atteinte aux droits de tiers ou à notre image</li>
              </ul>

              <h4>6.4 Conséquences de la résiliation</h4>
              <p>
                À la résiliation, vous pouvez exporter vos données pendant 30
                jours. Passé ce délai, les données seront supprimées
                conformément à notre politique de confidentialité.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 7: Utilisation Acceptable */}
        <section id="utilisation" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  7. Utilisation Acceptable
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <p>Vous vous engagez à :</p>
              <ul>
                <li>Utiliser le Service conformément à sa finalité</li>
                <li>Ne pas tenter de contourner les limitations techniques</li>
                <li>Ne pas surcharger intentionnellement le Service</li>
                <li>
                  Ne pas utiliser le Service pour générer du contenu illégal,
                  diffamatoire, ou trompeur
                </li>
                <li>
                  Respecter les droits de propriété intellectuelle des tiers
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Section 8: Propriété Intellectuelle */}
        <section id="propriete" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Scale className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  8. Propriété Intellectuelle
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <h4>8.1 Droits d&apos;Ascendos</h4>
              <p>
                Le Service, son code source, ses algorithmes, son design et sa
                documentation restent notre propriété exclusive. Vous bénéficiez
                uniquement d&apos;un droit d&apos;utilisation non exclusif et
                non transférable.
              </p>

              <h4>8.2 Droits du Client</h4>
              <p>
                Vous conservez tous les droits sur les données et contenus que
                vous saisissez dans le Service. Les updates générés vous
                appartiennent intégralement.
              </p>

              <h4>8.3 Licence sur le contenu</h4>
              <p>
                Vous nous accordez une licence limitée pour traiter vos données
                uniquement dans le cadre de la fourniture du Service.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 9: Utilisation de l'IA */}
        <section id="ia" className="scroll-mt-24">
          <Card className="border-blue-200 dark:border-blue-900">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">
                  9. Utilisation de l&apos;IA
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <p>
                Le Service utilise des modèles d&apos;intelligence artificielle
                (OpenAI, Anthropic) pour générer les updates. Vous reconnaissez
                que :
              </p>
              <ul>
                <li>
                  Les outputs générés par l&apos;IA peuvent nécessiter une
                  vérification humaine avant utilisation
                </li>
                <li>
                  Nous ne garantissons pas l&apos;exactitude ou la pertinence
                  des contenus générés
                </li>
                <li>
                  Les données envoyées aux modèles IA sont soumises aux
                  conditions d&apos;utilisation des fournisseurs tiers
                </li>
                <li>
                  L&apos;option BYOK (Bring Your Own Key) permet d&apos;utiliser
                  vos propres clés API pour plus de contrôle
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Section 10: Limitation de Responsabilité */}
        <section id="responsabilite" className="scroll-mt-24">
          <Card className="border-orange-200 dark:border-orange-900">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                  <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-lg">
                  10. Limitation de Responsabilité
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <h4>10.1 Disponibilité</h4>
              <p>
                Nous nous efforçons d&apos;assurer une disponibilité maximale du
                Service mais ne garantissons pas une disponibilité de 100%. Des
                interruptions pour maintenance peuvent survenir.
              </p>

              <h4>10.2 Exclusions</h4>
              <p>
                Dans les limites autorisées par la loi, nous excluons toute
                responsabilité pour :
              </p>
              <ul>
                <li>
                  Les dommages indirects (perte de chiffre d&apos;affaires, de
                  données, d&apos;opportunités)
                </li>
                <li>
                  Les conséquences de l&apos;utilisation des contenus générés
                  par l&apos;IA
                </li>
                <li>
                  Les interruptions dues à des tiers (hébergeur, fournisseurs
                  IA)
                </li>
              </ul>

              <h4>10.3 Plafond</h4>
              <p>
                Notre responsabilité totale est limitée au montant des sommes
                versées par le Client au cours des 12 derniers mois.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 11: Données Personnelles */}
        <section id="donnees" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  11. Données Personnelles
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <p>
                Le traitement des données personnelles est régi par notre{" "}
                <Link
                  href="/legal/privacy"
                  className="text-primary hover:underline"
                >
                  Politique de Confidentialité
                </Link>
                .
              </p>
              <p>
                Pour les clients B2B soumis au RGPD, un{" "}
                <Link
                  href="/legal/dpa"
                  className="text-primary hover:underline"
                >
                  Accord de Traitement des Données (DPA)
                </Link>{" "}
                est disponible.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 12: Modifications */}
        <section id="modifications" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <RefreshCw className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">12. Modifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <p>
                Nous nous réservons le droit de modifier les présentes CGU. Les
                modifications significatives seront notifiées par email au moins
                30 jours avant leur entrée en vigueur.
              </p>
              <p>
                La poursuite de l&apos;utilisation du Service après notification
                vaut acceptation des nouvelles CGU.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 13: Droit Applicable */}
        <section id="droit" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Scale className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  13. Droit Applicable et Litiges
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <p>
                Les présentes CGU sont régies par le droit français. En cas de
                litige, les parties s&apos;efforceront de trouver une solution
                amiable. À défaut, les tribunaux compétents de Paris seront
                exclusivement compétents.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 14: Contact */}
        <section id="contact" className="scroll-mt-24">
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">14. Contact</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Pour toute question concernant ces CGU :
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href="mailto:contact@ascendos.co"
                  className="flex items-center gap-3 rounded-lg border bg-background p-4 transition-colors hover:bg-muted"
                >
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Contact général</div>
                    <div className="text-sm text-muted-foreground">
                      contact@ascendos.co
                    </div>
                  </div>
                </a>
                <a
                  href="mailto:support@ascendos.co"
                  className="flex items-center gap-3 rounded-lg border bg-background p-4 transition-colors hover:bg-muted"
                >
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Support technique</div>
                    <div className="text-sm text-muted-foreground">
                      support@ascendos.co
                    </div>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
