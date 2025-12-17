// MasterProfile definitions
// Ces données correspondent aux presets créés dans le seed Prisma

export interface MasterProfileConfig {
  slug: string;
  name: string;
  description: string;
  tone: string;
  constraints: string[];
  vocabulary: {
    avoid: string[];
    prefer: string[];
  };
}

export const MASTER_PROFILES: Record<string, MasterProfileConfig> = {
  'non-tech-confiant': {
    slug: 'non-tech-confiant',
    name: 'Non-tech confiant',
    description:
      'Sponsor non-technique qui fait confiance à l\'équipe. Veut être rassuré et informé des décisions clés sans entrer dans les détails techniques.',
    tone: 'respectueux, sûr, non défensif',
    constraints: [
      'Max 250 mots',
      'Pas de jargon technique',
      'Toujours finir par une décision attendue claire',
      'Éviter les détails d\'implémentation',
    ],
    vocabulary: {
      avoid: [
        'bug',
        'refactoring',
        'optimisation',
        'architecture',
        'API',
        'endpoint',
        'migration',
        'rollback',
      ],
      prefer: [
        'correction',
        'amélioration',
        'fonctionnalité',
        'intégration',
        'mise à jour',
        'parcours utilisateur',
        'performance',
      ],
    },
  },

  'micro-manager': {
    slug: 'micro-manager',
    name: 'Micro-manager',
    description:
      'Sponsor qui veut des détails précis et des dates. Apprécie la transparence totale, les métriques, et les plans étape par étape.',
    tone: 'précis, rassurant, factuel',
    constraints: [
      'Max 350 mots',
      'Toujours dater les prochaines étapes',
      'Inclure métriques ou indicateurs factuels',
      'Mentionner ce qui pourrait ralentir',
      'Plan de revue obligatoire pour les risques',
    ],
    vocabulary: {
      avoid: [
        'bientôt',
        'probablement',
        'normalement',
        'on espère',
        'ça devrait',
      ],
      prefer: [
        'vendredi 15h',
        'confirmé',
        'planifié',
        'vérifié',
        'validé',
        'date de revue',
        'échéance',
      ],
    },
  },

  'comite-risque-averse': {
    slug: 'comite-risque-averse',
    name: 'Comité risque-averse',
    description:
      'Sponsor orienté risques et conformité (COPIL, comité de direction). Veut comprendre les impacts business et les plans de mitigation.',
    tone: 'neutre, structuré, orienté décisions',
    constraints: [
      'Max 400 mots',
      'Structure claire : Faits → Risques → Options → Recommandation',
      'Toujours présenter alternatives (A/B ou A/B/C)',
      'Impact business explicite pour chaque risque',
      'Plan de mitigation daté pour risques critiques',
    ],
    vocabulary: {
      avoid: [
        'problème',
        'catastrophe',
        'bloqué',
        'impossible',
        'erreur',
      ],
      prefer: [
        'risque identifié',
        'impact',
        'plan de mitigation',
        'options',
        'arbitrage',
        'recommandation',
        'validation',
      ],
    },
  },
};

export function getMasterProfile(slug: string): MasterProfileConfig | undefined {
  return MASTER_PROFILES[slug];
}

export function getAllMasterProfiles(): MasterProfileConfig[] {
  return Object.values(MASTER_PROFILES);
}
