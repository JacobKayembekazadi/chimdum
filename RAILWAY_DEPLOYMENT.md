# Railway Deployment Guide

## Quick Setup (5 minutes)

### 1. Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"**

### 2. Deploy from GitHub
1. Click **"Deploy from GitHub repo"**
2. Select `JacobKayembekazadi/chimdum3`
3. Click **"Deploy Now"**

### 3. Configure Environment Variables
In Railway dashboard:
1. Click on your service → **"Variables"** tab
2. Add these variables:
   ```
   DEEPSEEK_API_KEY=sk-067d18def03b465598124de4d393b274
   GEMINI_API_KEY=AIzaSyA6F308BPlHhKFIbUvo-8HPy1q2pju38nU
   PORT=3001
   ```

### 4. Configure Build Settings
1. Go to **"Settings"** tab
2. Set **Start Command**: `node server.js`
3. Set **Build Command**: `npm install`

### 5. Get Your API URL
1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `https://your-app.railway.app`)

### 6. Update Frontend
In your `.env` file (locally) and Vercel environment variables:
```
VITE_API_URL=https://your-app.railway.app
```

Update `services/geminiService.ts`:
```typescript
const API_URL = import.meta.env.VITE_API_URL || '';

const response = await fetch(`${API_URL}/api/wellness`, {
  // ... rest of the code
});
```

---

## Alternative: One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/JacobKayembekazadi/chimdum3)

Click the button above to deploy automatically!

---

## Troubleshooting

### If deployment fails:
1. Check logs in Railway dashboard
2. Ensure all env variables are set
3. Verify `server.js` is in the root directory

### If API returns 500:
1. Check Railway logs for errors
2. Verify API keys are correct
3. Check that `api/wellness.ts` is being imported correctly

---

## Benefits of Railway

✅ **60+ second timeouts** (free tier)  
✅ **$5 free credits monthly**  
✅ **Automatic HTTPS**  
✅ **Zero config deployment**  
✅ **Real-time logs**  

---

## Cost
- **Free tier**: 500 hours/month (plenty for this app)
- If you exceed: ~$5-10/month for this traffic
