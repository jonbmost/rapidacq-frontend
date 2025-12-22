'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, User, Phone, Mail, Target, Users as UsersIcon, DollarSign, AlertCircle, Lock } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    password: '',
    confirmPassword: '',
    acquisitionPriorities: [] as string[],
    teamSize: '',
    annualVolume: '',
    painPoints: '',
    preferredAuthorities: [] as string[]
  });

  const orgTypes = [
    'Department of Defense',
    'Civilian Agency',
    'State/Local Government',
    'Prime Contractor',
    'Small Business',
    'Other'
  ];

  const priorityOptions = [
    'Speed to Award',
    'Small Business Utilization',
    'Innovation/R&D',
    'IT/Digital Services',
    'FAR Compliance',
    'Cost Savings',
    'Vendor Diversity'
  ];

  const authorityOptions = [
    'FAR Part 15 (Negotiated)',
    'FAR Part 12 (Commercial)',
    'OTA (Other Transaction Authority)',
    'CSO (Commercial Solutions Opening)',
    'SBIR/STTR Phase III',
    'Simplified Acquisition',
    'IDIQ/BPA'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://acquisition-assistant-266001336704.us-central1.run.app';
      
      // Step 1: Create organization
      const orgResponse = await fetch(`${BACKEND_URL}/api/organizations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const orgData = await orgResponse.json();
      if (!orgData.success) throw new Error(orgData.error || 'Failed to create organization');

      // Step 2: Create user account
      const userResponse = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.contactEmail,
          password: formData.password,
          organizationId: orgData.organization.id,
          organizationName: orgData.organization.organizationName
        })
      });

      const userData = await userResponse.json();
      if (!userData.success) throw new Error(userData.error || 'Failed to create user account');

      // Step 3: Store auth and redirect
      localStorage.setItem('userId', userData.user.id);
      localStorage.setItem('userEmail', userData.user.email);
      localStorage.setItem('organizationId', userData.user.organizationId);
      localStorage.setItem('organizationName', userData.user.organizationName);
      localStorage.setItem('authToken', userData.token);

      router.push('/dashboard');

    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  return (
    <div className="min-h-screen bg-uswds-gray-5">
    
      {/* Header */}
      <div className="bg-uswds-blue text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2 font-serif">Welcome to RapidAcq</h1>
          <p className="text-xl text-uswds-blue-20">
            Let's get your organization set up in just a few steps
          </p>
        </div>
      </div>

      {/* Progress Bar */}
              <span className="ml-2 font-medium">Organization</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-uswds-gray-30">
              <div className={`h-full ${step >= 2 ? 'bg-uswds-blue' : 'bg-uswds-gray-30'}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
            </div>
            <div className={`flex items-center ${step >= 2 ? 'text-uswds-blue' : 'text-uswds-gray-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-uswds-blue text-white' : 'bg-uswds-gray-30 text-white'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Priorities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded border border-uswds-gray-30 p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Organization Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-uswds-gray-90 mb-2">
                    <Building2 className="inline h-4 w-4 mr-1" />
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organizationName}
                    onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-uswds-gray-30 rounded focus:outline-none focus:border-uswds-blue"
                    placeholder="e.g., Department of Veterans Affairs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-uswds-gray-90 mb-2">
                    Organization Type *
                  </label>
                  <select
                    required
                    value={formData.organizationType}
                    onChange={(e) => setFormData({...formData, organizationType: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-uswds-gray-30 rounded focus:outline-none focus:border-uswds-blue"
                  >
                    <option value="">Select type...</option>
                    {orgTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-uswds-gray-90 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-uswds-gray-30 rounded focus:outline-none focus:border-uswds-blue"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-uswds-gray-90 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-uswds-gray-30 rounded focus:outline-none focus:border-uswds-blue"
                      placeholder="john.doe@agency.gov"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-uswds-gray-90 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-uswds-gray-30 rounded focus:outline-none focus:border-uswds-blue"
                    placeholder="(202) 555-0100"
                  />
                </div>

                {/* Password Section */}
                <div className="border-t-2 border-uswds-gray-10 pt-6 mt-6">
                  <h3 className="text-lg font-bold text-uswds-gray-90 mb-4 flex items-center">
                    <Lock className="inline h-5 w-5 mr-2" />
                    Create Your Account
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-uswds-gray-90 mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-uswds-gray-30 rounded focus:outline-none focus:border-uswds-blue"
                        placeholder="Minimum 6 characters"
                        minLength={6}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-uswds-gray-90 mb-2">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-uswds-gray-30 rounded focus:outline-none focus:border-uswds-blue"
                        placeholder="Re-enter password"
                      />
                    </div>
                  </div>
                  
                  <p className="text-sm text-uswds-gray-70 mt-2">
                    You'll use this email and password to sign in to RapidAcq
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-uswds-blue text-white py-3 rounded font-bold hover:bg-uswds-blue-70"
                >
                  Continue to Priorities →
                </button>
              </div>
            )}

            {/* Step 2: Priorities & Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-uswds-gray-90 mb-2">
                    <Target className="inline h-4 w-4 mr-1" />
                    Acquisition Priorities (Select all that apply)
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {priorityOptions.map(priority => (
                      <label key={priority} className="flex items-center p-3 border-2 border-uswds-gray-30 rounded cursor-pointer hover:bg-uswds-blue-5">
                        <input
                          type="checkbox"
                          checked={formData.acquisitionPriorities.includes(priority)}
                          onChange={() => setFormData({
                            ...formData,
                            acquisitionPriorities: toggleArrayItem(formData.acquisitionPriorities, priority)
                          })}
                          className="mr-2 h-4 w-4"
                        />
                        <span className="text-sm">{priority}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-uswds-gray-90 mb-2">
                      <UsersIcon className="inline h-4 w-4 mr-1" />
                      Acquisition Team Size
                    </label>
                    <select
                      value={formData.teamSize}
                      onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-uswds-gray-30 rounded focus:outline-none focus:border-uswds-blue"
                    >
                      <option value="">Select size...</option>
                      <option value="1-5">1-5 people</option>
                      <option value="6-15">6-15 people</option>
                      <option value="16-50">16-50 people</option>
                      <option value="50+">50+ people</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-uswds-gray-90 mb-2">
                      <DollarSign className="inline h-4 w-4 mr-1" />
                      Annual Acquisition Volume
                    </label>
                    <select
                      value={formData.annualVolume}
                      onChange={(e) => setFormData({...formData, annualVolume: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-uswds-gray-30 rounded focus:outline-none focus:border-uswds-blue"
                    >
                      <option value="">Select range...</option>
                      <option value="<$1M">Less than $1M</option>
                      <option value="$1M-$10M">$1M - $10M</option>
                      <option value="$10M-$100M">$10M - $100M</option>
                      <option value="$100M+">$100M+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-uswds-gray-90 mb-2">
                    Preferred Acquisition Authorities (Select all that apply)
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {authorityOptions.map(authority => (
                      <label key={authority} className="flex items-center p-3 border-2 border-uswds-gray-30 rounded cursor-pointer hover:bg-uswds-blue-5">
                        <input
                          type="checkbox"
                          checked={formData.preferredAuthorities.includes(authority)}
                          onChange={() => setFormData({
                            ...formData,
                            preferredAuthorities: toggleArrayItem(formData.preferredAuthorities, authority)
                          })}
                          className="mr-2 h-4 w-4"
                        />
                        <span className="text-sm">{authority}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-uswds-gray-90 mb-2">
                    <AlertCircle className="inline h-4 w-4 mr-1" />
                    Current Pain Points (Optional)
                  </label>
                  <textarea
                    value={formData.painPoints}
                    onChange={(e) => setFormData({...formData, painPoints: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-uswds-gray-30 rounded focus:outline-none focus:border-uswds-blue"
                    placeholder="What are your biggest challenges in federal acquisition?"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded">
                    <strong>Error:</strong> {error}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white border-2 border-uswds-gray-50 text-uswds-gray-70 py-3 rounded font-bold hover:bg-uswds-gray-5"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-uswds-blue text-white py-3 rounded font-bold hover:bg-uswds-blue-70 disabled:bg-uswds-gray-50"
                  >
                    {loading ? 'Creating Account...' : 'Complete Setup →'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
