'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Search, Lightbulb, FileCheck, Shield, Rocket, Code, Users, FileSignature, ArrowLeft } from 'lucide-react';

const tools = [
  {
    name: 'SOW Generator',
    description: 'Create professional Statements of Objectives with agile guardrails',
    icon: FileText,
    href: '/tools/sow-generator',
    color: 'uswds-blue'
  },
  {
    name: 'Market Research',
    description: 'Comprehensive vendor landscape and competitive analysis',
    icon: Search,
    href: '/tools/market-research',
    color: 'uswds-green'
  },
  {
    name: 'Strategy Advisor',
    description: 'Evidence-based acquisition vehicle recommendations',
    icon: Lightbulb,
    href: '/tools/strategy-advisor',
    color: 'uswds-gold'
  },
  {
    name: 'Contract Review',
    description: 'Risk identification and improvement recommendations',
    icon: FileCheck,
    href: '/tools/contract-review',
    color: 'uswds-red-warm'
  },
  {
    name: 'FAR Compliance',
    description: 'Automated compliance checking with FAR citations',
    icon: Shield,
    href: '/tools/far-compliance',
    color: 'uswds-blue-70'
  },
  {
    name: 'SBIR Transition',
    description: 'Navigate SBIR Phase III transition pathways',
    icon: Rocket,
    href: '/tools/sbir-transition',
    color: 'uswds-blue-50'
  },
  {
    name: 'Agile Planner',
    description: 'Design modular contracting and sprint strategies',
    icon: Code,
    href: '/tools/agile-planner',
    color: 'uswds-green-cool'
  },
  {
    name: 'PM/COR Coordinator',
    description: 'Coordinate program management and oversight',
    icon: Users,
    href: '/tools/pm-cor-coordinator',
    color: 'uswds-gold'
  },
  {
    name: 'RFP Generator',
    description: 'Create professional solicitation documents',
    icon: FileSignature,
    href: '/tools/rfp-generator',
    color: 'uswds-blue-60'
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
    <div className="min-h-screen bg-uswds-gray-5">
      {/* USWDS Banner */}
      </div>

      {/* Header */}
      <div className="bg-uswds-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="text-white/80 hover:text-white mb-4 inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2 font-serif">Acquisition Tools</h1>
          <p className="text-xl text-uswds-blue-20">
            AI-powered tools built on agile acquisition principles
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.name}
                href={tool.href}
                className="bg-white p-6 rounded border-2 border-uswds-gray-10 hover:border-uswds-blue transition-all shadow-sm hover:shadow-md"
              >
                <div className={`w-12 h-12 rounded bg-uswds-blue-10 flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 text-uswds-blue`} />
                </div>
                <h3 className="text-xl font-semibold text-uswds-gray-90 mb-2">{tool.name}</h3>
                <p className="text-uswds-gray-70">{tool.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
