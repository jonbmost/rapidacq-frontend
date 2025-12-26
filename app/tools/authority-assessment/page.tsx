'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Scale, ArrowLeft, Send, Loader2, Download, Landmark } from 'lucide-react';
import DownloadButtons from '@/app/components/DownloadButtons';
import IntakeForm from '@/app/components/IntakeForm';
import SuggestedQuestions from '@/app/components/SuggestedQuestions';
import { intakeConfigs } from '@/app/config/intakeQuestions';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://acquisition-assistant-266001336704.us-central1.run.app';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AuthorityAssessmentPage() {
  const [showIntake, setShowIntake] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (userMessage: string) => {
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setSuggestionsLoading(true);
    setSuggestedQuestions([]);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `[Authority Assessment Context] ${userMessage}`,
          history: messages,
          includeSuggestions: true
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      if (data.suggestedQuestions?.length > 0) {
        setSuggestedQuestions(data.suggestedQuestions);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, but I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
      setSuggestionsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    await sendMessage(userMessage);
  };

  const handleIntakeComplete = async (generatedPrompt: string) => {
    setShowIntake(false);
    await sendMessage(generatedPrompt);
  };

  const handleIntakeSkip = () => {
    setShowIntake(false);
    setMessages([{ role: 'assistant', content: 'Welcome to Authority Assessment. I can help you identify the best acquisition authority for your situation - whether OTA, SBIR Phase III, FAR Part 12, CSO, or traditional FAR. What are you trying to acquire?' }]);
  };

  const handleSuggestionSelect = (question: string) => {
    setInput(question);
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

  const intakeConfig = intakeConfigs['authority-assessment'];

  if (showIntake && intakeConfig) {
    return (
      <div className="min-h-screen bg-[#0f172a]">
        <header className="bg-[#1e293b] border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-slate-400 hover:text-white transition flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
                <div className="h-6 w-px bg-slate-700"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center">
                    <Scale className="h-5 w-5 text-blue-500" />
                  </div>
                  <h1 className="text-lg font-bold text-white">Authority Assessment</h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <IntakeForm config={intakeConfig} onComplete={handleIntakeComplete} onSkip={handleIntakeSkip} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <header className="bg-[#1e293b] border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-slate-400 hover:text-white transition flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-slate-700"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center">
                  <Scale className="h-5 w-5 text-blue-500" />
                </div>
                <h1 className="text-lg font-bold text-white">Authority Assessment</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <DownloadButtons messages={messages} toolContext="authority-assessment" />
              <button onClick={exportConversation} className="flex items-center space-x-2 text-slate-400 hover:text-white transition">
                <Download className="h-4 w-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {(suggestedQuestions.length > 0 || suggestionsLoading) && (
              <SuggestedQuestions questions={suggestedQuestions} onSelect={handleSuggestionSelect} loading={suggestionsLoading} />
            )}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <h3 className="font-bold text-white mb-4 flex items-center">
                <Landmark className="h-5 w-5 text-blue-500 mr-2" />
                Authority Types
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start"><span className="text-blue-500 mr-2 mt-0.5">•</span><span>Other Transaction Authority (OTA)</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2 mt-0.5">•</span><span>Commercial Solutions Opening (CSO)</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2 mt-0.5">•</span><span>SBIR Phase III</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2 mt-0.5">•</span><span>FAR Part 12 Commercial</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2 mt-0.5">•</span><span>Simplified Acquisition</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2 mt-0.5">•</span><span>Traditional FAR</span></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg flex flex-col" style={{ height: 'calc(100vh - 180px)' }}>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-900/50 text-slate-100 border border-slate-700'}`}>
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
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700 bg-[#1e293b]">
                <div className="flex space-x-3">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about acquisition authorities..." className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={loading} />
                  <button type="submit" disabled={loading || !input.trim()} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition flex items-center space-x-2">
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
