const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

router.post('/rfp-generator', async (req, res) => {
  try {
    const { documentType, projectTitle, requirements, evaluationCriteria, timeline } = req.body;

    if (!projectTitle || !requirements) {
      return res.status(400).json({ error: 'Project title and requirements are required' });
    }

    // Load RFQ Template
    const templatePath = path.join('/workspaces/Acquisition-Assistant/knowledge-base/REQUEST FOR QUOTE (RFQ) TEMPLATE.md');
    let template = '';
    try {
      template = await fs.readFile(templatePath, 'utf-8');
    } catch (error) {
      console.warn('RFQ template not found');
    }

    const systemPrompt = `You are an expert federal acquisition specialist creating solicitation documents.

${template ? `Use this template structure:\n${template}\n\n` : ''}

Generate professional ${documentType || 'RFP'} documents including:
- Clear requirements and specifications
- Evaluation criteria and methodology
- Statement of Work/Objectives
- Contract terms and conditions
- Submission instructions
- Compliance requirements

Ensure FAR compliance and best practices.`;

    const userPrompt = `Create a ${documentType || 'Request for Proposal (RFP)'} for:

**Project Title:** ${projectTitle}

**Requirements:**
${requirements}

${evaluationCriteria ? `\n**Evaluation Criteria:**\n${evaluationCriteria}\n\n` : ''}

${timeline ? `**Timeline:**\n${timeline}\n\n` : ''}

Generate a complete, professional ${documentType || 'RFP'} including:
1. Cover Page and Instructions
2. Background and Objectives
3. Scope of Work
4. Technical Requirements
5. Evaluation Criteria
6. Submission Requirements
7. Contract Terms
8. Timeline and Key Dates`;

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
    const rfpContent = data.content[0].text;

    return res.status(200).json({
      success: true,
      document: rfpContent,
      metadata: {
        projectTitle,
        documentType: documentType || 'RFP',
        generatedAt: new Date().toISOString(),
        tool: 'RFP/RFI Generator'
      }
    });

  } catch (error) {
    console.error('RFP Generator error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;
