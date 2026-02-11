"use client"

import { useState } from 'react';
import { Building2, FileText, Users, Shield, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CHCompanyData } from '@/lib/api/types/companies-house-types';

interface CompaniesHouseDetailViewProps {
  data: CHCompanyData;
}

export function CompaniesHouseDetailView({ data }: CompaniesHouseDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'filing', label: 'Filing History', icon: FileText },
    { id: 'officers', label: 'Officers', icon: Users },
    { id: 'psc', label: 'PSC', icon: Shield },
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const renderAddress = () => {
    const addr = data.address;
    if (!addr) return 'No address available';

    const parts = [
      addr.address_line_1,
      addr.address_line_2,
      addr.locality,
      addr.postal_code,
      addr.country
    ].filter(Boolean);

    return parts.join(', ');
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex gap-2 p-4 border-b bg-muted/30 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 size={20} className="text-blue-600" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Company Number</p>
                    <p className="text-gray-900 font-mono font-semibold">{data.details.company_number}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Company Type</p>
                    <p className="text-gray-900 font-semibold">{data.details.type?.replace('-', ' ').toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant={data.details.company_status?.toLowerCase() === 'active' ? 'default' : 'destructive'}>
                      {data.details.company_status?.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Incorporation Date</p>
                    <p className="text-gray-900 font-semibold">{formatDate(data.details.date_of_creation)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin size={20} className="text-blue-600" />
                  Registered Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 text-sm">{renderAddress()}</p>
              </CardContent>
            </Card>

            {data.details.sic_codes && data.details.sic_codes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>SIC Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {data.details.sic_codes.map((code, idx) => (
                      <Badge key={idx} variant="secondary">
                        {code}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'filing' && (
          <div className="space-y-4">
            {data.filing_history && data.filing_history.length > 0 ? (
              data.filing_history.map((filing, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-semibold mb-2">{filing.description}</h4>
                        <p className="text-sm text-muted-foreground">{filing.type?.replace('_', ' ').toUpperCase()}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar size={14} />
                        {formatDate(filing.date)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>No filing history available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'officers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.individuals && data.individuals.length > 0 ? (
              data.individuals.map((officer, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Users size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-semibold mb-2">{officer.name}</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>Role: {officer.officer_role}</p>
                          <p>Appointed: {formatDate(officer.appointed_on)}</p>
                          {officer.occupation && <p>Occupation: {officer.occupation}</p>}
                          {officer.nationality && <p>Nationality: {officer.nationality}</p>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>No officers information available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'psc' && (
          <div className="space-y-4">
            {data.psc && data.psc.length > 0 ? (
              data.psc.map((person, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Shield size={20} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-semibold mb-2">{person.name}</h4>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Kind: {person.kind}</p>
                          <p className="text-sm text-muted-foreground">Notified: {formatDate(person.notified_on)}</p>
                          {person.nature_of_control && person.nature_of_control.length > 0 && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Nature of Control:</p>
                              <div className="flex flex-wrap gap-2">
                                {person.nature_of_control.map((control, cIdx) => (
                                  <Badge key={cIdx} variant="secondary" className="text-xs">
                                    {control}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Shield size={48} className="mx-auto mb-4 opacity-50" />
                <p>No PSC information available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
