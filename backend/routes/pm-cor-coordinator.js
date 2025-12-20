const express = require('express');
const router = express.Router();

router.post('/pm-cor-coordinator', async (req, res) => {
  try {
    const { contractInfo, issue, stakeholders, urgency } = req.body;

    if (!contractInfo || !issue) {
      return res.status(400).json({ error: 'Contract info and issue description are required' });
    }

    const systemPrompt = `You are an expert Program Manager and Contracting Officer Representative coordinator.

Provide guidance on:
- PM/COR roles and responsibilities
- Communication protocols
- Issue escalation procedures
- Contract administration
- Performance monitoring
- Invoice and payment processing
- Modification procedures
- Documentation requirements

Ensure proper coordination and compliance with federal contracting regulations.`;

    const userPrompt = `Coordinate PM/COR response for:

**Contract:** ${contractInfo}

**Issue:** ${issue}

${stakeholders ? `**Stakeholders:** ${stakeholders}\n\n` : ''}

${urgency ? `**Urgency:** ${urgency}\n\n` : ''}

Provide coordination guidance including:
1. Issue Assessment and Classification
2. Roles and Responsibilities
3. Recommended Actions (PM vs COR)
4. Communication Plan
5. Escalation Path (if needed)
6. Required Documentation
7. Timeline and Next Steps
8. Risk Mitigation`;

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
    const coordinationContent = data.content[0].text;

    return res.status(200).json({
      success: true,
      coordination: coordinationContent,
      metadata: {
        contractInfo,
        generatedAt: new Date().toISOString(),
        tool: 'PM/COR Coordinator'
      }
    });

  } catch (error) {
    console.error('PM/COR Coordinator error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;
