# Setting Up GitHub Secrets for DeepSeek API Key

To enable automatic deployments with GitHub Actions, you need to add the DeepSeek API key as a GitHub secret.

## Steps:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. **Name:** `DEEPSEEK_API_KEY`
5. **Value:** `sk-001c05a90fad45f0858ea3015134ed68`
6. Click **Add secret**

The GitHub Actions workflow will automatically use this secret when building and deploying.
