/**
 * Environment variable validation utilities
 */

interface EnvConfig {
  GEMINI_API_KEY: string;
  API_TIMEOUT?: number;
  API_RETRY_ATTEMPTS?: number;
}

/**
 * Validates that required environment variables are set
 * @throws Error if required environment variables are missing
 */
export const validateEnvironment = (): EnvConfig => {
  // Prioritize Gemini API key (supports voice), fallback to DeepSeek
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_api_key_here') {
    throw new Error(
      'GEMINI_API_KEY is not set. Please create a .env.local file with your API key.\n' +
      'See .env.example for reference.'
    );
  }

  return {
    GEMINI_API_KEY: apiKey,
    API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '30000', 10),
    API_RETRY_ATTEMPTS: parseInt(process.env.API_RETRY_ATTEMPTS || '3', 10),
  };
};

/**
 * Checks if environment is properly configured
 * @returns true if environment is valid, false otherwise
 */
export const isEnvironmentValid = (): boolean => {
  try {
    validateEnvironment();
    return true;
  } catch {
    return false;
  }
};

/**
 * Gets the API key from environment variables
 * Prioritizes Gemini API key (supports voice), falls back to DeepSeek
 * @returns API key or empty string
 */
export const getApiKey = (): string => {
  return process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.DEEPSEEK_API_KEY || '';
};

