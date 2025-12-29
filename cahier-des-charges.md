# Ascendos — Cahier des charges v0.5

> **Document de référence** pour le développement, la maintenance et l'évolution du produit Ascendos.
> Ce document est la pierre angulaire du projet et doit être mis à jour à chaque évolution majeure.

---

## Table des matières

1. [Introduction](#1-introduction)
2. [Spécifications fonctionnelles](#2-spécifications-fonctionnelles)
3. [Architecture technique](#3-architecture-technique)
4. [Modèle de données](#4-modèle-de-données)
5. [API & Endpoints](#5-api--endpoints)
6. [Intégrations externes](#6-intégrations-externes)
7. [Sécurité & Conformité](#7-sécurité--conformité)
8. [Business model](#8-business-model)
9. [UX/UI](#9-uxui)
10. [Infrastructure & Déploiement](#10-infrastructure--déploiement)
11. [Monitoring & Observabilité](#11-monitoring--observabilité)
12. [Glossaire](#12-glossaire)

---

## 1. Introduction

### 1.1 Objet du document

Ce cahier des charges définit l'ensemble des spécifications techniques, fonctionnelles et business du produit Ascendos. Il sert de référence unique pour :

- Le développement de nouvelles fonctionnalités
- La maintenance et le debugging
- L'onboarding de nouveaux contributeurs
- Les audits de sécurité et conformité
- Les discussions avec partenaires et investisseurs

### 1.2 Documents de référence

| Document      | Description               | Lien                                                                               |
| ------------- | ------------------------- | ---------------------------------------------------------------------------------- |
| vision.md     | Vision produit v0.5       | [vision.md](./vision.md)                                                           |
| SECURITY.md   | Politique de sécurité     | [SECURITY.md](./SECURITY.md)                                                       |
| schema.prisma | Schéma de base de données | [packages/database/prisma/schema.prisma](./packages/database/prisma/schema.prisma) |

### 1.3 Résumé exécutif

**Ascendos** est un SaaS B2B qui transforme des notes brutes de projet en updates hebdomadaires "sponsor-ready" en moins de 2 minutes, tout en construisant automatiquement un dossier de continuité (décisions + risques) consultable en cas d'escalade.

**Cible** : Chefs de projet / Delivery Leads dans des agences web françaises (5-25 personnes).

**Proposition de valeur** :

1. Gain de temps : 2 min au lieu de 60-90 min
2. Sérénité : output calibré politiquement ("Ne pas faire d'ombre au Maître")
3. Assurance : registres décisions/risques = preuve en cas d'escalade

---

## 2. Spécifications fonctionnelles

### 2.1 Vue d'ensemble des fonctionnalités

```
┌─────────────────────────────────────────────────────────────────┐
│                        ASCENDOS v0.5                            │
├─────────────────────────────────────────────────────────────────┤
│  ACQUISITION          │  CORE PRODUCT        │  RÉTENTION       │
│  ─────────────────    │  ─────────────────   │  ────────────    │
│  • Générateur gratuit │  • Projets multiples │  • Historique    │
│  • Landing page       │  • Profils Maître    │  • Registres     │
│  • Email capture      │  • Génération LLM    │  • Export PDF    │
│                       │  • Extraction auto   │  • Dossier 1 page│
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Parcours utilisateur principal

#### 2.2.1 Acquisition (Utilisateur anonyme)

```
Landing Page ──▶ Générateur gratuit ──▶ Génération (3 max/h) ──▶ Email capture ──▶ Signup
```

**Étapes détaillées** :

1. **Découverte** : L'utilisateur arrive sur la landing page
2. **Test immédiat** : Clic sur "Essayer gratuitement" → accès au générateur
3. **Première génération** :
   - Saisie des faits (max 5, 500 chars chacun)
   - Saisie des décisions attendues (max 3, 500 chars chacun)
   - Saisie des risques (max 3, 500 chars chacun)
   - Choix du profil Maître (3 options)
   - Choix du type de situation (6 options, 3 recommandées)
4. **Résultat** : Email + Slack + décisions/risques extraits
5. **Conversion** : Après 1-3 générations → modal email capture → inscription

#### 2.2.2 Activation (Utilisateur authentifié en trial)

```
Signup ──▶ Création org ──▶ Premier projet ──▶ 5 générations ──▶ Upgrade ou expiration
```

**Règles trial** :

- Durée : 7 jours
- Générations : 5 maximum sur toute la période
- Projets : 1 maximum
- Décisions/Risques par projet : 10 maximum chacun
- À expiration : blocage complet, upgrade requis

#### 2.2.3 Rétention (Utilisateur payant)

```
Rituel hebdo : Rappel ──▶ Génération ──▶ Copie/Envoi ──▶ Dossier enrichi
```

**Rituel type** :

1. Vendredi 9h : email de rappel (si activé)
2. Connexion au dashboard
3. Sélection du projet
4. Saisie des notes de la semaine
5. Génération → copier/coller vers sponsor
6. Le dossier de continuité s'enrichit automatiquement

### 2.3 Fonctionnalités détaillées

#### 2.3.1 Générateur d'updates

**Description** : Transformation de notes brutes en communications professionnelles.

**Inputs** :

| Champ               | Type                                      | Limite anonyme     | Limite auth | Description         |
| ------------------- | ----------------------------------------- | ------------------ | ----------- | ------------------- |
| `facts`             | Array<{text, source?}>                    | 5 items, 500 chars | Illimité    | Faits de la semaine |
| `decisionsNeeded`   | Array<{description, deadline?}>           | 3 items, 500 chars | Illimité    | Décisions attendues |
| `risksInput`        | Array<{description, impact, mitigation?}> | 3 items, 500 chars | Illimité    | Risques identifiés  |
| `masterProfileSlug` | String                                    | Requis             | Requis      | Profil du sponsor   |
| `situationType`     | Enum                                      | Requis             | Requis      | Type de situation   |
| `rawInput`          | String                                    | Non disponible     | Optionnel   | Input brut à parser |

**Outputs** :

| Champ                | Description                         | Exemple                                                      |
| -------------------- | ----------------------------------- | ------------------------------------------------------------ |
| `emailSubject`       | Objet de l'email (max 60 chars)     | "COPIL S50 — Avancement sous contrôle + validation attendue" |
| `emailBody`          | Corps de l'email (selon profil)     | Texte formaté respectant les contraintes                     |
| `slackMessage`       | Version ultra-courte (max 150 mots) | Version condensée pour Slack                                 |
| `extractedDecisions` | Décisions extraites                 | [{description, decidedBy?, tags}]                            |
| `extractedRisks`     | Risques extraits                    | [{description, impact, mitigation?, severity, tags}]         |
| `metadata`           | Métadonnées techniques              | {generatedWith, tokensUsed, generationTimeMs}                |

#### 2.3.2 Profils Maître (Master Profiles)

**Définition** : Ensemble de contraintes qui façonnent le ton, le vocabulaire et la structure des outputs.

**Profils intégrés** :

##### Non-tech confiant

| Attribut             | Valeur                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------- |
| Slug                 | `non-tech-confiant`                                                                      |
| Ton                  | Respectueux, sûr, non défensif                                                           |
| Longueur max         | 250 mots                                                                                 |
| Vocabulaire à éviter | bug, refactoring, optimisation, architecture, API, endpoint, migration, rollback         |
| Vocabulaire préféré  | correction, amélioration, fonctionnalité, intégration, mise à jour, parcours utilisateur |
| Contraintes          | Pas de jargon technique, décision claire, pas de détails d'implémentation                |

##### Micro-manager

| Attribut             | Valeur                                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| Slug                 | `micro-manager`                                                                                          |
| Ton                  | Précis, rassurant, factuel                                                                               |
| Longueur max         | 350 mots                                                                                                 |
| Vocabulaire à éviter | bientôt, probablement, normalement, on espère, ça devrait                                                |
| Vocabulaire préféré  | vendredi 15h, confirmé, planifié, vérifié, validé, date de revue, échéance                               |
| Contraintes          | Toujours dater les prochaines étapes, inclure métriques, mentionner bloqueurs, plan de revue obligatoire |

##### Comité risque-averse

| Attribut             | Valeur                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| Slug                 | `comite-risque-averse`                                                                                  |
| Ton                  | Neutre, structuré, orienté décisions                                                                    |
| Longueur max         | 400 mots                                                                                                |
| Vocabulaire à éviter | problème, catastrophe, bloqué, impossible, erreur                                                       |
| Vocabulaire préféré  | risque identifié, impact, plan de mitigation, options, arbitrage, recommandation                        |
| Contraintes          | Structure claire (Faits → Risques → Options → Recommandation), options A/B/C, impact business explicite |

#### 2.3.3 Templates de situations

**Définition** : Structure et focus de l'output selon le contexte de la semaine.

| Type       | Slug         | Description             | Usage recommandé                   |
| ---------- | ------------ | ----------------------- | ---------------------------------- |
| Normal     | `NORMAL`     | Continuité hebdomadaire | Semaine sans événement particulier |
| Validation | `VALIDATION` | Approbation attendue    | Besoin d'un GO explicite           |
| Risque     | `RISK`       | Risque identifié        | Alerte sur un risque nouveau       |
| Retard     | `DELAY`      | Glissement planning     | Annonce d'un retard                |
| Arbitrage  | `ARBITRAGE`  | Décision scope/budget   | Choix à présenter                  |
| Pré-COPIL  | `PRE_COPIL`  | Préparation comité      | Veille de COPIL                    |

**Scope v0.5** : Seuls NORMAL, VALIDATION et RISK sont activement promus. Les autres restent disponibles sur demande.

#### 2.3.4 Registres décisions/risques

**Extraction automatique** : À chaque génération, les décisions et risques sont extraits et ajoutés aux registres du projet.

**Registre des décisions** :

| Champ       | Type          | Description                           |
| ----------- | ------------- | ------------------------------------- |
| description | String        | Description de la décision            |
| context     | String        | Contexte (optionnel)                  |
| outcome     | String        | Résultat (optionnel)                  |
| decidedBy   | String        | Qui a décidé (ex: "Sophie (sponsor)") |
| decidedAt   | DateTime      | Date de décision                      |
| status      | Enum          | PENDING / DECIDED / CANCELLED         |
| tags        | Array<String> | scope, tech, budget, délai            |

**Registre des risques** :

| Champ       | Type          | Description                                          |
| ----------- | ------------- | ---------------------------------------------------- |
| description | String        | Description du risque                                |
| impact      | String        | Impact identifié                                     |
| mitigation  | String        | Plan de mitigation                                   |
| severity    | Enum          | LOW / MEDIUM / HIGH / CRITICAL                       |
| status      | Enum          | OPEN / MONITORING / MITIGATED / RESOLVED / CANCELLED |
| reviewDate  | DateTime      | Date de prochaine revue                              |
| tags        | Array<String> | legal, tech, externe, interne                        |

#### 2.3.5 Export dossier de continuité

**Description** : Export 1 page (HTML/PDF) consolidant l'historique d'un projet.

**Contenu** :

- Informations projet (nom, sponsor, objectifs)
- Timeline des décisions (avec statuts)
- Registre des risques actifs
- Derniers updates (résumé)

**Formats** :

- HTML (visualisation web)
- PDF (téléchargement)

**Usage** : COPIL, escalade, renewal, handover.

### 2.4 Règles métier

#### 2.4.1 Principe "Ne surpassez jamais le Maître"

Ce principe fondateur influence toute la génération :

1. **Attribution** : Toujours attribuer les arbitrages au sponsor quand c'est vrai
2. **Ton** : Respectueux, sûr, non défensif, non triomphaliste
3. **Clarté** : Privilégier la clarté sur la virtuosité technique
4. **Preuves** : Conserver les faits vérifiables, éviter le détail inutile
5. **Action** : Finir par une décision attendue claire ou prochaine étape datée

#### 2.4.2 Limites par plan

| Limite           | TRIAL   | TEAM         | AGENCY       |
| ---------------- | ------- | ------------ | ------------ |
| Durée            | 7 jours | Illimité     | Illimité     |
| Générations      | 5 total | 10/jour/user | 50/jour/user |
| Projets          | 1       | 10           | Illimité     |
| Décisions/projet | 10      | 100          | Illimité     |
| Risques/projet   | 10      | 100          | Illimité     |
| Utilisateurs     | 1       | 5            | 15           |
| Historique       | 7 jours | 12 mois      | 24 mois      |

#### 2.4.3 Rate limiting

| Contexte | Limite         | Fenêtre       | Clé Redis                               |
| -------- | -------------- | ------------- | --------------------------------------- |
| Anonyme  | 1 génération   | 1 heure       | `rate_limit:anonymous:{ip}:{hour_key}`  |
| Trial    | 5 générations  | Période trial | `rate_limit:trial:{orgId}:total`        |
| Team     | 10 générations | 24 heures     | `rate_limit:team:{userId}:{date_key}`   |
| Agency   | 50 générations | 24 heures     | `rate_limit:agency:{userId}:{date_key}` |

**Comportement en cas de dépassement** :

- HTTP 429 Too Many Requests
- Header `X-RateLimit-Remaining`
- Header `X-RateLimit-Reset` (timestamp)

---

## 3. Architecture technique

### 3.1 Stack technologique

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                 │
│  Next.js API Routes + tRPC (type-safe RPC)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   PostgreSQL    │ │   Upstash Redis │ │   LLM Providers │
│   (Neon)        │ │   (Rate Limit)  │ │   (OpenAI/Anth) │
│   Prisma ORM    │ │                 │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 3.2 Structure du projet (Monorepo Turbo)

```
ascendos/
├── apps/
│   └── web/                          # Application Next.js principale
│       ├── src/
│       │   ├── app/                  # App Router (pages, layouts, API)
│       │   │   ├── (auth)/           # Routes authentifiées
│       │   │   ├── (marketing)/      # Routes publiques (landing, generator)
│       │   │   ├── api/              # API Routes
│       │   │   │   ├── generate/     # Endpoint génération
│       │   │   │   ├── billing/      # Endpoints Stripe
│       │   │   │   ├── webhooks/     # Webhooks Clerk/Stripe
│       │   │   │   ├── cron/         # Jobs planifiés
│       │   │   │   └── trpc/         # Handler tRPC
│       │   │   └── layout.tsx
│       │   ├── components/           # Composants React
│       │   │   ├── ui/               # shadcn/ui components
│       │   │   ├── generator/        # Composants générateur
│       │   │   ├── dashboard/        # Composants dashboard
│       │   │   └── billing/          # Composants facturation
│       │   ├── lib/                  # Utilitaires
│       │   │   ├── trpc/             # Client tRPC
│       │   │   ├── stripe/           # Client Stripe
│       │   │   └── utils/            # Helpers
│       │   └── server/               # Code serveur uniquement
│       │       ├── routers/          # tRPC routers
│       │       └── services/         # Services métier
│       ├── public/                   # Assets statiques
│       └── next.config.js
│
├── packages/
│   ├── database/                     # Package Prisma
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Schéma de données
│   │   │   └── migrations/           # Migrations SQL
│   │   └── src/
│   │       └── index.ts              # Export PrismaClient
│   │
│   ├── ai/                           # Package IA/LLM
│   │   └── src/
│   │       ├── prompts/              # Templates de prompts
│   │       ├── providers/            # Providers OpenAI/Anthropic
│   │       └── extraction/           # Extraction décisions/risques
│   │
│   ├── templates/                    # Package templates
│   │   └── src/
│   │       ├── master-profiles/      # Profils Maître
│   │       └── situations/           # Templates situations
│   │
│   ├── validators/                   # Package validation
│   │   └── src/
│   │       └── schemas/              # Schémas Zod
│   │
│   └── config/                       # Configuration partagée
│       └── src/
│           ├── plans.ts              # Définition des plans
│           └── constants.ts          # Constantes globales
│
├── turbo.json                        # Configuration Turbo
├── package.json                      # Workspace root
└── pnpm-workspace.yaml               # Configuration pnpm
```

### 3.3 Flux de données

#### 3.3.1 Génération d'update

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│  API     │────▶│  Rate    │────▶│  LLM     │
│  (React) │     │  Route   │     │  Limiter │     │  Provider│
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                      │                                  │
                      ▼                                  ▼
                 ┌──────────┐                      ┌──────────┐
                 │  Prisma  │◀─────────────────────│ Response │
                 │  (Save)  │                      │  Parser  │
                 └──────────┘                      └──────────┘
```

#### 3.3.2 Authentification

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │────▶│  Clerk   │────▶│  Webhook │────▶│  Prisma  │
│  Signup  │     │  Auth    │     │  Handler │     │  (Create)│
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

#### 3.3.3 Paiement

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │────▶│ Checkout │────▶│  Stripe  │────▶│  Webhook │
│  Upgrade │     │  Session │     │  Payment │     │  Handler │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                        │
                                                        ▼
                                                   ┌──────────┐
                                                   │  Prisma  │
                                                   │  (Update)│
                                                   └──────────┘
```

### 3.4 Dépendances principales

| Package           | Version | Usage              |
| ----------------- | ------- | ------------------ |
| next              | 15.x    | Framework React    |
| react             | 19.x    | UI Library         |
| typescript        | 5.x     | Typage statique    |
| prisma            | 6.x     | ORM                |
| @clerk/nextjs     | 6.x     | Authentification   |
| stripe            | 17.x    | Paiements          |
| @upstash/redis    | 1.x     | Rate limiting      |
| @ai-sdk/openai    | 1.x     | Provider OpenAI    |
| @ai-sdk/anthropic | 1.x     | Provider Anthropic |
| ai                | 4.x     | Vercel AI SDK      |
| zod               | 3.x     | Validation         |
| tailwindcss       | 4.x     | CSS                |
| @trpc/server      | 11.x    | RPC type-safe      |

---

## 4. Modèle de données

### 4.1 Diagramme entité-relation

```
┌─────────────────┐       ┌─────────────────┐
│  Organization   │───────│     User        │
│─────────────────│ 1   N │─────────────────│
│ id              │       │ id              │
│ name            │       │ email           │
│ plan            │       │ clerkId         │
│ seats           │       │ name            │
│ trialEndsAt     │       │ organizationId  │
│ trialGenerations│       │ role            │
│ maxProjects     │       └─────────────────┘
│ stripeCustomerId│
│ stripeSubId     │       ┌─────────────────┐
│ stripePriceId   │       │ OrganizationSet │
│ billingEmail    │───────│─────────────────│
│ cancelAtPeriod  │ 1   1 │ organizationId  │
└─────────────────┘       │ dataRetention   │
        │                 │ autoRedaction   │
        │ 1               │ preferredProvider│
        │                 │ weeklyReminder  │
        ▼ N               └─────────────────┘
┌─────────────────┐
│    Project      │       ┌─────────────────┐
│─────────────────│───────│  MasterProfile  │
│ id              │ N   1 │─────────────────│
│ name            │       │ id              │
│ description     │       │ name            │
│ organizationId  │       │ slug            │
│ createdById     │       │ description     │
│ masterProfileId │       │ tone            │
│ objectives      │       │ constraints     │
│ sponsorName     │       │ vocabulary      │
│ sponsorRole     │       │ isCustom        │
│ sponsorEmail    │       └─────────────────┘
│ archived        │
└─────────────────┘
        │
        │ 1
        ▼ N
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    Update       │───────│   Decision      │       │     Risk        │
│─────────────────│ 1   N │─────────────────│       │─────────────────│
│ id              │       │ id              │       │ id              │
│ projectId       │       │ projectId       │       │ projectId       │
│ createdById     │       │ updateId        │       │ updateId        │
│ weekNumber      │       │ description     │       │ description     │
│ year            │       │ context         │       │ impact          │
│ facts           │       │ outcome         │       │ mitigation      │
│ decisionsNeeded │       │ decidedBy       │       │ severity        │
│ risksInput      │       │ decidedAt       │       │ status          │
│ situationType   │       │ status          │       │ reviewDate      │
│ emailSubject    │       │ tags            │       │ tags            │
│ emailBody       │       └─────────────────┘       └─────────────────┘
│ slackMessage    │
│ generatedWith   │       ┌─────────────────┐       ┌─────────────────┐
│ tokensUsed      │       │   UsageLog      │       │ MarketingLead   │
│ wasCopied       │       │─────────────────│       │─────────────────│
│ wasSent         │       │ organizationId  │       │ email           │
└─────────────────┘       │ userId          │       │ source          │
                          │ action          │       │ newsletter      │
                          │ tokensUsed      │       │ capturedAt      │
                          │ modelUsed       │       │ convertedAt     │
                          │ metadata        │       │ userId          │
                          └─────────────────┘       └─────────────────┘
```

### 4.2 Schéma Prisma détaillé

#### 4.2.1 Enums

```prisma
enum Plan {
  TRIAL
  TEAM
  AGENCY
}

enum Role {
  OWNER
  ADMIN
  MEMBER
}

enum SituationType {
  NORMAL
  VALIDATION
  RISK
  DELAY
  ARBITRAGE
  PRE_COPIL
}

enum DecisionStatus {
  PENDING
  DECIDED
  CANCELLED
}

enum RiskSeverity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum RiskStatus {
  OPEN
  MONITORING
  MITIGATED
  RESOLVED
  CANCELLED
}
```

#### 4.2.2 Models

**Organization**

```prisma
model Organization {
  id                     String    @id @default(cuid())
  name                   String
  plan                   Plan      @default(TRIAL)
  seats                  Int       @default(5)
  trialEndsAt            DateTime?
  trialGenerations       Int       @default(0)
  maxProjects            Int       @default(1)
  maxDecisionsPerProject Int       @default(10)
  maxRisksPerProject     Int       @default(10)
  stripeCustomerId       String?   @unique
  stripeSubscriptionId   String?   @unique
  stripePriceId          String?
  stripeCurrentPeriodEnd DateTime?
  billingEmail           String?
  cancelAtPeriodEnd      Boolean   @default(false)
  createdAt              DateTime  @default(now())
  updatedAt              DateTime  @updatedAt

  users    User[]
  projects Project[]
  settings OrganizationSettings?

  @@index([plan])
  @@index([stripeCustomerId])
  @@index([stripeSubscriptionId])
}
```

**User**

```prisma
model User {
  id             String       @id @default(cuid())
  email          String       @unique
  clerkId        String       @unique
  name           String?
  organizationId String
  role           Role         @default(MEMBER)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  organization    Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  createdProjects Project[]    @relation("ProjectCreator")
  updates         Update[]

  @@index([organizationId])
  @@index([clerkId])
}
```

**Project**

```prisma
model Project {
  id              String   @id @default(cuid())
  name            String
  description     String?  @db.Text
  organizationId  String
  createdById     String
  masterProfileId String
  objectives      String[] // ["rassurer", "validation", "COPIL", "arbitrage"]
  sponsorName     String?
  sponsorRole     String?
  sponsorEmail    String?
  archived        Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  organization  Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  createdBy     User          @relation("ProjectCreator", fields: [createdById], references: [id])
  masterProfile MasterProfile @relation(fields: [masterProfileId], references: [id])
  updates       Update[]
  decisions     Decision[]
  risks         Risk[]

  @@index([organizationId, archived])
  @@index([createdById])
}
```

**MasterProfile**

```prisma
model MasterProfile {
  id             String   @id @default(cuid())
  name           String
  slug           String   @unique
  description    String   @db.Text
  tone           String
  constraints    String[]
  vocabulary     Json     // { avoid: string[], prefer: string[] }
  isCustom       Boolean  @default(false)
  organizationId String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  projects Project[]

  @@index([slug])
  @@index([isCustom])
}
```

**Update**

```prisma
model Update {
  id               String        @id @default(cuid())
  projectId        String
  createdById      String
  weekNumber       String        // "S50", "2024-W50"
  year             Int
  facts            Json          // [{ text: string, source?: string }]
  decisionsNeeded  Json          // [{ description: string, deadline?: string }]
  risksInput       Json          // [{ description: string, impact: string, mitigation?: string }]
  rawInput         String?       @db.Text
  situationType    SituationType
  emailSubject     String
  emailBody        String        @db.Text
  slackMessage     String        @db.Text
  generatedWith    String        // "gpt-4o-mini", "claude-3-5-sonnet-20241022"
  tokensUsed       Int?
  generationTimeMs Int?
  wasCopied        Boolean       @default(false)
  wasSent          Boolean       @default(false)
  sentAt           DateTime?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  project            Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  createdBy          User       @relation(fields: [createdById], references: [id])
  extractedDecisions Decision[]
  extractedRisks     Risk[]

  @@unique([projectId, year, weekNumber])
  @@index([projectId, createdAt(sort: Desc)])
  @@index([createdById])
}
```

**Decision**

```prisma
model Decision {
  id          String          @id @default(cuid())
  projectId   String
  updateId    String?
  description String          @db.Text
  context     String?         @db.Text
  outcome     String?         @db.Text
  decidedBy   String?
  decidedAt   DateTime?
  tags        String[]        // ["scope", "tech", "budget", "délai"]
  status      DecisionStatus  @default(PENDING)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  update  Update? @relation(fields: [updateId], references: [id], onDelete: SetNull)

  @@index([projectId, createdAt(sort: Desc)])
  @@index([projectId, status])
  @@index([updateId])
}
```

**Risk**

```prisma
model Risk {
  id           String       @id @default(cuid())
  projectId    String
  updateId     String?
  description  String       @db.Text
  impact       String
  mitigation   String?      @db.Text
  identifiedAt DateTime     @default(now())
  reviewDate   DateTime?
  resolvedAt   DateTime?
  severity     RiskSeverity
  status       RiskStatus   @default(OPEN)
  tags         String[]     // ["legal", "tech", "externe", "interne"]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  update  Update? @relation(fields: [updateId], references: [id], onDelete: SetNull)

  @@index([projectId, status, createdAt(sort: Desc)])
  @@index([projectId, severity])
  @@index([updateId])
}
```

**OrganizationSettings**

```prisma
model OrganizationSettings {
  id                    String   @id @default(cuid())
  organizationId        String   @unique
  dataRetentionDays     Int      @default(365)
  autoRedaction         Boolean  @default(false)
  storeRawInput         Boolean  @default(true)
  customApiKey          String?  @db.Text // Encrypted
  preferredProvider     String   @default("anthropic") // "anthropic" | "openai"
  weeklyReminderEnabled Boolean  @default(true)
  weeklyReminderDay     Int      @default(5) // Friday (0=Sunday)
  weeklyReminderHour    Int      @default(9) // 9 AM
  exportBranding        Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
}
```

**UsageLog**

```prisma
model UsageLog {
  id             String   @id @default(cuid())
  organizationId String
  userId         String?
  action         String   // "generate_update", "export_pdf", "parse_raw"
  tokensUsed     Int?
  modelUsed      String?
  metadata       Json?
  createdAt      DateTime @default(now())

  @@index([organizationId, createdAt(sort: Desc)])
  @@index([userId, createdAt(sort: Desc)])
  @@index([action])
  @@index([organizationId, action, createdAt(sort: Desc)])
}
```

**MarketingLead**

```prisma
model MarketingLead {
  id          String    @id @default(cuid())
  email       String    @unique
  source      String    // "generator", "landing", "blog"
  newsletter  Boolean   @default(false)
  capturedAt  DateTime  @default(now())
  lastSeenAt  DateTime  @default(now())
  convertedAt DateTime?
  userId      String?   @unique
  metadata    Json?

  @@index([source])
  @@index([newsletter])
  @@index([capturedAt(sort: Desc)])
}
```

---

## 5. API & Endpoints

### 5.1 Endpoints publics (sans authentification)

#### POST /api/generate

**Description** : Génère un update sponsor-ready à partir de notes brutes.

**Rate limiting** :

- Anonyme : 1 req/heure/IP
- Authentifié : selon plan (5/10/50 par jour)

**Request** :

```typescript
{
  facts: Array<{ text: string; source?: string }>;        // max 5 (anon), illimité (auth)
  decisionsNeeded: Array<{ description: string; deadline?: string }>;  // max 3 (anon)
  risksInput: Array<{ description: string; impact: string; mitigation?: string }>;  // max 3 (anon)
  masterProfileSlug: "non-tech-confiant" | "micro-manager" | "comite-risque-averse";
  situationType: "NORMAL" | "VALIDATION" | "RISK" | "DELAY" | "ARBITRAGE" | "PRE_COPIL";
  projectId?: string;  // Optionnel, pour sauvegarder
}
```

**Response 200** :

```typescript
{
  emailSubject: string;
  emailBody: string;
  slackMessage: string;
  extractedDecisions: Array<{
    description: string;
    decidedBy?: string;
    tags?: string[];
  }>;
  extractedRisks: Array<{
    description: string;
    impact: string;
    mitigation?: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    tags?: string[];
  }>;
  metadata: {
    generatedWith: string;
    tokensUsed: number;
    generationTimeMs: number;
  }
}
```

**Erreurs** :

| Code | Condition          | Message                    |
| ---- | ------------------ | -------------------------- |
| 400  | Validation échouée | "Invalid input: {details}" |
| 403  | Origin invalide    | "Forbidden"                |
| 403  | Trial expiré       | "Trial expired"            |
| 429  | Rate limit dépassé | "Rate limit exceeded"      |
| 500  | Erreur serveur     | "Internal server error"    |

#### POST /api/marketing/capture-email

**Description** : Capture un email pour la newsletter ou le suivi marketing.

**Request** :

```typescript
{
  email: string; // Email valide
  source: "generator" | "landing" | "blog";
  newsletter: boolean; // Opt-in newsletter
}
```

**Response 200** :

```typescript
{
  success: true;
}
```

#### GET /api/health

**Description** : Vérifie l'état de santé de l'application.

**Response 200** :

```typescript
{
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;  // ISO8601
  version: string;
  checks: {
    database: { status: "pass" | "fail" | "warn"; message: string; latencyMs?: number };
    redis: { status: "pass" | "fail" | "warn"; message: string; latencyMs?: number };
    environment: { status: "pass" | "fail" | "warn"; message: string };
  };
}
```

### 5.2 Endpoints authentifiés

#### POST /api/billing/checkout

**Description** : Crée une session Stripe Checkout pour upgrade.

**Auth** : Clerk JWT + Role OWNER ou ADMIN

**Request** :

```typescript
{
  plan: "TEAM" | "AGENCY";
}
```

**Response 200** :

```typescript
{
  sessionId: string;
  url: string; // URL Stripe Checkout
}
```

**Erreurs** :

| Code | Condition        | Message                                   |
| ---- | ---------------- | ----------------------------------------- |
| 401  | Non authentifié  | "Unauthorized"                            |
| 403  | Role insuffisant | "Forbidden: requires OWNER or ADMIN role" |
| 400  | Déjà payant      | "Organization already has a paid plan"    |

#### POST /api/billing/verify

**Description** : Vérifie et synchronise le statut de paiement après checkout.

**Auth** : Clerk JWT

**Request** :

```typescript
{
  sessionId: string; // ID session Stripe
}
```

**Response 200** :

```typescript
{
  success: boolean;
  plan?: "TEAM" | "AGENCY";
  paymentStatus?: string;
  error?: string;
}
```

#### POST /api/billing/portal

**Description** : Génère une URL vers le portail client Stripe.

**Auth** : Clerk JWT + Role OWNER ou ADMIN

**Response 200** :

```typescript
{
  url: string; // URL portail Stripe
}
```

### 5.3 Webhooks

#### POST /api/webhooks/clerk

**Signature** : Svix HMAC-SHA256

**Events gérés** :

| Event                            | Action                                      |
| -------------------------------- | ------------------------------------------- |
| `user.created`                   | Crée Organization + User en TRIAL (7 jours) |
| `user.updated`                   | Met à jour email/name                       |
| `user.deleted`                   | Supprime User (cascade)                     |
| `organization.created`           | Crée Organization en TRIAL                  |
| `organization.updated`           | Met à jour nom                              |
| `organization.deleted`           | Supprime Organization (cascade)             |
| `organizationMembership.created` | Ajoute User à Organization                  |
| `organizationMembership.updated` | Met à jour role                             |
| `organizationMembership.deleted` | Retire User de Organization                 |

#### POST /api/webhooks/stripe

**Signature** : Stripe HMAC-SHA256

**Events gérés** :

| Event                           | Action                                      |
| ------------------------------- | ------------------------------------------- |
| `checkout.session.completed`    | Upgrade vers TEAM/AGENCY, applique limites  |
| `customer.subscription.updated` | Met à jour plan/period, synchronise limites |
| `customer.subscription.deleted` | Downgrade vers TRIAL, expire trial          |
| `invoice.payment_failed`        | Set cancelAtPeriodEnd=true, alerte          |

### 5.4 Jobs planifiés (Cron)

**Authentification** : Header `Authorization: Bearer {CRON_SECRET}`

#### GET /api/cron/weekly-reminders

**Fréquence** : Chaque heure (vérifie si vendredi 9h UTC)

**Max duration** : 60 secondes

**Actions** :

1. Récupère les orgs TEAM/AGENCY avec reminder activé
2. Vérifie jour et heure configurés
3. Envoie email HTML via Resend
4. Log événement

#### GET /api/cron/data-purge

**Fréquence** : Dimanche 3h UTC

**Max duration** : 300 secondes (5 min)

**Actions** :

1. Supprime Updates > dataRetentionDays
2. Supprime Decisions DECIDED/CANCELLED > dataRetentionDays
3. Supprime Risks RESOLVED/CANCELLED > dataRetentionDays
4. Supprime UsageLogs > dataRetentionDays

#### GET /api/cron/reconcile-subscriptions

**Fréquence** : Toutes les heures

**Max duration** : 120 secondes (2 min)

**Actions** :

1. Récupère toutes les orgs avec stripeSubscriptionId
2. Vérifie statut dans Stripe
3. Corrige les incohérences (plan, period, price)
4. Reset orgs orphelines vers TRIAL
5. Alerte sur problèmes significatifs

### 5.5 tRPC Router

**Endpoint** : `/api/trpc`

**Routers disponibles** :

| Router      | Procédures                                 | Auth     |
| ----------- | ------------------------------------------ | -------- |
| `projects`  | list, get, create, update, delete, archive | Required |
| `updates`   | list, get, create, delete, export          | Required |
| `decisions` | list, search, update                       | Required |
| `risks`     | list, search, update                       | Required |
| `search`    | global                                     | Required |
| `billing`   | getStatus, getUsage                        | Required |
| `settings`  | get, update                                | Required |

---

## 6. Intégrations externes

### 6.1 Clerk (Authentification)

**Rôle** : Gestion des utilisateurs, organisations et sessions.

**Configuration** :

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

**Fonctionnalités utilisées** :

- Sign-up / Sign-in (email + social)
- Organizations (multi-tenant)
- Webhooks (sync DB)
- JWT validation (server-side)

**Mapping roles** :
| Clerk Role | Ascendos Role |
|------------|---------------|
| org:admin | OWNER |
| org:member | MEMBER |
| - | ADMIN (custom) |

### 6.2 Stripe (Paiements)

**Rôle** : Gestion des abonnements et facturation.

**Configuration** :

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_TEAM_PRICE_ID=price_...
STRIPE_AGENCY_PRICE_ID=price_...
```

**API Version** : 2025-02-24.acacia

**Produits** :

| Produit | Price ID               | Montant | Récurrence |
| ------- | ---------------------- | ------- | ---------- |
| Team    | STRIPE_TEAM_PRICE_ID   | 89€     | /mois      |
| Agency  | STRIPE_AGENCY_PRICE_ID | 169€    | /mois      |

**Flux** :

1. Checkout Session → Redirection Stripe
2. Payment → Webhook checkout.session.completed
3. Subscription → Webhooks update/delete
4. Portal → Gestion autonome par client

### 6.3 OpenAI / Anthropic (LLM)

**Rôle** : Génération des updates et extraction décisions/risques.

**Configuration** :

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

**Modèles** :

| Provider  | Modèle                     | Usage                    |
| --------- | -------------------------- | ------------------------ |
| OpenAI    | gpt-4o-mini                | Génération (primary)     |
| Anthropic | claude-3-5-sonnet-20241022 | Génération (fallback)    |
| Anthropic | claude-3-5-haiku-20241022  | Parsing (cost-efficient) |

**Paramètres** :

- Temperature : 0.7
- Max tokens : 2000 (auth), 500 (anon)
- Response format : JSON

**Fallback** :

1. Essaie provider préféré (org settings)
2. Si échec → bascule sur l'autre provider
3. Si double échec → erreur 500

### 6.4 Upstash Redis (Rate Limiting)

**Rôle** : Stockage des compteurs de rate limit.

**Configuration** :

```env
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=AX...
```

**Clés** :

| Pattern                             | TTL        | Description                 |
| ----------------------------------- | ---------- | --------------------------- |
| `rate_limit:anonymous:{ip}:{hour}`  | 3600s      | Compteur anonyme            |
| `rate_limit:trial:{orgId}:total`    | None       | Compteur trial (persistant) |
| `rate_limit:team:{userId}:{date}`   | → midnight | Compteur daily Team         |
| `rate_limit:agency:{userId}:{date}` | → midnight | Compteur daily Agency       |
| `rate_limit:blocked:{ip}`           | 86400s     | IP bloquées                 |

### 6.5 Resend (Email)

**Rôle** : Envoi des emails transactionnels.

**Configuration** :

```env
RESEND_API_KEY=re_...
```

**Templates** :

- Weekly reminder (HTML)
- Trial expiring (HTML)
- Payment failed (HTML)

### 6.6 Sentry (Error Tracking) - Optionnel

**Configuration** :

```env
SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_SENTRY_DSN=${SENTRY_DSN}
SENTRY_ORG=your-org
SENTRY_PROJECT=ascendos
SENTRY_AUTH_TOKEN=sntrys_...
```

### 6.7 PostHog (Analytics) - Optionnel

**Configuration** :

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

---

## 7. Sécurité & Conformité

### 7.1 Authentification & Autorisation

#### Authentification

**Provider** : Clerk

**Méthodes** :

- Email + mot de passe
- OAuth (Google, GitHub)
- Magic link

**Validation** :

- JWT signé par Clerk
- Validation server-side via `@clerk/nextjs/server`
- Claims : userId, organizationId, role

#### Autorisation

**Modèle** : RBAC (Role-Based Access Control)

**Rôles** :

| Rôle   | Permissions                               |
| ------ | ----------------------------------------- |
| OWNER  | Tout (billing, settings, users, projects) |
| ADMIN  | Settings, users, projects                 |
| MEMBER | Projects uniquement                       |

**Isolation** :

- Multi-tenant par organizationId
- Toutes les requêtes filtrées par organizationId
- Impossible d'accéder aux données d'une autre org

### 7.2 Protection des endpoints

#### CORS & Origin

**Production** :

- Validation du header `Origin`
- Validation du header `Referer`
- Comparaison contre `NEXT_PUBLIC_APP_URL`
- Rejet si mismatch (403)

**Développement** :

- Validation désactivée (localhost)

#### Rate Limiting

**Stratégie** : Token bucket via Redis

**Comportement** :

- FAIL_CLOSED : si Redis indisponible → blocage
- Headers de réponse : `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Alerte après 5+ violations par IP

#### Input Validation

**Librairie** : Zod

**Règles** :

- Tous les inputs validés côté serveur
- Types stricts (pas de `any`)
- Limites de longueur explicites
- Sanitization des strings

### 7.3 Protection contre les injections

#### Prompt Injection

**Mesures** :

- Détection de patterns suspects
- Logging des tentatives
- Possibilité de blocage

**Patterns détectés** :

- "ignore previous instructions"
- "system prompt"
- Caractères de contrôle
- Encodages suspects

#### SQL Injection

**Mesures** :

- Prisma ORM (queries paramétrées)
- Pas de raw SQL

#### XSS

**Mesures** :

- React (échappement automatique)
- CSP headers
- Pas de `dangerouslySetInnerHTML`

### 7.4 Données sensibles

#### PII Redaction

**Patterns masqués** :

| Type           | Pattern                  | Remplacement |
| -------------- | ------------------------ | ------------ |
| Email          | `\S+@\S+\.\S+`           | `[EMAIL]`    |
| Téléphone      | `(\+33\|0)[0-9]{9}`      | `[PHONE]`    |
| NIR (Sécu)     | `[12][0-9]{12}`          | `[SSN]`      |
| IBAN           | `FR[0-9]{2}[A-Z0-9]{23}` | `[IBAN]`     |
| Carte bancaire | `[0-9]{16}`              | `[CARD]`     |

**Application** :

- Logs (toujours)
- Prompts LLM (si autoRedaction activé)
- Exports (optionnel)

#### Chiffrement

| Donnée          | Au repos               | En transit |
| --------------- | ---------------------- | ---------- |
| Base de données | PostgreSQL encryption  | TLS 1.3    |
| Secrets         | Env vars (non stockés) | HTTPS      |
| customApiKey    | Chiffrement applicatif | HTTPS      |

### 7.5 Conformité RGPD

#### Principes appliqués

| Principe             | Implémentation                                   |
| -------------------- | ------------------------------------------------ |
| Minimisation         | Seules les données nécessaires sont collectées   |
| Limitation durée     | Purge automatique configurable (365j par défaut) |
| Droit d'accès        | Export des données utilisateur                   |
| Droit de suppression | Cascade delete sur User                          |
| Portabilité          | Export JSON/PDF disponible                       |
| Consentement         | Opt-in explicite newsletter                      |

#### Data Retention

**Défaut** : 365 jours

**Configurable** : OrganizationSettings.dataRetentionDays

**Purge automatique** (cron weekly) :

- Updates > retention
- Decisions (DECIDED/CANCELLED) > retention
- Risks (RESOLVED/CANCELLED) > retention
- UsageLogs > retention

#### DPA (Data Processing Agreement)

**Disponibilité** : Page dédiée /legal/dpa

**Contenu** :

- Sous-traitants (Clerk, Stripe, Vercel, Neon, OpenAI, Anthropic)
- Mesures techniques
- Procédures de notification

### 7.6 Webhooks Security

| Service | Méthode              | Secret                |
| ------- | -------------------- | --------------------- |
| Clerk   | Svix HMAC-SHA256     | CLERK_WEBHOOK_SECRET  |
| Stripe  | Stripe SDK signature | STRIPE_WEBHOOK_SECRET |
| Cron    | Bearer token         | CRON_SECRET           |

### 7.7 Secrets Management

**Environnement** :

- Variables d'environnement uniquement
- Jamais commitées dans le repo
- Rotation possible sans redéploiement

**Liste des secrets** :

| Secret            | Usage          | Rotation              |
| ----------------- | -------------- | --------------------- |
| DATABASE_URL      | Connexion BDD  | Manuelle              |
| CLERK_SECRET_KEY  | Auth server    | Via Clerk dashboard   |
| STRIPE_SECRET_KEY | API Stripe     | Via Stripe dashboard  |
| OPENAI_API_KEY    | API OpenAI     | Via OpenAI dashboard  |
| ANTHROPIC_API_KEY | API Anthropic  | Via Anthropic console |
| CRON_SECRET       | Jobs planifiés | Manuelle (32+ chars)  |
| RESEND_API_KEY    | Emails         | Via Resend dashboard  |

---

## 8. Business model

### 8.1 Pricing

#### Plans

| Plan   | Prix    | Facturation | Cible                    |
| ------ | ------- | ----------- | ------------------------ |
| TRIAL  | Gratuit | -           | Découverte               |
| TEAM   | 89€ HT  | Mensuel     | PM solo ou petite équipe |
| AGENCY | 169€ HT | Mensuel     | Agence multi-projets     |

#### Limites par plan

| Feature          | TRIAL   | TEAM         | AGENCY       |
| ---------------- | ------- | ------------ | ------------ |
| Durée            | 7 jours | Illimité     | Illimité     |
| Générations      | 5 total | 10/jour/user | 50/jour/user |
| Projets          | 1       | 10           | Illimité     |
| Décisions/projet | 10      | 100          | Illimité     |
| Risques/projet   | 10      | 100          | Illimité     |
| Utilisateurs     | 1       | 5            | 15           |
| Historique       | 7 jours | 12 mois      | 24 mois      |
| Support          | -       | Email        | Prioritaire  |
| Export PDF       | -       | ✓            | ✓            |
| Dossier 1 page   | -       | ✓            | ✓            |

### 8.2 Conversion funnel

```
Visiteur ──▶ Générateur gratuit ──▶ Email capture ──▶ Signup ──▶ Trial ──▶ Payant
  100%           40%                   15%              10%        8%       2-3%
```

**Métriques cibles** :

| Étape                 | Taux   | Objectif                |
| --------------------- | ------ | ----------------------- |
| Visit → Generate      | 40%    | Réduire friction        |
| Generate → Email      | 15%    | Améliorer valeur perçue |
| Email → Signup        | 65%    | Nurturing email         |
| Signup → Trial active | 80%    | Onboarding              |
| Trial → Paid          | 15-20% | Démontrer ROI           |

### 8.3 Métriques business

#### North Star

**Métrique** : Nombre de projets actifs avec 2+ générations consécutives (rituel installé)

#### Métriques primaires

| Métrique               | Définition                  | Cible 6 mois |
| ---------------------- | --------------------------- | ------------ |
| MRR                    | Revenu mensuel récurrent    | 2 000€       |
| Organisations payantes | Orgs TEAM ou AGENCY actives | 20           |
| Organisations actives  | 2+ gen/semaine              | 100          |

#### Métriques secondaires

| Métrique       | Définition                  | Cible  |
| -------------- | --------------------------- | ------ |
| Activation     | % users 2 sem consécutives  | > 40%  |
| Output quality | % outputs copiés "tel quel" | > 60%  |
| Trial → Paid   | Conversion trial            | 15-20% |
| Churn mensuel  | % orgs qui annulent         | < 8%   |
| ARPA           | Revenu moyen par org        | 100€   |

### 8.4 Cycle de vie client

```
ACQUISITION ──▶ ACTIVATION ──▶ RÉTENTION ──▶ EXPANSION ──▶ REFERRAL
(gratuit)       (trial)        (payant)      (upgrade)     (bouche-à-oreille)
```

**Triggers de conversion** :

- Trial : 5 générations épuisées
- TEAM → AGENCY : 10 projets atteints ou >5 users

**Triggers de churn** :

- Pas de génération depuis 30 jours
- Payment failed
- Projet client terminé (saisonnier)

### 8.5 Coûts variables

| Poste           | Coût estimé  | Par         |
| --------------- | ------------ | ----------- |
| LLM (OpenAI)    | ~0.01€       | génération  |
| LLM (Anthropic) | ~0.015€      | génération  |
| Stripe          | 1.4% + 0.25€ | transaction |
| Clerk           | Gratuit      | <10k MAU    |
| Email (Resend)  | ~0.001€      | email       |

**Marge brute estimée** : ~85-90%

---

## 9. UX/UI

### 9.1 Design System

#### Couleurs

| Token      | Valeur                | Usage            |
| ---------- | --------------------- | ---------------- |
| Primary    | `#2563eb` (blue-600)  | CTAs, liens      |
| Secondary  | `#64748b` (slate-500) | Texte secondaire |
| Success    | `#22c55e` (green-500) | Confirmations    |
| Warning    | `#f59e0b` (amber-500) | Alertes          |
| Error      | `#ef4444` (red-500)   | Erreurs          |
| Background | `#ffffff`             | Fond principal   |
| Surface    | `#f8fafc` (slate-50)  | Cards, panels    |

#### Typographie

| Style | Font           | Size | Weight |
| ----- | -------------- | ---- | ------ |
| H1    | Inter          | 36px | 700    |
| H2    | Inter          | 30px | 600    |
| H3    | Inter          | 24px | 600    |
| Body  | Inter          | 16px | 400    |
| Small | Inter          | 14px | 400    |
| Code  | JetBrains Mono | 14px | 400    |

#### Composants (shadcn/ui)

| Composant | Usage                   |
| --------- | ----------------------- |
| Button    | CTAs, actions           |
| Card      | Containers              |
| Dialog    | Modals                  |
| Form      | Inputs structurés       |
| Table     | Listes données          |
| Toast     | Notifications           |
| Tabs      | Navigation contextuelle |
| Select    | Dropdowns               |
| Badge     | Tags, statuts           |

### 9.2 Pages principales

#### Landing Page (/)

```
┌─────────────────────────────────────────────────────────────┐
│  Logo                              Login    Essayer gratuit │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HERO: "Updates sponsor-ready en 2 minutes"                 │
│  Subtitle + CTA "Essayer gratuitement"                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  PROBLÈME: Temps perdu + risque politique                   │
├─────────────────────────────────────────────────────────────┤
│  SOLUTION: 3 colonnes (Temps / Sérénité / Assurance)        │
├─────────────────────────────────────────────────────────────┤
│  DÉMO: Générateur interactif (preview)                      │
├─────────────────────────────────────────────────────────────┤
│  PRICING: 3 cards (Trial / Team / Agency)                   │
├─────────────────────────────────────────────────────────────┤
│  FOOTER: Links, legal, contact                              │
└─────────────────────────────────────────────────────────────┘
```

#### Générateur (/generator)

```
┌─────────────────────────────────────────────────────────────┐
│  ← Retour                                    [Plan: Trial]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Non-tech    │  │ Micro-      │  │ Comité      │         │
│  │ confiant    │  │ manager     │  │ risque      │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ FAITS DE LA SEMAINE                                 │   │
│  │ + Ajouter un fait                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ DÉCISIONS ATTENDUES                                 │   │
│  │ + Ajouter une décision                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ RISQUES IDENTIFIÉS                                  │   │
│  │ + Ajouter un risque                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Situation: [Normal ▼]                                      │
│                                                             │
│  [        GÉNÉRER L'UPDATE        ]                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Dashboard (/dashboard)

```
┌─────────────────────────────────────────────────────────────┐
│  Logo     Projets  Décisions  Risques  Settings     Avatar  │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│  SIDEBAR │  MAIN CONTENT                                    │
│          │                                                  │
│  Projets │  [Projet sélectionné]                           │
│  ────────│                                                  │
│  > Proj1 │  Tabs: Updates | Décisions | Risques | Export   │
│    Proj2 │                                                  │
│    Proj3 │  ┌────────────────────────────────────────────┐ │
│          │  │ Historique des updates                     │ │
│  + Créer │  │                                            │ │
│          │  │ S50 - 13 déc 2024 - VALIDATION             │ │
│          │  │ S49 - 06 déc 2024 - NORMAL                 │ │
│          │  │ ...                                        │ │
│          │  └────────────────────────────────────────────┘ │
│          │                                                  │
│          │  [+ Nouvel update]                              │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

### 9.3 Responsive Design

| Breakpoint | Width      | Layout                      |
| ---------- | ---------- | --------------------------- |
| Mobile     | < 640px    | Stack vertical, menu burger |
| Tablet     | 640-1024px | Sidebar collapsible         |
| Desktop    | > 1024px   | Full layout                 |

### 9.4 Accessibilité

**Conformité** : WCAG 2.1 AA

**Mesures** :

- Contraste minimum 4.5:1
- Focus visible (outline)
- Navigation clavier
- Labels sur tous les inputs
- Alt text sur images
- ARIA labels sur composants interactifs

---

## 10. Infrastructure & Déploiement

### 10.1 Architecture de déploiement

```
                    ┌─────────────┐
                    │   Vercel    │
                    │   (Edge)    │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │   Neon      │  │   Upstash   │  │   Resend    │
   │ PostgreSQL  │  │   Redis     │  │   Email     │
   └─────────────┘  └─────────────┘  └─────────────┘
          │
          │ (EU region)
          ▼
   ┌─────────────┐
   │   OpenAI    │
   │  Anthropic  │
   └─────────────┘
```

### 10.2 Environnements

| Env         | URL            | Base        | Usage     |
| ----------- | -------------- | ----------- | --------- |
| Development | localhost:3000 | Local       | Dev local |
| Preview     | \*.vercel.app  | Neon branch | Review PR |
| Production  | ascendos.com   | Neon main   | Prod      |

### 10.3 Variables d'environnement

#### Requises (App)

```env
# Database
DATABASE_URL=postgresql://user:password@host/db?sslmode=require

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...

# LLM
OPENAI_API_KEY=sk-...
```

#### Requises (Production)

```env
# Payments (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_TEAM_PRICE_ID=price_...
STRIPE_AGENCY_PRICE_ID=price_...

# Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=AX...

# Cron Jobs
CRON_SECRET=<32+ random chars>

# Email
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=https://ascendos.com
```

#### Optionnelles

```env
# LLM fallback
ANTHROPIC_API_KEY=sk-ant-...

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ORG=your-org
SENTRY_PROJECT=ascendos

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com

# Alerts
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
ALERT_EMAIL_TO=alerts@yourdomain.com

# Debug
LOG_LEVEL=info
```

### 10.4 CI/CD Pipeline

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   Push   │───▶│  Lint    │───▶│  Test    │───▶│  Build   │
│   (PR)   │    │  (ESLint)│    │  (Vitest)│    │  (Next)  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                      │
                                                      ▼
                                               ┌──────────┐
                                               │  Deploy  │
                                               │ (Vercel) │
                                               └──────────┘
```

**Étapes** :

1. **Lint** : ESLint + Prettier
2. **Type check** : TypeScript strict
3. **Test** : Vitest (unit + integration)
4. **Build** : Next.js production build
5. **Deploy** : Vercel automatic

### 10.5 Database Migrations

**Outil** : Prisma Migrate

**Workflow** :

```bash
# Développement
pnpm prisma migrate dev --name <migration_name>

# Production
pnpm prisma migrate deploy
```

**Best practices** :

- Toujours backward compatible
- Split destructive changes
- Test sur preview avant prod

### 10.6 Backup & Recovery

**Database** :

- Neon : Point-in-time recovery (7 jours)
- Backup quotidien automatique

**Code** :

- Git (GitHub)
- Vercel deployments (rollback 1-click)

---

## 11. Monitoring & Observabilité

### 11.1 Logging

**Format** : JSON structuré

**Niveaux** :

| Level | Usage                    |
| ----- | ------------------------ |
| trace | Debug détaillé           |
| debug | Info développeur         |
| info  | Événements normaux       |
| warn  | Anomalies non-bloquantes |
| error | Erreurs récupérables     |
| fatal | Erreurs critiques        |

**Événements loggés** :

| Event                 | Level | Données              |
| --------------------- | ----- | -------------------- |
| anonymous_generation  | info  | ip_prefix, remaining |
| generation_completed  | info  | tokens, time, model  |
| subscription_upgraded | info  | plan, source         |
| payment_failed        | warn  | org_id, amount       |
| rate_limit_exceeded   | warn  | ip, type             |
| webhook_error         | error | service, event       |

### 11.2 Alerting

**Système** : AlertSystem custom

**Canaux** :

| Canal   | Niveaux  | Config              |
| ------- | -------- | ------------------- |
| Console | Tous     | Toujours actif      |
| Slack   | warning+ | SLACK_WEBHOOK_URL   |
| Discord | warning+ | DISCORD_WEBHOOK_URL |
| Email   | critical | ALERT_EMAIL_TO      |

**Types d'alertes** :

| Alerte                  | Niveau           | Trigger                   |
| ----------------------- | ---------------- | ------------------------- |
| rateLimitAlert          | warning/critical | IP bloquée 5+/10+ fois    |
| unauthorizedAccessAlert | warning          | Origin/Referer invalide   |
| promptInjectionAlert    | critical         | Pattern suspect détecté   |
| paymentFailedAlert      | warning          | Échec paiement Stripe     |
| stripeWebhookErrorAlert | critical         | Erreur traitement webhook |
| clerkWebhookErrorAlert  | critical         | Erreur traitement webhook |
| cronJobErrorAlert       | critical         | Job planifié échoué       |

### 11.3 Métriques applicatives

**Collecte** : UsageLog table

| Métrique         | Requête                                               |
| ---------------- | ----------------------------------------------------- |
| Générations/jour | COUNT(action='generate_update' AND createdAt > today) |
| Tokens consommés | SUM(tokensUsed WHERE createdAt > period)              |
| Users actifs     | COUNT(DISTINCT userId WHERE createdAt > 7 days)       |
| Exports réalisés | COUNT(action='export_pdf')                            |

### 11.4 Health Checks

**Endpoint** : GET /api/health

**Checks** :

| Service     | Méthode   | Timeout |
| ----------- | --------- | ------- |
| Database    | SELECT 1  | 5s      |
| Redis       | PING      | 3s      |
| Environment | Var check | -       |

**Statuts** :

| Status    | Condition            |
| --------- | -------------------- |
| healthy   | Tous les checks pass |
| degraded  | Au moins un warn     |
| unhealthy | Au moins un fail     |

---

## 12. Glossaire

| Terme                     | Définition                                                    |
| ------------------------- | ------------------------------------------------------------- |
| **COPIL**                 | Comité de pilotage - réunion périodique avec le sponsor       |
| **Dossier de continuité** | Export consolidant historique décisions/risques d'un projet   |
| **ICP**                   | Ideal Customer Profile - profil client idéal                  |
| **JTBD**                  | Job To Be Done - tâche que le client cherche à accomplir      |
| **Maître**                | Le sponsor/décideur à qui s'adresse l'update                  |
| **MRR**                   | Monthly Recurring Revenue - revenu mensuel récurrent          |
| **MVP**                   | Minimum Viable Product - produit minimum viable               |
| **North Star**            | Métrique principale guidant les décisions produit             |
| **PM**                    | Project Manager - chef de projet                              |
| **Profil Maître**         | Configuration qui détermine ton et contraintes de l'output    |
| **Rate limiting**         | Limitation du nombre de requêtes par période                  |
| **Renewal**               | Renouvellement de contrat client                              |
| **Retainer**              | Contrat récurrent (mensuel/annuel)                            |
| **RGPD**                  | Règlement Général sur la Protection des Données               |
| **SaaS**                  | Software as a Service                                         |
| **Sponsor**               | Le client/décideur côté entreprise                            |
| **Template situation**    | Structure prédéfinie selon le contexte (normal, risque, etc.) |
| **Trial**                 | Période d'essai gratuite                                      |
| **Update**                | Communication hebdomadaire générée vers le sponsor            |
| **Wedge**                 | Point d'entrée gratuit pour acquérir des utilisateurs         |

---

## Historique des versions

| Version | Date       | Auteur | Changements                               |
| ------- | ---------- | ------ | ----------------------------------------- |
| 0.5     | 29/12/2024 | -      | Version initiale alignée avec vision v0.5 |

---

_Ce document est la référence unique du projet Ascendos. Toute modification majeure doit être reflétée ici._
