import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-uswds-gray-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-uswds-blue rounded flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-uswds-gray-90 font-serif">RapidAcq</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/login" className="text-uswds-gray-70 hover:text-uswds-blue font-medium transition">
                Sign In
              </Link>
              <Link href="/admin/login" className="text-uswds-gray-70 hover:text-uswds-blue font-medium transition">
                Admin
              </Link>
              <Link 
                href="/onboarding" 
                className="bg-uswds-blue text-white px-6 py-2.5 rounded-md hover:bg-uswds-blue-70 transition font-semibold"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-uswds-blue-5 to-white pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-uswds-blue-20 mb-6">
                <Shield className="h-4 w-4 text-uswds-blue" />
                <span className="text-sm font-medium text-uswds-blue">Trusted by Federal Agencies</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-uswds-gray-90 mb-6 font-serif leading-tight">
                Federal Acquisition,<br />
                <span className="text-uswds-blue">Simplified</span>
              </h1>
              <p className="text-xl text-uswds-gray-70 mb-8 leading-relaxed">
                AI-powered tools for acquisition strategy, requirements, market research, and compliance. 
                Built by acquisition professionals, for acquisition professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/onboarding"
                  className="inline-flex items-center justify-center bg-uswds-blue text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-uswds-blue-70 transition shadow-lg hover:shadow-xl"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="#services"
                  className="inline-flex items-center justify-center border-2 border-uswds-gray-30 text-uswds-gray-90 px-8 py-4 rounded-md text-lg font-semibold hover:border-uswds-blue hover:text-uswds-blue transition"
                >
                  View Services
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white rounded-lg shadow-2xl p-8 border border-uswds-gray-10">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-uswds-blue-5 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-uswds-blue flex-shrink-0" />
                    <span className="text-uswds-gray-90 font-medium">FAR-compliant strategies in minutes</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-uswds-green-5 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-uswds-green flex-shrink-0" />
                    <span className="text-uswds-gray-90 font-medium">AI-powered market analysis</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-uswds-gold-5 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-uswds-gold flex-shrink-0" />
                    <span className="text-uswds-gray-90 font-medium">Expert acquisition guidance 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-uswds-gray-90 mb-4 font-serif">
              Complete Acquisition Toolkit
            </h2>
            <p className="text-xl text-uswds-gray-70 max-w-2xl mx-auto">
              Ten specialized AI tools covering every phase of the acquisition lifecycle
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Acquisition Strategy', desc: 'Develop comprehensive strategies' },
              { name: 'Requirement Documents', desc: 'Generate SOWs and PWS' },
              { name: 'Market Analysis', desc: 'Research vendors and markets' },
              { name: 'Evaluation Criteria', desc: 'Create scoring methodologies' },
              { name: 'SOP Creation', desc: 'Standardize processes' },
              { name: 'Stakeholder Mapping', desc: 'Identify key stakeholders' },
              { name: 'Authority Assessment', desc: 'Choose optimal authority' },
              { name: 'Slide Ranger', desc: 'Build presentations' },
              { name: 'Document Analysis', desc: 'Review compliance' },
              { name: 'Regs & Policy', desc: 'FAR quick reference' },
            ].map((service, index) => (
              <div 
                key={index}
                className="group bg-white p-6 rounded-lg border-2 border-uswds-gray-10 hover:border-uswds-blue hover:shadow-lg transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-uswds-blue-5 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-uswds-blue group-hover:text-white transition">
                    <CheckCircle className="h-6 w-6 text-uswds-blue group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-uswds-gray-90 mb-1">{service.name}</h3>
                    <p className="text-sm text-uswds-gray-70">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-uswds-blue">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4 font-serif">
            Ready to Accelerate Your Acquisitions?
          </h2>
          <p className="text-xl text-uswds-blue-20 mb-8">
            Join federal acquisition professionals using RapidAcq to save time and improve outcomes.
          </p>
          <Link 
            href="/onboarding"
            className="inline-flex items-center bg-white text-uswds-blue px-8 py-4 rounded-md text-lg font-bold hover:bg-uswds-gray-5 transition shadow-lg"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-uswds-gray-90 text-uswds-gray-30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-uswds-blue rounded flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-white text-lg font-bold font-serif">RapidAcq</span>
              </div>
              <p className="text-sm">
                AI-powered federal acquisition platform
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#services" className="hover:text-white transition">Services</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-uswds-gray-70 pt-8 text-sm text-center">
            © 2025 RapidAcq. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
