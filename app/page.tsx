import Link from 'next/link';
import { ArrowRight, Wrench, FileText, TrendingUp, CheckCircle, FileCheck, Users, Shield, Presentation, Search, Book, Target } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Navigation */}
      <nav className="bg-[#1e293b] border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">AIT</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-300 hover:text-white transition">Features</Link>
              <Link href="#services" className="text-slate-300 hover:text-white transition">Services</Link>
              <Link href="/about" className="text-slate-300 hover:text-white transition">About</Link>
              <Link href="/contact" className="text-slate-300 hover:text-white transition">Contact</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-slate-300 hover:text-white transition">Sign In</Link>
              <Link href="/admin/login" className="text-slate-300 hover:text-white transition">Admin</Link>
              <Link 
                href="/onboarding" 
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700 mb-8">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-slate-300">Agile Innovation Toolkit</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Rapidly Develop<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                Solutions
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Agile Innovation Toolkit (AIT) empowers government teams to move faster from idea to award. By combining acquisition strategy, market intelligence, requirements development, evaluation design, and policy guidance in one platform, AIT helps teams drive innovation while staying 
              compliant, disciplined, and mission-focused. 
              
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/onboarding"
                className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-900/50"
              >
                Start Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <div className="flex items-center space-x-3 text-slate-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Built on 20+ Years of Proven Solutions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1e293b]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Core <span className="text-blue-500">AIT</span> Services
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Comprehensive solutions designed to accelerate your strategy and drive rapid 
              innovation across your organization.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                name: 'Acquisition Strategy Development', 
                icon: Target, 
                desc: 'Develop comprehensive acquisition strategies with expert guidance and data-driven insights for rapid solution development.'
              },
              { 
                name: 'Business Process Redesign', 
                icon: Target, 
                desc: 'Optimize and transform your organizational workflows with strategic process redesign tailored to your acquisition goals.'
              },
              { 
                name: 'Requirement Document Generation', 
                icon: FileText, 
                desc: 'Automatically generate detailed, professional requirement documents that capture all critical specifications and deliverables.'
              },
              { 
                name: 'Market Research Services', 
                icon: TrendingUp, 
                desc: 'Identify and evaluate emerging technologies that align with your mission needs and accelerate your digital transformation journey.'
              },
              { 
                name: 'Authority Needs Analysis', 
                icon: Shield, 
                desc: 'Comprehensive analysis of legal mandates, authority scope, and approval processes to ensure compliance and proper governance alignment.'
              },
              { 
                name: 'Evaluation Criteria', 
                icon: CheckCircle, 
                desc: 'Create objective, defensible evaluation criteria and scoring methodologies for source selection decisions.'
              },
              { 
                name: 'SOP Creation', 
                icon: FileCheck, 
                desc: 'Develop standardized operating procedures for repeatable acquisition processes and workflows.'
              },
              { 
                name: 'Stakeholder Mapping', 
                icon: Users, 
                desc: 'Identify and analyze key stakeholders, map their roles and interests, and develop effective communication strategies.'
              },
              { 
                name: 'Slide Ranger', 
                icon: Presentation, 
                desc: 'Generate professional acquisition briefings and presentations for leadership, stakeholders, and review boards.'
              },
              { 
                name: 'Document Analysis', 
                icon: Search, 
                desc: 'Review and analyze contracts, proposals, and acquisition documents for compliance, risk, and improvement opportunities.'
              },
            ].map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={index}
                  className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-800 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600/20 transition">
                    <Icon className="h-7 w-7 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{service.name}</h3>
                  <p className="text-slate-400 leading-relaxed">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Complete Solution Suite */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Complete Solution Suite
            </h2>
            <p className="text-xl text-slate-400">
              Beyond core services, we provide specialized expertise to ensure your strategy 
              succeeds at every level.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition">
              <div className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6">
                <Book className="h-7 w-7 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Regs & Policy</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Quick reference and guidance on FAR, DFARS, agency supplements, and acquisition 
                policy to ensure compliance and regulatory alignment.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition">
              <div className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6">
                <Wrench className="h-7 w-7 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Digital Interactive Playbooks</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Access comprehensive playbooks with actionable strategies and best practices to 
                guide your acquisition and implementation process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Acquisition Process?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Join federal acquisition professionals using AIT to accelerate solutions and improve outcomes.
          </p>
          <Link 
            href="/onboarding"
            className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-900/50"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e293b] border-t border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Wrench className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AIT</span>
              </div>
              <p className="text-slate-400 text-sm">
                AI-powered federal acquisition platform
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#services" className="text-slate-400 hover:text-white transition">Services</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white transition">Features</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-slate-400 hover:text-white transition">About</Link></li>
                <li><Link href="/contact" className="text-slate-400 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-slate-400 hover:text-white transition">Privacy</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white transition">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
            © 2025 AIT. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
