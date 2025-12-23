'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Wrench, MessageSquare, Target, FileText, TrendingUp, CheckCircle, FileCheck, Users, Shield, Presentation, Search, Book } from 'lucide-react';
import AcquisitionChatbot from '@/components/AcquisitionChatbot';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orgName, setOrgName] = useState('');

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const userOrgName = localStorage.getItem('userOrgName');
    
    if (!userEmail) {
      router.push('/login');
      return;
    }
    
    setUser({ email: userEmail });
    setOrgName(userOrgName || '');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userOrgName');
    router.push('/');
  };

  // Stats for dashboard - will be dynamic in future
  const stats = [
    { label: 'Acquisition Strategies', count: 0, icon: Target },
    { label: 'Requirement Documents', count: 0, icon: FileText },
    { label: 'Market Analyses', count: 0, icon: TrendingUp },
    { label: 'Evaluation Criteria', count: 0, icon: CheckCircle },
    { label: 'SOPs Created', count: 0, icon: FileCheck },
    { label: 'Stakeholder Maps', count: 0, icon: Users },
    { label: 'Authority Assessments', count: 0, icon: Shield },
    { label: 'Presentations', count: 0, icon: Presentation },
    { label: 'Document Analyses', count: 0, icon: Search },
    { label: 'Regs Lookups', count: 0, icon: Book },
  ];

  // Services in alphabetical order
  const services = [
    { name: 'Acquisition Strategy', icon: Target, href: '/tools/acquisition-strategy', description: 'Develop comprehensive acquisition strategies' },
    { name: 'Authority Assessment', icon: Shield, href: '/tools/authority-assessment', description: 'Determine optimal authority' },
    { name: 'Document Analysis', icon: Search, href: '/tools/document-analysis', description: 'Review compliance' },
    { name: 'Evaluation Criteria', icon: CheckCircle, href: '/tools/evaluation-criteria', description: 'Create scoring methodologies' },
    { name: 'Market Analysis', icon: TrendingUp, href: '/tools/market-analysis', description: 'Conduct market research' },
    { name: 'Regs & Policy', icon: Book, href: '/tools/regs-policy', description: 'FAR quick reference' },
    { name: 'Requirement Documents', icon: FileText, href: '/tools/requirement-documents', description: 'Generate SOWs, PWS, and requirements' },
    { name: 'Slide Ranger', icon: Presentation, href: '/tools/slide-ranger', description: 'Generate presentations' },
    { name: 'SOP Creation', icon: FileCheck, href: '/tools/sop-creation', description: 'Standardize processes' },
    { name: 'Stakeholder Mapping', icon: Users, href: '/tools/stakeholder-mapping', description: 'Identify key stakeholders' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="bg-[#1e293b] border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AIT</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-sm">
                <div className="font-medium text-white">{user.email}</div>
                {orgName && <div className="text-slate-400 text-xs">{orgName}</div>}
              </div>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-white transition flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Dashboard */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-4">Dashboard Overview</h1>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stat.count}</div>
                      <div className="text-xs text-slate-400">{stat.label}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Assistant - Full Width */}
        <div className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-6 w-6 text-white" />
                <h2 className="text-xl font-bold text-white">AI Assistant</h2>
                <span className="text-blue-100 text-sm ml-auto">Get instant acquisition guidance</span>
              </div>
            </div>
            <div className="h-[400px]">
              <AcquisitionChatbot />
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Your Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.name}
                  href={service.href}
                  className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-800 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600/20 transition">
                      <Icon className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="font-bold text-white mb-2 group-hover:text-blue-400 transition">
                      {service.name}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {service.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
