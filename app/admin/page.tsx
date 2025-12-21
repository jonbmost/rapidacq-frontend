'use client';

import { useState, useEffect } from 'react';
import { Building2, Mail, Phone, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Organization {
  id: string;
  organizationName: string;
  organizationType: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  acquisitionPriorities: string[];
  teamSize?: string;
  annualVolume?: string;
  painPoints?: string;
  preferredAuthorities: string[];
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations`);
      const data = await response.json();
      if (data.success) {
        setOrganizations(data.organizations);
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orgId: string, status: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations/${orgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        fetchOrganizations();
        setSelectedOrg(null);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-uswds-gold-20 text-uswds-gray-90 border-uswds-gold',
      active: 'bg-uswds-green/10 text-uswds-green-cool border-uswds-green',
      inactive: 'bg-uswds-gray-10 text-uswds-gray-70 border-uswds-gray-50',
    };

    const icons = {
      pending: Clock,
      active: CheckCircle,
      inactive: XCircle,
    };

    const Icon = icons[status as keyof typeof icons];
    const style = styles[status as keyof typeof styles];

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded border-2 text-sm font-medium ${style}`}>
        <Icon className="h-4 w-4 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded border border-uswds-gray-30">
            <div className="text-3xl font-bold text-uswds-blue mb-2">
              {organizations.length}
            </div>
            <div className="text-uswds-gray-70">Total Organizations</div>
          </div>
          <div className="bg-white p-6 rounded border border-uswds-gray-30">
            <div className="text-3xl font-bold text-uswds-gold mb-2">
              {organizations.filter(o => o.status === 'pending').length}
            </div>
            <div className="text-uswds-gray-70">Pending Approval</div>
          </div>
          <div className="bg-white p-6 rounded border border-uswds-gray-30">
            <div className="text-3xl font-bold text-uswds-green mb-2">
              {organizations.filter(o => o.status === 'active').length}
            </div>
            <div className="text-uswds-gray-70">Active</div>
          </div>
        </div>

        {/* Organizations List */}
        <div className="bg-white rounded border border-uswds-gray-30">
          <div className="border-b border-uswds-gray-30 p-6">
            <h2 className="text-2xl font-bold text-uswds-gray-90">Organizations</h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center text-uswds-gray-70">Loading...</div>
          ) : organizations.length === 0 ? (
            <div className="p-12 text-center text-uswds-gray-70">No organizations yet</div>
          ) : (
            <div className="divide-y divide-uswds-gray-30">
              {organizations.map((org) => (
                <div key={org.id} className="p-6 hover:bg-uswds-gray-5 cursor-pointer" onClick={() => setSelectedOrg(org)}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-uswds-gray-90 mb-1">
                        {org.organizationName}
                      </h3>
                      <p className="text-sm text-uswds-gray-70">{org.organizationType}</p>
                    </div>
                    {getStatusBadge(org.status)}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-uswds-gray-70">
                      <Mail className="h-4 w-4 mr-2" />
                      {org.contactEmail}
                    </div>
                    <div className="flex items-center text-uswds-gray-70">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(org.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {org.acquisitionPriorities.length > 0 && (
                    <div className="mt-4">
                      <div className="text-xs text-uswds-gray-70 mb-2">Priorities:</div>
                      <div className="flex flex-wrap gap-2">
                        {org.acquisitionPriorities.map((priority) => (
                          <span key={priority} className="px-2 py-1 bg-uswds-blue-5 text-uswds-blue text-xs rounded">
                            {priority}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedOrg(null)}>
          <div className="bg-white rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-uswds-gray-30">
              <h2 className="text-2xl font-bold text-uswds-gray-90">
                {selectedOrg.organizationName}
              </h2>
              <p className="text-uswds-gray-70">{selectedOrg.organizationType}</p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-uswds-gray-90 mb-2">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-uswds-gray-70" />
                    {selectedOrg.contactEmail}
                  </div>
                  {selectedOrg.contactPhone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-uswds-gray-70" />
                      {selectedOrg.contactPhone}
                    </div>
                  )}
                </div>
              </div>

              {selectedOrg.painPoints && (
                <div>
                  <h3 className="font-bold text-uswds-gray-90 mb-2">Pain Points</h3>
                  <p className="text-sm text-uswds-gray-70">{selectedOrg.painPoints}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => updateStatus(selectedOrg.id, 'active')}
                  className="flex-1 bg-uswds-green text-white py-2 rounded font-medium hover:bg-uswds-green-cool"
                >
                  Activate
                </button>
                <button
                  onClick={() => updateStatus(selectedOrg.id, 'inactive')}
                  className="flex-1 bg-uswds-gray-50 text-white py-2 rounded font-medium hover:bg-uswds-gray-70"
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
