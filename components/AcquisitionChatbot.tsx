'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Download, Trash2, ChevronDown, Bot } from 'lucide-react';
import Link from 'next/link';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://acquisition-assistant-266001336704.us-central1.run.app';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const workspaces = [
  { name: 'Acquisition Strategy', href: '/tools/acquisition-strategy' },
  { name: 'Authority Assessment', href: '/tools/authority-assessment' },
  { name: 'Document Analysis', href: '/tools/document-analysis' },
  { name: 'Evaluation Criteria', href: '/tools/evaluation-criteria' },
  { name: 'Market Analysis', href: '/tools/market-analysis' },
  { name: 'Regs & Policy', href: '/tools/regs-policy' },
  { name: 'Requirement Documents', href: '/tools/requirement-documents' },
  { name: 'Slide Ranger', href: '/tools/slide-ranger' },
  { name: 'SOP Creation', href: '/tools/sop-creation' },
  { name: 'Stakeholder Mapping', href: '/tools/stakeholder-mapping' },
];

export default function AcquisitionChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your intelligent procurement assistant. How can I help you plan your agile acquisition today? You can ask me to draft a document, provide guidance on FAR, or help with evaluation strategies.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [workspacesOpen, setWorkspacesOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setWorkspacesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          message: userMessage,
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

  const clearConversation = () => {
    setMessages([{
      role: 'assistant',
      content: 'Hello! I am your intelligent procurement assistant. How can I help you plan your agile acquisition today? You can ask me to draft a document, provide guidance on FAR, or help with evaluation strategies.'
    }]);
  };

  const downloadChat = () => {
    const content = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n---\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapidacq-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0f172a] border border-slate-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#1e293b] border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Bot className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <span className="font-bold text-white">Agile Innovation Toolkit</span>
              <span className="text-cyan-400 ml-2">AI Assistant</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="bg-cyan-500 text-white text-sm px-3 py-1 rounded-md font-medium">
              Chat
            </span>
            
            {/* Workspaces Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setWorkspacesOpen(!workspacesOpen)}
                className="flex items-center space-x-1 text-white hover:text-cyan-400 transition"
              >
                <span>Workspaces</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${workspacesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {workspacesOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                  <div className="py-2">
                    {workspaces.map((workspace) => (
                      <Link
                        key={workspace.name}
                        href={workspace.href}
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition"
                        onClick={() => setWorkspacesOpen(false)}
                      >
                        {workspace.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* AI Model indicator */}
        <div className="mt-3 flex items-center space-x-2">
          <span className="text-sm text-slate-400">AI Model:</span>
          <span className="bg-slate-700 text-slate-300 text-sm px-3 py-1 rounded-md">
            Claude (Anthropic)
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <Bot className="h-5 w-5 text-cyan-400" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/80 text-slate-100 border border-slate-700'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              {message.role === 'assistant' && (
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={downloadChat}
                    className="text-xs text-slate-400 hover:text-cyan-400 transition flex items-center space-x-1"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <Bot className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700">
              <Loader2 className="h-5 w-5 animate-spin text-cyan-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700 p-4 bg-[#1e293b]">
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="flex items-center space-x-3 bg-slate-800 rounded-lg border border-slate-700 px-3">
            <button type="button" className="text-slate-500 hover:text-slate-300">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Draft a SOO for a SaaS prototype..."
              className="flex-1 py-3 bg-transparent text-white placeholder-slate-500 focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white p-2 rounded-lg transition"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
        
        {/* Footer */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">
            AIT is an AI assistant. Responses may be inaccurate. Verify important information.
          </span>
          <div className="flex items-center space-x-4">
            <button
              onClick={clearConversation}
              className="text-slate-400 hover:text-white transition flex items-center space-x-1 border border-slate-600 px-3 py-1.5 rounded-md"
            >
              <span>Clear Conversation</span>
            </button>
            <button
              onClick={downloadChat}
              className="text-slate-400 hover:text-white transition flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Download Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
