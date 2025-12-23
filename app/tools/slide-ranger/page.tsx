'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Presentation, ArrowLeft, Send, Loader2, Download } from 'lucide-react';
import api from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function SlideRangerPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome to Slide Ranger. I can help you generate presentation outlines and slide content for acquisition briefings. What presentation do you need to build?'
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
      const result = await api.callMcpTool('slide-ranger', {
        message: userMessage,
        history: messages
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to get response');
      }

      const responseText = result.data?.response ?? result.data?.result ?? result.data?.message;

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: responseText || 'I apologize, but I encountered an error. Please try again.'
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
    a.download = 'slide-ranger-outline.txt';
    a.click();
  };

  return (
    <div className="min-h-screen bg-uswds-gray-5">
      {/* Header */}
      <div className="bg-uswds-blue text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/dashboard" className="text-white/80 hover:text-white mb-4 inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center mt-4">
            <Presentation className="h-10 w-10 mr-4" />
            <div>
              <h1 className="text-3xl font-bold font-serif">Slide Ranger</h1>
              <p className="text-blue-100">Generate acquisition presentation content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Guide */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded border border-uswds-gray-30 p-6 sticky top-8">
              <h3 className="font-bold text-uswds-gray-90 mb-4">Suggested Slides</h3>
              <ul className="space-y-3 text-sm text-uswds-gray-70">
                <li className="flex items-start">
                  <span className="text-uswds-blue mr-2">•</span>
                  <span>Mission overview</span>
                </li>
                <li className="flex items-start">
                  <span className="text-uswds-blue mr-2">•</span>
                  <span>Problem statement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-uswds-blue mr-2">•</span>
                  <span>Market insights</span>
                </li>
                <li className="flex items-start">
                  <span className="text-uswds-blue mr-2">•</span>
                  <span>Acquisition strategy</span>
                </li>
                <li className="flex items-start">
                  <span className="text-uswds-blue mr-2">•</span>
                  <span>Milestones</span>
                </li>
                <li className="flex items-start">
                  <span className="text-uswds-blue mr-2">•</span>
                  <span>Risks and mitigations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-uswds-blue mr-2">•</span>
                  <span>Decision asks</span>
                </li>
              </ul>
              
              <button
                onClick={exportConversation}
                className="mt-6 w-full bg-uswds-gray-5 text-uswds-gray-90 px-4 py-2 rounded font-semibold hover:bg-uswds-gray-10 flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Outline
              </button>
            </div>
          </div>

          {/* Right Content - Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded border border-uswds-gray-30 flex flex-col" style={{ height: 'calc(100vh - 300px)' }}>
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
                          : 'bg-uswds-gray-5 text-uswds-gray-90'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-uswds-gray-5 rounded-lg p-4">
                      <Loader2 className="h-5 w-5 animate-spin text-uswds-blue" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-uswds-gray-30">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe the presentation you need..."
                    className="flex-1 px-4 py-2 border-2 border-uswds-gray-30 rounded focus:outline-none focus:border-uswds-blue"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-uswds-blue text-white px-6 py-2 rounded font-semibold hover:bg-uswds-blue-70 disabled:bg-uswds-gray-30 disabled:cursor-not-allowed flex items-center"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
