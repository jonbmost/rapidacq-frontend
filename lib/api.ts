// API client for connecting to the RapidAcq backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
     const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; service?: string; timestamp?: string }>> {
    return this.request('/health');
  }

  // Chat endpoint
  async sendChatMessage(message: string): Promise<ApiResponse<{ response: string }>> {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Document analysis
  async analyzeDocument(url: string): Promise<ApiResponse<any>> {
    return this.request('/document-analysis', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  // URL query
  async queryUrl(url: string, question: string): Promise<ApiResponse<any>> {
    return this.request('/url-query', {
      method: 'POST',
      body: JSON.stringify({ url, question }),
    });
  }

  // MCP tools integration
  async callMcpTool(toolName: string, params: Record<string, any>): Promise<ApiResponse<any>> {
    return this.request('/mcp', {
      method: 'POST',
      body: JSON.stringify({ tool: toolName, params }),
    });
  }
}

// Export singleton instance
export const api = new ApiClient(API_URL);

// Export for use in server components
export default api;
