import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Ascendos",
  description:
    "Politique de confidentialité d'Ascendos - Comment nous collectons, utilisons et protégeons vos données.",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">Politique de Confidentialité</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground mb-8">
          Dernière mise à jour : 19 décembre 2025
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Chez Ascendos, nous prenons la protection de vos données personnelles
            très au sérieux. Cette politique de confidentialité explique comment
            nous collectons, utilisons, stockons et protégeons vos informations
            lorsque vous utilisez notre service de génération d&apos;updates
            hebdomadaires.
          </p>
          <p className="mt-4">
            Ascendos est édité par [Nom légal de l&apos;entreprise], dont le
            siège social est situé [adresse].
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            2. Données Collectées
          </h2>

          <h3 className="text-lg font-medium mt-4 mb-2">
            2.1 Données d&apos;inscription
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Adresse email</li>
            <li>Nom et prénom</li>
            <li>Nom de l&apos;organisation</li>
            <li>Informations de facturation (traitées par Stripe)</li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">
            2.2 Données d&apos;utilisation
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Adresse IP et informations de connexion</li>
            <li>Type de navigateur et système d&apos;exploitation</li>
            <li>Pages visitées et actions effectuées</li>
            <li>Date et heure des visites</li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">
            2.3 Données de contenu
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Informations saisies pour générer les updates (faits, décisions,
              risques)
            </li>
            <li>Updates générés (email, Slack)</li>
            <li>Registres de décisions et de risques</li>
            <li>Paramètres de projets et profils &quot;Maître&quot;</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            3. Finalités du Traitement
          </h2>
          <p>Nous utilisons vos données pour :</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Fournir et améliorer le Service</li>
            <li>Gérer votre compte et votre abonnement</li>
            <li>Envoyer des communications relatives au Service (rappels, mises à jour)</li>
            <li>Assurer la sécurité du Service (détection de fraude, rate limiting)</li>
            <li>Respecter nos obligations légales</li>
            <li>Analyser l&apos;utilisation pour améliorer le produit (analytics anonymisés)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Base Légale</h2>
          <p>
            Conformément au RGPD, nous traitons vos données sur les bases
            légales suivantes :
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              <strong>Exécution du contrat</strong> : fourniture du Service,
              gestion du compte
            </li>
            <li>
              <strong>Intérêt légitime</strong> : sécurité, amélioration du
              Service, analytics
            </li>
            <li>
              <strong>Obligation légale</strong> : conservation des données de
              facturation
            </li>
            <li>
              <strong>Consentement</strong> : communications marketing (optionnel)
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            5. Partage des Données
          </h2>
          <p>
            Nous ne vendons jamais vos données personnelles. Nous les partageons
            uniquement avec :
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">5.1 Sous-traitants</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border border-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border px-4 py-2 text-left">Service</th>
                  <th className="border px-4 py-2 text-left">Finalité</th>
                  <th className="border px-4 py-2 text-left">Données partagées</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">Clerk</td>
                  <td className="border px-4 py-2">Authentification</td>
                  <td className="border px-4 py-2">Email, nom</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Stripe</td>
                  <td className="border px-4 py-2">Paiements</td>
                  <td className="border px-4 py-2">Données de facturation</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">OpenAI</td>
                  <td className="border px-4 py-2">Génération de texte</td>
                  <td className="border px-4 py-2">Contenu des updates*</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Vercel</td>
                  <td className="border px-4 py-2">Hébergement</td>
                  <td className="border px-4 py-2">Logs techniques</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Neon</td>
                  <td className="border px-4 py-2">Base de données</td>
                  <td className="border px-4 py-2">Toutes les données stockées</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Resend</td>
                  <td className="border px-4 py-2">Emails</td>
                  <td className="border px-4 py-2">Email destinataire</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            * L&apos;option de redaction automatique masque les données sensibles
            (emails, numéros) avant envoi à l&apos;IA.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">5.2 Autres cas</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>En cas d&apos;obligation légale (autorités compétentes)</li>
            <li>En cas de fusion ou acquisition (avec notification préalable)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            6. Transferts Internationaux
          </h2>
          <p>
            Certains de nos sous-traitants sont situés aux États-Unis. Ces
            transferts sont encadrés par :
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              Les Clauses Contractuelles Types (SCCs) de la Commission Européenne
            </li>
            <li>Des mesures techniques de sécurité supplémentaires</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            7. Durée de Conservation
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Données de compte</strong> : conservées pendant la durée de
              l&apos;abonnement + 30 jours après résiliation
            </li>
            <li>
              <strong>Données de contenu</strong> : selon la période de rétention
              configurée (jusqu&apos;à 12 mois pour TEAM, 24 mois pour AGENCY)
            </li>
            <li>
              <strong>Données de facturation</strong> : 10 ans (obligation légale)
            </li>
            <li>
              <strong>Logs de sécurité</strong> : 1 an
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Vos Droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              <strong>Droit d&apos;accès</strong> : obtenir une copie de vos
              données
            </li>
            <li>
              <strong>Droit de rectification</strong> : corriger vos données
              inexactes
            </li>
            <li>
              <strong>Droit à l&apos;effacement</strong> : demander la suppression
              de vos données
            </li>
            <li>
              <strong>Droit à la limitation</strong> : restreindre le traitement
              dans certains cas
            </li>
            <li>
              <strong>Droit à la portabilité</strong> : recevoir vos données dans
              un format structuré
            </li>
            <li>
              <strong>Droit d&apos;opposition</strong> : vous opposer au
              traitement pour motifs légitimes
            </li>
          </ul>
          <p className="mt-4">
            Pour exercer ces droits, contactez-nous à{" "}
            <strong>privacy@ascendos.co</strong>.
          </p>
          <p className="mt-4">
            Vous pouvez également déposer une réclamation auprès de la CNIL (
            <a
              href="https://www.cnil.fr"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.cnil.fr
            </a>
            ).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité techniques et
            organisationnelles pour protéger vos données :
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Chiffrement TLS 1.3 pour toutes les communications</li>
            <li>Chiffrement des données au repos (AES-256)</li>
            <li>Authentification forte avec support 2FA</li>
            <li>Accès restreint aux données (principe du moindre privilège)</li>
            <li>Audits de sécurité réguliers</li>
            <li>Plan de réponse aux incidents</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            10. Options de Confidentialité
          </h2>
          <p>Ascendos vous offre des contrôles avancés :</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              <strong>Redaction automatique</strong> : masque les emails et
              numéros de téléphone dans vos données
            </li>
            <li>
              <strong>Non-stockage du raw input</strong> : option pour ne pas
              conserver les données brutes saisies
            </li>
            <li>
              <strong>BYOK (Bring Your Own Key)</strong> : utilisez vos propres
              clés API pour les modèles IA
            </li>
            <li>
              <strong>Purge configurable</strong> : définissez la durée de
              rétention de vos données
            </li>
            <li>
              <strong>Export complet</strong> : exportez toutes vos données à
              tout moment
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">11. Cookies</h2>
          <p>Nous utilisons des cookies strictement nécessaires pour :</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Maintenir votre session de connexion</li>
            <li>Mémoriser vos préférences</li>
            <li>Assurer la sécurité (protection CSRF)</li>
          </ul>
          <p className="mt-4">
            Nous n&apos;utilisons pas de cookies publicitaires ou de tracking
            tiers sans votre consentement explicite.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">12. Mineurs</h2>
          <p>
            Le Service n&apos;est pas destiné aux personnes de moins de 18 ans.
            Nous ne collectons pas sciemment de données de mineurs.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            13. Modifications
          </h2>
          <p>
            Nous pouvons mettre à jour cette politique de confidentialité. Les
            modifications significatives seront notifiées par email ou via le
            Service. La date de dernière mise à jour est indiquée en haut de
            cette page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">14. Contact</h2>
          <p>Pour toute question concernant cette politique :</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              Email DPO : <strong>dpo@ascendos.co</strong>
            </li>
            <li>
              Email général : <strong>privacy@ascendos.co</strong>
            </li>
            <li>
              Adresse : [Adresse légale de l&apos;entreprise]
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
