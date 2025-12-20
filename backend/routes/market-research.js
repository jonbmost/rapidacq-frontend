const express = require('express');
const router = express.Router();

router.post('/market-research', async (req, res) => {
  try {
    const { requirement, industryFocus, estimatedValue, timeline } = req.body;

    if (!requirement) {
      return res.status(400).json({ error: 'Requirement description is required' });
    }

    const systemPrompt = `You are an expert federal acquisition market research specialist.

Provide comprehensive market research analysis including:
- Industry landscape and capabilities
- Potential vendors and qualifications
- Competition assessment
- Pricing trends and cost estimates
- Market maturity and risks
- NAICS codes
- Small business opportunities
- Acquisition strategy recommendations

Follow FAR Part 10 market research requirements.`;

    const userPrompt = `Conduct market research for:

**Requirement:** ${requirement}

${industryFocus ? `**Industry Focus:** ${industryFocus}\n\n` : ''}

${estimatedValue ? `**Estimated Value:** ${estimatedValue}\n\n` : ''}

${timeline ? `**Timeline:** ${timeline}\n\n` : ''}

Provide a comprehensive market research report with:
1. Market Overview
2. Vendor Landscape
3. Competitive Analysis
4. Pricing and Cost Analysis
5. Small Business Opportunities
6. Recommendations for Acquisition Strategy`;

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
    const researchContent = data.content[0].text;

    return res.status(200).json({
      success: true,
      research: researchContent,
      metadata: {
        requirement,
        generatedAt: new Date().toISOString(),
        tool: 'Market Research Assistant'
      }
    });

  } catch (error) {
    console.error('Market Research error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;
