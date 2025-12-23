'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileCheck, ArrowLeft, Send, Loader2, Download, Zap } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://acquisition-assistant-266001336704.us-central1.run.app';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function SOPCreationPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome to the SOP Creation tool. I can help you develop standardized operating procedures for repeatable acquisition processes and workflows. What process needs an SOP?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `[SOP Creation Context] ${userMessage}`,
          history: messages
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const exportConversation = () => {
    const content = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sop-document.txt';
    a.click();
  };

  return (
    <div className="min-h-screen bg-uswds-gray-5">
      {/* Header */}
      <header className="bg-white border-b border-uswds-gray-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="text-uswds-gray-70 hover:text-uswds-blue transition flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-uswds-gray-30"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-uswds-blue-5 rounded flex items-center justify-center">
                  <FileCheck className="h-5 w-5 text-uswds-blue" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-uswds-gray-90 font-serif">SOP Creation</h1>
                </div>
              </div>
            </div>
            <button
              onClick={exportConversation}
              className="flex items-center space-x-2 text-uswds-gray-70 hover:text-uswds-blue transition"
            >
              <Download className="h-4 w-4" />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Guide */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-uswds-gray-10 p-6 sticky top-8">
              <h3 className="font-bold text-uswds-gray-90 mb-4 flex items-center">
                <Zap className="h-5 w-5 text-uswds-blue mr-2" />
                Key Components
              </h3>
              <ul className="space-y-3 text-sm text-uswds-gray-70">
                <li className="flex items-start">
                  <span className="text-uswds-blue mr-2 mt-0.5">•</span>
                  <span>Process workflow steps</span>
                </li>
                <li className="flex items-start">
                  <span className="text-uswds-blue mr-2 mt-0.5">•</span>
                  <span>Roles and responsibilities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-uswds-blue mr-2 mt-0.5">•</span>
                  <span>Required documentation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-uswds-blue mr-2 mt-0.5">•</span>
                  <span>Approval authorities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-uswds-blue mr-2 mt-0.5">•</span>
                  <span>Compliance checkpoints</span>
                </li>
                <li className="flex items-start">
                  <span className="text-uswds-blue mr-2 mt-0.5">•</span>
                  <span>Quality control measures</span>
                </li>
                <li className="flex items-start">
                  <span className="text-uswds-blue mr-2 mt-0.5">•</span>
                  <span>Templates and tools</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Content - Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-uswds-gray-10 shadow-sm flex flex-col" style={{ height: 'calc(100vh - 180px)' }}>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-uswds-blue text-white'
                          : 'bg-uswds-gray-5 text-uswds-gray-90 border border-uswds-gray-10'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-uswds-gray-5 rounded-lg p-4 border border-uswds-gray-10">
                      <Loader2 className="h-5 w-5 animate-spin text-uswds-blue" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-uswds-gray-10 bg-uswds-gray-2">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="What process needs standardization?"
                    className="flex-1 px-4 py-3 border border-uswds-gray-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-uswds-blue focus:border-transparent"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-uswds-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-uswds-blue-70 disabled:bg-uswds-gray-30 disabled:cursor-not-allowed transition flex items-center space-x-2 shadow-sm"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
