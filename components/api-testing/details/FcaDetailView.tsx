"use client"

import { useState } from 'react';
import { Building2, Shield, Users, MoreHorizontal, MapPin, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { FcaFirmData } from '@/lib/api/types/fca-types';

interface FcaDetailViewProps {
  data: FcaFirmData;
}

export function FcaDetailView({ data }: FcaDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'permissions', label: 'Permissions', icon: Shield },
    { id: 'people', label: 'People', icon: Users },
    { id: 'more', label: 'More', icon: MoreHorizontal },
  ];

  const renderAddress = () => {
    const addr = data.address;
    if (!addr) return 'No address available';

    const parts = [
      addr['Address Line 1'],
      addr['Address Line 2'],
      addr['City'],
      addr['Postcode'],
      addr['Country']
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
                  Firm Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Firm Name</p>
                    <p className="text-gray-900 font-semibold">{data.details['Firm Name'] || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant={data.details['Status']?.toLowerCase() === 'active' ? 'default' : 'destructive'}>
                      {data.details['Status']?.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Business Type</p>
                    <p className="text-gray-900 font-semibold">{data.details['Business Type'] || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Client Money Permission</p>
                    <p className="text-gray-900 font-semibold">{data.details['Client Money Permission'] || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {data.address && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin size={20} className="text-blue-600" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900 text-sm">{renderAddress()}</p>
                </CardContent>
              </Card>
            )}

            {data.requirements && data.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle size={20} className="text-yellow-600" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.requirements.map((req, idx) => (
                      <div key={idx} className="bg-muted/50 p-3 rounded-lg border">
                        <p className="text-gray-900 font-semibold">{req['Requirement']}</p>
                        {req['Requirement Type'] && (
                          <p className="text-sm text-muted-foreground mt-1">Type: {req['Requirement Type']}</p>
                        )}
                        {req['Description'] && (
                          <p className="text-sm text-muted-foreground mt-1">{req['Description']}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="space-y-4">
            {data.permissions && data.permissions.length > 0 ? (
              data.permissions.map((permission, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Shield size={20} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-semibold mb-2">
                          {permission['Permission Name']}
                        </h4>
                        {permission['Status'] && (
                          <Badge variant="default" className="text-xs">
                            {permission['Status']}
                          </Badge>
                        )}
                        {permission['Details'] && Array.isArray(permission['Details']) && permission['Details'].length > 0 && (
                          <div className="mt-3 space-y-2">
                            {permission['Details'].map((detail: any, dIdx: number) => (
                              <div key={dIdx} className="text-sm text-muted-foreground">
                                {typeof detail === 'string' ? detail : JSON.stringify(detail)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Shield size={48} className="mx-auto mb-4 opacity-50" />
                <p>No permissions information available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'people' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.individuals && data.individuals.length > 0 ? (
              data.individuals.map((person, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Users size={20} className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-semibold mb-2">{person['Name']}</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>IRN: {person['IRN']}</p>
                          <p>Role: {person['Role']}</p>
                          <Badge variant={person['Status']?.toLowerCase() === 'active' ? 'default' : 'destructive'} className="text-xs mt-2">
                            {person['Status']?.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>No people information available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'more' && (
          <div className="space-y-6">
            {data.names && data.names.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Trading Names</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {data.names.map((name, idx) => (
                      <Badge key={idx} variant="secondary">
                        {name['Name']}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {data.regulators && data.regulators.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Regulators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.regulators.map((reg, idx) => (
                      <div key={idx} className="bg-muted/50 p-3 rounded-lg border">
                        <p className="text-gray-900 font-semibold">{reg['Name']}</p>
                        {reg['Category'] && (
                          <p className="text-sm text-muted-foreground mt-1">Category: {reg['Category']}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {data.passports && data.passports.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Passports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.passports.map((passport, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Badge variant="secondary">{passport['Country']}</Badge>
                        {passport['Activity'] && <span className="text-muted-foreground">• {passport['Activity']}</span>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {data.disciplinary && data.disciplinary.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle size={20} className="text-red-600" />
                    Disciplinary History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.disciplinary.map((action, idx) => (
                      <div key={idx} className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <p className="text-gray-900 font-semibold">{action['Action']}</p>
                          <p className="text-sm text-muted-foreground">{action['Date']}</p>
                        </div>
                        {action['Details'] && (
                          <p className="text-sm text-muted-foreground mt-2">{action['Details']}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {data.waivers && data.waivers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Waivers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.waivers.map((waiver, idx) => (
                      <div key={idx} className="bg-muted/50 p-3 rounded-lg border">
                        <div className="flex justify-between items-start">
                          <p className="text-gray-900 font-semibold">{waiver['Rule']}</p>
                          <Badge variant="secondary" className="text-xs">
                            {waiver['Status']}
                          </Badge>
                        </div>
                        {waiver['Date'] && (
                          <p className="text-sm text-muted-foreground mt-1">Date: {waiver['Date']}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {(!data.names?.length && !data.regulators?.length && !data.passports?.length &&
              !data.disciplinary?.length && !data.waivers?.length) && (
              <div className="text-center py-10 text-muted-foreground">
                <MoreHorizontal size={48} className="mx-auto mb-4 opacity-50" />
                <p>No additional information available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
