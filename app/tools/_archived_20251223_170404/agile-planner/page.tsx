'use client';

import { useState } from 'react';
import { ArrowLeft, Code } from 'lucide-react';
import Link from 'next/link';

export default function AgilePlannerPage() {
  const [formData, setFormData] = useState({
    project: '',
    duration: '',
    teamSize: '',
    deliverables: ''
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/agile-planner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.plan);
      } else {
        setError(data.error || 'Failed to generate plan');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/tools" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tools
        </Link>

        <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-8 mb-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-600/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
              <Code className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-100">Agile Acquisition Planner</h1>
              <p className="text-slate-400">Design modular contracting and sprint strategies</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Project Description *
              </label>
              <textarea
                required
                value={formData.project}
                onChange={(e) => setFormData({...formData, project: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500"
                placeholder="Describe the project and desired outcomes..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Duration (Optional)
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500"
                  placeholder="e.g., 12 months"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Team Size (Optional)
                </label>
                <input
                  type="text"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500"
                  placeholder="e.g., 5-7 people"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Key Deliverables (Optional)
              </label>
              <textarea
                value={formData.deliverables}
                onChange={(e) => setFormData({...formData, deliverables: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500"
                placeholder="List key deliverables or milestones..."
              />
            </div>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Creating Plan...' : 'Create Agile Plan'}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-8 mt-6">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Agile Acquisition Plan</h2>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-slate-200">{result}</pre>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="mt-6 bg-slate-900 text-slate-100 px-6 py-2 rounded-lg hover:bg-slate-800 border border-slate-700"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
