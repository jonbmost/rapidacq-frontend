const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

router.post('/far-compliance', async (req, res) => {
  try {
    const { documentText, acquisitionType, contractValue } = req.body;

    if (!documentText) {
      return res.status(400).json({ error: 'Document text is required' });
    }

    // Load FAR Quick Reference
    const farPath = path.join('/workspaces/Acquisition-Assistant/knowledge-base/FAR-Quick-Reference.md');
    let farReference = '';
    try {
      farReference = await fs.readFile(farPath, 'utf-8');
    } catch (error) {
      console.warn('FAR reference not found');
    }

    const systemPrompt = `You are an expert FAR compliance specialist and federal contracting officer.

${farReference ? `Use this FAR reference:\n${farReference}\n\n` : ''}

Check compliance with:
- Required FAR clauses
- Proper citations and references
- Applicability thresholds
- Contract type requirements
- Small business provisions
- Socioeconomic requirements
- Protest vulnerabilities

Provide specific FAR citations for all findings.`;

    const userPrompt = `Check FAR compliance for:

${acquisitionType ? `**Acquisition Type:** ${acquisitionType}\n\n` : ''}

${contractValue ? `**Contract Value:** ${contractValue}\n\n` : ''}

**Document to Review:**
${documentText}

Provide detailed compliance analysis including:
1. Required Clauses (with FAR citations)
2. Missing or Incorrect Clauses
3. Compliance Issues and Risks
4. Recommended Corrections
5. Protest Vulnerabilities
6. Best Practice Recommendations`;

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
    const complianceContent = data.content[0].text;

    return res.status(200).json({
      success: true,
      compliance: complianceContent,
      metadata: {
        acquisitionType: acquisitionType || 'general',
        generatedAt: new Date().toISOString(),
        tool: 'FAR Compliance Checker'
      }
    });

  } catch (error) {
    console.error('FAR Compliance error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;
