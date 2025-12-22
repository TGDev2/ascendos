import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation | Ascendos",
  description:
    "Conditions générales d'utilisation du service Ascendos - Génération d'updates sponsor-ready.",
};

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">
        Conditions Générales d&apos;Utilisation
      </h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground mb-8">
          Dernière mise à jour : 19 décembre 2025
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Objet</h2>
          <p>
            Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent
            l&apos;accès et l&apos;utilisation du service Ascendos (le
            &quot;Service&quot;), une plateforme SaaS de génération d&apos;updates
            hebdomadaires destinés aux sponsors non-techniques, avec dossier de
            continuité intégré.
          </p>
          <p className="mt-4">
            En utilisant le Service, vous acceptez les présentes CGU dans leur
            intégralité.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Définitions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>&quot;Ascendos&quot;</strong> ou &quot;nous&quot; : [Nom
              légal de l&apos;entreprise], société [forme juridique], immatriculée
              [numéro], dont le siège social est situé [adresse].
            </li>
            <li>
              <strong>&quot;Client&quot;</strong> ou &quot;vous&quot; :
              l&apos;organisation ou la personne physique qui souscrit au Service.
            </li>
            <li>
              <strong>&quot;Utilisateur&quot;</strong> : toute personne autorisée
              par le Client à utiliser le Service.
            </li>
            <li>
              <strong>&quot;Update&quot;</strong> : message hebdomadaire généré
              par le Service à destination d&apos;un sponsor.
            </li>
            <li>
              <strong>&quot;Dossier de Continuité&quot;</strong> : compilation
              exportable des décisions et risques d&apos;un projet.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            3. Description du Service
          </h2>
          <p>Ascendos propose :</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              Un générateur d&apos;updates hebdomadaires &quot;sponsor-ready&quot;
              basé sur l&apos;IA
            </li>
            <li>
              Des profils &quot;Maître&quot; configurables (ton, contraintes,
              vocabulaire)
            </li>
            <li>Des templates de situations politiques prédéfinis</li>
            <li>Un registre de décisions avec suivi des statuts</li>
            <li>Un registre de risques avec niveaux de sévérité</li>
            <li>Un export &quot;Dossier de Continuité&quot; en 1 page</li>
            <li>Des rappels hebdomadaires configurables</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            4. Inscription et Compte
          </h2>
          <h3 className="text-lg font-medium mt-4 mb-2">4.1 Création de compte</h3>
          <p>
            L&apos;utilisation complète du Service nécessite la création d&apos;un
            compte. Vous vous engagez à fournir des informations exactes et à les
            maintenir à jour.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">4.2 Sécurité du compte</h3>
          <p>
            Vous êtes responsable de la confidentialité de vos identifiants et de
            toutes les activités réalisées sous votre compte. En cas de suspicion
            d&apos;utilisation non autorisée, vous devez nous en informer
            immédiatement.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">4.3 Utilisation anonyme</h3>
          <p>
            Le générateur gratuit peut être utilisé sans compte, dans la limite
            de 3 générations par heure et par adresse IP.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Tarifs et Paiement</h2>
          <h3 className="text-lg font-medium mt-4 mb-2">5.1 Plans disponibles</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Essai gratuit</strong> : 7 jours, 5 générations maximum,
              sans historique persistant
            </li>
            <li>
              <strong>Plan TEAM</strong> : 89€ HT/mois - jusqu&apos;à 5
              utilisateurs, 10 projets, historique 12 mois
            </li>
            <li>
              <strong>Plan AGENCY</strong> : 169€ HT/mois - jusqu&apos;à 15
              utilisateurs, projets illimités, historique 24 mois
            </li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">5.2 Facturation</h3>
          <p>
            Les abonnements sont facturés mensuellement à l&apos;avance. La TVA
            applicable sera ajoutée au tarif HT selon la législation en vigueur.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">5.3 Moyens de paiement</h3>
          <p>
            Les paiements sont effectués par carte bancaire via notre prestataire
            Stripe. Les données de paiement sont traitées directement par Stripe
            et ne sont pas stockées par Ascendos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            6. Durée et Résiliation
          </h2>
          <h3 className="text-lg font-medium mt-4 mb-2">6.1 Durée</h3>
          <p>
            L&apos;abonnement est conclu pour une durée d&apos;un mois,
            renouvelable tacitement.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">6.2 Résiliation par le Client</h3>
          <p>
            Vous pouvez résilier votre abonnement à tout moment depuis les
            paramètres de votre compte. La résiliation prend effet à la fin de la
            période de facturation en cours.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">6.3 Résiliation par Ascendos</h3>
          <p>
            Nous nous réservons le droit de suspendre ou résilier votre compte en
            cas de violation des présentes CGU, notamment :
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Utilisation abusive ou frauduleuse du Service</li>
            <li>Non-paiement des factures après mise en demeure</li>
            <li>Atteinte aux droits de tiers ou à notre image</li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">6.4 Conséquences de la résiliation</h3>
          <p>
            À la résiliation, vous pouvez exporter vos données pendant 30 jours.
            Passé ce délai, les données seront supprimées conformément à notre
            politique de confidentialité.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            7. Utilisation Acceptable
          </h2>
          <p>Vous vous engagez à :</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
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
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            8. Propriété Intellectuelle
          </h2>
          <h3 className="text-lg font-medium mt-4 mb-2">8.1 Droits d&apos;Ascendos</h3>
          <p>
            Le Service, son code source, ses algorithmes, son design et sa
            documentation restent notre propriété exclusive. Vous bénéficiez
            uniquement d&apos;un droit d&apos;utilisation non exclusif et non
            transférable.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">8.2 Droits du Client</h3>
          <p>
            Vous conservez tous les droits sur les données et contenus que vous
            saisissez dans le Service. Les updates générés vous appartiennent
            intégralement.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">8.3 Licence sur le contenu</h3>
          <p>
            Vous nous accordez une licence limitée pour traiter vos données
            uniquement dans le cadre de la fourniture du Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            9. Utilisation de l&apos;IA
          </h2>
          <p>
            Le Service utilise des modèles d&apos;intelligence artificielle
            (OpenAI, Anthropic) pour générer les updates. Vous reconnaissez que :
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              Les outputs générés par l&apos;IA peuvent nécessiter une
              vérification humaine avant utilisation
            </li>
            <li>
              Nous ne garantissons pas l&apos;exactitude ou la pertinence des
              contenus générés
            </li>
            <li>
              Les données envoyées aux modèles IA sont soumises aux conditions
              d&apos;utilisation des fournisseurs tiers
            </li>
            <li>
              L&apos;option BYOK (Bring Your Own Key) permet d&apos;utiliser vos
              propres clés API pour plus de contrôle
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            10. Limitation de Responsabilité
          </h2>
          <h3 className="text-lg font-medium mt-4 mb-2">10.1 Disponibilité</h3>
          <p>
            Nous nous efforçons d&apos;assurer une disponibilité maximale du
            Service mais ne garantissons pas une disponibilité de 100%. Des
            interruptions pour maintenance peuvent survenir.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">10.2 Exclusions</h3>
          <p>
            Dans les limites autorisées par la loi, nous excluons toute
            responsabilité pour :
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              Les dommages indirects (perte de chiffre d&apos;affaires, de données,
              d&apos;opportunités)
            </li>
            <li>
              Les conséquences de l&apos;utilisation des contenus générés par
              l&apos;IA
            </li>
            <li>Les interruptions dues à des tiers (hébergeur, fournisseurs IA)</li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">10.3 Plafond</h3>
          <p>
            Notre responsabilité totale est limitée au montant des sommes versées
            par le Client au cours des 12 derniers mois.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            11. Données Personnelles
          </h2>
          <p>
            Le traitement des données personnelles est régi par notre{" "}
            <a href="/legal/privacy" className="text-primary hover:underline">
              Politique de Confidentialité
            </a>
            .
          </p>
          <p className="mt-4">
            Pour les clients B2B soumis au RGPD, un{" "}
            <a href="/legal/dpa" className="text-primary hover:underline">
              Accord de Traitement des Données (DPA)
            </a>{" "}
            est disponible.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">12. Modifications</h2>
          <p>
            Nous nous réservons le droit de modifier les présentes CGU. Les
            modifications significatives seront notifiées par email au moins 30
            jours avant leur entrée en vigueur.
          </p>
          <p className="mt-4">
            La poursuite de l&apos;utilisation du Service après notification vaut
            acceptation des nouvelles CGU.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            13. Droit Applicable et Litiges
          </h2>
          <p>
            Les présentes CGU sont régies par le droit français. En cas de
            litige, les parties s&apos;efforceront de trouver une solution
            amiable. À défaut, les tribunaux compétents de Paris seront
            exclusivement compétents.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">14. Contact</h2>
          <p>Pour toute question concernant ces CGU :</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              Email : <strong>contact@ascendos.co</strong>
            </li>
            <li>
              Support : <strong>support@ascendos.co</strong>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
