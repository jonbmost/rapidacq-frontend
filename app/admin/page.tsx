'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Users, CheckCircle, XCircle, Clock, LogOut } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://acquisition-assistant-266001336704.us-central1.run.app';

export default function AdminPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    // Check if admin is logged in
    const isAdmin = localStorage.getItem('isAdmin');
    const storedAdminEmail = localStorage.getItem('adminEmail');
    
    if (!isAdmin || isAdmin !== 'true') {
      router.push('/admin/login');
      return;
    }

    setAdminEmail(storedAdminEmail || 'Admin');
    fetchOrganizations();
  }, [router]);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/organizations`, {
        mode: 'cors',
      });

      const data = await response.json();

      if (data.success) {
        setOrganizations(data.organizations || []);
      } else {
        setError('Failed to load organizations');
      }
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orgId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/organizations/${orgId}/approve`, {
        method: 'POST',
        mode: 'cors',
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the list
        fetchOrganizations();
      } else {
        alert('Failed to approve organization');
      }
    } catch (err) {
      console.error('Error approving organization:', err);
      alert('Failed to approve organization');
    }
  };

  const handleReject = async (orgId: string) => {
    if (!confirm('Are you sure you want to reject this organization?')) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/organizations/${orgId}/reject`, {
        method: 'POST',
        mode: 'cors',
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the list
        fetchOrganizations();
      } else {
        alert('Failed to reject organization');
      }
    } catch (err) {
      console.error('Error rejecting organization:', err);
      alert('Failed to reject organization');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const pendingOrgs = organizations.filter(org => org.status === 'pending');
  const activeOrgs = organizations.filter(org => org.status === 'active');
  const rejectedOrgs = organizations.filter(org => org.status === 'inactive');

  if (loading) {
    return (
      <div className="min-h-screen bg-uswds-gray-5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uswds-blue mx-auto mb-4"></div>
          <p className="text-uswds-gray-70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-uswds-gray-5">
      {/* Header */}
      <div className="bg-uswds-blue text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center mb-2">
                <Shield className="h-8 w-8 mr-3" />
                <h1 className="text-3xl font-bold font-serif">Admin Dashboard</h1>
              </div>
              <p className="text-uswds-blue-20">Logged in as: {adminEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded border border-uswds-gray-30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-uswds-gray-70">Total Organizations</p>
                <p className="text-3xl font-bold text-uswds-gray-90">{organizations.length}</p>
              </div>
              <Users className="h-8 w-8 text-uswds-gray-50" />
            </div>
          </div>

          <div className="bg-white p-6 rounded border border-uswds-gray-30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-uswds-gray-70">Pending Approval</p>
                <p className="text-3xl font-bold text-uswds-gold">{pendingOrgs.length}</p>
              </div>
              <Clock className="h-8 w-8 text-uswds-gold" />
            </div>
          </div>

          <div className="bg-white p-6 rounded border border-uswds-gray-30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-uswds-gray-70">Active</p>
                <p className="text-3xl font-bold text-uswds-green">{activeOrgs.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-uswds-green" />
            </div>
          </div>

          <div className="bg-white p-6 rounded border border-uswds-gray-30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-uswds-gray-70">Rejected</p>
                <p className="text-3xl font-bold text-uswds-red-warm">{rejectedOrgs.length}</p>
              </div>
              <XCircle className="h-8 w-8 text-uswds-red-warm" />
            </div>
          </div>
        </div>

        {/* Organizations List */}
        <div className="bg-white rounded border border-uswds-gray-30">
          <div className="p-6 border-b border-uswds-gray-30">
            <h2 className="text-2xl font-bold text-uswds-gray-90">Organizations</h2>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200 text-red-700">
              {error}
            </div>
          )}

          {organizations.length === 0 ? (
            <div className="p-8 text-center text-uswds-gray-70">
              <Users className="h-12 w-12 mx-auto mb-4 text-uswds-gray-30" />
              <p>No organizations found</p>
              <p className="text-sm">Organizations will appear here once they complete onboarding</p>
            </div>
          ) : (
            <div className="divide-y divide-uswds-gray-30">
              {organizations.map((org) => (
                <div key={org.id} className="p-6 hover:bg-uswds-gray-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-uswds-gray-90">
                          {org.organizationName}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            org.status === 'pending'
                              ? 'bg-uswds-gold-5 text-uswds-gold'
                              : org.status === 'active'
                              ? 'bg-uswds-green-5 text-uswds-green'
                              : 'bg-red-50 text-uswds-red-warm'
                          }`}
                        >
                          {org.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-uswds-gray-70">
                        <div>
                          <p><strong>Contact:</strong> {org.contactName}</p>
                          <p><strong>Email:</strong> {org.email}</p>
                          <p><strong>Type:</strong> {org.organizationType}</p>
                        </div>
                        <div>
                          <p><strong>Team Size:</strong> {org.teamSize || 'N/A'}</p>
                          <p><strong>Annual Volume:</strong> {org.annualVolume || 'N/A'}</p>
                          <p><strong>Created:</strong> {new Date(org.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    {org.status === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleApprove(org.id)}
                          className="bg-uswds-green text-white px-4 py-2 rounded font-semibold hover:bg-uswds-green-70 flex items-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(org.id)}
                          className="bg-uswds-red-warm text-white px-4 py-2 rounded font-semibold hover:opacity-80 flex items-center"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
