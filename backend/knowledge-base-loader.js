const fs = require('fs').promises;
const path = require('path');

class KnowledgeBaseLoader {
  constructor() {
    this.basePath = '/workspaces/Acquisition-Assistant/knowledge-base';
    this.cache = {};
  }

  async loadFile(filename) {
    if (this.cache[filename]) {
      return this.cache[filename];
    }

    try {
      const filePath = path.join(this.basePath, filename);
      const content = await fs.readFile(filePath, 'utf-8');
      this.cache[filename] = content;
      return content;
    } catch (error) {
      console.warn(`Could not load ${filename}:`, error.message);
      return '';
    }
  }

  async getAgileGuidelines() {
    return await this.loadFile('Agile-Acquisition-Principles.md');
  }

  async getFARReference() {
    return await this.loadFile('FAR-Quick-Reference.md');
  }

  async getSOOTemplate() {
    return await this.loadFile('SOO Template.md');
  }

  async getPWSTemplate() {
    return await this.loadFile('PWS Template.md');
  }

  async getQASPTemplate() {
    return await this.loadFile('QASP-Template.md');
  }

  async getRFQTemplate() {
    return await this.loadFile('REQUEST FOR QUOTE (RFQ) TEMPLATE.md');
  }

  async getEvalTemplate() {
    return await this.loadFile('eval template.md');
  }
}

module.exports = new KnowledgeBaseLoader();
