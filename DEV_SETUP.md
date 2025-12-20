# Development Setup Guide

## Quick Start

Since your organization blocks public access to Cloud Run, we've created a development proxy that handles authentication automatically.

### Start Development

**Option 1: Run everything together (recommended)**
```bash
# This will be added when concurrently is installed
npm run dev:full
```

**Option 2: Run separately in different terminals**

Terminal 1 - Start the proxy:
```bash
npm run dev:proxy
```

Terminal 2 - Start Next.js:
```bash
npm run dev
```

### What's Happening

1. **Development Proxy** (port 3001)
   - Automatically adds Google Cloud authentication to requests
   - Handles CORS for local development
   - Proxies requests to: `https://rapidacq-api-suojmotvaq-uc.a.run.app`

2. **Next.js Frontend** (port 3000)
   - Connects to proxy at `http://localhost:3001`
   - Shows real-time API status in the nav bar
   - Displays connection banner when backend is online

### Verify Connection

1. Open http://localhost:3000
2. Look for the green ✓ "API Connected" indicator in the top right
3. You should see "Connected to Google Cloud Backend" banner

### Test the API

```bash
# Health check
curl http://localhost:3001/health

# Expected response:
# {"status":"ok","service":"rapidacq-api"}
```

### Production Deployment

For production on Vercel, you'll need to:

1. **Option A: Use API Gateway** (Recommended)
   - Set up Cloud API Gateway with CORS
   - Enable public access through API Gateway
   - Update `NEXT_PUBLIC_API_URL` to API Gateway URL

2. **Option B: Use Cloud Run with IAP**
   - Set up Identity-Aware Proxy
   - Configure OAuth for your domain

3. **Option C: Create Public Endpoints**
   - Work with your GCP admin to allow `allUsers` for specific services
   - Or create a separate public-facing API layer

### Troubleshooting

**Proxy not working?**
```bash
# Make sure you're logged into gcloud
gcloud auth login

# Test authentication
gcloud auth print-identity-token

# Restart the proxy
npm run dev:proxy
```

**Can't connect to backend?**
- Check that proxy is running on port 3001
- Verify `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:3001`
- Restart Next.js dev server

## Architecture

```
Browser (localhost:3000)
    ↓
Next.js Frontend
    ↓ HTTP
Dev Proxy (localhost:3001)
    ↓ HTTPS + Auth Token
Cloud Run Backend (rapidacq-api-suojmotvaq-uc.a.run.app)
```
