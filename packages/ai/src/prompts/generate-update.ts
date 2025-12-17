// Placeholder for generate-update prompt logic
// This will be implemented in Phase 1

import type { MasterProfileConfig } from '@ascendos/templates';
import type { SituationTemplate } from '@ascendos/templates';

export interface GenerateUpdateInput {
  facts: Array<{ text: string; source?: string }>;
  decisionsNeeded: Array<{ description: string; deadline?: string }>;
  risksInput: Array<{ description: string; impact: string; mitigation?: string }>;
  masterProfile: MasterProfileConfig;
  situation: SituationTemplate;
  projectContext?: {
    name: string;
    sponsorName?: string;
    sponsorRole?: string;
    objectives?: string[];
  };
}

export function buildGenerateUpdatePrompt(input: GenerateUpdateInput): string {
  // TODO: Implement in Phase 1
  return `Prompt will be implemented in Phase 1`;
}
