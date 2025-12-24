/**
 * Services barrel export
 */

// Primary service - DeepSeek (OpenAI-compatible)
export { generateWellnessRecommendation, DeepSeekServiceError } from './deepseekService';
// Export DeepSeekServiceError as GeminiServiceError for backward compatibility
export { DeepSeekServiceError as GeminiServiceError } from './deepseekService';
export type { WellnessRecommendation } from './types';

// Alternative service - Gemini (kept for reference, not currently used)
// export { generateWellnessRecommendation as generateWellnessRecommendationGemini, GeminiServiceError } from './geminiService';
