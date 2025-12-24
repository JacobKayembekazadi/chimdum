# API Documentation

## DeepSeek Service

### `generateWellnessRecommendation`

Generates a personalized wellness recommendation based on user answers using DeepSeek API.

**Parameters:**

- `answers: UserAnswers` - Object containing user's answers to assessment questions

**Returns:**

- `Promise<string>` - Formatted wellness recommendation text

**Example:**

```typescript
import { generateWellnessRecommendation } from './services/deepseekService';

const answers = {
  1: 'low',
  2: 'often',
  3: 'poor',
  4: 'poor',
  5: 'high',
  6: 'energy',
  7: 'no',
};

const recommendation = await generateWellnessRecommendation(answers);
```

**Error Handling:**

- Throws `DeepSeekServiceError` if API call fails
- Includes retry logic with exponential backoff
- Rate limiting applied automatically

**API Details:**

- Uses DeepSeek Chat API (OpenAI-compatible)
- Model: `deepseek-chat`
- Base URL: `https://api.deepseek.com`

## Utilities

### Environment Validation

```typescript
import { validateEnvironment, getApiKey, isEnvironmentValid } from './utils/envValidation';

// Validate all environment variables
const config = validateEnvironment();

// Get API key
const apiKey = getApiKey();

// Check if environment is valid
const isValid = isEnvironmentValid();
```

### Error Handling

```typescript
import { retryWithBackoff } from './utils/apiHelpers';

const result = await retryWithBackoff(
  async () => {
    return await apiCall();
  },
  {
    maxAttempts: 3,
    initialDelay: 1000,
  }
);
```

### Rate Limiting

```typescript
import { rateLimiter } from './utils/rateLimiter';

if (rateLimiter.isAllowed('user-id')) {
  // Make API call
} else {
  const timeUntilReset = rateLimiter.getTimeUntilReset('user-id');
  // Show rate limit message
}
```
