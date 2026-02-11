"use client"

import { useState } from 'react';
import { Building2, FileText, Users, Shield, MapPin, Calendar } from 'lucide-react';
import type { CHCompanyData } from '@/lib/api/types/companies-house-types';
import styles from '../styles/glassmorphism.module.css';

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
      <div className={styles.tabContainer}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? 'active' : ''}`}
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
            <div className={`${styles.glass} p-6`}>
              <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                <Building2 size={20} className="text-blue-400" />
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Company Number</p>
                  <p className="text-white font-mono">{data.details.company_number}</p>
                </div>
                <div>
                  <p className="text-gray-400">Company Type</p>
                  <p className="text-white">{data.details.type?.replace('-', ' ').toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <span className={
                    data.details.company_status?.toLowerCase() === 'active'
                      ? styles.badgeActive
                      : styles.badgeInactive
                  }>
                    {data.details.company_status?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400">Incorporation Date</p>
                  <p className="text-white">{formatDate(data.details.date_of_creation)}</p>
                </div>
              </div>
            </div>

            <div className={`${styles.glass} p-6`}>
              <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                <MapPin size={20} className="text-cyan-400" />
                Registered Address
              </h3>
              <p className="text-white text-sm">{renderAddress()}</p>
            </div>

            {data.details.sic_codes && data.details.sic_codes.length > 0 && (
              <div className={`${styles.glass} p-6`}>
                <h3 className="text-lg font-semibold mb-4 text-white">SIC Codes</h3>
                <div className="flex flex-wrap gap-2">
                  {data.details.sic_codes.map((code, idx) => (
                    <span key={idx} className={styles.badgeNeutral}>
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'filing' && (
          <div className="space-y-4">
            {data.filing_history && data.filing_history.length > 0 ? (
              data.filing_history.map((filing, idx) => (
                <div key={idx} className={`${styles.glass} p-4`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2">{filing.description}</h4>
                      <p className="text-sm text-gray-400">{filing.type?.replace('_', ' ').toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar size={14} />
                      {formatDate(filing.date)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
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
                <div key={idx} className={`${styles.glass} p-4`}>
                  <div className="flex items-start gap-3">
                    <div className={styles.iconBadge}>
                      <Users size={20} className="text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2">{officer.name}</h4>
                      <div className="space-y-1 text-sm text-gray-400">
                        <p>Role: {officer.officer_role}</p>
                        <p>Appointed: {formatDate(officer.appointed_on)}</p>
                        {officer.occupation && <p>Occupation: {officer.occupation}</p>}
                        {officer.nationality && <p>Nationality: {officer.nationality}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400">
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
                <div key={idx} className={`${styles.glass} p-4`}>
                  <div className="flex items-start gap-3">
                    <div className={styles.iconBadge}>
                      <Shield size={20} className="text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2">{person.name}</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">Kind: {person.kind}</p>
                        <p className="text-sm text-gray-400">Notified: {formatDate(person.notified_on)}</p>
                        {person.nature_of_control && person.nature_of_control.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-400 mb-2">Nature of Control:</p>
                            <div className="flex flex-wrap gap-2">
                              {person.nature_of_control.map((control, cIdx) => (
                                <span key={cIdx} className={styles.badgeNeutral} style={{ fontSize: '11px' }}>
                                  {control}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
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
