'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, ArrowLeft, Send, Loader2, Download } from 'lucide-react';
import DownloadButtons from '@/app/components/DownloadButtons';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://acquisition-assistant-266001336704.us-central1.run.app';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function RequirementDocumentsPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome to the Requirement Documents tool. I can help you generate Statements of Work (SOW), Performance Work Statements (PWS), and requirements documents using performance-based principles. What type of requirement document do you need?'
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
          message: `[Requirement Documents Context] ${userMessage}`,
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
    a.download = 'requirement-documents.txt';
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="bg-[#1e293b] border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="text-slate-400 hover:text-white transition flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-slate-700"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Requirement Documents</h1>
                </div>
              </div>
            </div>
              <DownloadButtons messages={messages} toolContext="requirement-documents" />
            <button
              onClick={exportConversation}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition"
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
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 sticky top-8">
              <h3 className="font-bold text-white mb-4 flex items-center">
                <FileText className="h-5 w-5 text-blue-500 mr-2" />
                Document Types
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-0.5">•</span>
                  <span>Statement of Work (SOW)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-0.5">•</span>
                  <span>Performance Work Statement (PWS)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-0.5">•</span>
                  <span>Statement of Objectives (SOO)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-0.5">•</span>
                  <span>Technical requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-0.5">•</span>
                  <span>Quality Assurance Plans</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-0.5">•</span>
                  <span>Performance metrics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-0.5">•</span>
                  <span>Acceptance criteria</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg flex flex-col" style={{ height: 'calc(100vh - 180px)' }}>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-900/50 text-slate-100 border border-slate-700'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700 bg-[#1e293b]">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your requirement document needs..."
                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
              <DownloadButtons messages={messages} toolContext="requirement-documents" />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
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
