# Ascendos — Vision produit v0.5

> **North Star :** Chaque chef de projet en agence envoie son update hebdo en moins de 2 minutes, sans stress politique, avec un dossier prêt quand ça chauffe.

> **v0.5 en une ligne :** Un générateur d'updates sponsor-ready + registres décisions/risques auto-extraits = reporting hebdo divisé par 10 et preuve de continuité prête pour le jour J.

---

## 1. Problème principal

**Les chefs de projet en agence perdent 1 à 2 heures par semaine à reformuler ce qu'ils savent déjà** — tickets, PR, notes — en un email "lisible" pour un sponsor non-tech.

Ce temps perdu n'est pas le vrai problème. Le vrai problème :

- **Risque politique** : un message mal calibré crée du doute, génère des réunions de clarification, retarde les validations
- **Aucune traçabilité** : quand ça chauffe (COPIL, escalade, renewal), impossible de reconstruire "qui a décidé quoi, quand"
- **Pas de standard** : chaque PM a son style, l'agence n'a pas de format cohérent

**Coût réel** : perte de confiance sponsor → churn projet → retainer renégocié à la baisse.

---

## 2. Cible prioritaire (ICP)

**Persona principal :**
Chef de projet / Delivery Lead dans une **agence ou studio web français (5-25 personnes)**, qui :

- Gère 2 à 5 projets actifs simultanément
- Rend des comptes chaque semaine à des sponsors non-tech (PME, ETI)
- A déjà vécu une escalade ou un COPIL tendu
- Paie ses outils sur carte (budget OPEX < 200€/mois sans validation)

**Persona secondaire :**
Consultant indépendant en mission longue (6+ mois) qui protège son retainer et sa réputation.

**Exclus (hors scope v0.5) :**

- Grands comptes / ESN (process d'achat trop long)
- Équipes produit internes (pas le même JTBD)
- Freelances en missions courtes (pas de rituel hebdo)

---

## 3. Proposition de valeur centrale

**Pour le PM :**

> "En 2 minutes le vendredi, j'ai un email prêt à envoyer qui dit exactement ce qu'il faut, dans le bon ton, sans oublier les décisions à prendre."

**Pour l'agence :**

> "On a un format standard pour tous nos projets, et un dossier 1 page prêt si un client escalade."

**Ce qu'on vend vraiment :**

1. **Temps** : 2 min au lieu de 60-90 min
2. **Sérénité** : "sponsor-ready" = calibré politiquement
3. **Assurance** : registres décisions/risques = preuve en cas d'escalade

---

## 4. Périmètre produit v0.5

### Dans le scope (ce qui existe et doit être parfait)

| Feature                          | Objectif                                                 | État             |
| -------------------------------- | -------------------------------------------------------- | ---------------- |
| **Générateur d'updates**         | Input brut → email + Slack prêts                         | ✅ Fonctionnel   |
| **3 profils Maître**             | Non-tech confiant / Micro-manager / Comité risque-averse | ✅ Fonctionnel   |
| **3 situations core**            | Normal / Validation / Risque                             | ✅ À privilégier |
| **Extraction décisions/risques** | Auto-populate les registres                              | ✅ Fonctionnel   |
| **Projets multiples**            | Jusqu'à 10 projets (TEAM)                                | ✅ Fonctionnel   |
| **Historique updates**           | Timeline par projet, recherche                           | ✅ Fonctionnel   |
| **Export dossier 1 page**        | HTML/PDF décisions + risques                             | ✅ Fonctionnel   |
| **Billing Stripe**               | TRIAL → TEAM → AGENCY                                    | ✅ Fonctionnel   |

### Hors scope v0.5 (volontairement)

| Feature                                                     | Raison                                         |
| ----------------------------------------------------------- | ---------------------------------------------- |
| Envoi email natif                                           | Complexité délivrabilité, copier/coller suffit |
| Intégrations Jira/Linear/GitHub                             | Distraction, pas de signal de demande          |
| Rappels automatiques                                        | Nice-to-have, pas différenciant                |
| Mode BYOK / confidentiel                                    | V0.7+, quand signal Agency fort                |
| Templates situations avancés (Arbitrage, Pré-COPIL, Retard) | Simplifier d'abord, ajouter si demande         |
| Collaboration temps réel                                    | Pas le JTBD (PM génère seul)                   |
| Dashboard analytics                                         | Vanity metrics, pas de valeur                  |

---

## 5. Différenciation clé

### Ce qui nous rend différents

**1. Le principe "Ne surpassez jamais le Maître"**

Pas juste un générateur de texte. Une **philosophie de communication ascendante** :

- Toujours attribuer les arbitrages au sponsor quand c'est vrai
- Éviter la virtuosité technique qui met le PM en avant
- Ton : respectueux, sûr, non défensif, non triomphaliste

→ Le sponsor se sent plus en contrôle, pas moins.

**2. Le dossier de continuité (vs. simple historique)**

Les concurrents génèrent du texte. Nous construisons une **preuve structurée** :

- Registre décisions avec timeline et statuts
- Registre risques avec sévérité et plans de mitigation
- Export 1 page prêt pour COPIL / escalade / renewal

→ Quand ça chauffe, on a 30 secondes pour prouver "qui a décidé quoi, quand".

**3. Profils Maître contextuels**

Pas de prompt générique. Des **contraintes calibrées** par type de sponsor :

- Vocabulaire à éviter / préférer
- Longueur max adaptée
- Structure de sortie différente

→ Même input, output radicalement différent selon le sponsor.

### Ce qu'on ne cherche PAS à être

- Un ChatGPT avec un wrapper
- Un outil de gestion de projet
- Une plateforme de collaboration
- Un CRM sponsors

---

## 6. Objectifs produit 3-6 mois

### Métriques primaires

| Métrique                                    | Cible 3 mois | Cible 6 mois |
| ------------------------------------------- | ------------ | ------------ |
| Organisations actives (2+ gen/sem)          | 30           | 100          |
| Organisations payantes                      | 5            | 20           |
| MRR                                         | 500€         | 2 000€       |
| Exports dossier utilisés (situation réelle) | 1            | 5            |

### Métriques d'activation

| Métrique                                     | Cible  |
| -------------------------------------------- | ------ |
| % users qui génèrent 2 semaines consécutives | > 40%  |
| % outputs copiés/envoyés "tel quel"          | > 60%  |
| Trial → Payant                               | 15-20% |
| Churn mensuel                                | < 8%   |

### Jalons qualitatifs

- [ ] 3 témoignages écrits de PM en agence
- [ ] 1 cas d'usage dossier en escalade réelle documenté
- [ ] 1 agence qui standardise sur Ascendos (3+ PM)

---

## 7. Anti-objectifs

Ce que le produit **ne cherche PAS** à faire :

1. **Remplacer la réflexion du PM** — L'outil structure et formule, il ne décide pas quoi dire
2. **Automatiser la relation sponsor** — Pas de réponses auto, pas de chatbot, le PM reste l'interlocuteur
3. **Devenir un outil de gestion de projet** — Pas de tâches, pas de Gantt, pas de backlog
4. **Collecter des données sensibles** — Minimum nécessaire, pas de lecture de repos/tickets
5. **Servir tous les cas d'usage** — Reporting hebdo sponsor uniquement, pas de communication interne
6. **Croître par les features** — Croître par la valeur perçue et le bouche-à-oreille

---

## 8. Contraintes structurelles

### Techniques

- **LLM externe** : dépendance OpenAI/Anthropic (coût, latence, disponibilité)
- **RGPD** : données projets = données sensibles, hébergement UE requis
- **Multi-tenant** : isolation stricte par organisation, pas de cross-contamination

### Business

- **Cycle de vente court** : doit convaincre en < 5 min de test
- **Budget OPEX** : < 200€/mois = décision PM seul, pas de procurement
- **Churn saisonnier** : agences = projets finis = churn structurel

### Produit

- **Friction minimale** : générateur gratuit sans login = wedge d'acquisition
- **Confiance** : données clients = responsabilité, pas de prompt injection, pas de fuite
- **Rituel** : valeur = usage récurrent, pas one-shot

---

## 9. Principes directeurs

**3 règles pour trancher les décisions produit :**

### 1. "2 minutes le vendredi"

Si une feature ralentit le temps de génération ou complexifie le flow, elle est rejetée. Le rituel doit rester ultra-rapide.

### 2. "Le sponsor doit briller"

Chaque output doit mettre le sponsor en position de contrôle. Si le PM "fait trop bien", on a raté.

### 3. "Preuve > Prose"

Le dossier de continuité (décisions + risques structurés) a plus de valeur que la qualité rédactionnelle de l'update. Prioriser l'extraction et la traçabilité.

---

## 10. Feuille de route simplifiée

### v0.5 (actuel) — Fondations solides

- Générateur + 3 profils + 3 situations core
- Registres décisions/risques auto-extraits
- Export dossier 1 page
- Billing TRIAL/TEAM/AGENCY
- Onboarding simplifié (< 2 min pour première génération)

### v0.6 — Rétention

- Rappels hebdo personnalisables
- Templates de situations étendus (si demande)
- Amélioration qualité extraction décisions/risques

### v0.7 — Scale Agency

- Mode confidentiel (BYOK)
- Export multi-projets (vue agence)
- Presets standards internes par organisation

### v0.8+ — Intégrations (si signal fort)

- Slack natif (envoi direct)
- Import contexte depuis outils existants

---

## 11. Validation continue

### Signaux à surveiller

| Signal                     | Interprétation                   | Action                          |
| -------------------------- | -------------------------------- | ------------------------------- |
| Demandes BYOK récurrentes  | Agences avec contraintes sécu    | Prioriser v0.7                  |
| Exports dossier fréquents  | Feature différenciante confirmée | Renforcer, documenter cas       |
| Abandon après 1 génération | Onboarding ou qualité output     | A/B test prompts, simplifier    |
| Demandes intégrations      | Dépend du volume et du profil    | Attendre 5+ demandes similaires |

### Questions à résoudre par les données

1. Quel profil Maître est le plus utilisé ? (→ prioriser son amélioration)
2. Quelle situation génère le plus de valeur perçue ? (→ focus marketing)
3. À quel moment les trials convertissent ? (→ optimiser le moment de paywall)

---

## Annexe : Ce que v0.5 retire de v0.1

| Élément v0.1                                                            | Décision v0.5                                                         |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 6 situations (Normal, Validation, Risque, Retard, Arbitrage, Pré-COPIL) | Réduit à 3 core (Normal, Validation, Risque) — les autres sur demande |
| Plan de validation 7 jours                                              | Supprimé (produit déjà construit)                                     |
| Stratégie d'acquisition détaillée                                       | Hors scope vision, document séparé                                    |
| Questions ouvertes                                                      | Tranchées ou supprimées                                               |
| Add-on Confidentiel 19€                                                 | Reporté v0.7, intégré dans AGENCY si demande                          |
| Exemple d'output détaillé                                               | Déplacé vers documentation marketing                                  |
| Définition "done MVP"                                                   | Remplacé par objectifs 3-6 mois                                       |

---

_Dernière mise à jour : 29 décembre 2024_
_Version : 0.5_
