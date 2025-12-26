'use client';

import { useState } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { IntakeQuestion, ToolIntakeConfig } from '@/app/config/intakeQuestions';

interface IntakeFormProps {
  config: ToolIntakeConfig;
  onComplete: (generatedPrompt: string) => void;
  onSkip: () => void;
}

export default function IntakeForm({ config, onComplete, onSkip }: IntakeFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);

  const updateAnswer = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const isStepComplete = (question: IntakeQuestion) => {
    if (!question.required) return true;
    return answers[question.id] && answers[question.id].trim() !== '';
  };

  const canProceed = isStepComplete(config.questions[currentStep]);

  const handleNext = () => {
    if (currentStep < config.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate the prompt and complete
      const prompt = config.generatePrompt(answers);
      onComplete(prompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && canProceed) {
      e.preventDefault();
      handleNext();
    }
  };

  const question = config.questions[currentStep];
  const progress = ((currentStep + 1) / config.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/20 rounded-full mb-4">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{config.title}</h2>
          <p className="text-slate-400 text-sm">{config.description}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>Question {currentStep + 1} of {config.questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <label className="block text-white font-medium mb-3">
            {question.label}
            {question.required && <span className="text-red-400 ml-1">*</span>}
          </label>

          {question.type === 'textarea' && (
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => updateAnswer(question.id, e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={question.placeholder}
              rows={3}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              autoFocus
            />
          )}

          {question.type === 'text' && (
            <input
              type="text"
              value={answers[question.id] || ''}
              onChange={(e) => updateAnswer(question.id, e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={question.placeholder}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          )}

          {question.type === 'select' && (
            <select
              value={answers[question.id] || ''}
              onChange={(e) => updateAnswer(question.id, e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            >
              <option value="">Select an option...</option>
              {question.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}

          {question.type === 'radio' && (
            <div className="space-y-3">
              {question.options?.map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                    answers[question.id] === opt.value
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={opt.value}
                    checked={answers[question.id] === opt.value}
                    onChange={(e) => updateAnswer(question.id, e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    answers[question.id] === opt.value
                      ? 'border-blue-500'
                      : 'border-slate-500'
                  }`}>
                    {answers[question.id] === opt.value && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span className="text-white">{opt.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onSkip}
            className="text-slate-400 hover:text-white text-sm transition"
          >
            Skip to chat →
          </button>

          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 text-slate-300 hover:text-white transition"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition"
            >
              {currentStep === config.questions.length - 1 ? 'Get Started' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
