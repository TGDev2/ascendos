import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';

export type LLMProvider = 'anthropic' | 'openai';

export function getModel(provider: LLMProvider = 'anthropic', modelName?: string) {
  switch (provider) {
    case 'anthropic':
      return anthropic(modelName || 'claude-3-5-sonnet-20241022');
    case 'openai':
      return openai(modelName || 'gpt-4o');
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export function getParsingModel(provider: LLMProvider = 'anthropic') {
  // Utiliser un modèle plus rapide/moins cher pour le parsing
  switch (provider) {
    case 'anthropic':
      return anthropic('claude-3-5-haiku-20241022');
    case 'openai':
      return openai('gpt-4o-mini');
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
