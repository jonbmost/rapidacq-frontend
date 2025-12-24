'use client';

import { Download, FileText, Presentation } from 'lucide-react';
import { useState } from 'react';
import { trackToolUsage } from '@/app/utils/analytics';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://acquisition-assistant-266001336704.us-central1.run.app';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface DownloadButtonsProps {
  messages: Message[];
  toolContext: string;
}

export default function DownloadButtons({ messages, toolContext }: DownloadButtonsProps) {
  const [loading, setLoading] = useState<'docx' | 'pptx' | null>(null);

  const downloadDocument = async (type: 'docx' | 'pptx') => {
    if (messages.length < 2) {
      alert('Have a conversation first before downloading!');
      return;
    }

    setLoading(type);

    try {
      const response = await fetch(`${BACKEND_URL}/api/documents/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationHistory: messages,
          documentType: type,
          toolContext: toolContext
        }),
      });

      if (!response.ok) throw new Error('Failed to generate');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${toolContext}-${Date.now()}.${type}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Track download
      trackToolUsage(toolContext, 'download');
    } catch (error) {
      alert('Failed to generate document');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={() => downloadDocument('docx')}
        disabled={loading !== null}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed transition text-sm border border-slate-600"
      >
        {loading === 'docx' ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating...</span>
          </>
        ) : (
          <>
            <FileText className="w-4 h-4" />
            <span>Word Doc</span>
          </>
        )}
      </button>
      <button
        onClick={() => downloadDocument('pptx')}
        disabled={loading !== null}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed transition text-sm border border-slate-600"
      >
        {loading === 'pptx' ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Presentation className="w-4 h-4" />
            <span>PowerPoint</span>
          </>
        )}
      </button>
    </div>
  );
}
