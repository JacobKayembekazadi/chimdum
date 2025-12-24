#!/bin/bash

# Script to set DeepSeek API key in Vercel
# Usage: ./scripts/setup-env.sh

set -e

DEEPSEEK_API_KEY="sk-001c05a90fad45f0858ea3015134ed68"

echo "Setting up DeepSeek API key for production..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel..."
    vercel login
fi

# Link project if not already linked
if [ ! -d ".vercel" ]; then
    echo "Linking Vercel project..."
    vercel link
fi

# Set environment variable for all environments
echo "Setting DEEPSEEK_API_KEY environment variable..."
vercel env add DEEPSEEK_API_KEY production <<< "$DEEPSEEK_API_KEY" || true
vercel env add DEEPSEEK_API_KEY preview <<< "$DEEPSEEK_API_KEY" || true
vercel env add DEEPSEEK_API_KEY development <<< "$DEEPSEEK_API_KEY" || true

echo "✅ DeepSeek API key configured successfully!"
echo ""
echo "Next steps:"
echo "1. Redeploy your application: vercel --prod"
echo "2. Or push a new commit to trigger automatic deployment"
