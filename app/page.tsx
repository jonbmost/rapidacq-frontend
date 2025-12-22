import Link from 'next/link';
import { ArrowRight, Shield, Zap, TrendingUp, CheckCircle } from 'lucide-react';

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
            Streamline your acquisition process with intelligent tools for SOWs, market research, 
            strategy development, and compliance. Built for federal acquisition professionals.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/onboarding"
              className="bg-uswds-blue text-white px-8 py-3 rounded text-lg font-bold hover:bg-uswds-blue-70 transition inline-flex items-center"
            >
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="#demo"
              className="border-2 border-uswds-blue text-uswds-blue px-8 py-3 rounded text-lg font-bold hover:bg-uswds-blue-5 transition"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-uswds-gray-90 mb-4 font-serif">
              Everything You Need for Modern Acquisition
            </h2>
            <p className="text-xl text-uswds-gray-70">
              Nine powerful AI tools designed for federal acquisition professionals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded border-2 border-uswds-gray-30 hover:border-uswds-blue transition">
              <div className="bg-uswds-blue-5 w-12 h-12 rounded flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-uswds-blue" />
              </div>
              <h3 className="text-xl font-bold text-uswds-gray-90 mb-2">SOW Generator</h3>
              <p className="text-uswds-gray-70">
                Create professional, compliant Statements of Objectives in minutes with AI assistance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded border-2 border-uswds-gray-30 hover:border-uswds-blue transition">
              <div className="bg-uswds-green-5 w-12 h-12 rounded flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-uswds-green" />
              </div>
              <h3 className="text-xl font-bold text-uswds-gray-90 mb-2">Market Research</h3>
              <p className="text-uswds-gray-70">
                Conduct comprehensive market research with vendor landscape and competitive analysis.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded border-2 border-uswds-gray-30 hover:border-uswds-blue transition">
              <div className="bg-uswds-red-5 w-12 h-12 rounded flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-uswds-red-warm" />
              </div>
              <h3 className="text-xl font-bold text-uswds-gray-90 mb-2">FAR Compliance</h3>
              <p className="text-uswds-gray-70">
                Ensure compliance with automated FAR checks and specific citation recommendations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded border-2 border-uswds-gray-30 hover:border-uswds-blue transition">
              <div className="bg-uswds-gold-5 w-12 h-12 rounded flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-uswds-gold" />
              </div>
              <h3 className="text-xl font-bold text-uswds-gray-90 mb-2">Strategy Advisor</h3>
              <p className="text-uswds-gray-70">
                Get expert recommendations on OTA, CSO, SBIR Phase III, or traditional FAR approaches.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded border-2 border-uswds-gray-30 hover:border-uswds-blue transition">
              <div className="bg-uswds-blue-5 w-12 h-12 rounded flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-uswds-blue" />
              </div>
              <h3 className="text-xl font-bold text-uswds-gray-90 mb-2">Contract Review</h3>
              <p className="text-uswds-gray-70">
                Identify risks and get improvement recommendations for contracts and clauses.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded border-2 border-uswds-gray-30 hover:border-uswds-blue transition">
              <div className="bg-uswds-green-5 w-12 h-12 rounded flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-uswds-green" />
              </div>
              <h3 className="text-xl font-bold text-uswds-gray-90 mb-2">AI Assistant</h3>
              <p className="text-uswds-gray-70">
                Get instant answers from our AI-powered acquisition expert trained on FAR and federal best practices.
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
