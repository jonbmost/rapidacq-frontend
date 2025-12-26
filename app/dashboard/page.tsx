'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Wrench, Target, FileText, TrendingUp, CheckCircle, FileCheck, Users, Shield, Presentation, Search, Book } from 'lucide-react';
import AcquisitionChatbot from '@/components/AcquisitionChatbot';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orgName, setOrgName] = useState('');
  const [stats, setStats] = useState([
    { label: 'Acquisition Strategies', count: 0, icon: Target, key: 'acquisition-strategy' },
    { label: 'Requirement Documents', count: 0, icon: FileText, key: 'requirement-documents' },
    { label: 'Market Analyses', count: 0, icon: TrendingUp, key: 'market-analysis' },
    { label: 'Evaluation Criteria', count: 0, icon: CheckCircle, key: 'evaluation-criteria' },
    { label: 'SOPs Created', count: 0, icon: FileCheck, key: 'sop-creation' },
    { label: 'Stakeholder Maps', count: 0, icon: Users, key: 'stakeholder-mapping' },
    { label: 'Authority Assessments', count: 0, icon: Shield, key: 'authority-assessment' },
    { label: 'Presentations', count: 0, icon: Presentation, key: 'slide-ranger' },
    { label: 'Document Analyses', count: 0, icon: Search, key: 'document-analysis' },
    { label: 'Regs Lookups', count: 0, icon: Book, key: 'regs-policy' },
  ]);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const userOrgName = localStorage.getItem('organizationName');
    
    if (!userEmail) {
      router.push('/login');
      return;
    }
    
    setUser({ email: userEmail });
    setOrgName(userOrgName || '');

    // Load usage stats from localStorage
    loadStats();
  }, [router]);

  const loadStats = () => {
    const updatedStats = stats.map(stat => {
      const conversationCount = parseInt(localStorage.getItem(`${stat.key}-conversations`) || '0');
      const downloadCount = parseInt(localStorage.getItem(`${stat.key}-downloads`) || '0');
      return {
        ...stat,
        count: conversationCount + downloadCount
      };
    });
    setStats(updatedStats);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');
    localStorage.removeItem('organizationId');
    localStorage.removeItem('organizationName');
    router.push('/');
  };

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
              <span className="text-xl font-bold text-white">RapidAcq</span>
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

        {/* AI Assistant Chatbot - Now right after overview */}
        <div className="mb-8">
          <AcquisitionChatbot />
        </div>

        {/* Services Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Acquisition Intelligence Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.name}
                  href={service.href}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-blue-500 hover:bg-slate-800/70 transition group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 transition">
                      <Icon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1 group-hover:text-blue-400 transition">
                        {service.name}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {service.description}
                      </p>
                    </div>
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
