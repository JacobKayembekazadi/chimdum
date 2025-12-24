import { UserAnswers } from '../types';
import { formatApiError } from '../utils/apiHelpers';
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
 * Generates a wellness recommendation using Vercel Edge Function (secure API key handling)
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

  try {
    const response = await fetch('/api/wellness', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `API request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.recommendation || data.recommendation.trim() === '') {
      throw new GeminiServiceError('Empty response from API');
    }

    return data.recommendation;
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
