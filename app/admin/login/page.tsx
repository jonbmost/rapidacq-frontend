'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Mail, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://acquisition-assistant-266001336704.us-central1.run.app';
      
      const response = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store admin auth info
        localStorage.setItem('adminId', data.admin.id);
        localStorage.setItem('adminEmail', data.admin.email);
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('isAdmin', 'true');

        // Redirect to admin dashboard
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-100 mb-2 font-serif">
            Admin Access
          </h1>
          <p className="text-slate-400">
            RapidAcq Administration Portal
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800 rounded border border-slate-700 p-8 shadow-lg">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Admin Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border-2 border-slate-700 bg-slate-900 text-slate-100 rounded focus:outline-none focus:border-blue-500 placeholder-slate-500"
                placeholder="admin@rapidacq.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                <Lock className="inline h-4 w-4 mr-1" />
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-slate-700 bg-slate-900 text-slate-100 rounded focus:outline-none focus:border-blue-500 placeholder-slate-500"
                placeholder="••••••••"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-700 text-red-300 rounded text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Signing In...' : 'Sign In as Admin'}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <Link
              href="/admin/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-400">
          <Link href="/" className="hover:text-blue-400">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
