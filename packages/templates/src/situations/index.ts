// SituationType templates
// Ces templates correspondent aux valeurs de l'enum SituationType dans Prisma

export enum SituationType {
  NORMAL = 'NORMAL',
  VALIDATION = 'VALIDATION',
  RISK = 'RISK',
  DELAY = 'DELAY',
  ARBITRAGE = 'ARBITRAGE',
  PRE_COPIL = 'PRE_COPIL',
}

export interface SituationTemplate {
  type: SituationType;
  name: string;
  description: string;
  guidelines: string[];
  structure: string[];
}

export const SITUATION_TEMPLATES: Record<SituationType, SituationTemplate> = {
  [SituationType.NORMAL]: {
    type: SituationType.NORMAL,
    name: 'Semaine normale',
    description: 'Continuité du projet, avancement régulier',
    guidelines: [
      'Mettre en avant les accomplissements de la semaine',
      'Mentionner la prochaine décision ou jalón important',
      'Ton positif mais factuel',
      'Anticiper la semaine suivante',
    ],
    structure: [
      'Résumé des accomplissements',
      'Prochaine étape importante',
      'Ce qui arrive la semaine prochaine',
    ],
  },

  [SituationType.VALIDATION]: {
    type: SituationType.VALIDATION,
    name: 'Validation attendue',
    description: 'Demande de validation ou approbation nécessaire',
    guidelines: [
      'Call-to-action clair et daté',
      'Contexte minimal pour décision éclairée',
      'Échéance explicite',
      'Impact si validation retardée',
    ],
    structure: [
      'Contexte de la validation',
      'Ce qui est demandé (validation précise)',
      'Échéance et conséquences',
      'Prochaines étapes après validation',
    ],
  },

  [SituationType.RISK]: {
    type: SituationType.RISK,
    name: 'Semaine de risque',
    description: 'Risque identifié nécessitant attention',
    guidelines: [
      'Risque cadré : description factuelle',
      'Impact business clair',
      'Plan de mitigation proposé',
      'Date de revue obligatoire',
      'Ton "sous contrôle" mais transparent',
    ],
    structure: [
      'Risque identifié (description)',
      'Impact (délai, budget, scope)',
      'Plan de mitigation',
      'Date de revue / point de contrôle',
    ],
  },

  [SituationType.DELAY]: {
    type: SituationType.DELAY,
    name: 'Retard',
    description: 'Retard sur planning ou livrable',
    guidelines: [
      'Cause factuelle (pas de blâme)',
      'Écart chiffré (jours, semaines)',
      'Options de rattrapage (A/B)',
      'Arbitrage demandé si nécessaire',
      'Ton factuel, non défensif',
    ],
    structure: [
      'Retard constaté (combien, sur quoi)',
      'Cause identifiée',
      'Options pour rattraper ou ajuster',
      'Arbitrage ou décision attendue',
    ],
  },

  [SituationType.ARBITRAGE]: {
    type: SituationType.ARBITRAGE,
    name: 'Arbitrage scope/budget',
    description: 'Nécessité d\'arbitrer entre options (scope, délai, budget)',
    guidelines: [
      'Présenter 2 ou 3 options (A/B/C)',
      'Pour chaque option : avantages, inconvénients, impact',
      'Recommandation neutre (si demandée) ou pas de recommandation',
      'Laisser le sponsor décider',
    ],
    structure: [
      'Contexte de l\'arbitrage',
      'Option A : description + impacts',
      'Option B : description + impacts',
      '(Option C si applicable)',
      'Recommandation neutre ou ouverture à discussion',
    ],
  },

  [SituationType.PRE_COPIL]: {
    type: SituationType.PRE_COPIL,
    name: 'Pré-COPIL',
    description: 'Préparation pour comité de pilotage ou réunion importante',
    guidelines: [
      'Résumé exécutif (3-4 phrases)',
      'Décisions prises depuis dernier COPIL',
      'Risques ouverts et leur statut',
      'Questions à trancher en COPIL',
      'Format structuré, scannable',
    ],
    structure: [
      'Résumé exécutif',
      'Décisions clés prises',
      'Risques en surveillance',
      'Points à arbitrer en COPIL',
      'Prochaines étapes post-COPIL',
    ],
  },
};

export function getSituationTemplate(type: SituationType): SituationTemplate {
  return SITUATION_TEMPLATES[type];
}

export function getAllSituationTemplates(): SituationTemplate[] {
  return Object.values(SITUATION_TEMPLATES);
}

export function getSituationTypeByValue(value: string): SituationType | undefined {
  return Object.values(SituationType).find((type) => type === value);
}
