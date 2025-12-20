'use client';

import { useState } from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';

export default function PmCorPage() {
  const [formData, setFormData] = useState({
    contractInfo: '',
    issue: '',
    stakeholders: '',
    urgency: ''
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/pm-cor-coordinator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.coordination);
      } else {
        setError(data.error || 'Failed to generate guidance');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/tools" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tools
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center mb-6">
            <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PM/COR Coordinator</h1>
              <p className="text-gray-600">Coordinate program management and oversight</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Information *
              </label>
              <input
                type="text"
                required
                value={formData.contractInfo}
                onChange={(e) => setFormData({...formData, contractInfo: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Contract #123456 - IT Services"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Description *
              </label>
              <textarea
                required
                value={formData.issue}
                onChange={(e) => setFormData({...formData, issue: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Describe the issue or situation requiring coordination..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stakeholders (Optional)
              </label>
              <input
                type="text"
                value={formData.stakeholders}
                onChange={(e) => setFormData({...formData, stakeholders: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., PM, COR, Vendor, Legal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency (Optional)
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Select urgency...</option>
                <option value="Low">Low - Routine</option>
                <option value="Medium">Medium - Timely response needed</option>
                <option value="High">High - Urgent attention required</option>
                <option value="Critical">Critical - Immediate action needed</option>
              </select>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Guidance...' : 'Get Coordination Guidance'}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Coordination Guidance</h2>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-700">{result}</pre>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="mt-6 bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
