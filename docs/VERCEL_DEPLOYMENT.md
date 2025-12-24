# Vercel Deployment Guide

## Setting Up Environment Variables

Since `.env.local` files are not committed to git (for security), you need to configure environment variables directly in Vercel.

### Steps to Add Environment Variables in Vercel:

1. **Go to your Vercel Dashboard**
   - Navigate to: https://vercel.com/dashboard
   - Select your project: `chimdum`

2. **Open Project Settings**
   - Click on your project
   - Go to **Settings** → **Environment Variables**

3. **Add the DeepSeek API Key**
   - Click **Add New**
   - **Name:** `DEEPSEEK_API_KEY`
   - **Value:** Your DeepSeek API key (starts with `sk-`)
   - **Environment:** Select all (Production, Preview, Development)
   - Click **Save**
   
   **Note:** You can also use `GEMINI_API_KEY` as a fallback, but `DEEPSEEK_API_KEY` is preferred.

4. **Redeploy**
   - After adding the environment variable, go to **Deployments**
   - Click the **⋯** menu on the latest deployment
   - Select **Redeploy**
   - Or push a new commit to trigger automatic redeployment

### Alternative: Using Vercel CLI

You can also set environment variables using the Vercel CLI:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Set environment variable
vercel env add DEEPSEEK_API_KEY
# When prompted, enter your DeepSeek API key (starts with sk-)
# Select all environments (Production, Preview, Development)
```

### Required Environment Variables

- **DEEPSEEK_API_KEY** (Primary, Recommended)
  - Your DeepSeek API key from https://platform.deepseek.com/
  - Example: `sk-001c05a90fad45f0858ea3015134ed68`
  
- **GEMINI_API_KEY** (Optional Fallback)
  - Your Gemini API key from https://ai.google.dev/
  - Only used if DEEPSEEK_API_KEY is not set

### Optional Environment Variables

- **API_TIMEOUT** (Optional)
  - Default: `30000` (30 seconds)
  - API request timeout in milliseconds

- **API_RETRY_ATTEMPTS** (Optional)
  - Default: `3`
  - Number of retry attempts for failed API calls

### Verifying Environment Variables

After adding the environment variable and redeploying, you can verify it's working by:

1. Check the deployment logs in Vercel
2. The app should load without the "Configuration Error" message
3. You should be able to use both text and voice assessments

### Troubleshooting

**If you still see the configuration error:**

1. Make sure the environment variable name is exactly `DEEPSEEK_API_KEY` (case-sensitive, or `GEMINI_API_KEY` as fallback)
2. Ensure it's enabled for all environments (Production, Preview, Development)
3. Redeploy the application after adding the variable
4. Check that the API key value doesn't have extra spaces or quotes

**If the build fails:**

- Check that all dependencies are installed correctly
- Verify that `.npmrc` is configured properly (should have `legacy-peer-deps=true`)
- Check the build logs in Vercel for specific error messages
