import Link from 'next/link';
import { FileText, Search, Lightbulb, FileCheck, Shield, Rocket, Code, Users, FileSignature } from 'lucide-react';

const tools = [
  {
    name: 'SOW Generator',
    description: 'Create professional Statements of Objectives in minutes',
    icon: FileText,
    href: '/tools/sow-generator',
    color: 'blue'
  },
  {
    name: 'Market Research',
    description: 'Comprehensive vendor landscape and competitive analysis',
    icon: Search,
    href: '/tools/market-research',
    color: 'green'
  },
  {
    name: 'Strategy Advisor',
    description: 'Get recommendations on acquisition vehicles and approaches',
    icon: Lightbulb,
    href: '/tools/strategy-advisor',
    color: 'purple'
  },
  {
    name: 'Contract Review',
    description: 'Identify risks and get improvement recommendations',
    icon: FileCheck,
    href: '/tools/contract-review',
    color: 'orange'
  },
  {
    name: 'FAR Compliance',
    description: 'Check compliance with automated FAR analysis',
    icon: Shield,
    href: '/tools/far-compliance',
    color: 'red'
  },
  {
    name: 'SBIR Transition',
    description: 'Navigate SBIR Phase III transition pathways',
    icon: Rocket,
    href: '/tools/sbir-transition',
    color: 'indigo'
  },
  {
    name: 'Agile Planner',
    description: 'Design modular contracting and sprint strategies',
    icon: Code,
    href: '/tools/agile-planner',
    color: 'cyan'
  },
  {
    name: 'PM/COR Coordinator',
    description: 'Coordinate program management and oversight',
    icon: Users,
    href: '/tools/pm-cor-coordinator',
    color: 'pink'
  },
  {
    name: 'RFP Generator',
    description: 'Create professional RFPs and RFIs',
    icon: FileSignature,
    href: '/tools/rfp-generator',
    color: 'amber'
  }
];

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
  red: 'bg-red-100 text-red-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  cyan: 'bg-cyan-100 text-cyan-600',
  pink: 'bg-pink-100 text-pink-600',
  amber: 'bg-amber-100 text-amber-600',
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Acquisition Tools</h1>
          <p className="text-xl text-gray-600">AI-powered tools to streamline your federal acquisition process</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.name}
                href={tool.href}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[tool.color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-gray-600">{tool.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
