import { generateObject } from "ai";
import { z } from "zod";
import { getModel } from "../providers";

const extractionSchema = z.object({
  decisions: z.array(
    z.object({
      description: z.string().describe("Description claire de la décision attendue ou prise"),
      context: z.string().optional().describe("Contexte ou justification de la décision"),
      decidedBy: z.string().optional().describe("Qui doit prendre ou a pris la décision"),
      tags: z.array(z.string()).optional().describe("Tags pertinents: scope, tech, budget, délai, etc."),
      isPending: z.boolean().describe("True si la décision est en attente, false si elle a été prise"),
    })
  ),
  risks: z.array(
    z.object({
      description: z.string().describe("Description claire du risque"),
      impact: z.string().describe("Impact du risque sur le projet"),
      mitigation: z.string().optional().describe("Plan de mitigation proposé"),
      severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).describe("Sévérité du risque"),
      tags: z.array(z.string()).optional().describe("Tags pertinents: legal, tech, externe, interne, etc."),
    })
  ),
});

export type ExtractedEntities = z.infer<typeof extractionSchema>;

/**
 * Extrait automatiquement les décisions et risques depuis un update généré
 */
export async function extractEntitiesFromUpdate(
  emailBody: string,
  slackMessage: string
): Promise<ExtractedEntities> {
  const model = getModel("anthropic", "haiku"); // Utiliser Haiku pour l'extraction (rapide et économique)

  try {
    const { object } = await generateObject({
      model,
      schema: extractionSchema,
      prompt: `Tu es un expert en gestion de projet. Analyse l'update suivant et extrais toutes les DÉCISIONS (attendues ou prises) et tous les RISQUES mentionnés.

Principes d'extraction :

DÉCISIONS :
- Identifier les validations demandées (GO/NO-GO, arbitrages, choix à faire)
- Identifier les décisions déjà prises et communiquées
- Extraire le contexte si disponible
- Marquer comme "pending" si la décision est attendue, "decided" si elle a été prise
- Tags possibles : scope, tech, budget, délai, stratégie, etc.

RISQUES :
- Identifier les blocages, dépendances, incertitudes
- Évaluer la sévérité : LOW (mineur), MEDIUM (impact modéré), HIGH (impact important), CRITICAL (bloquant)
- Extraire l'impact et le plan de mitigation si mentionné
- Tags possibles : legal, tech, externe, interne, délai, budget, etc.

IMPORTANT :
- Ne rien inventer : extraire UNIQUEMENT ce qui est explicitement mentionné
- Si un élément manque d'info (contexte, mitigation, etc.), laisser vide
- Être précis et factuel

UPDATE EMAIL :
${emailBody}

UPDATE SLACK :
${slackMessage}

Extrais maintenant toutes les décisions et risques.`,
    });

    return object;
  } catch (error) {
    console.error("Error extracting entities:", error);
    // En cas d'erreur, retourner un objet vide plutôt que de faire échouer toute l'opération
    return {
      decisions: [],
      risks: [],
    };
  }
}
