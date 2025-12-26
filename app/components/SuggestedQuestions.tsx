'use client';

import { Lightbulb } from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
  loading?: boolean;
}

export default function SuggestedQuestions({ questions, onSelect, loading }: SuggestedQuestionsProps) {
  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
        <h3 className="font-bold text-white mb-3 flex items-center text-sm">
          <Lightbulb className="h-4 w-4 text-yellow-500 mr-2" />
          Suggested Questions
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-700/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
      <h3 className="font-bold text-white mb-3 flex items-center text-sm">
        <Lightbulb className="h-4 w-4 text-yellow-500 mr-2" />
        Suggested Questions
      </h3>
      <div className="space-y-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question)}
            className="w-full text-left px-3 py-2 text-xs text-slate-300 bg-slate-900/50 hover:bg-slate-700/50 border border-slate-600 hover:border-blue-500 rounded-lg transition-all duration-200"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
