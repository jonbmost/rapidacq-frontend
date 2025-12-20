const express = require('express');
const router = express.Router();
const kb = require('../knowledge-base-loader');
const { buildGuardrailPrompt, getToolSpecificGuardrails } = require('../guardrails');

router.post('/strategy-advisor', async (req, res) => {
  try {
    const { requirement, budget, urgency, complexity, incumbentStatus } = req.body;

    if (!requirement) {
      return res.status(400).json({ error: 'Requirement description is required' });
    }

    const agileGuidelines = await kb.getAgileGuidelines();
    const guardrails = buildGuardrailPrompt();
    const strategyGuardrails = getToolSpecificGuardrails('strategy-advisor');

    const systemPrompt = `You are an expert agile acquisition strategist who challenges traditional approaches.

${guardrails}

${strategyGuardrails}

${agileGuidelines ? `AGILE METHODOLOGY:\n${agileGuidelines}\n\n` : ''}

CRITICAL: Your recommendations must:
1. START WITH USER OUTCOMES - Define success from mission/user perspective
2. DESIGN FOR MODULARITY - Break into phases, create competitive onramps
3. ENABLE VENDOR DIVERSITY - Mix contract types, multiple entry points
4. CHALLENGE DEFAULTS - Don't default to GSA schedules or traditional FAR Part 15
5. RECOMMEND CONCRETE VEHICLES - OTAs, CSOs, BPAs, SBIR Phase III with specific justification
6. CONSIDER NON-TRADITIONAL VENDORS - Make space for startups and small businesses
7. BUILD IN FLEXIBILITY - Design contracts that enable pivots and iteration

Push back against waterfall thinking. Be direct about tradeoffs.`;

    const userPrompt = `Recommend agile acquisition strategy for:

**Requirement:** ${requirement}

${budget ? `**Budget:** ${budget}\n\n` : ''}

${urgency ? `**Urgency:** ${urgency}\n\n` : ''}

${complexity ? `**Complexity:** ${complexity}\n\n` : ''}

${incumbentStatus ? `**Incumbent Status:** ${incumbentStatus}\n\n` : ''}

Provide AGILE strategy including:
1. **Recommended Vehicle** (OTA, CSO, BPA, FAR Part 12/15, SBIR Phase III) with specific justification
2. **Modular Approach** - How to break into phases/increments
3. **Contract Structure** - Type (FFP per iteration, T&M, LOE) and why
4. **Competition Strategy** - Challenge-based? Tech demos? Phased downselect?
5. **Vendor Diversity** - How to enable non-traditionals and small business
6. **Risk Mitigation** - Smart risks with bounded cost/time
7. **Timeline** - Realistic, MVP-focused milestones
8. **Exit Strategy** - How to pivot if needed

Be specific. Challenge assumptions. Recommend the AGILE path, not just the safe one.`;

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
        tool: 'Acquisition Strategy Advisor',
        principles: 'Agile Acquisition with Evidence-Based Strategy'
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
