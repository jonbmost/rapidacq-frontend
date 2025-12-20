const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

router.post('/strategy-advisor', async (req, res) => {
  try {
    const { requirement, budget, urgency, complexity, incumbentStatus } = req.body;

    if (!requirement) {
      return res.status(400).json({ error: 'Requirement description is required' });
    }

    // Load Agile Acquisition Principles
    const principlesPath = path.join('/workspaces/Acquisition-Assistant/knowledge-base/Agile-Acquisition-Principles.md');
    let principles = '';
    try {
      principles = await fs.readFile(principlesPath, 'utf-8');
    } catch (error) {
      console.warn('Agile principles not found');
    }

    const systemPrompt = `You are an expert federal acquisition strategist specializing in alternative acquisition authorities.

${principles ? `Follow these agile acquisition principles:\n${principles}\n\n` : ''}

Provide strategic recommendations for:
- Best acquisition vehicle (FAR Part 15, FAR Part 12, OTA, CSO, SBIR Phase III)
- Contract type selection
- Competition strategy
- Risk mitigation
- Timeline optimization
- Small business considerations

Consider all modern acquisition tools and authorities.`;

    const userPrompt = `Recommend acquisition strategy for:

**Requirement:** ${requirement}

${budget ? `**Budget:** ${budget}\n\n` : ''}

${urgency ? `**Urgency:** ${urgency}\n\n` : ''}

${complexity ? `**Complexity:** ${complexity}\n\n` : ''}

${incumbentStatus ? `**Incumbent Status:** ${incumbentStatus}\n\n` : ''}

Provide comprehensive strategy recommendations including:
1. Recommended Acquisition Vehicle (with justification)
2. Contract Type Recommendation
3. Competition Strategy
4. Timeline and Milestones
5. Risk Assessment and Mitigation
6. Alternative Approaches to Consider`;

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
    const strategyContent = data.content[0].text;

    return res.status(200).json({
      success: true,
      strategy: strategyContent,
      metadata: {
        requirement,
        generatedAt: new Date().toISOString(),
        tool: 'Acquisition Strategy Advisor'
      }
    });

  } catch (error) {
    console.error('Strategy Advisor error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;
