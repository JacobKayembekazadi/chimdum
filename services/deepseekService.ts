// eslint-disable-next-line import/no-named-as-default
import OpenAI from 'openai';

import { SYSTEM_PROMPT, QUESTIONS } from '../constants';
import { UserAnswers } from '../types';
import { retryWithBackoff, formatApiError } from '../utils/apiHelpers';
import { getValidatedApiKey } from '../utils/apiKeyValidator';
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
 * Note: dangerouslyAllowBrowser is required for browser environments
 * The API key is already exposed via environment variables in the build
 */
const createDeepSeekClient = (apiKey: string): OpenAI => {
  return new OpenAI({
    apiKey,
    baseURL: 'https://api.deepseek.com',
    dangerouslyAllowBrowser: true, // Required for browser usage - API key is already in the build
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

  const apiKey = getValidatedApiKey();
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
      try {
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
      } catch (apiError: any) {
        // Log the full error for debugging
        console.error('DeepSeek API call failed:', {
          status: apiError?.status,
          code: apiError?.code,
          message: apiError?.message,
          response: apiError?.response,
          error: apiError,
        });
        throw apiError;
      }
    });

    const result = response.choices[0]?.message?.content;

    if (!result || result.trim() === '') {
      throw new DeepSeekServiceError('Empty response from API');
    }

    return result;
  } catch (error) {
    // Log detailed error information for debugging
    console.error('DeepSeek API Error Details:', {
      error,
      errorType: error?.constructor?.name,
      errorMessage: error instanceof Error ? error.message : String(error),
      // Check if it's an OpenAI API error (DeepSeek uses OpenAI-compatible API)
      status: (error as any)?.status,
      code: (error as any)?.code,
      response: (error as any)?.response,
    });
    
    logError(error instanceof Error ? error : new Error(formatApiError(error)), {
      context: 'generateWellnessRecommendation',
      answers,
      apiKeyPrefix: apiKey.substring(0, 10) + '...', // Log first 10 chars for debugging
    });

    // Re-throw as DeepSeekServiceError for better error handling
    if (error instanceof DeepSeekServiceError) {
      throw error;
    }

    // Extract more detailed error message
    let friendlyMessage = 'Unable to generate recommendation. Please try again.';
    
    if (error instanceof Error) {
      // Check if it's an OpenAI API error (DeepSeek uses OpenAI-compatible API)
      const errorMessage = error.message.toLowerCase();
      const status = (error as any)?.status || (error as any)?.response?.status;
      
      if (status === 400 || errorMessage.includes('400') || errorMessage.includes('bad request')) {
        friendlyMessage = 'Invalid API request. The model name or request format may be incorrect. Please check the DeepSeek API documentation.';
      } else if (status === 401 || errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
        friendlyMessage = 'Invalid API key. Please check your DEEPSEEK_API_KEY configuration.';
      } else if (status === 429 || errorMessage.includes('429') || errorMessage.includes('rate limit')) {
        friendlyMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      } else {
        friendlyMessage = getUserFriendlyErrorMessage(error);
      }
    }

    throw new DeepSeekServiceError(friendlyMessage, error);
  }
};
