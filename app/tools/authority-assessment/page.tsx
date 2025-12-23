'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowLeft, Send, Loader2, Download } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://acquisition-assistant-266001336704.us-central1.run.app';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AuthorityAssessmentPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome to the Authority Needs Assessment tool. I can help you determine the optimal acquisition authority (FAR, OTA, CSO, SBIR Phase III) based on your requirement characteristics and objectives. What are you trying to acquire?'
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
          message: `[Authority Assessment Context] ${userMessage}`,
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
    a.download = 'authority-assessment.txt';
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <div className="bg-[#1e293b] text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-white mb-4 inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center mt-4">
            <Shield className="h-10 w-10 mr-4" />
            <div>
              <h1 className="text-3xl font-bold font-serif">Authority Needs Assessment</h1>
              <p className="text-slate-400">Determine optimal acquisition authority</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Guide */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 rounded border border-slate-700 p-6 sticky top-8">
              <h3 className="font-bold text-white mb-4">Authority Options</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>FAR Part 12 (Commercial)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>FAR Part 15 (Negotiated)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Other Transaction Authority (OTA)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Commercial Solutions Opening (CSO)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>SBIR/STTR Phase III</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Simplified Acquisition Procedures</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Authority comparison matrix</span>
                </li>
              </ul>
              
              <button
                onClick={exportConversation}
                className="mt-6 w-full bg-[#0f172a] text-white px-4 py-2 rounded font-semibold hover:bg-uswds-gray-10 flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Assessment
              </button>
            </div>
          </div>

          {/* Right Content - Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 rounded border border-slate-700 flex flex-col" style={{ height: 'calc(100vh - 300px)' }}>
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
                          ? 'bg-[#1e293b] text-white'
                          : 'bg-[#0f172a] text-white'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-[#0f172a] rounded-lg p-4">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe what you need to acquire..."
                    className="flex-1 px-4 py-2 border-2 border-slate-700 rounded focus:outline-none focus:border-slate-700"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-[#1e293b] text-white px-6 py-2 rounded font-semibold hover:bg-[#1e293b]-70 disabled:bg-uswds-gray-30 disabled:cursor-not-allowed flex items-center"
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
