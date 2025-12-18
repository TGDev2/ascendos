import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

export type LLMProvider = 'anthropic' | 'openai';

export function getModel(provider: LLMProvider = 'openai', modelName?: string): LanguageModel {
  switch (provider) {
    case 'anthropic':
      return anthropic(modelName || 'claude-3-5-sonnet-20241022');
    case 'openai':
      return openai(modelName || 'gpt-5-mini-2025-08-07');
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export function getParsingModel(provider: LLMProvider = 'openai'): LanguageModel {
  // Utiliser un modèle plus rapide/moins cher pour le parsing
  switch (provider) {
    case 'anthropic':
      return anthropic('claude-3-5-haiku-20241022');
    case 'openai':
      return openai('gpt-5-mini-2025-08-07');
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
