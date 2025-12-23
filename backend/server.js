const express = require('express');
const cors = require('cors');
const verifyGoogleToken = require('./middleware/verifyGoogleToken');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// General chat endpoint (proxies to SOW Generator for now)
const fetch = require('node-fetch');
app.post('/api/chat', async (req, res) => {
  try {
    // Proxy to SOW Generator tool endpoint
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/tools/sow-generator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error || 'API error' });
    }

    const data = await response.json();
    // Return in frontend-expected format
    return res.status(200).json({ response: data.sow || data.response || 'No response.' });
  } catch (error) {
    console.error('General chat error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});
// Health check (public)
app.get('/', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'acquisition-assistant-backend',
    version: '1.0.0',
    tools: 9,
    timestamp: new Date().toISOString() 
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Import all routes
const sowGenerator = require('./routes/sow-generator');
const marketResearch = require('./routes/market-research');
const strategyAdvisor = require('./routes/strategy-advisor');
const contractReview = require('./routes/contract-review');
const farCompliance = require('./routes/far-compliance');
const sbirTransition = require('./routes/sbir-transition');
const agilePlanner = require('./routes/agile-planner');
const pmCorCoordinator = require('./routes/pm-cor-coordinator');
const rfpGenerator = require('./routes/rfp-generator');
const organizations = require('./routes/organizations');

// Public routes (no auth required)
app.use('/api', organizations);

// Protected routes (require auth - currently allowing all for testing)
app.use(verifyGoogleToken);

// Mount all tool endpoints
app.use('/api/tools', sowGenerator);
app.use('/api/tools', marketResearch);
app.use('/api/tools', strategyAdvisor);
app.use('/api/tools', contractReview);
app.use('/api/tools', farCompliance);
app.use('/api/tools', sbirTransition);
app.use('/api/tools', agilePlanner);
app.use('/api/tools', pmCorCoordinator);
app.use('/api/tools', rfpGenerator);

// List all available tools
app.get('/api/tools', (req, res) => {
  res.json({
    tools: [
      { name: 'SOW Generator', endpoint: '/api/tools/sow-generator', method: 'POST' },
      { name: 'Market Research Assistant', endpoint: '/api/tools/market-research', method: 'POST' },
      { name: 'Acquisition Strategy Advisor', endpoint: '/api/tools/strategy-advisor', method: 'POST' },
      { name: 'Contract Review', endpoint: '/api/tools/contract-review', method: 'POST' },
      { name: 'FAR Compliance Checker', endpoint: '/api/tools/far-compliance', method: 'POST' },
      { name: 'SBIR Phase III Transition Helper', endpoint: '/api/tools/sbir-transition', method: 'POST' },
      { name: 'Agile Acquisition Planner', endpoint: '/api/tools/agile-planner', method: 'POST' },
      { name: 'PM/COR Coordinator', endpoint: '/api/tools/pm-cor-coordinator', method: 'POST' },
      { name: 'RFP/RFI Generator', endpoint: '/api/tools/rfp-generator', method: 'POST' }
    ]
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Acquisition Assistant Backend running on port ${PORT}`);
  console.log(`📊 9 acquisition tools available`);
  console.log(`🏢 Organization management enabled`);
});
