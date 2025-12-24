'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft, Send, Loader2, Download } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://acquisition-assistant-266001336704.us-central1.run.app';

const RECOMMENDED_RESOURCES = [
  {
    label: "Leading Agile Acquisition (User's Book)",
    url: 'https://joinmost.org/agile-book',
  },
  {
    label: 'TechFAR Hub',
    url: 'https://techfarhub.usds.gov/',
  },
  {
    label: 'FAR Overhaul',
    url: 'https://www.acquisition.gov/far-overhaul',
  },
  {
    label: 'DFARS',
    url: 'https://www.acquisition.gov/dfars',
  },
  {
    label: 'Foreign Affairs Manual (FAM)',
    url: 'https://fam.state.gov/',
  },
  {
    label: 'FAR Index',
    url: 'https://www.acquisition.gov/browse/index/far',
  },
];

function sanitizeAnswerText(text: string): string {
  if (typeof text !== 'string') return '';
  const stripped = text.replace(/<invoke name="mcp">[\s\S]*?<\/invoke>/gi, '').trim();
  return stripped.length > 0 ? stripped : '';
}

function extractAnswer(data: any): string {
  if (Array.isArray(data?.content)) {
    const combined = data.content
      .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
      .filter(Boolean)
      .join('\n\n');

    if (combined.trim().length > 0) {
      const sanitized = sanitizeAnswerText(combined);
      if (sanitized.length > 0) {
        return sanitized;
      }
    }
  }

  if (typeof data?.answer === 'string' && data.answer.trim().length > 0) {
    const sanitized = sanitizeAnswerText(data.answer);
    if (sanitized.length > 0) {
      return sanitized;
    }
  }

  if (typeof data?.error === 'string' && data.error.trim().length > 0) {
    return data.error.trim();
  }

  return 'No answer returned. Please try again with a different question or URL.';
}

export default function RegsPolicyPage() {
  const [urlValue, setUrlValue] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{question: string, answer: string, url: string}>>([]);

  const isSubmitDisabled = useMemo(() => {
    return isLoading || !urlValue.trim() || !question.trim();
  }, [isLoading, urlValue, question]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedUrl = urlValue.trim();
    const trimmedQuestion = question.trim();

    if (!trimmedUrl || !trimmedQuestion) {
      setError('Please provide both a URL and a question before submitting.');
      return;
    }

    setIsLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await fetch('/api/url-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mcpUrl: trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`,
          question: trimmedQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = typeof data?.error === 'string' && data.error.trim().length > 0
          ? data.error.trim()
          : 'Request failed. Please verify the URL and try again.';
        setError(message);
        return;
      }

      const parsedAnswer = extractAnswer(data);
      setAnswer(parsedAnswer);
      
      // Add to conversation history
      setConversationHistory(prev => [...prev, {
        question: trimmedQuestion,
        answer: parsedAnswer,
        url: trimmedUrl
      }]);
      
      // Clear inputs for next question
      setQuestion('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error while requesting the answer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResourceSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUrl = event.target.value;
    if (selectedUrl) {
      setUrlValue(selectedUrl);
    }
  };

  const exportConversation = () => {
    const content = conversationHistory.map(item => 
      `URL: ${item.url}\nQUESTION: ${item.question}\nANSWER: ${item.answer}\n\n---\n\n`
    ).join('');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'regs-policy-queries.txt';
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
                  <BookOpen className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Regs & Policy</h1>
                </div>
              </div>
            </div>
            <button
              onClick={exportConversation}
              disabled={conversationHistory.length === 0}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Resources */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 sticky top-8">
              <h3 className="font-bold text-white mb-4">Recommended Resources</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                {RECOMMENDED_RESOURCES.map((resource) => (
                  <li key={resource.url} className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-0.5">•</span>
                    <button
                      onClick={() => setUrlValue(resource.url)}
                      className="text-left hover:text-blue-400 transition"
                    >
                      {resource.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Content - Query Interface */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 space-y-6">
              {/* Introduction */}
              <div>
                <p className="text-slate-300 text-sm">
                  Ask questions about acquisition regulations or policy pages. Paste a public website URL or pick a recommended resource, 
                  ask your question, and the assistant will ground its answer in that page.
                </p>
              </div>

              {/* Query Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white" htmlFor="url-input">
                    Website URL
                  </label>
                  <input
                    id="url-input"
                    type="text"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Example: acquisition.gov or https://acquisition.gov/far"
                    value={urlValue}
                    onChange={(event) => setUrlValue(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white" htmlFor="question-input">
                    Your Question
                  </label>
                  <textarea
                    id="question-input"
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Example: Summarize the commercial item determination guidance on this page."
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Ask Question</span>
                    </>
                  )}
                </button>
              </form>

              {/* Answer Display */}
              {(answer || error) && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Answer</h3>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                    {error && <p className="text-red-400 whitespace-pre-line">{error}</p>}
                    {!error && answer && <p className="text-slate-100 whitespace-pre-line leading-relaxed">{answer}</p>}
                  </div>
                </div>
              )}

              {/* Conversation History */}
              {conversationHistory.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-t border-slate-700 pt-6">Previous Queries</h3>
                  <div className="space-y-4">
                    {conversationHistory.map((item, index) => (
                      <div key={index} className="bg-slate-900/30 border border-slate-700 rounded-lg p-4 space-y-2">
                        <p className="text-xs text-slate-500 font-mono">{item.url}</p>
                        <p className="text-sm text-slate-300"><span className="font-semibold text-white">Q:</span> {item.question}</p>
                        <p className="text-sm text-slate-400"><span className="font-semibold text-slate-300">A:</span> {item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
