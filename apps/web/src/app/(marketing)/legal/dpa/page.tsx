import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Scale,
  BookOpen,
  Target,
  Database,
  Shield,
  Building2,
  Globe,
  Clock,
  Lock,
  UserCheck,
  Mail,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Accord de Traitement des Données (DPA) | Ascendos",
  description:
    "Accord de traitement des données personnelles conforme au RGPD pour les clients Ascendos.",
};

const sections = [
  { id: "introduction", title: "1. Introduction", icon: Scale },
  { id: "definitions", title: "2. Définitions", icon: BookOpen },
  { id: "objet", title: "3. Objet et Finalité", icon: Target },
  { id: "types-donnees", title: "4. Types de Données", icon: Database },
  { id: "obligations", title: "5. Obligations d'Ascendos", icon: Shield },
  {
    id: "sous-traitants",
    title: "6. Sous-traitants Ultérieurs",
    icon: Building2,
  },
  { id: "transferts", title: "7. Transferts Internationaux", icon: Globe },
  { id: "conservation", title: "8. Durée de Conservation", icon: Clock },
  { id: "securite", title: "9. Mesures de Sécurité", icon: Lock },
  { id: "droits", title: "10. Droits des Personnes", icon: UserCheck },
  { id: "contact", title: "11. Contact", icon: Mail },
  { id: "vigueur", title: "12. Entrée en Vigueur", icon: CheckCircle2 },
];

const subProcessors = [
  {
    name: "Vercel Inc.",
    finalite: "Hébergement infrastructure",
    location: "USA (SCCs)",
  },
  {
    name: "Neon Inc.",
    finalite: "Base de données PostgreSQL",
    location: "USA/UE (SCCs)",
  },
  { name: "Clerk Inc.", finalite: "Authentification", location: "USA (SCCs)" },
  {
    name: "OpenAI LLC",
    finalite: "Génération de texte IA",
    location: "USA (SCCs)",
  },
  { name: "Stripe Inc.", finalite: "Paiements", location: "USA/UE (SCCs)" },
  {
    name: "Upstash Inc.",
    finalite: "Cache et rate limiting",
    location: "USA/UE (SCCs)",
  },
];

export default function DPAPage() {
  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  Accord de Traitement des Données (DPA)
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Dernière mise à jour : 19 décembre 2025
                </p>
              </div>
            </div>
            <Badge variant="outline">RGPD Art. 28</Badge>
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
        {/* Section 1: Introduction */}
        <section id="introduction" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Scale className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">1. Introduction</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <p>
                Le présent Accord de Traitement des Données (&quot;DPA&quot;)
                complète les Conditions Générales d&apos;Utilisation
                d&apos;Ascendos et s&apos;applique dans la mesure où Ascendos
                traite des Données Personnelles pour le compte du Client en
                vertu du Règlement Général sur la Protection des Données (RGPD).
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
                    term: "Données Personnelles",
                    definition:
                      "Toute information se rapportant à une personne physique identifiée ou identifiable.",
                  },
                  {
                    term: "Traitement",
                    definition:
                      "Toute opération effectuée sur des Données Personnelles (collecte, enregistrement, organisation, stockage, adaptation, extraction, consultation, utilisation, communication, effacement ou destruction).",
                  },
                  {
                    term: "Responsable du Traitement",
                    definition:
                      "Le Client qui détermine les finalités et les moyens du Traitement.",
                  },
                  {
                    term: "Sous-traitant",
                    definition:
                      "Ascendos, qui traite les Données Personnelles pour le compte du Responsable du Traitement.",
                  },
                ].map((item) => (
                  <div
                    key={item.term}
                    className="rounded-lg border bg-muted/30 p-4"
                  >
                    <div className="font-medium text-foreground mb-1">
                      {item.term}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.definition}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 3: Objet et Finalité */}
        <section id="objet" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  3. Objet et Finalité du Traitement
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <p>Ascendos traite les Données Personnelles uniquement pour :</p>
              <ul>
                <li>
                  Fournir le Service de génération d&apos;updates hebdomadaires
                </li>
                <li>Maintenir les registres de décisions et de risques</li>
                <li>Générer les dossiers de continuité</li>
                <li>Envoyer les rappels hebdomadaires configurés</li>
                <li>Assurer le support technique</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Section 4: Types de Données */}
        <section id="types-donnees" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Database className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  4. Types de Données Traitées
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    title: "Données d'identification",
                    items: ["Nom, prénom", "Adresse email professionnelle"],
                  },
                  {
                    title: "Données de connexion",
                    items: ["Adresse IP", "Logs d'accès"],
                  },
                  {
                    title: "Données de contenu",
                    items: [
                      "Faits, décisions, risques saisis",
                      "Updates générés",
                    ],
                  },
                  {
                    title: "Données d'usage",
                    items: ["Statistiques d'utilisation", "Préférences"],
                  },
                ].map((category) => (
                  <div
                    key={category.title}
                    className="rounded-lg border bg-muted/30 p-4"
                  >
                    <div className="font-medium mb-2">{category.title}</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {category.items.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 5: Obligations d'Ascendos */}
        <section id="obligations" className="scroll-mt-24">
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">
                  5. Obligations d&apos;Ascendos
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                En tant que Sous-traitant, Ascendos s&apos;engage à :
              </p>
              <div className="grid gap-2">
                {[
                  "Traiter les Données uniquement sur instruction documentée du Client",
                  "Garantir la confidentialité des Données (personnel soumis à obligation de confidentialité)",
                  "Mettre en œuvre les mesures techniques et organisationnelles appropriées (chiffrement, contrôle d'accès, sauvegardes)",
                  "Ne pas faire appel à un autre sous-traitant sans autorisation écrite préalable",
                  "Aider le Client à répondre aux demandes d'exercice des droits des personnes concernées",
                  "Notifier le Client dans les 72 heures en cas de violation de données",
                  "Supprimer ou restituer les Données à la fin du contrat, selon le choix du Client",
                  "Mettre à disposition les informations nécessaires pour démontrer le respect des obligations RGPD",
                ].map((obligation) => (
                  <div
                    key={obligation}
                    className="flex items-start gap-3 rounded-lg border bg-green-50/50 p-3 dark:bg-green-950/20"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    <span className="text-sm">{obligation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 6: Sous-traitants Ultérieurs */}
        <section id="sous-traitants" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  6. Sous-traitants Ultérieurs
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Ascendos fait appel aux sous-traitants ultérieurs suivants, avec
                lesquels des accords de protection des données ont été conclus :
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium">
                        Sous-traitant
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        Finalité
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        Localisation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subProcessors.map((item, index) => (
                      <tr
                        key={item.name}
                        className={index % 2 === 0 ? "bg-muted/20" : ""}
                      >
                        <td className="px-4 py-3 font-medium">{item.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {item.finalite}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="font-normal">
                            {item.location}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="rounded-lg border bg-blue-50/50 p-3 dark:bg-blue-950/20">
                <p className="text-xs text-muted-foreground">
                  <strong>SCCs</strong> = Standard Contractual Clauses (Clauses
                  Contractuelles Types approuvées par la Commission Européenne)
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 7: Transferts Internationaux */}
        <section id="transferts" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  7. Transferts Internationaux
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <p>
                Certains sous-traitants ultérieurs étant établis aux États-Unis,
                des transferts de Données Personnelles vers des pays tiers
                peuvent avoir lieu. Ces transferts sont encadrés par :
              </p>
              <ul>
                <li>
                  Les Clauses Contractuelles Types (SCCs) adoptées par la
                  Commission Européenne
                </li>
                <li>
                  Des mesures techniques supplémentaires (chiffrement en transit
                  et au repos)
                </li>
                <li>
                  L&apos;évaluation régulière de la législation des pays
                  destinataires
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Section 8: Durée de Conservation */}
        <section id="conservation" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  8. Durée de Conservation
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Les Données Personnelles sont conservées conformément aux
                paramètres configurés par le Client :
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border bg-muted/30 p-4 text-center">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">
                    mois max (TEAM)
                  </div>
                </div>
                <div className="rounded-lg border bg-muted/30 p-4 text-center">
                  <div className="text-2xl font-bold text-primary">24</div>
                  <div className="text-sm text-muted-foreground">
                    mois max (AGENCY)
                  </div>
                </div>
                <div className="rounded-lg border bg-muted/30 p-4 text-center">
                  <div className="text-2xl font-bold text-primary">Auto</div>
                  <div className="text-sm text-muted-foreground">
                    Purge automatique
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Le Client peut à tout moment demander la suppression anticipée
                de ses données.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 9: Mesures de Sécurité */}
        <section id="securite" className="scroll-mt-24">
          <Card className="border-blue-200 dark:border-blue-900">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">
                  9. Mesures de Sécurité
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Ascendos met en œuvre les mesures de sécurité suivantes :
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "Chiffrement TLS 1.3 pour toutes les communications",
                  "Chiffrement AES-256 des données au repos",
                  "Authentification forte (2FA disponible via Clerk)",
                  "Contrôle d'accès basé sur les rôles (RBAC)",
                  "Journalisation des accès et des opérations sensibles",
                  "Sauvegardes automatiques quotidiennes",
                  "Tests de sécurité réguliers",
                  "Option de redaction automatique des données sensibles",
                  "Option BYOK (Bring Your Own Key) pour les clés API LLM",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-lg border bg-blue-50/50 p-3 text-sm dark:bg-blue-950/20"
                  >
                    <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 10: Droits des Personnes */}
        <section id="droits" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <UserCheck className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  10. Droits des Personnes Concernées
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Le Client reste responsable de répondre aux demandes
                d&apos;exercice des droits. Ascendos s&apos;engage à :
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    title: "Export",
                    desc: "Fournir les outils d'export des données (dossier de continuité)",
                  },
                  {
                    title: "Suppression",
                    desc: "Permettre la suppression des données sur demande (via les paramètres)",
                  },
                  {
                    title: "Réponse",
                    desc: "Répondre dans les 30 jours aux demandes transmises par le Client",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg border bg-muted/30 p-4"
                  >
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 11: Contact */}
        <section id="contact" className="scroll-mt-24">
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">11. Contact</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Pour toute question relative à ce DPA :
              </p>
              <a
                href="mailto:dpo@ascendos.co"
                className="flex items-center gap-3 rounded-lg border bg-background p-4 transition-colors hover:bg-muted max-w-sm"
              >
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">
                    DPO (Data Protection Officer)
                  </div>
                  <div className="text-sm text-muted-foreground">
                    dpo@ascendos.co
                  </div>
                </div>
              </a>
            </CardContent>
          </Card>
        </section>

        {/* Section 12: Entrée en Vigueur */}
        <section id="vigueur" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">12. Entrée en Vigueur</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <p>
                Ce DPA entre en vigueur dès l&apos;acceptation des Conditions
                Générales d&apos;Utilisation et reste applicable pendant toute
                la durée de la relation contractuelle.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
