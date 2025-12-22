import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accord de Traitement des Données (DPA) | Ascendos",
  description:
    "Accord de traitement des données personnelles conforme au RGPD pour les clients Ascendos.",
};

export default function DPAPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">
        Accord de Traitement des Données (DPA)
      </h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground mb-8">
          Dernière mise à jour : 19 décembre 2025
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Le présent Accord de Traitement des Données (&quot;DPA&quot;)
            complète les Conditions Générales d&apos;Utilisation
            d&apos;Ascendos et s&apos;applique dans la mesure où Ascendos
            traite des Données Personnelles pour le compte du Client en vertu du
            Règlement Général sur la Protection des Données (RGPD).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Définitions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>&quot;Données Personnelles&quot;</strong> : toute
              information se rapportant à une personne physique identifiée ou
              identifiable.
            </li>
            <li>
              <strong>&quot;Traitement&quot;</strong> : toute opération effectuée
              sur des Données Personnelles (collecte, enregistrement,
              organisation, stockage, adaptation, extraction, consultation,
              utilisation, communication, effacement ou destruction).
            </li>
            <li>
              <strong>&quot;Responsable du Traitement&quot;</strong> : le Client
              qui détermine les finalités et les moyens du Traitement.
            </li>
            <li>
              <strong>&quot;Sous-traitant&quot;</strong> : Ascendos, qui traite
              les Données Personnelles pour le compte du Responsable du
              Traitement.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            3. Objet et Finalité du Traitement
          </h2>
          <p>Ascendos traite les Données Personnelles uniquement pour :</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              Fournir le Service de génération d&apos;updates hebdomadaires
            </li>
            <li>Maintenir les registres de décisions et de risques</li>
            <li>Générer les dossiers de continuité</li>
            <li>Envoyer les rappels hebdomadaires configurés</li>
            <li>Assurer le support technique</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            4. Types de Données Traitées
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Données d&apos;identification : nom, prénom, adresse email
              professionnelle
            </li>
            <li>Données de connexion : adresse IP, logs d&apos;accès</li>
            <li>
              Données de contenu : informations saisies dans les updates (faits,
              décisions, risques)
            </li>
            <li>
              Données d&apos;usage : statistiques d&apos;utilisation du Service
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            5. Obligations d&apos;Ascendos
          </h2>
          <p>En tant que Sous-traitant, Ascendos s&apos;engage à :</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              Traiter les Données uniquement sur instruction documentée du
              Client
            </li>
            <li>
              Garantir la confidentialité des Données (personnel soumis à
              obligation de confidentialité)
            </li>
            <li>
              Mettre en œuvre les mesures techniques et organisationnelles
              appropriées (chiffrement, contrôle d&apos;accès, sauvegardes)
            </li>
            <li>
              Ne pas faire appel à un autre sous-traitant sans autorisation
              écrite préalable
            </li>
            <li>
              Aider le Client à répondre aux demandes d&apos;exercice des droits
              des personnes concernées
            </li>
            <li>
              Notifier le Client dans les 72 heures en cas de violation de
              données
            </li>
            <li>
              Supprimer ou restituer les Données à la fin du contrat, selon le
              choix du Client
            </li>
            <li>
              Mettre à disposition les informations nécessaires pour démontrer
              le respect des obligations RGPD
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            6. Sous-traitants Ultérieurs
          </h2>
          <p>
            Ascendos fait appel aux sous-traitants ultérieurs suivants, avec
            lesquels des accords de protection des données ont été conclus :
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border border-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border px-4 py-2 text-left">Sous-traitant</th>
                  <th className="border px-4 py-2 text-left">Finalité</th>
                  <th className="border px-4 py-2 text-left">Localisation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">Vercel Inc.</td>
                  <td className="border px-4 py-2">Hébergement infrastructure</td>
                  <td className="border px-4 py-2">USA (SCCs)</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Neon Inc.</td>
                  <td className="border px-4 py-2">Base de données PostgreSQL</td>
                  <td className="border px-4 py-2">USA/UE (SCCs)</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Clerk Inc.</td>
                  <td className="border px-4 py-2">Authentification</td>
                  <td className="border px-4 py-2">USA (SCCs)</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">OpenAI LLC</td>
                  <td className="border px-4 py-2">Génération de texte IA</td>
                  <td className="border px-4 py-2">USA (SCCs)</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Stripe Inc.</td>
                  <td className="border px-4 py-2">Paiements</td>
                  <td className="border px-4 py-2">USA/UE (SCCs)</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Upstash Inc.</td>
                  <td className="border px-4 py-2">Cache et rate limiting</td>
                  <td className="border px-4 py-2">USA/UE (SCCs)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            SCCs = Standard Contractual Clauses (Clauses Contractuelles Types
            approuvées par la Commission Européenne)
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            7. Transferts Internationaux
          </h2>
          <p>
            Certains sous-traitants ultérieurs étant établis aux États-Unis, des
            transferts de Données Personnelles vers des pays tiers peuvent avoir
            lieu. Ces transferts sont encadrés par :
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              Les Clauses Contractuelles Types (SCCs) adoptées par la Commission
              Européenne
            </li>
            <li>
              Des mesures techniques supplémentaires (chiffrement en transit et
              au repos)
            </li>
            <li>
              L&apos;évaluation régulière de la législation des pays
              destinataires
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            8. Durée de Conservation
          </h2>
          <p>
            Les Données Personnelles sont conservées conformément aux paramètres
            configurés par le Client :
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Plan TEAM : historique configurable jusqu&apos;à 12 mois</li>
            <li>Plan AGENCY : historique configurable jusqu&apos;à 24 mois</li>
            <li>
              Purge automatique des données au-delà de la période de rétention
              configurée
            </li>
          </ul>
          <p className="mt-4">
            Le Client peut à tout moment demander la suppression anticipée de
            ses données.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            9. Mesures de Sécurité
          </h2>
          <p>Ascendos met en œuvre les mesures de sécurité suivantes :</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Chiffrement TLS 1.3 pour toutes les communications</li>
            <li>Chiffrement AES-256 des données au repos</li>
            <li>Authentification forte (2FA disponible via Clerk)</li>
            <li>Contrôle d&apos;accès basé sur les rôles (RBAC)</li>
            <li>Journalisation des accès et des opérations sensibles</li>
            <li>Sauvegardes automatiques quotidiennes</li>
            <li>Tests de sécurité réguliers</li>
            <li>
              Option de redaction automatique des données sensibles (emails,
              numéros)
            </li>
            <li>Option BYOK (Bring Your Own Key) pour les clés API LLM</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            10. Droits des Personnes Concernées
          </h2>
          <p>
            Le Client reste responsable de répondre aux demandes d&apos;exercice
            des droits. Ascendos s&apos;engage à :
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              Fournir les outils d&apos;export des données (dossier de
              continuité)
            </li>
            <li>
              Permettre la suppression des données sur demande (via les
              paramètres)
            </li>
            <li>
              Répondre dans les 30 jours aux demandes transmises par le Client
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">11. Contact</h2>
          <p>Pour toute question relative à ce DPA :</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              Email : <strong>dpo@ascendos.co</strong>
            </li>
            <li>
              Adresse : [Adresse légale de l&apos;entreprise]
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">12. Entrée en Vigueur</h2>
          <p>
            Ce DPA entre en vigueur dès l&apos;acceptation des Conditions
            Générales d&apos;Utilisation et reste applicable pendant toute la
            durée de la relation contractuelle.
          </p>
        </section>
      </div>
    </div>
  );
}
