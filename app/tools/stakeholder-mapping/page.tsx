'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, ArrowLeft, Send, Loader2, Download } from 'lucide-react';
import api from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function StakeholderMappingPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome to the Stakeholder Mapping tool. I can help you identify and analyze key stakeholders, map their roles and interests, and develop effective communication strategies. Who are the stakeholders for your acquisition?'
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
      const result = await api.callMcpTool('stakeholder-mapping', {
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
    a.download = 'stakeholder-map.txt';
    a.click();
  };

  return (
    <div className="min-h-screen bg-uswds-gray-5">
      <div className="bg-uswds-green text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/dashboard" className="text-white/80 hover:text-white mb-4 inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center mt-4">
            <Users className="h-10 w-10 mr-4" />
            <div>
              <h1 className="text-3xl font-bold font-serif">Stakeholder Mapping</h1>
              <p className="text-green-100">Identify and analyze key stakeholders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded border border-uswds-gray-30 p-6 sticky top-8">
              <h3 className="font-bold text-uswds-gray-90 mb-4">Mapping Components</h3>
              <ul className="space-y-3 text-sm text-uswds-gray-70">
                <li className="flex items-start"><span className="text-uswds-green mr-2">•</span><span>Stakeholder identification</span></li>
                <li className="flex items-start"><span className="text-uswds-green mr-2">•</span><span>Role and responsibility matrix</span></li>
                <li className="flex items-start"><span className="text-uswds-green mr-2">•</span><span>Influence and interest analysis</span></li>
                <li className="flex items-start"><span className="text-uswds-green mr-2">•</span><span>Communication requirements</span></li>
                <li className="flex items-start"><span className="text-uswds-green mr-2">•</span><span>Approval chain mapping</span></li>
                <li className="flex items-start"><span className="text-uswds-green mr-2">•</span><span>Risk and issue escalation paths</span></li>
                <li className="flex items-start"><span className="text-uswds-green mr-2">•</span><span>Engagement strategy</span></li>
              </ul>
              <button onClick={exportConversation} className="mt-6 w-full bg-uswds-gray-5 text-uswds-gray-90 px-4 py-2 rounded font-semibold hover:bg-uswds-gray-10 flex items-center justify-center">
                <Download className="h-4 w-4 mr-2" />Export Map
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded border border-uswds-gray-30 flex flex-col" style={{ height: 'calc(100vh - 300px)' }}>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user' ? 'bg-uswds-green text-white' : 'bg-uswds-gray-5 text-uswds-gray-90'}`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {loading && <div className="flex justify-start"><div className="bg-uswds-gray-5 rounded-lg p-4"><Loader2 className="h-5 w-5 animate-spin text-uswds-green" /></div></div>}
              </div>

              <form onSubmit={handleSubmit} className="p-4 border-t border-uswds-gray-30">
                <div className="flex space-x-2">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe your acquisition stakeholders..." className="flex-1 px-4 py-2 border-2 border-uswds-gray-30 rounded focus:outline-none focus:border-uswds-green" disabled={loading} />
                  <button type="submit" disabled={loading || !input.trim()} className="bg-uswds-green text-white px-6 py-2 rounded font-semibold hover:bg-uswds-green-70 disabled:bg-uswds-gray-30 disabled:cursor-not-allowed flex items-center">
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
