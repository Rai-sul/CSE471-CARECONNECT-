# Complete Vercel Deployment Guide for CareConnect

## Your Stack
- **Frontend:** Next.js + React (deployed on Vercel)
- **Backend:** Express.js + Prisma + MongoDB (deployed separately)
- **Database:** MongoDB Atlas (cloud)

---

## PHASE 1: Prepare Backend (Express Server)

### Step 1: Choose Backend Hosting
Vercel doesn't support long-running Express servers. Choose ONE:
- **Render** (recommended, free tier available)
- **Railway**
- **Fly.io**
- **AWS EC2**

### Step 2: Set Up Backend on Render (Example)
1. Go to https://render.com
2. Sign up with GitHub
3. Click **New +** → **Web Service**
4. Select your GitHub repo
5. Fill in:
   - **Name:** `careconnect-api`
   - **Environment:** `Node`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install --include=dev && npm run build`
   - **Start Command:** `npm run start`
   - **Node Version:** `20`
   - **Region:** (closest to you)
6. Click **Create Web Service**

### Step 3: Add Backend Environment Variables
In Render dashboard → your service → **Environment**:

```
PORT=5000
NODE_ENV=production
BASE_URL=https://careconnect-api.onrender.com

DATABASE_URL=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DB?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret_min_32_chars
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your_app_password

CLIENT_URL=https://careconnect-sepia.vercel.app
CLIENT_URLS=https://careconnect-sepia.vercel.app,https://*.vercel.app
ALLOW_VERCEL_PREVIEW_ORIGINS=true

STRIPE_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-proj-...
STREAM_API_KEY=...
```

If your Root Directory is left blank by mistake, use these commands instead:

```
Build Command: cd backend && npm install --include=dev && npm run build
Start Command: cd backend && npm run start
```

⚠️ **Important:** Never paste secrets in code. Always use hosting platform's env var UI.

### Step 4: Wait for Backend to Deploy
Render shows build logs. Wait until you see:
```
✅ Service live at https://careconnect-api.onrender.com
```

### Step 5: Test Backend
Open in browser:
```
https://careconnect-api.onrender.com/
```
Should show:
```json
{
  "success": true,
  "message": "CareConnect API is running successfully! 🚀"
}
```

---

## PHASE 2: Prepare Frontend (Next.js)

### Step 1: Update Frontend API URL
Edit `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=https://careconnect-api.onrender.com/api
```

Use this exact URL so frontend calls your Render backend directly.

### Step 2: Verify Next.js Config
Check `frontend/next.config.ts` — should look like:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
```

### Step 3: Test Build Locally
```bash
cd frontend
npm install
npm run build
```

If no errors, you're good.

### Step 4: Push to GitHub
```bash
cd /home/raisul/RaisulFiles/CSE471_Project/CSE471-CARECONNECT-
git add .
git commit -m "feat: prepare for Vercel deployment"
git push origin main
```

---

## PHASE 3: Deploy Frontend to Vercel

### Step 1: Go to Vercel
1. Open https://vercel.com
2. Sign in with GitHub
3. Click **Add New** → **Project**
4. Select your repo `CSE471-CARECONNECT-`

### Step 2: Configure Vercel Settings
- **Project Name:** `careconnect` (or your choice)
- **Framework Preset:** `Next.js`
- **Root Directory:** `frontend` (⚠️ **CRITICAL** — not root, not `frontend/frontendreq`)
- **Node.js Version:** `20.x` (latest LTS)

### Step 3: Add Environment Variables
Click **Environment Variables** and add:

```
NEXT_PUBLIC_API_URL = https://careconnect-api.onrender.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
NEXT_PUBLIC_STREAM_API_KEY = your_stream_key
```

Set **Environments:** `Production`, `Preview`, `Development` (select all three).

### Step 4: Deploy
Click **Deploy**. Vercel shows build progress. Wait for green checkmark.

### Step 5: Get Your Frontend URL
Vercel shows:
```
✅ Production: https://careconnect-sepia.vercel.app
```

---

## PHASE 4: Update Backend with Frontend Domain

### Step 1: Go Back to Render (or your backend host)
1. Open your backend service dashboard
2. Click **Environment** (or Settings)
3. Update these variables:

```
CLIENT_URL=https://careconnect-sepia.vercel.app
CLIENT_URLS=https://careconnect-sepia.vercel.app,https://*.vercel.app
ALLOW_VERCEL_PREVIEW_ORIGINS=true
```

### Step 2: Redeploy Backend
Click **Redeploy** or wait for auto-redeploy. Service restarts with new CORS settings.

---

## PHASE 5: Test Login on Vercel

### Step 1: Open Frontend
Go to: `https://careconnect-sepia.vercel.app/login`

### Step 2: Try Login
Use a seeded account from `backend/prisma/seed.ts`:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@careconnect.com` | `admin123` |
| Parent | `parent@careconnect.com` | `parent123` |
| Sitter | `sitter@careconnect.com` | `sitter123` |

⚠️ **First, seed your MongoDB:**
```bash
cd backend
npx prisma db push
npm run prisma:seed
```

### Step 3: Check Network Tab
If login fails:
1. Open DevTools (F12) → **Network**
2. Try login again
3. Look for `/auth/login` request:
   - **Status 404:** Backend URL is wrong
   - **Status CORS error:** Backend CORS not updated
   - **Status 400 + "Invalid credentials":** Credentials wrong (API works!)
   - **Status 200:** Login successful ✅

---

## PHASE 6: Troubleshooting

### Problem: "Login failed. Check API URL..."
**Solution:**
1. In Vercel → **Settings → Environment Variables**, confirm `NEXT_PUBLIC_API_URL` is set.
2. Click **Deployments** → **Redeploy latest** (env vars only bake at build time).
3. Wait 5 minutes for redeployment.

### Problem: CORS Error in Network Tab
**Solution:**
1. Go to Render/backend settings
2. Confirm `CLIENT_URL` matches your Vercel domain exactly
3. Redeploy backend
4. Wait 2 minutes, then retry login

### Problem: Backend responds but login shows "Invalid credentials"
**Good news!** API works. Either:
- Wrong email/password (try seed accounts above)
- Database not seeded (run `npm run prisma:seed`)
- User account doesn't exist

### Problem: 502 Bad Gateway on Backend
**Solution:**
- Render free tier auto-pauses after 15 min inactivity
- Upgrade to paid or use Railway/Fly
- Or set up uptime monitor (UptimeRobot) to ping every 5 min

---

## Final Checklist

- [ ] Backend deployed on Render/Railway/Fly (not Vercel)
- [ ] Backend shows green "live" status
- [ ] Backend domain is reachable in browser
- [ ] Frontend deployed on Vercel with **Root Directory = `frontend`**
- [ ] `NEXT_PUBLIC_API_URL` set in Vercel env vars
- [ ] Backend env vars include `CLIENT_URL` with your Vercel domain
- [ ] Backend redeployed after env var changes
- [ ] Database seeded with test accounts
- [ ] Login works end-to-end on production

---

## Quick Reference

| Component | Host | URL |
|-----------|------|-----|
| Frontend | Vercel | https://careconnect-sepia.vercel.app |
| Backend API | Render | https://careconnect-api.onrender.com |
| Database | MongoDB Atlas | (no public URL) |

---

## After Deployment

### Add Custom Domain
1. In Vercel → **Settings → Domains**
2. Add your domain (e.g., `careconnect.com`)
3. Follow DNS instructions

### Enable Analytics
1. Vercel → **Analytics**
2. Track user sessions, API latency, etc.

### Set Up CI/CD
Vercel auto-deploys on `git push`. No extra setup needed!

### Monitor Backend Logs
Render → **Logs** tab shows API errors in real-time.

---

## Common Env Var Mistakes

❌ **Wrong:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api  # Local URL in production!
NEXT_PUBLIC_API_URL=https://careconnect-sepia.vercel.app/api  # Frontend calling itself!
```

✅ **Right:**
```
NEXT_PUBLIC_API_URL=https://careconnect-api.onrender.com/api  # Backend domain
```

---

**You're all set! Go deploy! 🚀**
