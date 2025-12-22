'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    const checkConnection = async () => {
      const result = await api.healthCheck();
      setApiStatus(result.success ? 'connected' : 'disconnected');
    };
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      

      {/* Navigation */}
      <nav className="border-b-4 border-uswds-blue bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-uswds-blue">RapidAcq</div>
              <span className="text-sm text-uswds-gray-70 hidden sm:inline">
                Federal Acquisition Intelligence
              </span>
            </Link>
            
            <div className="flex items-center space-x-6">
              {/* API Status */}
              <div className="flex items-center space-x-2 text-sm">
                {apiStatus === 'connected' && (
                  <>
                    <CheckCircle className="h-4 w-4 text-uswds-green" />
                    <span className="text-uswds-green hidden md:inline">API Connected</span>
                  </>
                )}
                {apiStatus === 'disconnected' && (
                  <>
                    <XCircle className="h-4 w-4 text-uswds-red" />
                    <span className="text-uswds-red hidden md:inline">API Offline</span>
                  </>
                )}
         <div className="flex items-center space-x-4">
  <Link href="/login" className="text-gray-700 hover:text-primary-600">Sign In</Link>
  <Link href="/admin/login" className="text-gray-700 hover:text-primary-600">Admin</Link>
  <Link 
    href="/onboarding" 
    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
  >
    Get Started
  </Link>
</div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-uswds-blue-5 pt-16 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {apiStatus === 'connected' && (
            <div className="mb-8 inline-flex items-center bg-uswds-green-cool/10 text-uswds-green-cool px-4 py-2 rounded border border-uswds-green-cool/20">
              <CheckCircle className="h-4 w-4 mr-2" />
              Connected to Cloud Backend
            </div>
          )}
          
          <h1 className="text-5xl font-bold text-uswds-gray-90 mb-6 font-serif">
            Transform Federal Acquisition<br />
            <span className="text-uswds-blue">with AI-Powered Intelligence</span>
          </h1>
          
          <p className="text-xl text-uswds-gray-70 mb-8 max-w-3xl mx-auto">
            Streamline your acquisition process with intelligent tools built on agile principles, 
            USWDS standards, and federal best practices.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/onboarding" 
              className="inline-flex items-center justify-center bg-uswds-blue text-white px-8 py-3 rounded text-lg font-semibold hover:bg-uswds-blue-70"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center border-2 border-uswds-blue text-uswds-blue px-8 py-3 rounded text-lg font-semibold hover:bg-uswds-blue-5"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-uswds-gray-90 font-serif">
            9 Powerful Acquisition Tools
          </h2>
          <p className="text-center text-uswds-gray-70 mb-16 max-w-2xl mx-auto">
            Built on agile acquisition principles and federal design standards
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded border-2 border-uswds-blue-10 hover:border-uswds-blue-30 transition-colors">
              <div className="bg-uswds-blue-10 w-16 h-16 rounded flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-uswds-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-uswds-gray-90">SOW Generator</h3>
              <p className="text-uswds-gray-70">Create performance-based SOOs in minutes with agile guardrails</p>
            </div>

            <div className="bg-white p-8 rounded border-2 border-uswds-blue-10 hover:border-uswds-blue-30 transition-colors">
              <div className="bg-uswds-blue-10 w-16 h-16 rounded flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-uswds-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-uswds-gray-90">Market Research</h3>
              <p className="text-uswds-gray-70">Comprehensive vendor analysis and competition strategy</p>
            </div>

            <div className="bg-white p-8 rounded border-2 border-uswds-blue-10 hover:border-uswds-blue-30 transition-colors">
              <div className="bg-uswds-blue-10 w-16 h-16 rounded flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-uswds-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-uswds-gray-90">FAR Compliance</h3>
              <p className="text-uswds-gray-70">Automated compliance checking with specific citations</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-uswds-gray-70 mb-4">
              Ready to transform your acquisition process?
            </p>
            <Link href="/onboarding" className="text-uswds-blue hover:text-uswds-blue-70 font-semibold text-lg">
              Get Started Today →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-uswds-gray-90 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">RapidAcq</h4>
              <p className="text-uswds-gray-30 text-sm">
                AI-powered federal acquisition tools built on agile principles
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Get Started</h4>
              <ul className="space-y-2 text-uswds-gray-30 text-sm">
                <li><Link href="/onboarding" className="hover:text-white">Create Account</Link></li>
                <li><Link href="/login" className="hover:text-white">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-uswds-gray-30 text-sm">
                Agile Acquisitions LLC<br />
                Email: info@rapidacq.com
              </p>
            </div>
          </div>
          <div className="border-t border-uswds-gray-70 pt-8 text-center text-uswds-gray-30 text-sm">
            © 2025 RapidAcq. Built with USWDS standards.
          </div>
        </div>
      </footer>
    </div>
  );
}

<div>
  <h4 className="text-white font-semibold mb-4">Admin</h4>
  <ul className="space-y-2 text-sm">
    <li><Link href="/admin/login" className="hover:text-white">Admin Login</Link></li>
  </ul>
</div>