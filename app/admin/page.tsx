'use client';

import { useEffect, useState } from 'react';

interface Organization {
  id: string;
  organizationName: string;
  contactName: string;
  email: string;
  phone?: string;
  organizationType: string;
  status: 'pending' | 'active' | 'inactive';
  createdAt: string;
  currentChallenges?: string[];
  acquisitionVolume?: string;
  teamSize?: string;
  painPoints?: string;
  desiredOutcomes?: string;
}

export default function AdminPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get backend URL from environment variable
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://acquisition-assistant-266001336704.us-central1.run.app';

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching from:', `${BACKEND_URL}/api/organizations`);
      
      const response = await fetch(`${BACKEND_URL}/api/organizations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Important: use 'cors' mode explicitly
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      if (data.success && Array.isArray(data.organizations)) {
        setOrganizations(data.organizations);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/organizations/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (response.ok) {
        fetchOrganizations();
      }
    } catch (err) {
      console.error('Error approving organization:', err);
    }
  };

  const stats = {
    total: organizations.length,
    pending: organizations.filter(org => org.status === 'pending').length,
    active: organizations.filter(org => org.status === 'active').length,
  };

  return (
    <div className="min-h-screen bg-uswds-gray-5">
      {/* Header */}
      <div className="bg-uswds-gray-90 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-uswds-gray-30">Manage organization onboarding</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded border border-uswds-gray-30">
            <div className="text-3xl font-bold text-uswds-blue mb-2">{stats.total}</div>
            <div className="text-uswds-gray-70">Total Organizations</div>
          </div>
          <div className="bg-white p-6 rounded border border-uswds-gray-30">
            <div className="text-3xl font-bold text-uswds-gold mb-2">{stats.pending}</div>
            <div className="text-uswds-gray-70">Pending Approval</div>
          </div>
          <div className="bg-white p-6 rounded border border-uswds-gray-30">
            <div className="text-3xl font-bold text-uswds-green mb-2">{stats.active}</div>
            <div className="text-uswds-gray-70">Active</div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
            <div className="text-sm mt-2">
              <p>Backend URL: {BACKEND_URL}</p>
              <button 
                onClick={fetchOrganizations}
                className="mt-2 text-blue-600 hover:text-blue-800 underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Organizations Table */}
        <div className="bg-white rounded border border-uswds-gray-30">
          <div className="border-b border-uswds-gray-30 p-6">
            <h2 className="text-2xl font-bold text-uswds-gray-90">Organizations</h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center text-uswds-gray-70">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-uswds-blue"></div>
              <p className="mt-4">Loading organizations...</p>
            </div>
          ) : organizations.length === 0 ? (
            <div className="p-12 text-center text-uswds-gray-70">
              <p className="text-lg">No organizations found</p>
              <p className="text-sm mt-2">Organizations will appear here once they complete onboarding</p>
              <button 
                onClick={fetchOrganizations}
                className="mt-4 px-4 py-2 bg-uswds-blue text-white rounded hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-uswds-gray-5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-uswds-gray-70 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-uswds-gray-70 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-uswds-gray-70 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-uswds-gray-70 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-uswds-gray-70 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-uswds-gray-70 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-uswds-gray-30">
                  {organizations.map((org) => (
                    <tr key={org.id} className="hover:bg-uswds-gray-5">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-uswds-gray-90">{org.organizationName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-uswds-gray-90">{org.contactName}</div>
                        <div className="text-sm text-uswds-gray-70">{org.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-uswds-gray-90 capitalize">{org.organizationType}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${org.status === 'active' ? 'bg-green-100 text-green-800' : 
                            org.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {org.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-uswds-gray-70">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {org.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(org.id)}
                            className="px-3 py-1 bg-uswds-green text-white rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
