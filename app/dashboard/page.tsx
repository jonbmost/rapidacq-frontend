'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Search, Lightbulb, Building2, LogOut, MessageSquare } from 'lucide-react';
import AcquisitionChatbot from '@/components/AcquisitionChatbot';

export default function DashboardPage() {
  const router = useRouter();
  const [orgName, setOrgName] = useState('');

  useEffect(() => {
    const storedOrgId = localStorage.getItem('organizationId');
    const storedOrgName = localStorage.getItem('organizationName');
    
    if (!storedOrgId) {
      router.push('/onboarding');
      return;
    }
    
    setOrgName(storedOrgName || 'Your Organization');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('organizationId');
    localStorage.removeItem('organizationName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const quickTools = [
    { name: 'SOW Generator', icon: FileText, href: '/tools/sow-generator', color: 'uswds-blue' },
    { name: 'Market Research', icon: Search, href: '/tools/market-research', color: 'uswds-green' },
    { name: 'Strategy Advisor', icon: Lightbulb, href: '/tools/strategy-advisor', color: 'uswds-gold' },
  ];

  return (
    <div className="min-h-screen bg-uswds-gray-5">
      {/* USWDS Banner */}
      <div className="bg-white border-b border-uswds-gray-30">
        <div className="max-w-7xl mx-auto px-4 py-1 text-xs text-uswds-gray-70">
          An official website of the United States government
        </div>
      </div>

      {/* Top Navigation */}
      <nav className="bg-uswds-blue text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-2xl font-bold">RapidAcq</Link>
              <div className="flex items-center text-sm text-uswds-blue-20">
                <Building2 className="h-4 w-4 mr-1" />
                {orgName}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-white/80 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-uswds-gray-90 mb-2 font-serif">
            Welcome back!
          </h1>
          <p className="text-xl text-uswds-gray-70">
            Access your AI-powered acquisition tools
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Quick Tools */}
          <div>
            <h2 className="text-2xl font-bold text-uswds-gray-90 mb-4 flex items-center">
              <FileText className="h-6 w-6 mr-2" />
              Quick Access Tools
            </h2>
            <div className="space-y-4">
              {quickTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="bg-white p-6 rounded border-2 border-uswds-gray-30 hover:border-uswds-blue transition-all flex items-center"
                  >
                    <div className={`w-12 h-12 rounded bg-uswds-blue-5 flex items-center justify-center mr-4`}>
                      <Icon className={`h-6 w-6 text-uswds-blue`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-uswds-gray-90">{tool.name}</h3>
                      <p className="text-sm text-uswds-gray-70">Generate professional documents</p>
                    </div>
                  </Link>
                );
              })}
              
              {/* Coming Soon Tools */}
              <div className="bg-white p-6 rounded border-2 border-uswds-gray-20 opacity-60">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded bg-uswds-gray-5 flex items-center justify-center mr-4">
                    <FileText className="h-6 w-6 text-uswds-gray-50" />
                  </div>
                  <div>
                    <h3 className="font-bold text-uswds-gray-70">More Tools Coming Soon</h3>
                    <p className="text-sm text-uswds-gray-50">FAR Compliance, Contract Review, & More</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - AI Assistant */}
          <div>
            <h2 className="text-2xl font-bold text-uswds-gray-90 mb-4 flex items-center">
              <MessageSquare className="h-6 w-6 mr-2" />
              AI Acquisition Assistant
            </h2>
            <AcquisitionChatbot />
          </div>
        </div>
      </div>
    </div>
  );
}
