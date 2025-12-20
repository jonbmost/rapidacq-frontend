const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

router.post('/agile-planner', async (req, res) => {
  try {
    const { project, duration, teamSize, deliverables } = req.body;

    if (!project) {
      return res.status(400).json({ error: 'Project description is required' });
    }

    // Load Agile Acquisition Principles
    const principlesPath = path.join('/workspaces/Acquisition-Assistant/knowledge-base/Agile-Acquisition-Principles.md');
    let principles = '';
    try {
      principles = await fs.readFile(principlesPath, 'utf-8');
    } catch (error) {
      console.warn('Agile principles not found');
    }

    const systemPrompt = `You are an expert in agile acquisition and modular contracting strategies.

${principles ? `Apply these agile principles:\n${principles}\n\n` : ''}

Design plans that include:
- Modular contracting approach
- Sprint/iteration structure
- Incremental delivery milestones
- User story development
- Risk-based planning
- DevSecOps integration
- Continuous delivery pipeline

Focus on flexibility, rapid deployment, and user-centered design.`;

    const userPrompt = `Create an agile acquisition plan for:

**Project:** ${project}

${duration ? `**Duration:** ${duration}\n\n` : ''}

${teamSize ? `**Team Size:** ${teamSize}\n\n` : ''}

${deliverables ? `**Key Deliverables:** ${deliverables}\n\n` : ''}

Provide comprehensive agile acquisition plan including:
1. Modular Contracting Strategy
2. Sprint Structure and Timeline
3. User Stories and Epics
4. Incremental Delivery Schedule
5. Performance Metrics and KPIs
6. Risk Management Approach
7. Governance and Oversight Structure
8. Vendor Management Strategy`;

    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!anthropicApiKey) {
      return res.status(500).json({ error: 'Anthropic API key not configured' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: userPrompt
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error?.message || 'API error' });
    }

    const data = await response.json();
    const planContent = data.content[0].text;

    return res.status(200).json({
      success: true,
      plan: planContent,
      metadata: {
        project,
        generatedAt: new Date().toISOString(),
        tool: 'Agile Acquisition Planner'
      }
    });

  } catch (error) {
    console.error('Agile Planner error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;
