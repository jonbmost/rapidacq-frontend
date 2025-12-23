'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Zap, MessageSquare, Target, FileText, TrendingUp, CheckCircle, FileCheck, Users, Shield, Presentation, Search, Book } from 'lucide-react';
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
    { 
      name: 'Acquisition Strategy', 
      icon: Target, 
      href: '/tools/acquisition-strategy', 
      description: 'Develop comprehensive acquisition strategies',
      category: 'Strategy'
    },
    { 
      name: 'Requirement Documents', 
      icon: FileText, 
      href: '/tools/requirement-documents', 
      description: 'Generate SOWs, PWS, and requirements',
      category: 'Documentation'
    },
    { 
      name: 'Market Analysis', 
      icon: TrendingUp, 
      href: '/tools/market-analysis', 
      description: 'Conduct market research',
      category: 'Research'
    },
    { 
      name: 'Evaluation Criteria', 
      icon: CheckCircle, 
      href: '/tools/evaluation-criteria', 
      description: 'Create scoring methodologies',
      category: 'Evaluation'
    },
    { 
      name: 'SOP Creation', 
      icon: FileCheck, 
      href: '/tools/sop-creation', 
      description: 'Standardize processes',
      category: 'Process'
    },
    { 
      name: 'Stakeholder Mapping', 
      icon: Users, 
      href: '/tools/stakeholder-mapping', 
      description: 'Identify key stakeholders',
      category: 'Planning'
    },
    { 
      name: 'Authority Assessment', 
      icon: Shield, 
      href: '/tools/authority-assessment', 
      description: 'Determine optimal authority',
      category: 'Strategy'
    },
    { 
      name: 'Slide Ranger', 
      icon: Presentation, 
      href: '/tools/slide-ranger', 
      description: 'Generate presentations',
      category: 'Documentation'
    },
    { 
      name: 'Document Analysis', 
      icon: Search, 
      href: '/tools/document-analysis', 
      description: 'Review compliance',
      category: 'Analysis'
    },
    { 
      name: 'Regs & Policy', 
      icon: Book, 
      href: '/tools/regs-policy', 
      description: 'FAR quick reference',
      category: 'Reference'
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-uswds-gray-5 flex items-center justify-center">
        <div className="text-uswds-gray-70">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-uswds-gray-5">
      {/* Header */}
      <header className="bg-white border-b border-uswds-gray-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-uswds-blue rounded flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-uswds-gray-90 font-serif">RapidAcq</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-sm">
                <div className="font-medium text-uswds-gray-90">{user.email}</div>
                {orgName && <div className="text-uswds-gray-50 text-xs">{orgName}</div>}
              </div>
              <button
                onClick={handleLogout}
                className="text-uswds-gray-70 hover:text-uswds-red-warm transition flex items-center space-x-2"
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
          {/* Services Grid - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-uswds-gray-90 font-serif">Your Services</h1>
              <p className="text-uswds-gray-70 mt-1">Select a service to get started</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="group bg-white p-6 rounded-lg border border-uswds-gray-10 hover:border-uswds-blue hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-uswds-blue-5 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-uswds-blue transition">
                        <Icon className="h-6 w-6 text-uswds-blue group-hover:text-white transition" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-uswds-gray-90 group-hover:text-uswds-blue transition truncate">
                            {service.name}
                          </h3>
                        </div>
                        <p className="text-sm text-uswds-gray-70 line-clamp-2">
                          {service.description}
                        </p>
                        <div className="mt-2">
                          <span className="inline-block text-xs font-medium text-uswds-blue bg-uswds-blue-5 px-2 py-1 rounded">
                            {service.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* AI Assistant Sidebar - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg border border-uswds-gray-10 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-uswds-blue to-uswds-blue-70 p-6 text-white">
                  <div className="flex items-center space-x-3 mb-2">
                    <MessageSquare className="h-6 w-6" />
                    <h2 className="text-xl font-bold font-serif">AI Assistant</h2>
                  </div>
                  <p className="text-uswds-blue-10 text-sm">
                    Get instant acquisition guidance
                  </p>
                </div>
                <div className="h-[calc(100vh-280px)]">
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
