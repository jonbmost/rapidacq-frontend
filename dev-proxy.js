#!/usr/bin/env node

/**
 * Development Proxy for Authenticated Cloud Run Backend
 * 
 * This proxy adds Google Cloud authentication to requests
 * so the frontend can connect to the backend during development.
 */

const http = require('http');
const https = require('https');
const { execSync } = require('child_process');

const BACKEND_URL = 'https://rapidacq-api-suojmotvaq-uc.a.run.app';
const PORT = 3001;

// Get Google Cloud identity token
function getAuthToken() {
  try {
    return execSync('gcloud auth print-identity-token', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error('Failed to get auth token. Make sure you are logged in to gcloud.');
    return null;
  }
}

// Create proxy server
const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const token = getAuthToken();
  if (!token) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to get authentication token' }));
    return;
  }

  // Proxy the request
  const backendUrl = new URL(req.url, BACKEND_URL);
  const options = {
    hostname: backendUrl.hostname,
    port: 443,
    path: backendUrl.pathname + backendUrl.search,
    method: req.method,
    headers: {
      ...req.headers,
      'Authorization': `Bearer ${token}`,
      'host': backendUrl.hostname,
    },
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (error) => {
    console.error('Proxy error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  });

  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log(`\n🔐 Development Proxy Running`);
  console.log(`   Local:  http://localhost:${PORT}`);
  console.log(`   Backend: ${BACKEND_URL}`);
  console.log(`\n✅ Update your .env.local:`);
  console.log(`   NEXT_PUBLIC_API_URL=http://localhost:${PORT}\n`);
});
