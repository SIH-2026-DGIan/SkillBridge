/**
 * AI & LLM Service
 * Communicates with Google Gemini API to generate personalized learning paths and gap analysis.
 */

import { generateAIRecommendation, type EnhancerInput } from '@/lib/ai/gemini-enhancer';

export class AIService {
  /**
   * Generates AI-assisted career advice, gap analysis, and tailored learning suggestions.
   */
  static async getRecommendation(input: EnhancerInput): Promise<string> {
    return generateAIRecommendation(input);
  }
}
