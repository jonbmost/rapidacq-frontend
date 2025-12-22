import Link from 'next/link';
import { ArrowRight, Shield, FileText, TrendingUp, CheckCircle, Users, Target, FileCheck, Presentation, Search, Book } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b-4 border-uswds-blue bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-uswds-blue font-serif">RapidAcq</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="#features" className="text-uswds-gray-70 hover:text-uswds-blue font-semibold">Features</Link>
              <Link href="/pricing" className="text-uswds-gray-70 hover:text-uswds-blue font-semibold">Pricing</Link>
              <Link href="/about" className="text-uswds-gray-70 hover:text-uswds-blue font-semibold">About</Link>
              <Link href="/contact" className="text-uswds-gray-70 hover:text-uswds-blue font-semibold">Contact</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-uswds-gray-70 hover:text-uswds-blue font-semibold">Sign In</Link>
              <Link href="/admin/login" className="text-uswds-gray-70 hover:text-uswds-blue font-semibold">Admin</Link>
              <Link 
                href="/onboarding" 
                className="bg-uswds-blue text-white px-6 py-2 rounded hover:bg-uswds-blue-70 transition font-bold"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-uswds-blue-5 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-uswds-gray-90 mb-6 font-serif">
            Transform Federal Acquisition<br />
            <span className="text-uswds-blue">with AI-Powered Intelligence</span>
          </h1>
          <p className="text-xl text-uswds-gray-70 mb-8 max-w-3xl mx-auto">
            Streamline your acquisition process with intelligent tools for strategy, requirements, 
            market analysis, and compliance. Built for federal acquisition professionals.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/onboarding"
              className="bg-uswds-blue text-white px-8 py-3 rounded text-lg font-bold hover:bg-uswds-blue-70 transition inline-flex items-center"
            >
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="#features"
              className="border-2 border-uswds-blue text-uswds-blue px-8 py-3 rounded text-lg font-bold hover:bg-uswds-blue-5 transition"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-uswds-gray-90 mb-4 font-serif">
              Complete Suite of Acquisition Services
            </h2>
            <p className="text-xl text-uswds-gray-70">
              Ten powerful AI tools designed for federal acquisition professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service 1 */}
            <div className="bg-white p-6 rounded border-2 border-uswds-gray-30 hover:border-uswds-blue transition">
              <div className="bg-uswds-blue-5 w-12 h-12 rounded flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-uswds-blue" />
              </div>
              <h3 className="text-lg font-bold text-uswds-gray-90 mb-2">Acquisition Strategy</h3>
              <p className="text-sm text-uswds-gray-70">
                Develop comprehensive acquisition strategies with AI-guided recommendations for approach and timeline.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-6 rounded border-2 border-uswds-gray-30 hover:border-uswds-blue transition">
              <div className="bg-uswds-green-5 w-12 h-12 rounded flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-uswds-green" />
              </div>
              <h3 className="text-lg font-bold text-uswds-gray-90 mb-2">Requirement Documents</h3>
              <p className="text-sm text-uswds-gray-70">
                Generate SOWs, PWS, and performance requirements with FAR-compliant language and structure.
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-white p-6 rounded border-2 border-uswds-gray-30 hover:border-uswds-blue transition">
              <div className="bg-uswds-gold-5 w-12 h-12 rounded flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-uswds-gold" />
              </div>
              <h3 className="text-lg font-bold text-uswds-gray-90 mb-2">Market Analysis</h3>
              <p className="text-sm text-uswds-gray-70">
                Conduct thorough market research with vendor landscape analysis and capability assessments.
              </p>
            </div>

            {/* Service 4 */}
            <div className="bg-white p-6 rounded border-2 border-uswds-gray-30 hover:border-uswds-blue transition">
              <div className="bg-uswds-red-5 w-12 h-12 rounded flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-uswds-red-warm" />
              </div>
              <h3 className="text-lg font-bold text-uswds-gray-90 mb-2">Evaluation Criteria</h3>
              <p className="text-sm text-uswds-gray-70">
                Create objective, defensible evaluation criteria and scoring methodologies for source selection.
              </p>
            </div>

            {/* Service 5 */}
            <div className="bg-white p-6 rounded border-2 border-uswds-gray-30 hover:border-uswds-blue transition">
              <div className="bg-uswds-blue-5 w-12 h-12 rounded flex items-center justify-center mb-4">
                <FileCheck className="h-6 w-6 text-uswds-blue" />
              </div>
              <h3 className="text-lg font-bold text-uswds-gray-90 mb-2">SOP Creation</h3>
              <p className="text-sm text-uswds-gray-70">
                Develop standardized operating procedures for repeatable acquisition processes and workflows.
              </p>
            </div>

            {/* Service 6 */}
            <div className="bg-white p-6 rounded border-2 border-uswds-gray-30 hover:border-uswds-blue transition">
              <div className="bg-uswds-green-5 w-12 h-12 rounded flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-uswds-green" />
              </div>
              <h3 className="text-lg font-bold text-uswds-gray-90 mb-2">Stakeholder Mapping</h3>
              <p className="text-sm text-uswds-gray-70">
                Identify and analyze key stakeholders, roles, and communication strategies for your acquisition.
              </p>
            </div>

            {/* Service 7 */}
            <div className="bg-white p-6 rounded border-2 border-uswds-gray-30 hover:border-uswds-blue transition">
              <div className="bg-uswds-gold-5 w-12 h-12 rounded flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-uswds-gold" />
              </div>
              <h3 className="text-lg font-bold text-uswds-gray-90 mb-2">Authority Needs Assessment</h3>
              <p className="text-sm text-uswds-gray-70">
                Determine optimal acquisition authority: FAR, OTA, CSO, or SBIR Phase III for your requirement.
              </p>
            </div>

            {/* Service 8 */}
            <div className="bg-white p-6 rounded border-2 border-uswds-gray-30 hover:border-uswds-blue transition">
              <div className="bg-uswds-red-5 w-12 h-12 rounded flex items-center justify-center mb-4">
                <Presentation className="h-6 w-6 text-uswds-red-warm" />
              </div>
              <h3 className="text-lg font-bold text-uswds-gray-90 mb-2">Slide Ranger</h3>
              <p className="text-sm text-uswds-gray-70">
                Generate professional acquisition briefings and presentations for leadership and stakeholders.
              </p>
            </div>

            {/* Service 9 */}
            <div className="bg-white p-6 rounded border-2 border-uswds-gray-30 hover:border-uswds-blue transition">
              <div className="bg-uswds-blue-5 w-12 h-12 rounded flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-uswds-blue" />
              </div>
              <h3 className="text-lg font-bold text-uswds-gray-90 mb-2">Document Analysis</h3>
              <p className="text-sm text-uswds-gray-70">
                Review and analyze contracts, proposals, and acquisition documents for compliance and risk.
              </p>
            </div>

            {/* Service 10 */}
            <div className="bg-white p-6 rounded border-2 border-uswds-gray-30 hover:border-uswds-blue transition">
              <div className="bg-uswds-green-5 w-12 h-12 rounded flex items-center justify-center mb-4">
                <Book className="h-6 w-6 text-uswds-green" />
              </div>
              <h3 className="text-lg font-bold text-uswds-gray-90 mb-2">Regs & Policy</h3>
              <p className="text-sm text-uswds-gray-70">
                Quick reference and guidance on FAR, DFARS, agency supplements, and acquisition policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-uswds-blue">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4 font-serif">
            Ready to Transform Your Acquisition Process?
          </h2>
          <p className="text-xl text-uswds-blue-20 mb-8">
            Join federal acquisition professionals using RapidAcq to save time and improve outcomes.
          </p>
          <Link 
            href="/onboarding"
            className="bg-white text-uswds-blue px-8 py-3 rounded text-lg font-bold hover:bg-uswds-gray-5 transition inline-flex items-center"
          >
            Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-uswds-gray-90 text-uswds-gray-30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4 font-serif">RapidAcq</h3>
              <p className="text-sm">
                AI-powered federal acquisition platform built by acquisition professionals.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-uswds-gray-70 mt-8 pt-8 text-sm text-center">
            © 2025 RapidAcq. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
