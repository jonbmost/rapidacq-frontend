'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://acquisition-assistant-266001336704.us-central1.run.app';

export default function LoginPage() {
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
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store auth info
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('organizationId', data.user.organizationId);
        localStorage.setItem('organizationName', data.user.organizationName);
        localStorage.setItem('authToken', data.token);

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-uswds-gray-5 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-uswds-gray-90 mb-2 font-serif">
            Sign In to RapidAcq
          </h1>
          <p className="text-uswds-gray-70">
            Access your federal acquisition tools
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded border border-uswds-gray-30 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-uswds-gray-90 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border-2 border-uswds-gray-30 rounded focus:outline-none focus:border-uswds-blue"
                placeholder="your.name@agency.gov"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-uswds-gray-90 mb-2">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-uswds-gray-30 rounded focus:outline-none focus:border-uswds-blue"
                placeholder="••••••••"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-uswds-blue text-white py-3 rounded font-bold hover:bg-uswds-blue-70 disabled:bg-uswds-gray-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-uswds-gray-30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-uswds-gray-70">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            href="/onboarding"
            className="block w-full text-center bg-white border-2 border-uswds-gray-30 text-uswds-gray-90 py-3 rounded font-bold hover:bg-uswds-gray-5"
          >
            Register Your Organization
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-uswds-gray-70">
          <Link href="/" className="hover:text-uswds-blue">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
