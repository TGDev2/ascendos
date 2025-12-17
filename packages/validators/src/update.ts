import { z } from 'zod';

export const factSchema = z.object({
  text: z.string().min(1),
  source: z.string().optional(),
});

export const decisionNeededSchema = z.object({
  description: z.string().min(1),
  deadline: z.string().optional(),
});

export const riskInputSchema = z.object({
  description: z.string().min(1),
  impact: z.string().min(1),
  mitigation: z.string().optional(),
});

export const createUpdateSchema = z.object({
  projectId: z.string().cuid(),
  weekNumber: z.string(),
  year: z.number().int().min(2024).max(2100),
  facts: z.array(factSchema),
  decisionsNeeded: z.array(decisionNeededSchema),
  risksInput: z.array(riskInputSchema),
  rawInput: z.string().optional(),
  situationType: z.enum(['NORMAL', 'VALIDATION', 'RISK', 'DELAY', 'ARBITRAGE', 'PRE_COPIL']),
});

export const generatedUpdateOutputSchema = z.object({
  emailSubject: z.string(),
  emailBody: z.string(),
  slackMessage: z.string(),
  extractedDecisions: z.array(
    z.object({
      description: z.string(),
      decidedBy: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })
  ),
  extractedRisks: z.array(
    z.object({
      description: z.string(),
      impact: z.string(),
      mitigation: z.string().optional(),
      severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      tags: z.array(z.string()).optional(),
    })
  ),
});

export type CreateUpdateInput = z.infer<typeof createUpdateSchema>;
export type GeneratedUpdateOutput = z.infer<typeof generatedUpdateOutputSchema>;
export type Fact = z.infer<typeof factSchema>;
export type DecisionNeeded = z.infer<typeof decisionNeededSchema>;
export type RiskInput = z.infer<typeof riskInputSchema>;
