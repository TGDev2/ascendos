# Setup Ascendos - Phase 0 Complétée ✅

## Résumé

La Phase 0 (Setup infrastructure) est terminée! Le monorepo Turborepo est initialisé avec toute la structure de base.

## Ce qui a été créé

### Structure du monorepo

```
ascendos/
├── apps/
│   └── web/                    # Application Next.js 15
│       ├── src/
│       │   ├── app/           # App Router
│       │   └── lib/           # Utilitaires
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       └── package.json
│
├── packages/
│   ├── database/              # Prisma + PostgreSQL
│   │   ├── prisma/
│   │   │   ├── schema.prisma  # Schéma complet (8 modèles)
│   │   │   └── seed.ts        # 3 MasterProfiles presets
│   │   └── src/
│   │       └── client.ts      # Prisma client singleton
│   │
│   ├── ai/                    # Logique LLM (placeholders)
│   │   └── src/
│   │       ├── providers/     # Anthropic + OpenAI
│   │       └── prompts/       # generate-update, parse, extract
│   │
│   ├── templates/             # MasterProfiles + Situations
│   │   └── src/
│   │       ├── master-profiles/ # 3 presets définis
│   │       └── situations/      # 6 SituationTypes
│   │
│   ├── validators/            # Schémas Zod
│   │   └── src/
│   │       ├── project.ts
│   │       ├── update.ts
│   │       ├── decision.ts
│   │       └── risk.ts
│   │
│   └── config/                # Configurations partagées
│       └── typescript/        # tsconfig base & nextjs
│
├── turbo.json                 # Configuration Turborepo
├── package.json               # Workspace root
├── pnpm-workspace.yaml        # pnpm workspaces
├── .gitignore
├── .env.example              # Variables d'environnement
└── README.md
```

### Modèle de données Prisma

8 modèles créés:
- `Organization` (plan: TRIAL/TEAM/AGENCY)
- `User` (avec roles)
- `Project` (avec MasterProfile)
- `Update` (updates hebdomadaires)
- `Decision` (log décisions)
- `Risk` (registre risques)
- `MasterProfile` (profils sponsors)
- `OrganizationSettings` (RGPD, LLM, notifications)
- `UsageLog` (tracking)

### MasterProfiles presets

3 profils créés dans le seed:
1. **Non-tech confiant** - Max 250 mots, pas de jargon, ton rassurant
2. **Micro-manager** - Max 350 mots, dates précises, métriques
3. **Comité risque-averse** - Max 400 mots, structure Faits→Risques→Options

### SituationTypes templates

6 templates définis (enum Prisma):
1. `NORMAL` - Semaine normale, continuité
2. `VALIDATION` - Validation attendue, call-to-action
3. `RISK` - Risque identifié, plan de mitigation
4. `DELAY` - Retard, options de rattrapage
5. `ARBITRAGE` - Arbitrage scope/budget, options A/B/C
6. `PRE_COPIL` - Préparation COPIL, résumé exécutif

### Dépendances installées

617 packages installés, incluant:
- Next.js 15.1.4
- Prisma 6.19.1
- @clerk/nextjs 6.36.3
- @tanstack/react-query
- @trpc/server & @trpc/client
- Vercel AI SDK + Anthropic + OpenAI
- Tailwind CSS + shadcn/ui
- Zod pour validation

## Prochaines étapes

### Avant de commencer le développement

1. **Créer une base de données PostgreSQL**

   Option A - Neon (recommandé):
   ```bash
   # 1. Créer compte sur https://neon.tech
   # 2. Créer nouveau projet (région: Frankfurt EU)
   # 3. Copier la connection string
   ```

   Option B - Supabase:
   ```bash
   # 1. Créer compte sur https://supabase.com
   # 2. Créer nouveau projet (région: Frankfurt)
   # 3. Copier la connection string
   ```

   Option C - Local:
   ```bash
   # Installer PostgreSQL localement
   # Connection string: postgresql://user:password@localhost:5432/ascendos
   ```

2. **Configurer les variables d'environnement**

   ```bash
   # Copier .env.example
   cp .env.example .env.local

   # Éditer .env.local et remplir au minimum:
   DATABASE_URL="postgresql://..."  # Connection string de votre DB
   ```

3. **Initialiser la base de données**

   ```bash
   cd packages/database

   # Pousser le schéma (dev)
   pnpm db:push

   # OU créer une migration (production)
   pnpm db:migrate

   # Seed les MasterProfiles
   pnpm db:seed
   ```

4. **Lancer le serveur de développement**

   ```bash
   # Retour à la racine
   cd ../..

   # Lancer Next.js
   pnpm dev
   ```

   L'app sera disponible sur [http://localhost:3000](http://localhost:3000)

### Phase 1 - Générateur gratuit (Semaine 2)

La prochaine phase consiste à créer le générateur d'updates sans authentification.

Tâches Phase 1:
- [ ] Page `/generator` publique
- [ ] Formulaire structuré (Faits / Décisions / Risques)
- [ ] Option "Coller texte brut" avec parsing LLM
- [ ] Sélecteur MasterProfile + SituationType
- [ ] API route `/api/generate` (génération LLM)
- [ ] Preview email + Slack avec copy-to-clipboard
- [ ] CTA "Sauvegarder → Sign up"

Pour commencer Phase 1, vous aurez besoin de:
- Une clé API Anthropic: https://console.anthropic.com
- (Optionnel) Une clé API OpenAI: https://platform.openai.com

## Commandes utiles

```bash
# Développement
pnpm dev              # Lancer Next.js en dev
pnpm build            # Build production
pnpm lint             # Linter
pnpm type-check       # TypeScript check

# Database (depuis packages/database/)
pnpm db:generate      # Générer Prisma client
pnpm db:push          # Push schema sans migration
pnpm db:migrate       # Créer migration
pnpm db:studio        # Prisma Studio (GUI)
pnpm db:seed          # Seed la DB

# Workspace
pnpm clean            # Nettoyer node_modules
```

## Vérification de la configuration

Pour vérifier que tout fonctionne:

```bash
# 1. Vérifier que les dépendances sont installées
pnpm type-check       # Doit passer sans erreur

# 2. Vérifier le client Prisma
cd packages/database
pnpm db:generate      # Doit générer sans erreur

# 3. Lancer Next.js
cd ../..
pnpm dev              # Doit démarrer sur localhost:3000
```

## État du projet

✅ **Phase 0 complétée** (Semaine 1)
- Monorepo Turborepo
- Next.js 15 + TypeScript + Tailwind
- Prisma avec schéma complet
- 3 MasterProfiles + 6 SituationTypes
- Dépendances installées

⏭️ **Phase 1 à venir** (Semaine 2)
- Générateur gratuit (wedge)
- Intégration LLM
- Preview outputs

## Documentation

- Plan complet: `.claude/plans/polymorphic-imagining-piglet.md`
- Vision produit: `vision.md`
- README: `README.md`

## Support

Pour toute question ou problème:
1. Vérifier que PostgreSQL est accessible
2. Vérifier que DATABASE_URL est correct dans .env.local
3. Vérifier que le client Prisma est généré (`pnpm db:generate`)
4. Consulter le plan dans `.claude/plans/`

Bon développement! 🚀
