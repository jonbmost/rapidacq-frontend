const express = require('express');
const router = express.Router();

router.post('/sbir-transition', async (req, res) => {
  try {
    const { technology, sbirPhase, priorAwards, transitionGoal } = req.body;

    if (!technology) {
      return res.status(400).json({ error: 'Technology description is required' });
    }

    const systemPrompt = `You are an expert in SBIR/STTR Phase III transitions and federal technology acquisition.

Provide guidance on:
- SBIR Phase III sole-source authority (FAR 19.1305)
- Transition pathways and strategies
- Justification and documentation requirements
- Risk mitigation
- Partnership opportunities
- Funding mechanisms
- Timeline development

Ensure compliance with SBIR/STTR policy directives and agency-specific requirements.`;

    const userPrompt = `Help transition this SBIR technology:

**Technology:** ${technology}

${sbirPhase ? `**Current SBIR Phase:** ${sbirPhase}\n\n` : ''}

${priorAwards ? `**Prior SBIR Awards:** ${priorAwards}\n\n` : ''}

${transitionGoal ? `**Transition Goal:** ${transitionGoal}\n\n` : ''}

Provide comprehensive transition guidance including:
1. Phase III Eligibility Assessment
2. Sole-Source Justification Strategy
3. Recommended Transition Pathway
4. Required Documentation
5. Timeline and Milestones
6. Risk Factors and Mitigation
7. Funding Strategy
8. Next Steps and Action Items`;

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
    const transitionContent = data.content[0].text;

    return res.status(200).json({
      success: true,
      transition: transitionContent,
      metadata: {
        technology,
        generatedAt: new Date().toISOString(),
        tool: 'SBIR Phase III Transition Helper'
      }
    });

  } catch (error) {
    console.error('SBIR Transition error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;
