import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Database,
  Target,
  Scale,
  Share2,
  Globe,
  Clock,
  UserCheck,
  Lock,
  Settings,
  Cookie,
  Baby,
  RefreshCw,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Ascendos",
  description:
    "Politique de confidentialité d'Ascendos - Comment nous collectons, utilisons et protégeons vos données.",
};

const sections = [
  { id: "introduction", title: "1. Introduction", icon: Shield },
  { id: "donnees-collectees", title: "2. Données Collectées", icon: Database },
  { id: "finalites", title: "3. Finalités du Traitement", icon: Target },
  { id: "base-legale", title: "4. Base Légale", icon: Scale },
  { id: "partage", title: "5. Partage des Données", icon: Share2 },
  { id: "transferts", title: "6. Transferts Internationaux", icon: Globe },
  { id: "conservation", title: "7. Durée de Conservation", icon: Clock },
  { id: "droits", title: "8. Vos Droits", icon: UserCheck },
  { id: "securite", title: "9. Sécurité", icon: Lock },
  { id: "options", title: "10. Options de Confidentialité", icon: Settings },
  { id: "cookies", title: "11. Cookies", icon: Cookie },
  { id: "mineurs", title: "12. Mineurs", icon: Baby },
  { id: "modifications", title: "13. Modifications", icon: RefreshCw },
  { id: "contact", title: "14. Contact", icon: Mail },
];

const subProcessors = [
  { service: "Clerk", finalite: "Authentification", donnees: "Email, nom" },
  {
    service: "Stripe",
    finalite: "Paiements",
    donnees: "Données de facturation",
  },
  {
    service: "OpenAI",
    finalite: "Génération de texte",
    donnees: "Contenu des updates*",
  },
  { service: "Vercel", finalite: "Hébergement", donnees: "Logs techniques" },
  {
    service: "Neon",
    finalite: "Base de données",
    donnees: "Toutes les données stockées",
  },
  { service: "Resend", finalite: "Emails", donnees: "Email destinataire" },
];

export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  Politique de Confidentialité
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Dernière mise à jour : 19 décembre 2025
                </p>
              </div>
            </div>
            <Badge variant="outline">RGPD</Badge>
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
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">1. Introduction</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <p>
                Chez Ascendos, nous prenons la protection de vos données
                personnelles très au sérieux. Cette politique de confidentialité
                explique comment nous collectons, utilisons, stockons et
                protégeons vos informations lorsque vous utilisez notre service
                de génération d&apos;updates hebdomadaires.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 2: Données Collectées */}
        <section id="donnees-collectees" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Database className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">2. Données Collectées</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border bg-blue-50/50 p-4 dark:bg-blue-950/20">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                    Données d&apos;inscription
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Adresse email</li>
                    <li>• Nom et prénom</li>
                    <li>• Nom de l&apos;organisation</li>
                    <li>• Infos de facturation (Stripe)</li>
                  </ul>
                </div>
                <div className="rounded-lg border bg-green-50/50 p-4 dark:bg-green-950/20">
                  <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">
                    Données d&apos;utilisation
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Adresse IP</li>
                    <li>• Type de navigateur</li>
                    <li>• Pages visitées</li>
                    <li>• Date et heure des visites</li>
                  </ul>
                </div>
                <div className="rounded-lg border bg-purple-50/50 p-4 dark:bg-purple-950/20">
                  <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">
                    Données de contenu
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Faits, décisions, risques</li>
                    <li>• Updates générés</li>
                    <li>• Registres de projets</li>
                    <li>• Profils &quot;Maître&quot;</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 3: Finalités */}
        <section id="finalites" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  3. Finalités du Traitement
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <p>Nous utilisons vos données pour :</p>
              <ul>
                <li>Fournir et améliorer le Service</li>
                <li>Gérer votre compte et votre abonnement</li>
                <li>
                  Envoyer des communications relatives au Service (rappels,
                  mises à jour)
                </li>
                <li>
                  Assurer la sécurité du Service (détection de fraude, rate
                  limiting)
                </li>
                <li>Respecter nos obligations légales</li>
                <li>
                  Analyser l&apos;utilisation pour améliorer le produit
                  (analytics anonymisés)
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Section 4: Base Légale */}
        <section id="base-legale" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Scale className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">4. Base Légale</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Conformément au RGPD, nous traitons vos données sur les bases
                légales suivantes :
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    title: "Exécution du contrat",
                    description: "Fourniture du Service, gestion du compte",
                  },
                  {
                    title: "Intérêt légitime",
                    description: "Sécurité, amélioration du Service, analytics",
                  },
                  {
                    title: "Obligation légale",
                    description: "Conservation des données de facturation",
                  },
                  {
                    title: "Consentement",
                    description: "Communications marketing (optionnel)",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg border bg-muted/30 p-4"
                  >
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 5: Partage des Données */}
        <section id="partage" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Share2 className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  5. Partage des Données
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-green-200 bg-green-50/50 p-4 dark:border-green-900 dark:bg-green-950/20">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Nous ne vendons jamais vos données personnelles.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-3">Sous-traitants</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium">
                          Service
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          Finalité
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          Données partagées
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subProcessors.map((item, index) => (
                        <tr
                          key={item.service}
                          className={index % 2 === 0 ? "bg-muted/20" : ""}
                        >
                          <td className="px-4 py-3 font-medium">
                            {item.service}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {item.finalite}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {item.donnees}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  * L&apos;option de redaction automatique masque les données
                  sensibles (emails, numéros) avant envoi à l&apos;IA.
                </p>
              </div>

              <div className="prose prose-slate max-w-none dark:prose-invert">
                <h4>Autres cas</h4>
                <ul>
                  <li>
                    En cas d&apos;obligation légale (autorités compétentes)
                  </li>
                  <li>
                    En cas de fusion ou acquisition (avec notification
                    préalable)
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 6: Transferts Internationaux */}
        <section id="transferts" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  6. Transferts Internationaux
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <p>
                Certains de nos sous-traitants sont situés aux États-Unis. Ces
                transferts sont encadrés par :
              </p>
              <ul>
                <li>
                  Les Clauses Contractuelles Types (SCCs) de la Commission
                  Européenne
                </li>
                <li>Des mesures techniques de sécurité supplémentaires</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Section 7: Durée de Conservation */}
        <section id="conservation" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  7. Durée de Conservation
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {[
                  {
                    type: "Données de compte",
                    duree: "Durée de l'abonnement + 30 jours",
                  },
                  {
                    type: "Données de contenu",
                    duree: "Jusqu'à 12 mois (TEAM) ou 24 mois (AGENCY)",
                  },
                  {
                    type: "Données de facturation",
                    duree: "10 ans (obligation légale)",
                  },
                  {
                    type: "Logs de sécurité",
                    duree: "1 an",
                  },
                ].map((item) => (
                  <div
                    key={item.type}
                    className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="font-medium">{item.type}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.duree}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 8: Vos Droits */}
        <section id="droits" className="scroll-mt-24">
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">8. Vos Droits</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Droit d'accès",
                    desc: "Obtenir une copie de vos données",
                  },
                  {
                    title: "Droit de rectification",
                    desc: "Corriger vos données inexactes",
                  },
                  {
                    title: "Droit à l'effacement",
                    desc: "Demander la suppression",
                  },
                  {
                    title: "Droit à la limitation",
                    desc: "Restreindre le traitement",
                  },
                  {
                    title: "Droit à la portabilité",
                    desc: "Recevoir vos données",
                  },
                  {
                    title: "Droit d'opposition",
                    desc: "Vous opposer au traitement",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg border bg-green-50/50 p-3 dark:bg-green-950/20"
                  >
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm">
                  Pour exercer ces droits, contactez-nous à{" "}
                  <a
                    href="mailto:privacy@ascendos.co"
                    className="font-medium text-primary hover:underline"
                  >
                    privacy@ascendos.co
                  </a>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Vous pouvez également déposer une réclamation auprès de la{" "}
                  <a
                    href="https://www.cnil.fr"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CNIL
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 9: Sécurité */}
        <section id="securite" className="scroll-mt-24">
          <Card className="border-blue-200 dark:border-blue-900">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">9. Sécurité</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Nous mettons en œuvre des mesures de sécurité techniques et
                organisationnelles pour protéger vos données :
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "Chiffrement TLS 1.3 pour toutes les communications",
                  "Chiffrement des données au repos (AES-256)",
                  "Authentification forte avec support 2FA",
                  "Accès restreint (principe du moindre privilège)",
                  "Audits de sécurité réguliers",
                  "Plan de réponse aux incidents",
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

        {/* Section 10: Options de Confidentialité */}
        <section id="options" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  10. Options de Confidentialité
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Ascendos vous offre des contrôles avancés :
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    title: "Redaction automatique",
                    desc: "Masque les emails et numéros de téléphone dans vos données",
                  },
                  {
                    title: "Non-stockage du raw input",
                    desc: "Option pour ne pas conserver les données brutes saisies",
                  },
                  {
                    title: "BYOK (Bring Your Own Key)",
                    desc: "Utilisez vos propres clés API pour les modèles IA",
                  },
                  {
                    title: "Purge configurable",
                    desc: "Définissez la durée de rétention de vos données",
                  },
                  {
                    title: "Export complet",
                    desc: "Exportez toutes vos données à tout moment",
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

        {/* Section 11: Cookies */}
        <section id="cookies" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Cookie className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">11. Cookies</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <p>Nous utilisons des cookies strictement nécessaires pour :</p>
              <ul>
                <li>Maintenir votre session de connexion</li>
                <li>Mémoriser vos préférences</li>
                <li>Assurer la sécurité (protection CSRF)</li>
              </ul>
              <p>
                Nous n&apos;utilisons pas de cookies publicitaires ou de
                tracking tiers sans votre consentement explicite.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 12: Mineurs */}
        <section id="mineurs" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Baby className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">12. Mineurs</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <p>
                Le Service n&apos;est pas destiné aux personnes de moins de 18
                ans. Nous ne collectons pas sciemment de données de mineurs.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 13: Modifications */}
        <section id="modifications" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <RefreshCw className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">13. Modifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <p>
                Nous pouvons mettre à jour cette politique de confidentialité.
                Les modifications significatives seront notifiées par email ou
                via le Service. La date de dernière mise à jour est indiquée en
                haut de cette page.
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
                Pour toute question concernant cette politique :
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href="mailto:dpo@ascendos.co"
                  className="flex items-center gap-3 rounded-lg border bg-background p-4 transition-colors hover:bg-muted"
                >
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">DPO</div>
                    <div className="text-sm text-muted-foreground">
                      dpo@ascendos.co
                    </div>
                  </div>
                </a>
                <a
                  href="mailto:privacy@ascendos.co"
                  className="flex items-center gap-3 rounded-lg border bg-background p-4 transition-colors hover:bg-muted"
                >
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Privacy</div>
                    <div className="text-sm text-muted-foreground">
                      privacy@ascendos.co
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
