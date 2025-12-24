/**
 * API Key validation utilities
 */

import { getApiKey, getGeminiApiKey, getDeepSeekApiKey } from './envValidation';

/**
 * Validates that an API key is present and properly formatted
 * @returns true if API key is valid, false otherwise
 */
export const isValidApiKey = (): boolean => {
  const apiKey = getApiKey();
  return apiKey !== '' && apiKey !== 'your_api_key_here' && apiKey.trim().length > 0;
};

/**
 * Validates API key format (basic check)
 * @param apiKey - The API key to validate
 * @returns true if format appears valid
 */
export const isValidApiKeyFormat = (apiKey: string): boolean => {
  if (!apiKey || apiKey.trim() === '') {
    return false;
  }

  // Gemini API keys typically start with "AIza" and are 39 characters
  // DeepSeek API keys start with "sk-" and are 40+ characters
  // This is a basic check and may need adjustment based on actual key format
  return apiKey.trim().length >= 20;
};

/**
 * Gets API key with validation (generic fallback)
 * @throws Error if API key is not valid
 */
export const getValidatedApiKey = (): string => {
  const apiKey = getApiKey();

  if (!isValidApiKey()) {
    throw new Error(
      'API key is not configured. Please set GEMINI_API_KEY or DEEPSEEK_API_KEY in your .env.local file.'
    );
  }

  if (!isValidApiKeyFormat(apiKey)) {
    throw new Error('API key format appears invalid. Please check your configuration.');
  }

  return apiKey;
};

/**
 * Gets Gemini API key with validation
 * @throws Error if Gemini API key is not valid
 */
export const getValidatedGeminiApiKey = (): string => {
  const apiKey = getGeminiApiKey();

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_api_key_here') {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please set it in your .env.local file.'
    );
  }

  // Gemini specific validation could be added here
  if (!isValidApiKeyFormat(apiKey)) {
    throw new Error('GEMINI_API_KEY format appears invalid. It should typically start with "AIza".');
  }

  return apiKey;
};

/**
 * Gets DeepSeek API key with validation
 * @throws Error if DeepSeek API key is not valid
 */
export const getValidatedDeepSeekApiKey = (): string => {
  const apiKey = getDeepSeekApiKey();

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_api_key_here') {
    throw new Error(
      'DEEPSEEK_API_KEY is not configured. Please set it in your .env.local file.'
    );
  }

  // DeepSeek specific validation could be added here
  if (!isValidApiKeyFormat(apiKey)) {
    throw new Error('DEEPSEEK_API_KEY format appears invalid. It should typically start with "sk-".');
  }

  return apiKey;
};
