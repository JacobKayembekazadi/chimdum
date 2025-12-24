import { GoogleGenAI } from '@google/genai';

import { SYSTEM_PROMPT, QUESTIONS } from '../constants';
import { UserAnswers } from '../types';
import { retryWithBackoff, formatApiError } from '../utils/apiHelpers';
import { getValidatedGeminiApiKey } from '../utils/apiKeyValidator';
import { logError, getUserFriendlyErrorMessage } from '../utils/errorLogger';
import { rateLimiter } from '../utils/rateLimiter';

export class GeminiServiceError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'GeminiServiceError';
  }
}

/**
 * Generates a wellness recommendation using Gemini API
 */
export const generateWellnessRecommendation = async (answers: UserAnswers): Promise<string> => {
  // Check rate limit
  if (!rateLimiter.isAllowed('api-request')) {
    const timeUntilReset = rateLimiter.getTimeUntilReset('api-request');
    const seconds = Math.ceil(timeUntilReset / 1000);
    throw new GeminiServiceError(
      `Rate limit exceeded. Please wait ${seconds} second(s) before trying again.`
    );
  }

  const apiKey = getValidatedGeminiApiKey();

  const ai = new GoogleGenAI({ apiKey });

  // Construct a summary of user answers for the prompt
  const answerSummary = QUESTIONS.map(q => {
    const answerValue = answers[q.id];
    const answerLabel = q.options.find(o => o.value === answerValue)?.label || 'Not answered';
    return `${q.text}: ${answerLabel}`;
  }).join('\n');

  const prompt = `Based on the following user assessment, provide a wellness recommendation following your strict rules and output format:

User Assessment:
${answerSummary}

Ensure the recommendation strictly follows the Decision Logic and Output Format specified in your system instructions.`;

  try {
    const response = await retryWithBackoff(async () => {
      return await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
        },
      });
    });

    const result = response.text;

    if (!result || result.trim() === '') {
      throw new GeminiServiceError('Empty response from API');
    }

    return result;
  } catch (error) {
    logError(error instanceof Error ? error : new Error(formatApiError(error)), {
      context: 'generateWellnessRecommendation',
      answers,
    });

    // Re-throw as GeminiServiceError for better error handling
    if (error instanceof GeminiServiceError) {
      throw error;
    }

    const friendlyMessage =
      error instanceof Error
        ? getUserFriendlyErrorMessage(error)
        : 'Unable to generate recommendation. Please try again.';

    throw new GeminiServiceError(friendlyMessage, error);
  }
};
