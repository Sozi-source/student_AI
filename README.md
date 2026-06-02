# KNDI Assistant — Deployment Guide

AI-powered academic assistant for Human Nutrition & Dietetics students at Imperial College of Medical and Health Sciences.

Built with: **Next.js 14 + Groq AI (llama-3.3-70b) + Vercel**

---

## What This App Does

- Answers student questions about KNDI indexing, upgrading, aptitude, and licensing exams
- Uses the official KNDI 2026 knowledge base (fees, dates, links, contacts)
- Responds in English or Kiswahili
- Works on mobile and desktop
- Free to run (Groq free tier + Vercel free tier)

---

## Step 1 — Get Your Groq API Key (Free)

1. Go to **https://console.groq.com**
2. Sign up with your email
3. Click **"API Keys"** in the sidebar
4. Click **"Create API Key"**
5. Copy the key — it starts with `gsk_...`
6. Save it somewhere safe (you'll use it in Step 3)

---

## Step 2 — Push Code to GitHub

1. Go to **https://github.com** and sign in (or create a free account)
2. Click **"New repository"** (the green button)
3. Name it: `kndi-assistant`
4. Set to **Public** (required for Vercel free tier)
5. Click **"Create repository"**
6. Follow GitHub's instructions to push this folder:

```bash
cd kndi-assistant
git init
git add .
git commit -m "Initial commit: KNDI Assistant"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kndi-assistant.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 3 — Deploy to Vercel (Free)

1. Go to **https://vercel.com**
2. Click **"Sign Up"** → choose **"Continue with GitHub"**
3. Click **"Add New Project"**
4. Find and click **"kndi-assistant"** from your GitHub repos
5. Click **"Import"**
6. In the **"Environment Variables"** section, add:
   - **Name:** `GROQ_API_KEY`
   - **Value:** paste your key from Step 1 (the `gsk_...` key)
7. Click **"Deploy"**

Wait about 60 seconds. Vercel will build and deploy automatically.

---

## Step 4 — Get Your Public URL

After deployment, Vercel gives you a URL like:

```
https://kndi-assistant.vercel.app
```

or a custom one like:

```
https://kndi-assistant-imperialcollege.vercel.app
```

**Share this link in your WhatsApp group!**

Students open it in their phone browser and chat with the KNDI Assistant instantly.

---

## Step 5 — (Optional) Add a Custom Domain

If you want a professional URL like `kndi.icmhs.co.ke`:

1. In Vercel dashboard → your project → **"Settings"** → **"Domains"**
2. Add your domain
3. Follow the DNS instructions (you'll need access to your domain registrar)

---

## Local Development (For Testing)

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local
# Then edit .env.local and add your GROQ_API_KEY

# Run development server
npm run dev

# Open in browser
http://localhost:3000
```

---

## Updating the Knowledge Base

To add or update KNDI information:

1. Open `app/api/chat/knowledge.js`
2. Edit the `SYSTEM_PROMPT` string
3. Save the file
4. Push to GitHub → Vercel redeploys automatically

```bash
git add .
git commit -m "Update KNDI knowledge base"
git push
```

---

## Project Structure

```
kndi-assistant/
├── app/
│   ├── api/
│   │   └── chat/
│   │       ├── route.js        ← Groq API handler
│   │       └── knowledge.js    ← KNDI knowledge base
│   ├── page.js                 ← Chat UI
│   ├── page.module.css         ← Styles
│   ├── layout.js               ← App layout & metadata
│   └── globals.css             ← Global styles
├── .env.local.example          ← Environment variable template
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

---

## Free Tier Limits

| Service | Free Limit | Your Expected Usage |
|---------|-----------|-------------------|
| Vercel  | 100GB bandwidth/month | Well within limits |
| Groq    | 14,400 requests/day | ~200 students × 10 msgs = 2,000/day |

You will not exceed free limits for a department student group.

---

## Support

For issues with the app: check Vercel deployment logs at vercel.com/dashboard

For KNDI queries contact:
- 📞 +254 0112 514 865
- 📧 info@kndi.institute
- 🌐 www.kndi.institute
