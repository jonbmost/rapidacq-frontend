// Intake questions for each tool - guides users to provide context upfront

export interface IntakeQuestion {
  id: string;
  label: string;
  type: 'text' | 'select' | 'radio' | 'textarea';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface ToolIntakeConfig {
  title: string;
  description: string;
  questions: IntakeQuestion[];
  generatePrompt: (answers: Record<string, string>) => string;
}

export const intakeConfigs: Record<string, ToolIntakeConfig> = {
  'acquisition-strategy': {
    title: 'Tell me about your acquisition',
    description: 'This helps me provide tailored strategy recommendations.',
    questions: [
      {
        id: 'requirement',
        label: 'What are you acquiring?',
        type: 'textarea',
        placeholder: 'e.g., Cloud hosting services, IT support, software development...',
        required: true
      },
      {
        id: 'value',
        label: 'Estimated contract value',
        type: 'select',
        options: [
          { value: 'micro', label: 'Micro-purchase (< $10K)' },
          { value: 'sap', label: 'Simplified ($10K - $250K)' },
          { value: 'medium', label: 'Medium ($250K - $750K)' },
          { value: 'large', label: 'Large ($750K - $10M)' },
          { value: 'major', label: 'Major (> $10M)' }
        ],
        required: true
      },
      {
        id: 'timeline',
        label: 'When do you need this in place?',
        type: 'select',
        options: [
          { value: 'urgent', label: 'Urgent (< 30 days)' },
          { value: 'quick', label: '1-3 months' },
          { value: 'standard', label: '3-6 months' },
          { value: 'flexible', label: '6+ months' }
        ],
        required: true
      },
      {
        id: 'type',
        label: 'Acquisition type',
        type: 'radio',
        options: [
          { value: 'new', label: 'New requirement' },
          { value: 'recompete', label: 'Recompete/follow-on' },
          { value: 'bridge', label: 'Bridge contract' },
          { value: 'modification', label: 'Contract modification' }
        ],
        required: true
      },
      {
        id: 'vehicles',
        label: 'Do you have existing contract vehicles available?',
        type: 'select',
        options: [
          { value: 'unknown', label: "I don't know" },
          { value: 'none', label: 'No existing vehicles' },
          { value: 'gwac', label: 'GWAC (8a STARS, OASIS, etc.)' },
          { value: 'bpa', label: 'BPA' },
          { value: 'idiq', label: 'Agency IDIQ' },
          { value: 'gsa', label: 'GSA Schedule' },
          { value: 'other', label: 'Other vehicle' }
        ]
      },
      {
        id: 'constraints',
        label: 'Any special requirements or constraints?',
        type: 'textarea',
        placeholder: 'e.g., Small business set-aside, security clearances, specific certifications...'
      }
    ],
    generatePrompt: (answers) => {
      const valueLabels: Record<string, string> = {
        micro: 'micro-purchase (under $10K)',
        sap: 'simplified acquisition ($10K-$250K)',
        medium: 'medium value ($250K-$750K)',
        large: 'large ($750K-$10M)',
        major: 'major acquisition (over $10M)'
      };
      const timelineLabels: Record<string, string> = {
        urgent: 'urgent (under 30 days)',
        quick: '1-3 months',
        standard: '3-6 months',
        flexible: '6+ months'
      };
      const typeLabels: Record<string, string> = {
        new: 'new requirement',
        recompete: 'recompete/follow-on',
        bridge: 'bridge contract',
        modification: 'contract modification'
      };
      
      let prompt = `I need help developing an acquisition strategy. Here's my situation:\n\n`;
      prompt += `**Requirement:** ${answers.requirement}\n`;
      prompt += `**Estimated Value:** ${valueLabels[answers.value] || answers.value}\n`;
      prompt += `**Timeline:** ${timelineLabels[answers.timeline] || answers.timeline}\n`;
      prompt += `**Type:** ${typeLabels[answers.type] || answers.type}\n`;
      
      if (answers.vehicles && answers.vehicles !== 'unknown') {
        prompt += `**Available Vehicles:** ${answers.vehicles}\n`;
      }
      
      if (answers.constraints) {
        prompt += `**Constraints/Special Requirements:** ${answers.constraints}\n`;
      }
      
      prompt += `\nBased on this information, what acquisition strategy do you recommend? Please explain the approach, key considerations, and any risks I should be aware of.`;
      
      return prompt;
    }
  },

  'evaluation-criteria': {
    title: 'Tell me about what you need to evaluate',
    description: 'This helps me create relevant evaluation criteria.',
    questions: [
      {
        id: 'requirement',
        label: 'What are you acquiring?',
        type: 'textarea',
        placeholder: 'e.g., Software development services, IT infrastructure...',
        required: true
      },
      {
        id: 'method',
        label: 'Source selection method',
        type: 'select',
        options: [
          { value: 'unknown', label: "I'm not sure" },
          { value: 'lpta', label: 'Lowest Price Technically Acceptable (LPTA)' },
          { value: 'tradeoff', label: 'Best Value Tradeoff' },
          { value: 'value', label: 'Highest Technical Rating' }
        ],
        required: true
      },
      {
        id: 'priority',
        label: 'What matters most?',
        type: 'radio',
        options: [
          { value: 'technical', label: 'Technical capability' },
          { value: 'experience', label: 'Past performance/experience' },
          { value: 'price', label: 'Price' },
          { value: 'balanced', label: 'Balanced approach' }
        ],
        required: true
      },
      {
        id: 'factors',
        label: 'Any specific factors you want to include?',
        type: 'textarea',
        placeholder: 'e.g., Cybersecurity expertise, cleared personnel, specific certifications...'
      }
    ],
    generatePrompt: (answers) => {
      let prompt = `I need help developing evaluation criteria. Here's my situation:\n\n`;
      prompt += `**Requirement:** ${answers.requirement}\n`;
      prompt += `**Source Selection Method:** ${answers.method}\n`;
      prompt += `**Priority:** ${answers.priority}\n`;
      
      if (answers.factors) {
        prompt += `**Specific Factors to Include:** ${answers.factors}\n`;
      }
      
      prompt += `\nPlease provide recommended evaluation factors, subfactors, and a rating scale. Include guidance on how to apply these criteria fairly and consistently.`;
      
      return prompt;
    }
  },

  'requirement-documents': {
    title: 'Tell me about your requirement',
    description: 'This helps me generate the right document structure.',
    questions: [
      {
        id: 'docType',
        label: 'What document do you need?',
        type: 'select',
        options: [
          { value: 'soo', label: 'Statement of Objectives (SOO)' },
          { value: 'pws', label: 'Performance Work Statement (PWS)' },
          { value: 'sow', label: 'Statement of Work (SOW)' },
          { value: 'unsure', label: "I'm not sure which one" }
        ],
        required: true
      },
      {
        id: 'requirement',
        label: 'Describe what you need the contractor to do',
        type: 'textarea',
        placeholder: 'e.g., Provide help desk support, develop a web application, maintain IT systems...',
        required: true
      },
      {
        id: 'outcomes',
        label: 'What outcomes or results do you need?',
        type: 'textarea',
        placeholder: 'e.g., 99.9% uptime, 24-hour response time, modernized system...',
        required: true
      },
      {
        id: 'duration',
        label: 'Period of performance',
        type: 'select',
        options: [
          { value: 'short', label: 'Less than 1 year' },
          { value: 'base', label: '1 year base' },
          { value: 'baseoption', label: '1 year base + option years' },
          { value: 'multi', label: 'Multi-year (3-5 years)' },
          { value: 'idiq', label: 'IDIQ (task order based)' }
        ],
        required: true
      },
      {
        id: 'location',
        label: 'Where will work be performed?',
        type: 'radio',
        options: [
          { value: 'onsite', label: 'Government site' },
          { value: 'contractor', label: 'Contractor site' },
          { value: 'remote', label: 'Remote' },
          { value: 'hybrid', label: 'Hybrid' }
        ]
      }
    ],
    generatePrompt: (answers) => {
      const docLabels: Record<string, string> = {
        soo: 'Statement of Objectives (SOO)',
        pws: 'Performance Work Statement (PWS)',
        sow: 'Statement of Work (SOW)',
        unsure: 'requirements document (please recommend the best type)'
      };
      
      let prompt = `I need help creating a ${docLabels[answers.docType] || 'requirements document'}.\n\n`;
      prompt += `**Requirement:** ${answers.requirement}\n`;
      prompt += `**Desired Outcomes:** ${answers.outcomes}\n`;
      prompt += `**Period of Performance:** ${answers.duration}\n`;
      
      if (answers.location) {
        prompt += `**Work Location:** ${answers.location}\n`;
      }
      
      prompt += `\nPlease help me draft this document with appropriate sections, clear requirements, and measurable outcomes.`;
      
      return prompt;
    }
  },

  'authority-assessment': {
    title: 'Tell me about your situation',
    description: 'This helps me recommend the right acquisition authority.',
    questions: [
      {
        id: 'requirement',
        label: 'What are you trying to acquire?',
        type: 'textarea',
        placeholder: 'e.g., Innovative AI solution, prototype development, commercial software...',
        required: true
      },
      {
        id: 'situation',
        label: 'What best describes your situation?',
        type: 'select',
        options: [
          { value: 'innovative', label: 'Need innovative/non-traditional solution' },
          { value: 'prototype', label: 'Need prototype or R&D' },
          { value: 'commercial', label: 'Commercial product available' },
          { value: 'sbir', label: 'Working with SBIR company' },
          { value: 'urgent', label: 'Urgent operational need' },
          { value: 'unsure', label: "Not sure - help me figure it out" }
        ],
        required: true
      },
      {
        id: 'value',
        label: 'Estimated value',
        type: 'select',
        options: [
          { value: 'small', label: 'Under $250K' },
          { value: 'medium', label: '$250K - $5M' },
          { value: 'large', label: '$5M - $25M' },
          { value: 'major', label: 'Over $25M' }
        ],
        required: true
      },
      {
        id: 'agency',
        label: 'What agency/component?',
        type: 'text',
        placeholder: 'e.g., Army, DHS, State Department...'
      }
    ],
    generatePrompt: (answers) => {
      let prompt = `I need help determining the best acquisition authority for my situation:\n\n`;
      prompt += `**Requirement:** ${answers.requirement}\n`;
      prompt += `**Situation:** ${answers.situation}\n`;
      prompt += `**Estimated Value:** ${answers.value}\n`;
      
      if (answers.agency) {
        prompt += `**Agency:** ${answers.agency}\n`;
      }
      
      prompt += `\nWhat acquisition authority would you recommend (OTA, SBIR Phase III, FAR Part 12, CSO, etc.)? Please explain the pros/cons and any requirements I'd need to meet.`;
      
      return prompt;
    }
  },

  'market-analysis': {
    title: 'Tell me about your market research needs',
    description: 'This helps me guide your market analysis.',
    questions: [
      {
        id: 'requirement',
        label: 'What are you looking to procure?',
        type: 'textarea',
        placeholder: 'e.g., Cloud migration services, cybersecurity tools...',
        required: true
      },
      {
        id: 'stage',
        label: 'Where are you in the process?',
        type: 'select',
        options: [
          { value: 'early', label: 'Just starting - exploring options' },
          { value: 'sources', label: 'Need to identify potential vendors' },
          { value: 'validate', label: 'Validating approach before solicitation' },
          { value: 'pricing', label: 'Need pricing/market data' }
        ],
        required: true
      },
      {
        id: 'setaside',
        label: 'Considering any set-asides?',
        type: 'select',
        options: [
          { value: 'unknown', label: 'Not sure yet' },
          { value: 'none', label: 'Full and open competition' },
          { value: 'sb', label: 'Small business set-aside' },
          { value: '8a', label: '8(a)' },
          { value: 'sdvosb', label: 'SDVOSB' },
          { value: 'hubzone', label: 'HUBZone' },
          { value: 'wosb', label: 'WOSB/EDWOSB' }
        ]
      }
    ],
    generatePrompt: (answers) => {
      let prompt = `I need help with market research:\n\n`;
      prompt += `**Requirement:** ${answers.requirement}\n`;
      prompt += `**Stage:** ${answers.stage}\n`;
      
      if (answers.setaside && answers.setaside !== 'unknown') {
        prompt += `**Set-aside Consideration:** ${answers.setaside}\n`;
      }
      
      prompt += `\nPlease help me understand the market, identify potential sources, and determine the best approach for this procurement.`;
      
      return prompt;
    }
  },

  'sop-creation': {
    title: 'Tell me about the process',
    description: 'This helps me create a useful SOP.',
    questions: [
      {
        id: 'process',
        label: 'What process needs an SOP?',
        type: 'textarea',
        placeholder: 'e.g., Contract file documentation, invoice processing, COR surveillance...',
        required: true
      },
      {
        id: 'audience',
        label: 'Who will use this SOP?',
        type: 'select',
        options: [
          { value: 'co', label: 'Contracting Officers' },
          { value: 'cor', label: 'CORs' },
          { value: 'pm', label: 'Program Managers' },
          { value: 'mixed', label: 'Multiple roles' },
          { value: 'new', label: 'New employees/training' }
        ],
        required: true
      },
      {
        id: 'detail',
        label: 'Level of detail needed',
        type: 'radio',
        options: [
          { value: 'high', label: 'High - step-by-step for beginners' },
          { value: 'medium', label: 'Medium - key steps with some detail' },
          { value: 'checklist', label: 'Checklist format' }
        ],
        required: true
      }
    ],
    generatePrompt: (answers) => {
      let prompt = `I need help creating a Standard Operating Procedure (SOP):\n\n`;
      prompt += `**Process:** ${answers.process}\n`;
      prompt += `**Audience:** ${answers.audience}\n`;
      prompt += `**Detail Level:** ${answers.detail}\n`;
      
      prompt += `\nPlease help me create an SOP with clear steps, roles and responsibilities, and any relevant references or templates.`;
      
      return prompt;
    }
  },

  'stakeholder-mapping': {
    title: 'Tell me about your acquisition',
    description: 'This helps me identify relevant stakeholders.',
    questions: [
      {
        id: 'acquisition',
        label: 'What acquisition are you working on?',
        type: 'textarea',
        placeholder: 'e.g., New IT services contract, major system upgrade...',
        required: true
      },
      {
        id: 'agency',
        label: 'What agency/organization?',
        type: 'text',
        placeholder: 'e.g., DoD, DHS, specific bureau...',
        required: true
      },
      {
        id: 'stage',
        label: 'Current stage',
        type: 'select',
        options: [
          { value: 'planning', label: 'Acquisition planning' },
          { value: 'requirements', label: 'Developing requirements' },
          { value: 'presol', label: 'Pre-solicitation' },
          { value: 'solicitation', label: 'Solicitation/evaluation' },
          { value: 'award', label: 'Award/post-award' }
        ],
        required: true
      },
      {
        id: 'concerns',
        label: 'Any specific approval concerns?',
        type: 'textarea',
        placeholder: 'e.g., Tight timeline, unusual requirement, high visibility...'
      }
    ],
    generatePrompt: (answers) => {
      let prompt = `I need help identifying stakeholders and approval chains:\n\n`;
      prompt += `**Acquisition:** ${answers.acquisition}\n`;
      prompt += `**Agency:** ${answers.agency}\n`;
      prompt += `**Current Stage:** ${answers.stage}\n`;
      
      if (answers.concerns) {
        prompt += `**Concerns:** ${answers.concerns}\n`;
      }
      
      prompt += `\nWho should I coordinate with? What approvals will I need? Are there any stakeholders I might be overlooking?`;
      
      return prompt;
    }
  },

  'slide-ranger': {
    title: 'Tell me about your presentation',
    description: 'This helps me create relevant content.',
    questions: [
      {
        id: 'topic',
        label: 'What is the presentation about?',
        type: 'textarea',
        placeholder: 'e.g., Acquisition strategy briefing, milestone decision review...',
        required: true
      },
      {
        id: 'audience',
        label: 'Who is the audience?',
        type: 'select',
        options: [
          { value: 'leadership', label: 'Senior leadership/executives' },
          { value: 'board', label: 'Review board/governance' },
          { value: 'program', label: 'Program team' },
          { value: 'technical', label: 'Technical audience' },
          { value: 'mixed', label: 'Mixed audience' }
        ],
        required: true
      },
      {
        id: 'purpose',
        label: 'Purpose of the briefing',
        type: 'radio',
        options: [
          { value: 'decision', label: 'Decision briefing (need approval)' },
          { value: 'status', label: 'Status update' },
          { value: 'inform', label: 'Informational' },
          { value: 'training', label: 'Training/education' }
        ],
        required: true
      },
      {
        id: 'length',
        label: 'Briefing length',
        type: 'select',
        options: [
          { value: 'short', label: '5-10 minutes (5-8 slides)' },
          { value: 'medium', label: '15-20 minutes (10-15 slides)' },
          { value: 'long', label: '30+ minutes (15-25 slides)' }
        ]
      }
    ],
    generatePrompt: (answers) => {
      let prompt = `I need help creating a presentation:\n\n`;
      prompt += `**Topic:** ${answers.topic}\n`;
      prompt += `**Audience:** ${answers.audience}\n`;
      prompt += `**Purpose:** ${answers.purpose}\n`;
      
      if (answers.length) {
        prompt += `**Length:** ${answers.length}\n`;
      }
      
      prompt += `\nPlease help me outline this briefing with key points for each slide, talking points, and any data/visuals I should include.`;
      
      return prompt;
    }
  },

  'regs-policy': {
    title: 'What regulation or policy do you need help with?',
    description: 'This helps me provide relevant guidance.',
    questions: [
      {
        id: 'topic',
        label: 'What topic or regulation are you asking about?',
        type: 'textarea',
        placeholder: 'e.g., FAR Part 15 negotiations, DFARS cybersecurity, commercial item determination...',
        required: true
      },
      {
        id: 'context',
        label: "What's your situation?",
        type: 'select',
        options: [
          { value: 'understanding', label: 'Need to understand a regulation' },
          { value: 'applying', label: 'Applying regulation to specific situation' },
          { value: 'compliance', label: 'Checking compliance requirements' },
          { value: 'comparing', label: 'Comparing different approaches' },
          { value: 'recent', label: 'Looking for recent changes/updates' }
        ],
        required: true
      },
      {
        id: 'agency',
        label: 'Which agency regulations apply?',
        type: 'select',
        options: [
          { value: 'far', label: 'FAR (all agencies)' },
          { value: 'dfars', label: 'DFARS (DoD)' },
          { value: 'gsam', label: 'GSAM (GSA)' },
          { value: 'aidar', label: 'AIDAR (USAID)' },
          { value: 'dosar', label: 'DOSAR (State Dept)' },
          { value: 'multiple', label: 'Multiple/Not sure' }
        ]
      }
    ],
    generatePrompt: (answers) => {
      let prompt = `I need help understanding federal acquisition regulations:\n\n`;
      prompt += `**Topic:** ${answers.topic}\n`;
      prompt += `**Context:** ${answers.context}\n`;
      
      if (answers.agency) {
        prompt += `**Applicable Regulations:** ${answers.agency}\n`;
      }
      
      prompt += `\nPlease explain the relevant regulations, any key requirements, and practical guidance for applying them.`;
      
      return prompt;
    }
  },

  'document-analysis': {
    title: 'What document do you need analyzed?',
    description: 'Upload a document or describe what you need reviewed.',
    questions: [
      {
        id: 'docType',
        label: 'What type of document is this?',
        type: 'select',
        options: [
          { value: 'solicitation', label: 'Solicitation (RFP/RFQ/RFI)' },
          { value: 'contract', label: 'Contract or modification' },
          { value: 'proposal', label: 'Proposal or quote' },
          { value: 'requirements', label: 'Requirements document (SOW/PWS/SOO)' },
          { value: 'policy', label: 'Policy or guidance' },
          { value: 'other', label: 'Other document' }
        ],
        required: true
      },
      {
        id: 'goal',
        label: 'What do you want me to analyze?',
        type: 'select',
        options: [
          { value: 'compliance', label: 'Check for compliance issues' },
          { value: 'risk', label: 'Identify risks or concerns' },
          { value: 'summary', label: 'Summarize key points' },
          { value: 'improve', label: 'Suggest improvements' },
          { value: 'compare', label: 'Compare against standards' },
          { value: 'general', label: 'General review' }
        ],
        required: true
      },
      {
        id: 'focus',
        label: 'Any specific areas to focus on?',
        type: 'textarea',
        placeholder: 'e.g., pricing terms, IP rights, security requirements, evaluation criteria...'
      }
    ],
    generatePrompt: (answers) => {
      let prompt = `I need help analyzing a document:\n\n`;
      prompt += `**Document Type:** ${answers.docType}\n`;
      prompt += `**Analysis Goal:** ${answers.goal}\n`;
      
      if (answers.focus) {
        prompt += `**Focus Areas:** ${answers.focus}\n`;
      }
      
      prompt += `\nPlease upload your document or paste the relevant text, and I'll provide a thorough analysis.`;
      
      return prompt;
    }
  }
};
