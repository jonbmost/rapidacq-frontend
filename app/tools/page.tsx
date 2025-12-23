'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Target, Shield, Search, CheckCircle, TrendingUp, Book, FileText, Presentation, FileCheck, Users, ArrowLeft } from 'lucide-react';

const tools = [
  {
    name: 'Acquisition Strategy',
    description: 'Develop comprehensive acquisition strategies',
    icon: Target,
    href: '/tools/acquisition-strategy'
  },
  {
    name: 'Authority Assessment',
    description: 'Determine optimal authority',
    icon: Shield,
    href: '/tools/authority-assessment'
  },
  {
    name: 'Document Analysis',
    description: 'Review compliance',
    icon: Search,
    href: '/tools/document-analysis'
  },
  {
    name: 'Evaluation Criteria',
    description: 'Create scoring methodologies',
    icon: CheckCircle,
    href: '/tools/evaluation-criteria'
  },
  {
    name: 'Market Analysis',
    description: 'Conduct market research',
    icon: TrendingUp,
    href: '/tools/market-analysis'
  },
  {
    name: 'Regs & Policy',
    description: 'FAR quick reference',
    icon: Book,
    href: '/tools/regs-policy'
  },
  {
    name: 'Requirement Documents',
    description: 'Generate SOWs, PWS, and requirements',
    icon: FileText,
    href: '/tools/requirement-documents'
  },
  {
    name: 'Slide Ranger',
    description: 'Generate presentations',
    icon: Presentation,
    href: '/tools/slide-ranger'
  },
  {
    name: 'SOP Creation',
    description: 'Standardize processes',
    icon: FileCheck,
    href: '/tools/sop-creation'
  },
  {
    name: 'Stakeholder Mapping',
    description: 'Identify key stakeholders',
    icon: Users,
    href: '/tools/stakeholder-mapping'
  }
];

export default function ToolsPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const orgId = localStorage.getItem('organizationId');
    if (!orgId) {
      router.push('/onboarding');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <header className="bg-[#1e293b] border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-10">
            <Link href="/dashboard" className="text-slate-400 hover:text-white inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Your Services</h1>
              <p className="text-slate-400 mt-2">
                AI-powered tools built on agile acquisition principles
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.name}
                href={tool.href}
                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-800 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600/20 transition">
                    <Icon className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="font-bold text-white mb-2 group-hover:text-blue-400 transition">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {tool.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
