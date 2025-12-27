# API Route Fix Summary

## Root Cause Analysis

The API route `/api/wellness` was failing with "signal is aborted without reason" due to several critical issues:

### Issues Found:

1. **Missing Timeout Wrapper**: The external API calls (DeepSeek/Gemini) had no explicit timeout protection. While the OpenAI client had a `timeout` config, this is unreliable in Vercel's Node.js runtime and doesn't prevent hanging promises.

2. **Inconsistent CORS Headers**: One error response (line 72) was missing CORS headers, which could cause CORS errors in production.

3. **No AbortController Protection**: The client-side had a 60s timeout, but if the server-side API call hung, it would cause the client to abort while the server was still processing.

4. **Unhandled Promise Rejections**: If the OpenAI client or GoogleGenAI client hung indefinitely, the promise would never resolve or reject, causing the request to hang.

5. **Missing Error Context**: Some errors weren't properly categorized (timeout vs auth vs generic), making debugging difficult.

## Fixes Applied

### 1. Added `withTimeout()` Wrapper Function
- Wraps all external API calls with a 45-second timeout using `AbortController` and `Promise.race()`
- Ensures no API call can hang indefinitely
- Automatically clears timeout on success or error

### 2. Consistent CORS Headers
- All responses now include CORS headers
- Centralized `corsHeaders` object used throughout
- Includes `Content-Type` in headers

### 3. Separated API Call Functions
- `callDeepSeekAPI()` - Handles DeepSeek calls with timeout
- `callGeminiAPI()` - Handles Gemini calls with timeout
- Both functions are wrapped with `withTimeout()`

### 4. Better Error Handling
- Specific error responses for:
  - Timeout errors (504 status)
  - Authentication errors (401 status)
  - Empty responses (500 status)
  - Generic errors (500 status)
- All errors are properly logged with context

### 5. Request Body Parsing Protection
- Added try/catch around `req.json()` parsing
- Returns proper error response if JSON is invalid

### 6. Explicit Return Types
- Function signature: `async function handler(req: Request): Promise<Response>`
- Ensures all code paths return a Response

### 7. No Hanging Promises
- Every async operation is either:
  - Wrapped in timeout
  - Properly caught in try/catch
  - Has explicit error handling

## Key Changes

1. **Timeout Protection**: All external API calls now have a 45-second timeout wrapper
2. **Error Categorization**: Errors are categorized and return appropriate HTTP status codes
3. **Consistent Headers**: All responses include CORS headers
4. **Better Logging**: More detailed logs for debugging
5. **Type Safety**: Explicit return types ensure no missing returns

## Testing Checklist

- [ ] Test with valid DeepSeek API key
- [ ] Test with valid Gemini API key
- [ ] Test with invalid API key (should return 401)
- [ ] Test with timeout scenario (should return 504)
- [ ] Test with invalid JSON body (should return 400)
- [ ] Test with missing answers (should return 400)
- [ ] Test CORS preflight (OPTIONS request)
- [ ] Verify all responses include CORS headers

## Files Modified

- `api/wellness.ts` - Complete rewrite with timeout protection and better error handling

## No Other Files Need Updates

The client-side code (`services/geminiService.ts`) already has proper timeout handling (60s), which is now aligned with the server-side 45s timeout (leaving buffer for network overhead).

