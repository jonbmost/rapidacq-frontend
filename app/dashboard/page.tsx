'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Search, Lightbulb, Building2, LogOut, MessageSquare, Target, TrendingUp, CheckCircle, FileCheck, Users, Shield, Presentation, Book } from 'lucide-react';
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
    { name: 'Acquisition Strategy', icon: Target, href: '/tools/acquisition-strategy', description: 'Develop comprehensive acquisition strategies' },
    { name: 'Requirement Documents', icon: FileText, href: '/tools/requirement-documents', description: 'Generate SOWs, PWS, and requirements' },
    { name: 'Market Analysis', icon: TrendingUp, href: '/tools/market-analysis', description: 'Conduct market research and vendor analysis' },
    { name: 'Evaluation Criteria', icon: CheckCircle, href: '/tools/evaluation-criteria', description: 'Create objective evaluation criteria' },
    { name: 'SOP Creation', icon: FileCheck, href: '/tools/sop-creation', description: 'Develop standardized operating procedures' },
    { name: 'Stakeholder Mapping', icon: Users, href: '/tools/stakeholder-mapping', description: 'Identify and analyze key stakeholders' },
    { name: 'Authority Needs Assessment', icon: Shield, href: '/tools/authority-assessment', description: 'Determine optimal acquisition authority' },
    { name: 'Slide Ranger', icon: Presentation, href: '/tools/slide-ranger', description: 'Generate professional presentations' },
    { name: 'Document Analysis', icon: Search, href: '/tools/document-analysis', description: 'Review contracts and documents' },
    { name: 'Regs & Policy', icon: Book, href: '/tools/regs-policy', description: 'FAR and policy quick reference' },
  ];

  return (
    <div className="min-h-screen bg-uswds-gray-5">
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
              All Services
            </h2>
            <div className="grid grid-cols-1 gap-3 mb-6">
              {quickTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="bg-white p-4 rounded border-2 border-uswds-gray-30 hover:border-uswds-blue transition-all flex items-center"
                  >
                    <div className="w-10 h-10 rounded bg-uswds-blue-5 flex items-center justify-center mr-3">
                      <Icon className="h-5 w-5 text-uswds-blue" />
                    </div>
                    <div>
                      <h3 className="font-bold text-uswds-gray-90 text-sm">{tool.name}</h3>
                      <p className="text-xs text-uswds-gray-70">{tool.description}</p>
                    </div>
                  </Link>
                );
              })}
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
