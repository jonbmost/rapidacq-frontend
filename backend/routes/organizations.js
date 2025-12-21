const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/organizations.json');

// Ensure data file exists
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ organizations: [] }, null, 2));
  }
}

// Get all organizations (admin only)
router.get('/organizations', async (req, res) => {
  try {
    await ensureDataFile();
    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
    return res.json({ success: true, organizations: data.organizations });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Create new organization
router.post('/organizations', async (req, res) => {
  try {
    const {
      organizationName,
      organizationType,
      contactName,
      contactEmail,
      contactPhone,
      acquisitionPriorities,
      teamSize,
      annualVolume,
      painPoints,
      preferredAuthorities
    } = req.body;

    if (!organizationName || !contactName || !contactEmail) {
      return res.status(400).json({ 
        error: 'Organization name, contact name, and email are required' 
      });
    }

    await ensureDataFile();
    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));

    const newOrg = {
      id: `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      organizationName,
      organizationType,
      contactName,
      contactEmail,
      contactPhone,
      acquisitionPriorities: acquisitionPriorities || [],
      teamSize,
      annualVolume,
      painPoints,
      preferredAuthorities: preferredAuthorities || [],
      status: 'pending', // pending, active, inactive
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.organizations.push(newOrg);
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));

    return res.status(201).json({ 
      success: true, 
      organization: newOrg,
      message: 'Organization onboarded successfully'
    });

  } catch (error) {
    console.error('Organization creation error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Get organization by ID
router.get('/organizations/:id', async (req, res) => {
  try {
    await ensureDataFile();
    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
    const org = data.organizations.find(o => o.id === req.params.id);
    
    if (!org) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    return res.json({ success: true, organization: org });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update organization status
router.patch('/organizations/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    await ensureDataFile();
    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
    const orgIndex = data.organizations.findIndex(o => o.id === req.params.id);
    
    if (orgIndex === -1) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    data.organizations[orgIndex] = {
      ...data.organizations[orgIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));

    return res.json({ 
      success: true, 
      organization: data.organizations[orgIndex] 
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
