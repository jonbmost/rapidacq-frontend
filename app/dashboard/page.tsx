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

  const services = [
    { name: 'Acquisition Strategy', icon: Target, href: '/tools/acquisition-strategy', description: 'Develop comprehensive acquisition strategies' },
    { name: 'Requirement Documents', icon: FileText, href: '/tools/requirement-documents', description: 'Generate SOWs, PWS, and requirements' },
    { name: 'Market Analysis', icon: TrendingUp, href: '/tools/market-analysis', description: 'Conduct market research' },
    { name: 'Evaluation Criteria', icon: CheckCircle, href: '/tools/evaluation-criteria', description: 'Create scoring methodologies' },
    { name: 'SOP Creation', icon: FileCheck, href: '/tools/sop-creation', description: 'Standardize processes' },
    { name: 'Stakeholder Mapping', icon: Users, href: '/tools/stakeholder-mapping', description: 'Identify key stakeholders' },
    { name: 'Authority Assessment', icon: Shield, href: '/tools/authority-assessment', description: 'Determine optimal authority' },
    { name: 'Slide Ranger', icon: Presentation, href: '/tools/slide-ranger', description: 'Generate presentations' },
    { name: 'Document Analysis', icon: Search, href: '/tools/document-analysis', description: 'Review compliance' },
    { name: 'Regs & Policy', icon: Book, href: '/tools/regs-policy', description: 'FAR quick reference' },
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Services Grid - 2 columns */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Your Services</h1>
              <p className="text-slate-400">Select a service to get started with your acquisition</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-800 hover:border-blue-500/50 transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 transition">
                        <Icon className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white mb-1 group-hover:text-blue-400 transition">
                          {service.name}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* AI Assistant Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <MessageSquare className="h-6 w-6 text-white" />
                    <h2 className="text-xl font-bold text-white">AI Assistant</h2>
                  </div>
                  <p className="text-blue-100 text-sm">
                    Get instant acquisition guidance
                  </p>
                </div>
                <div className="h-[calc(100vh-340px)]">
                  <AcquisitionChatbot />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
