'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [apiMessage, setApiMessage] = useState<string>('');

  useEffect(() => {
    // Check backend connection on page load
    const checkConnection = async () => {
      const result = await api.healthCheck();
      if (result.success) {
        setApiStatus('connected');
        setApiMessage('Backend connected successfully');
      } else {
        setApiStatus('disconnected');
        setApiMessage(result.error || 'Unable to connect to backend');
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-2xl font-bold text-blue-600">RapidAcq</span>
            <div className="flex items-center space-x-4">
              {/* API Status Indicator */}
              <div className="flex items-center space-x-2 text-sm">
                {apiStatus === 'checking' && (
                  <span className="text-gray-500">Checking API...</span>
                )}
                {apiStatus === 'connected' && (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">API Connected</span>
                  </>
                )}
                {apiStatus === 'disconnected' && (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-red-600">API Offline</span>
                  </>
                )}
              </div>
              <Link href="/login" className="text-gray-700">Sign In</Link>
              <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-16 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          {/* Backend Status Banner */}
          {apiStatus === 'connected' && (
            <div className="mb-8 inline-flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Connected to Google Cloud Backend
            </div>
          )}
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Federal Acquisition<br />
            <span className="text-blue-600">with AI-Powered Intelligence</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your acquisition process with intelligent tools for SOWs, market research, and compliance.
          </p>
          <Link href="/signup" className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold">
            Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">SOW Generator</h3>
              <p className="text-gray-600">Create professional SOWs in minutes</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <TrendingUp className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Market Research</h3>
              <p className="text-gray-600">Comprehensive vendor analysis</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">FAR Compliance</h3>
              <p className="text-gray-600">Automated compliance checking</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <p>© 2025 RapidAcq. All rights reserved.</p>
        {apiMessage && (
          <p className="text-sm mt-2 text-gray-500">{apiMessage}</p>
        )}
      </footer>
    </div>
  );
}
