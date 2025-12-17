# Ascendos — vision produit (v0.1)

## Résumé en une phrase
Ascendos transforme des signaux de delivery (notes brutes, tickets, PR) en un update hebdo “prêt à envoyer” orienté décisions/risques, tout en construisant automatiquement un Dossier de continuité (log décisions + risques) consultable en 30 secondes quand ça chauffe.

## Pourquoi ce produit existe
Dans les agences/studios et chez les consultants en mission longue, le reporting hebdo vers un sponsor non-tech est à la fois chronophage (1–2h/semaine) et politiquement risqué. Le problème n’est pas “écrire mieux”, c’est éviter le flou, accélérer les validations, réduire les réunions de clarification et disposer d’une traçabilité simple (qui a décidé quoi, quand, sur quelles hypothèses) en cas d’escalade, COPIL, ou renouvellement.

## Noyau personnel (principe directeur)
“NE SURPASSEZ JAMAIS LE MAÎTRE” = conception d’une communication ascendante qui rend le décideur plus à l’aise et plus en contrôle, sans manipulation ni mensonge.
Concrètement, ce noyau influence :
1) l’output : formulations orientées décisions, contrôle, arbitrages, et messages réutilisables par le sponsor vers son propre management ;
2) l’expérience : profils “Maître” + garde-fous visibles (“mode ne pas faire d’ombre”) + templates de situations politiques (validation, risque, retard, arbitrage, pré-COPIL) ;
3) la distribution : vente comme assurance anti-escalade + standard interne d’agence (pas comme un outil de rédaction).

## Cible initiale (ICP) — hyper précise
Agences/studios web de 5 à 30 personnes en Europe (France d’abord), vendant au forfait et/ou en retainer à des PME, avec COPIL réguliers et sponsor non-tech.
Utilisateurs : Head of Delivery / Chef de projet / CTO / lead dev faisant office de delivery.
Payeur : l’agence (OPEX sur carte) ; cas secondaire : consultant indépendant en mission longue qui protège son retainer.

Déclencheurs d’achat (moments “chauds”) :
- semaine pré-COPIL / comité projet
- phase critique (recette, mise en prod, incident)
- arbitrages nécessaires (scope, délais, budget)
- renouvellement/renégociation de retainer

## Job-to-be-done (JTBD)
“Quand je dois rendre des comptes chaque semaine à un sponsor non-tech (et parfois à mon N+1), je veux produire en moins de 10 minutes un message clair et politiquement ‘safe’ qui facilite les décisions et cadre les risques, tout en construisant une preuve de continuité réutilisable en cas d’escalade.”

## Symptômes observables (douleur chiffrable)
- 60 à 150 minutes/semaine à reconstruire “ce qui compte” depuis plusieurs sources
- réunions supplémentaires (30–60 min) de clarification si l’update est vague ou trop technique
- validations retardées (1–3 jours) faute de décision cadrée
- risque business : perte de confiance -> escalade, réduction de scope, churn, retainer renégocié

Pourquoi les solutions actuelles ne suffisent pas :
- Template + ChatGPT : non persistant, pas de rituel, pas d’historique structuré, dépend de la discipline et du contexte à recharger ; faible standardisation à l’échelle d’une agence
- Notion/Google Docs : saisie manuelle, pas de garde-fous, pas d’extraction automatique décisions/risques, pas de “dossier 1 page” anti-escalade
- Outils de gestion de projet : listes/tickets, pas de narration orientée sponsor ni de formulation “safe politiquement”

## Proposition de valeur (ce qui est vendu)
- Réduction immédiate : “2 minutes le vendredi” au lieu de 1–2h de reporting + moins de réunions de clarification
- Accélération : décisions mieux cadrées -> validations plus rapides
- Assurance : “zéro flou hebdo” + dossier de continuité (décisions/risques) prêt quand la pression monte
- Standardisation : même format et mêmes garde-fous pour toute l’agence

## Wedge (angle d’attaque)
Entrée par un générateur gratuit d’update sponsor-ready (sans login) qui produit un résultat instantané.
Conversion payante quand l’utilisateur veut : sauvegarder projets/profils, construire l’historique, exporter le “dossier 1 page”, recevoir les rappels, standardiser en équipe.

## Expérience utilisateur (flux bout en bout)
1) Découverte : page “Générateur d’update sponsor-ready + dossier 1 page”
2) Essai instantané : coller notes brutes + choisir situation + choisir profil Maître -> email + Slack + aperçu dossier
3) Activation : création de compte pour sauvegarder projet, profils Maître, historique, export
4) Rituel : rappel hebdo -> générer -> copier/coller (ou envoyer) -> le dossier s’enrichit
5) Moments critiques : export “Dossier de continuité” pour COPIL / escalade / renewal / handover

## Scope MVP (strict) — ce qui doit exister pour vendre
1) Projets + profil “Maître” (3 presets au départ) + objectifs (rassurer, obtenir validation, préparer COPIL)
2) Entrée cadrée : Faits / Décisions attendues / Risques (avec option coller brut -> suggestion de structure)
3) Génération output : email + Slack, avec contraintes visibles (longueur max, ton, vocabulaire à éviter)
4) Extraction & registres : log Décisions + log Risques (timeline simple)
5) Historique hebdo par projet + recherche basique (par date / tag décision / tag risque)
6) Export “Dossier 1 page” (HTML + PDF simple) + rappel hebdo

## Non-objectifs (anti scope creep)
- Pas de gestion de tâches (on ne remplace pas Jira/Linear)
- Pas de dashboards KPI / Gantt
- Pas de collaboration complexe (workflows d’approbation, rôles avancés) dans le MVP
- Pas d’intégrations multiples au départ ; une intégration “low effort” uniquement après signal payant
- Pas de promesse de délivrabilité email (au début : copier/coller + option envoi plus tard)
- Pas de “lecture automatique du repo” / accès profond aux données clientes

## Bibliothèque “situations politiques” (fondation différenciante)
Le produit doit fournir des templates de situations qui ne se résument pas à “mieux écrire” :
- Semaine normale (continuité + prochaine décision)
- Validation attendue (call-to-action + échéance)
- Semaine de risque (risque cadré + plan + date de revue)
- Retard (cause factuelle + options + arbitrage)
- Arbitrage scope/budget (options A/B/C + recommandation neutre)
- Pré-COPIL (résumé + décisions + risques + questions)

## Garde-fous “Ne pas faire d’ombre” (règles de sortie)
- Toujours attribuer les arbitrages/axes au sponsor quand c’est vrai (“suite à ton arbitrage…”, “conformément à la décision…”)
- Privilégier la clarté et la maîtrise (“sous contrôle”, “plan de mitigation”, “date de revue”) plutôt que la virtuosité technique
- Éviter le détail technique inutile ; conserver les preuves minimales (faits vérifiables)
- Finir par une décision attendue claire ou une prochaine étape datée
- Ton : respectueux, sûr, non défensif, non triomphaliste

## Packaging & prix (hypothèse initiale)
Objectif : vendre un standard de reporting + dossier anti-escalade, pas un “générateur de texte”.
- Team (par défaut) : 89€ HT/mois — jusqu’à 5 utilisateurs, 10 projets, templates situations, dossier 1 page, historique 12 mois
- Agency : 169€ HT/mois — jusqu’à 15 utilisateurs, projets “raisonnables” illimités, historique 24 mois, exports multi-projets, presets standard interne
- Add-on Confidentiel (optionnel) : 19€ HT/mois — BYOK + redaction renforcée + options purge

Essai : 7 jours sans carte, limité à 5 générations et sans historique persistant ; payant requis pour sauvegarde + export.

## Stratégie d’acquisition (sans audience)
1) Outbound ciblé agences (Head of Delivery / CTO / PM) avec offre “rewrite + dossier 1 page” sur un update réel
2) Partenariats légers (PMO / coach delivery / consultants) : co-brand + plan Agency partenaire
3) SEO outil transactionnel (2–3 pages) : générateur + exemples + dossier 1 page

## Mesures de succès (North Star + métriques)
North Star : nombre de projets actifs avec 2 cycles hebdo consécutifs (rituel installé).
Activation : % d’utilisateurs qui génèrent 2 semaines de suite sur un même projet.
Value proof : % d’outputs envoyés “tel quel” (copié/collé ou envoi).
Conversion : essai -> payant (cible 20–30% si la démo est forte).
Rétention : churn mensuel cible 5% au début puis 3–4% en vitesse de croisière.
Économie : ARPA cible 110€ (mix Team/Agency).

## Plan de validation (7 jours)
- Contacter 30 personnes ICP avec proposition : “colle ton update brut -> je renvoie version COPIL + dossier 1 page”
- Mesurer 3 signaux forts :
  - nombre d’inputs réels reçus (objectif ≥ 6)
  - demandes explicites “je veux l’avoir en récurrent / comment je paie” (objectif ≥ 3)
  - au moins 1 paiement founding ou engagement ferme
- Test A/B manuel : update classique vs Ascendos “safe” (objectif ≥ 70% préfère Ascendos)

## Données, confidentialité, RGPD (principes MVP)
- Minimisation : stocker le strict nécessaire (projet, registres, méta, historique) ; option “ne pas stocker le texte brut”
- Purge automatique configurable (ex : 90 jours sur Team, 180/365 sur Agency)
- Redaction : masque emails/numéros/noms si activé
- Transparence LLM : indiquer clairement si un modèle externe est utilisé ; offrir BYOK “mode confidentiel”
- Hébergement UE si possible (ou au minimum, documentation claire du traitement)
- DPA simple disponible (page dédiée)

## Positionnement (phrases testables)
- “Zéro flou hebdo : un update prêt à envoyer + un dossier de continuité en 1 page.”
- “Réduis les réunions de clarification, accélère les validations, sécurise le renouvellement.”
- “Fais briller ton sponsor : décisions claires, risques cadrés, ton ‘safe’.”

## Exemple d’output (mini démo)
Entrée (notes brutes) :
Faits : PR #182 règles livraison merged ; bug 231 erreurs 500 corrigé
Décisions attendues : GO mise en prod ; arbitrage tracking
Risques : retour Legal CGV pas reçu ; prestataire paiement indisponible jeudi

Email généré (extrait) :
Objet : COPIL — Avancement sous contrôle + décisions attendues (S50)
“Bonjour Sophie, conformément à l’arbitrage sur le parcours de paiement, nous avons sécurisé cette semaine : intégration des règles de livraison et correction du pic d’erreurs observé mardi. Décision attendue avant jeudi 17h : validation GO mise en production (fenêtre vendredi 16h) + arbitrage tracking option A/B. Risques surveillés : retour Legal CGV (impact : validation bloquée) ; plan : proposer version A conservative, revue jeudi 12h. Prochaines 48h : finaliser tracking, obtenir validation Legal, préparer rollback.”

Dossier 1 page (extrait) :
S49 — Décision : fenêtre de déploiement vendredi 16h
S50 — Risque : Legal CGV (impact validation) ; plan : version A ; revue : jeudi 12h
S50 — Décision attendue : GO prod + arbitrage tracking A/B

## Questions ouvertes (à trancher par signaux)
- Le déclencheur le plus vendeur : COPIL ? risque ? renewal ?
- La friction acceptable : compte requis après combien de générations ?
- Le “must-have” Agency : export multi-projets ou standard interne (templates) ?
- Envoi email : utile tôt ou source de support/délivrabilité ?
- Quel niveau de stockage les agences acceptent sans BYOK ?

## Définition du “done” (MVP vendu)
Le MVP est “done” quand :
- 5 équipes l’utilisent 2 semaines de suite sur au moins 1 projet
- 3 équipes paient (Team ou Agency)
- l’export dossier est utilisé au moins 1 fois en situation réelle (COPIL / escalade / renewal)
- le support reste gérable (≤ 30 min/jour) grâce aux presets + garde-fous + onboarding
