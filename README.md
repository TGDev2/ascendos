# Ascendos

**Transformez vos notes brutes en updates hebdomadaires sponsor-ready en 2 minutes**

Ascendos est un SaaS qui aide les agences web et studios à communiquer efficacement avec leurs sponsors non-tech, tout en construisant automatiquement un dossier de continuité consultable.

## Principe directeur

"Ne pas faire d'ombre au maître" - Génération de communication ascendante politiquement safe qui rend le décideur plus à l'aise et plus en contrôle.

## Stack technique

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Next.js API Routes + tRPC
- **Database:** PostgreSQL (Neon) + Prisma
- **Auth:** Clerk
- **AI:** Anthropic Claude 3.5 Sonnet + OpenAI GPT-4o (backup)
- **Payments:** Stripe
- **Infrastructure:** Vercel + Upstash Redis

## Structure du projet

```
ascendos/
├── apps/
│   └── web/          # Application Next.js principale
├── packages/
│   ├── database/     # Prisma schema + client
│   ├── ai/           # Logique LLM et prompts
│   ├── templates/    # MasterProfiles + Situations
│   ├── validators/   # Schémas Zod
│   └── config/       # Configurations partagées
```

## Démarrage

### Prérequis

- Node.js >= 20
- pnpm >= 9
- PostgreSQL (ou compte Neon)

### Installation

```bash
# Installer les dépendances
pnpm install

# Copier .env.example et remplir les variables
cp .env.example .env.local

# Configurer la base de données
cd packages/database
pnpm db:push
pnpm db:seed

# Lancer le dev server
cd ../..
pnpm dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## Commandes utiles

```bash
# Développement
pnpm dev              # Lancer tous les projets en mode dev
pnpm build            # Build production
pnpm lint             # Linter
pnpm type-check       # TypeScript check

# Database
cd packages/database
pnpm db:generate      # Générer Prisma client
pnpm db:push          # Push schema sans migration
pnpm db:migrate       # Créer migration
pnpm db:studio        # Prisma Studio (GUI)
pnpm db:seed          # Seed la DB
```

## Documentation

Voir le fichier [vision.md](vision.md) pour la vision produit complète et le plan [polymorphic-imagining-piglet.md](.claude/plans/polymorphic-imagining-piglet.md) pour le plan d'implémentation détaillé.

## License

Propriétaire - Tous droits réservés
