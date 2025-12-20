# Backend Connection Setup

## Overview
The RapidAcq frontend is now connected to the Google Cloud backend deployed on Cloud Run.

## Configuration

### Backend Endpoints
- **Production API:** `https://rapidacq-api-suojmotvaq-uc.a.run.app`
- **Health Check:** `/health` ✅ (works with auth)
- **Chat API:** `/chat`
- **Document Analysis:** `/document-analysis`
- **URL Query:** `/url-query`
- **MCP Tools:** `/mcp`

### Authentication Status
⚠️ **The backend requires authentication** due to organization policies. 

**Options:**
1. **Development Proxy** (Recommended): Run a local proxy that adds authentication
2. **Deploy with Auth**: Use Google Identity-Aware Proxy
3. **API Gateway**: Set up Cloud API Gateway with CORS

### Testing with Authentication
```bash
TOKEN=$(gcloud auth print-identity-token)
curl -H "Authorization: Bearer $TOKEN" https://rapidacq-api-suojmotvaq-uc.a.run.app/health
```

### Environment Variables
Located in `.env.local` (not committed to git):
```env
NEXT_PUBLIC_API_URL=https://rapidacq-api-266001336704.us-central1.run.app
NEXT_PUBLIC_PROJECT_ID=rapidacq
```

## API Client Usage

The API client is located at `lib/api.ts` and provides easy methods to call backend endpoints:

```typescript
import { api } from '@/lib/api';

// Health check
const result = await api.healthCheck();

// Send chat message
const response = await api.sendChatMessage('Hello!');

// Analyze document
const analysis = await api.analyzeDocument('https://example.com/doc.pdf');

// Query URL
const answer = await api.queryUrl('https://example.com', 'What is this about?');

// Call MCP tool
const mcpResult = await api.callMcpTool('toolName', { param: 'value' });
```

## Frontend Features

### API Status Indicator
The homepage now displays a real-time connection status in the navigation bar:
- ✅ Green check: Connected to backend
- ❌ Red X: Disconnected from backend
- ⏳ Gray: Checking connection

### Connection Banner
When connected, a green banner appears on the homepage showing "Connected to Google Cloud Backend"

## Development

### Running Locally
```bash
npm run dev
```

The frontend will:
1. Load environment variables from `.env.local`
2. Connect to the Google Cloud backend
3. Display connection status on the homepage
4. Be available at http://localhost:3000

### Testing the Connection
1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Check the API status indicator in the top right
4. Look for the green "Connected to Google Cloud Backend" banner

## Deployment

When deploying to Vercel, add these environment variables:
- `NEXT_PUBLIC_API_URL` - Your Cloud Run backend URL
- `NEXT_PUBLIC_PROJECT_ID` - Your Google Cloud project ID

## Cloud Run Backend

### Service Details
- **Name:** `rapidacq-api`
- **Region:** `us-central1`
- **Project:** `rapidacq`
- **URL:** https://rapidacq-api-266001336704.us-central1.run.app

### Latest Build
Build ID: `9495e3b9-071f-4ff7-a554-01f9a7e4a1da`
- View logs: [Cloud Build Console](https://console.cloud.google.com/cloud-build/builds;region=us-central1/9495e3b9-071f-4ff7-a554-01f9a7e4a1da?project=rapidacq)

## Next Steps

1. **Add Authentication:** Implement user authentication to secure API calls
2. **Error Handling:** Add retry logic and better error messages
3. **Loading States:** Add loading indicators for API calls
4. **Caching:** Implement client-side caching for API responses
5. **Rate Limiting:** Add rate limiting awareness
6. **MCP Tools Integration:** Copy MCP tools from Acquisition-Assistant and integrate them into the backend

## Troubleshooting

### API Not Connecting
1. Check that the backend is running: `curl https://rapidacq-api-266001336704.us-central1.run.app/api/health`
2. Verify environment variables are loaded
3. Check browser console for CORS errors
4. Ensure Cloud Run service is not sleeping (first request may be slow)

### Environment Variables Not Loading
1. Ensure `.env.local` exists in the project root
2. Restart the dev server: `npm run dev`
3. Check that variables start with `NEXT_PUBLIC_`

### CORS Issues
If you see CORS errors, the backend needs to allow requests from your frontend domain. Update the backend CORS configuration to include your Vercel domain.
