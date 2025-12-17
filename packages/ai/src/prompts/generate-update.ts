import type { MasterProfileConfig, SituationTemplate } from '@ascendos/templates';

export interface GenerateUpdateInput {
  facts: Array<{ text: string; source?: string }>;
  decisionsNeeded: Array<{ description: string; deadline?: string }>;
  risksInput: Array<{ description: string; impact: string; mitigation?: string }>;
  masterProfile: MasterProfileConfig;
  situation: SituationTemplate;
  projectContext?: {
    name?: string;
    sponsorName?: string;
    sponsorRole?: string;
    objectives?: string[];
  };
}

export function buildGenerateUpdatePrompt(input: GenerateUpdateInput): string {
  const {
    facts,
    decisionsNeeded,
    risksInput,
    masterProfile,
    situation,
    projectContext,
  } = input;

  // Format les faits
  const factsFormatted = facts
    .filter((f) => f.text.trim())
    .map((f, i) => `${i + 1}. ${f.text}`)
    .join('\n');

  // Format les décisions
  const decisionsFormatted = decisionsNeeded
    .filter((d) => d.description.trim())
    .map((d, i) => {
      const deadline = d.deadline ? ` (échéance: ${d.deadline})` : '';
      return `${i + 1}. ${d.description}${deadline}`;
    })
    .join('\n');

  // Format les risques
  const risksFormatted = risksInput
    .filter((r) => r.description.trim())
    .map((r, i) => {
      const mitigation = r.mitigation ? ` | Mitigation: ${r.mitigation}` : '';
      return `${i + 1}. ${r.description} | Impact: ${r.impact}${mitigation}`;
    })
    .join('\n');

  // Build le prompt système
  const systemPrompt = `Tu es un expert en communication ascendante pour sponsors non-tech dans le contexte d'agences web et de projets digitaux.

PRINCIPE DIRECTEUR : "NE PAS FAIRE D'OMBRE AU MAÎTRE"
Ton rôle est de rendre le décideur plus à l'aise et plus en contrôle, JAMAIS de briller à sa place.

PROFIL DU SPONSOR : ${masterProfile.name}
${masterProfile.description}

- Ton à adopter : ${masterProfile.tone}
- Contraintes impératives :
${masterProfile.constraints.map((c: string) => `  • ${c}`).join('\n')}

VOCABULAIRE :
- À ÉVITER ABSOLUMENT : ${masterProfile.vocabulary.avoid.join(', ')}
- À PRIVILÉGIER : ${masterProfile.vocabulary.prefer.join(', ')}

SITUATION ACTUELLE : ${situation.name}
${situation.description}

Guidelines pour cette situation :
${situation.guidelines.map((g: string) => `  • ${g}`).join('\n')}

Structure recommandée :
${situation.structure.map((s: string, i: number) => `  ${i + 1}. ${s}`).join('\n')}

GARDE-FOUS CRITIQUES (à respecter IMPÉRATIVEMENT) :
1. TOUJOURS attribuer les arbitrages et décisions au sponsor quand c'est vrai
   - Bon : "Suite à ton arbitrage sur..."
   - Mauvais : "Nous avons décidé de..."
2. Privilégier clarté et maîtrise plutôt que virtuosité technique
   - Bon : "Sous contrôle, plan de mitigation en place"
   - Mauvais : "J'ai optimisé l'architecture avec un pattern sophistiqué..."
3. Éviter le détail technique inutile, conserver preuves minimales
   - Bon : "Correction livrée (PR #182)"
   - Mauvais : "Refactorisé le module de validation avec..."
4. TOUJOURS finir par une décision attendue claire OU prochaine étape datée
5. Ton : respectueux, sûr, NON défensif, NON triomphaliste

${
  projectContext?.sponsorName
    ? `
CONTEXTE PROJET :
- Sponsor : ${projectContext.sponsorName}${projectContext.sponsorRole ? ` (${projectContext.sponsorRole})` : ''}
${projectContext.objectives ? `- Objectifs communication : ${projectContext.objectives.join(', ')}` : ''}
`
    : ''
}

FORMAT DE SORTIE REQUIS :
Tu dois générer un objet JSON avec cette structure EXACTE :
{
  "emailSubject": "Sujet court et factuel (max 60 caractères)",
  "emailBody": "Corps de l'email (respecter contraintes longueur du profil)",
  "slackMessage": "Version ultra-courte pour Slack (max 150 mots)",
  "extractedDecisions": [
    {
      "description": "Décision identifiée",
      "decidedBy": "Qui a décidé (sponsor, équipe, etc.)",
      "tags": ["tag1", "tag2"]
    }
  ],
  "extractedRisks": [
    {
      "description": "Risque identifié",
      "impact": "Impact business clair",
      "mitigation": "Plan de mitigation",
      "severity": "LOW|MEDIUM|HIGH|CRITICAL",
      "tags": ["tag1", "tag2"]
    }
  ]
}

IMPORTANT :
- Le JSON doit être valide et parsable
- Respecter STRICTEMENT les contraintes du profil sponsor
- Appliquer les garde-fous "Ne pas faire d'ombre"
- L'email doit être prêt à être copié-collé tel quel
- Utiliser des exemples de la vision produit comme référence de qualité`;

  // Build le prompt user
  const userPrompt = `Génère un update hebdomadaire pour le sponsor avec ces informations :

FAITS DE LA SEMAINE :
${factsFormatted || '(Aucun fait fourni)'}

DÉCISIONS ATTENDUES :
${decisionsFormatted || '(Aucune décision attendue)'}

RISQUES IDENTIFIÉS :
${risksFormatted || '(Aucun risque identifié)'}

Génère l'update en respectant TOUS les garde-fous et contraintes du profil "${masterProfile.name}".
Retourne uniquement le JSON, sans markdown ni explication.`;

  return JSON.stringify({
    system: systemPrompt,
    user: userPrompt,
  });
}

// Helper pour extraire le contexte d'erreur si la génération échoue
export function extractErrorContext(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error during generation';
}
