import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================================================
  // MASTER PROFILES (Profils de sponsors presets)
  // ============================================================================

  console.log('📋 Creating Master Profiles...');

  const masterProfiles = [
    {
      name: 'Non-tech confiant',
      slug: 'non-tech-confiant',
      description:
        'Sponsor non-technique qui fait confiance à l\'équipe. Veut être rassuré et informé des décisions clés sans entrer dans les détails techniques. Apprécie la clarté et la concision.',
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
      isCustom: false,
    },
    {
      name: 'Micro-manager',
      slug: 'micro-manager',
      description:
        'Sponsor qui veut des détails précis et des dates. Apprécie la transparence totale, les métriques, et les plans étape par étape. Sensible aux risques et aux retards.',
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
      isCustom: false,
    },
    {
      name: 'Comité risque-averse',
      slug: 'comite-risque-averse',
      description:
        'Sponsor orienté risques et conformité (COPIL, comité de direction). Veut comprendre les impacts business, les plans de mitigation, et les alternatives. Sensible aux escalades.',
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
      isCustom: false,
    },
  ];

  for (const profile of masterProfiles) {
    await prisma.masterProfile.upsert({
      where: { slug: profile.slug },
      update: profile,
      create: profile,
    });
    console.log(`  ✓ ${profile.name}`);
  }

  console.log('✅ Master Profiles created successfully\n');

  // ============================================================================
  // SITUATION TYPES (Templates de situations) - Documentation only
  // ============================================================================

  console.log('📝 Situation Types (enum values, no DB insert needed):');
  console.log('  ✓ NORMAL - Semaine normale (continuité + prochaine décision)');
  console.log('  ✓ VALIDATION - Validation attendue (call-to-action + échéance)');
  console.log('  ✓ RISK - Semaine de risque (risque cadré + plan + date de revue)');
  console.log('  ✓ DELAY - Retard (cause factuelle + options + arbitrage)');
  console.log('  ✓ ARBITRAGE - Arbitrage scope/budget (options A/B/C + recommandation neutre)');
  console.log('  ✓ PRE_COPIL - Pré-COPIL (résumé + décisions + risques + questions)\n');

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
