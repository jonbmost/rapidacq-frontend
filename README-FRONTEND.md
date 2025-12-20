# RapidAcq Frontend - Quick Setup

## 🚀 5-Minute Setup

### Step 1: Create & Clone Repo

1. Go to GitHub.com
2. Create new repo named: `rapidacq-frontend`
3. Make it **Public** (or Private)
4. **DO NOT** initialize with README
5. Click "Create repository"

Then in terminal:
```bash
git clone https://github.com/YOUR_USERNAME/rapidacq-frontend.git
cd rapidacq-frontend
```

### Step 2: Copy Files

Download all files from Claude, then copy them:

```bash
cp ~/Downloads/frontend-package.json package.json
cp ~/Downloads/frontend-next.config.ts next.config.ts
cp ~/Downloads/frontend-tailwind.config.ts tailwind.config.ts
cp ~/Downloads/tsconfig.json tsconfig.json
cp ~/Downloads/postcss.config.mjs postcss.config.mjs
```

Create app directory:
```bash
mkdir -p app
cp ~/Downloads/frontend-app-layout.tsx app/layout.tsx
cp ~/Downloads/frontend-globals.css app/globals.css
cp ~/Downloads/frontend-page.tsx app/page.tsx
```

### Step 3: Install & Run

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000

### Step 4: Push to GitHub

```bash
git add .
git commit -m "Initial commit: RapidAcq frontend"
git push origin main
```

### Step 5: Deploy to Vercel

```bash
npx vercel
```

Follow prompts, deploy!

## ✅ You're Done!

Your site should be live at: `https://rapidacq-frontend.vercel.app`

## 📝 What's Included

- ✅ Professional homepage
- ✅ Responsive design
- ✅ TypeScript + Tailwind
- ✅ Ready for backend integration
- ✅ Production-ready

## 🎨 Next Steps

Add these pages:
1. `/pricing` - Pricing tiers
2. `/about` - Your story
3. `/contact` - Contact form
4. `/login` & `/signup` - Auth pages

I can help create any of these!
