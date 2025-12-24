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
  // Prioritize DeepSeek API key, fallback to Gemini or generic API_KEY
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_api_key_here') {
    throw new Error(
      'DEEPSEEK_API_KEY is not set. Please create a .env.local file with your API key.\n' +
        'See .env.example for reference.'
    );
  }

  return {
    GEMINI_API_KEY: apiKey, // Keep same interface name for backward compatibility
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
 * Prioritizes DeepSeek API key, falls back to Gemini or generic API_KEY
 * @returns API key or empty string
 */
export const getApiKey = (): string => {
  return process.env.DEEPSEEK_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY || '';
};
