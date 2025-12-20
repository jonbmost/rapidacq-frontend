const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

router.post('/sow-generator', async (req, res) => {
  try {
    const { projectTitle, description, requirements, performanceObjectives } = req.body;

    if (!projectTitle || !description) {
      return res.status(400).json({ 
        error: 'Project title and description are required' 
      });
    }

    // Load SOO template from knowledge base
    const templatePath = path.join('/workspaces/Acquisition-Assistant/knowledge-base/SOO Template.md');
    let template = '';
    try {
      template = await fs.readFile(templatePath, 'utf-8');
    } catch (error) {
      console.warn('Template not found, using default structure');
    }

    const systemPrompt = `You are an expert federal acquisition specialist creating Statements of Objectives (SOO).

${template ? `Use this template structure:\n${template}\n\n` : ''}

Follow these principles:
- Clear, measurable objectives
- Performance-based language
- Compliance with FAR Part 37.6
- Focus on outcomes, not methods
- Include quality standards

Generate professional, government-ready documentation.`;

    const userPrompt = `Create a Statement of Objectives for:

**Project Title:** ${projectTitle}

**Description:** ${description}

${requirements ? `**Requirements:**\n${requirements}\n\n` : ''}

${performanceObjectives ? `**Performance Objectives:**\n${performanceObjectives}\n\n` : ''}

Generate a complete, professional SOO following federal acquisition standards. Include:
1. Background
2. Scope
3. Specific Objectives
4. Performance Standards
5. Deliverables and Schedule`;

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
    const sowContent = data.content[0].text;

    return res.status(200).json({
      success: true,
      sow: sowContent,
      metadata: {
        projectTitle,
        generatedAt: new Date().toISOString(),
        tool: 'SOW Generator'
      }
    });

  } catch (error) {
    console.error('SOW Generator error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;
