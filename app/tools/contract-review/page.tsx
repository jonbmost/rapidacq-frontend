'use client';

import { useState } from 'react';
import { ArrowLeft, FileCheck } from 'lucide-react';
import Link from 'next/link';

export default function ContractReviewPage() {
  const [formData, setFormData] = useState({
    contractText: '',
    reviewType: '',
    specificClauses: ''
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/contract-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.review);
      } else {
        setError(data.error || 'Failed to review contract');
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
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
              <FileCheck className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contract Review</h1>
              <p className="text-gray-600">Identify risks and get improvement recommendations</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Text *
              </label>
              <textarea
                required
                value={formData.contractText}
                onChange={(e) => setFormData({...formData, contractText: e.target.value})}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                placeholder="Paste contract language, clauses, or full agreement here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Type (Optional)
              </label>
              <select
                value={formData.reviewType}
                onChange={(e) => setFormData({...formData, reviewType: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">General Review</option>
                <option value="risk">Risk Assessment</option>
                <option value="compliance">Compliance Check</option>
                <option value="pricing">Pricing Analysis</option>
                <option value="terms">Terms & Conditions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Clauses to Review (Optional)
              </label>
              <input
                type="text"
                value={formData.specificClauses}
                onChange={(e) => setFormData({...formData, specificClauses: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Termination, IP Rights, Warranty"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Reviewing Contract...' : 'Review Contract'}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contract Review Results</h2>
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
