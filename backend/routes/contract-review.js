const express = require('express');
const router = express.Router();

router.post('/contract-review', async (req, res) => {
  try {
    const { contractText, reviewType, specificClauses } = req.body;

    if (!contractText) {
      return res.status(400).json({ error: 'Contract text is required' });
    }

    const systemPrompt = `You are an expert federal contract attorney and acquisition specialist.

Review contracts for:
- Legal compliance and risk
- FAR clause appropriateness
- Terms and conditions analysis
- Pricing and cost reasonableness
- Performance requirements clarity
- Intellectual property rights
- Dispute resolution provisions
- Flow-down requirements

Provide actionable recommendations and identify red flags.`;

    const userPrompt = `Review this contract:

${reviewType ? `**Review Type:** ${reviewType}\n\n` : ''}

**Contract Text:**
${contractText}

${specificClauses ? `\n\n**Focus on these clauses:** ${specificClauses}\n\n` : ''}

Provide a comprehensive review including:
1. Overall Assessment
2. Compliance Issues
3. Risk Areas
4. Missing or Problematic Clauses
5. Pricing/Cost Analysis
6. Recommendations for Improvement
7. Red Flags and Required Actions`;

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
    const reviewContent = data.content[0].text;

    return res.status(200).json({
      success: true,
      review: reviewContent,
      metadata: {
        reviewType: reviewType || 'general',
        generatedAt: new Date().toISOString(),
        tool: 'Contract Review'
      }
    });

  } catch (error) {
    console.error('Contract Review error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;
