// eslint-disable-next-line import/no-named-as-default
import OpenAI from 'openai';

import { SYSTEM_PROMPT, QUESTIONS } from '../constants';
import { UserAnswers } from '../types';
import { retryWithBackoff, formatApiError } from '../utils/apiHelpers';
import { getValidatedDeepSeekApiKey } from '../utils/apiKeyValidator';
import { logError, getUserFriendlyErrorMessage } from '../utils/errorLogger';
import { rateLimiter } from '../utils/rateLimiter';

export class DeepSeekServiceError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'DeepSeekServiceError';
  }
}

/**
 * Creates a DeepSeek API client
 */
const createDeepSeekClient = (apiKey: string): OpenAI => {
  return new OpenAI({
    apiKey,
    baseURL: 'https://api.deepseek.com',
  });
};

/**
 * Generates a wellness recommendation using DeepSeek API
 */
export const generateWellnessRecommendation = async (answers: UserAnswers): Promise<string> => {
  // Check rate limit
  if (!rateLimiter.isAllowed('api-request')) {
    const timeUntilReset = rateLimiter.getTimeUntilReset('api-request');
    const seconds = Math.ceil(timeUntilReset / 1000);
    throw new DeepSeekServiceError(
      `Rate limit exceeded. Please wait ${seconds} second(s) before trying again.`
    );
  }

  const apiKey = getValidatedDeepSeekApiKey();
  const client = createDeepSeekClient(apiKey);

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
      return await client.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });
    });

    const result = response.choices[0]?.message?.content;

    if (!result || result.trim() === '') {
      throw new DeepSeekServiceError('Empty response from API');
    }

    return result;
  } catch (error) {
    logError(error instanceof Error ? error : new Error(formatApiError(error)), {
      context: 'generateWellnessRecommendation',
      answers,
    });

    // Re-throw as DeepSeekServiceError for better error handling
    if (error instanceof DeepSeekServiceError) {
      throw error;
    }

    const friendlyMessage =
      error instanceof Error
        ? getUserFriendlyErrorMessage(error)
        : 'Unable to generate recommendation. Please try again.';

    throw new DeepSeekServiceError(friendlyMessage, error);
  }
};
