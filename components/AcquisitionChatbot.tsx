'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const services = [
  { name: 'Acquisition Strategy', href: '/tools/acquisition-strategy' },
  { name: 'Market Analysis', href: '/tools/market-analysis' },
  { name: 'Authority Assessment', href: '/tools/authority-assessment' },
  { name: 'Requirement Documents', href: '/tools/requirement-documents' },
  { name: 'Evaluation Criteria', href: '/tools/evaluation-criteria' },
  { name: 'Compliance Checker', href: '/tools/compliance-checker' },
  { name: 'Regs & Policy', href: '/tools/regs-policy' },
  { name: 'Slide Ranger', href: '/tools/slide-ranger' },
  { name: 'SOP Creation', href: '/tools/sop-creation' },
  { name: 'Stakeholder Mapping', href: '/tools/stakeholder-mapping' },
];

export default function AcquisitionChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI acquisition assistant. How can I help you with federal procurement today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWorkspaces, setShowWorkspaces] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || data.error }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([{
      role: 'assistant',
      content: 'Hello! I\'m your AI acquisition assistant. How can I help you with federal procurement today?'
    }]);
  };

  const downloadChat = () => {
    const text = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-white">AI Assistant</h3>
          <div className="relative">
            <button
              onClick={() => setShowWorkspaces(!showWorkspaces)}
              className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded flex items-center gap-1"
            >
              Workspaces
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showWorkspaces && (
              <div className="absolute top-full left-0 mt-1 bg-gray-700 rounded shadow-lg z-10 min-w-[200px]">
                {services.map(service => (
                  <Link
                    key={service.href}
                    href={service.href}
                    className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-600"
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearConversation}
            className="text-xs text-gray-400 hover:text-white"
            title="Clear conversation"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={downloadChat}
            className="text-xs text-gray-400 hover:text-white"
            title="Download chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 relative"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />

        {/* Scroll to bottom button - inside messages container, fixed to bottom */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="sticky bottom-2 left-1/2 -translate-x-1/2 bg-gray-600/70 hover:bg-gray-500/80 text-white rounded-full p-2 shadow-lg backdrop-blur-sm border border-gray-500/50 transition-all"
            title="Scroll to bottom"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about federal acquisition..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
