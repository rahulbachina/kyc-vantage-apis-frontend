"use client"

import { useState } from 'react';
import { Building2, Shield, Users, MoreHorizontal, MapPin, AlertTriangle } from 'lucide-react';
import type { FcaFirmData } from '@/lib/api/types/fca-types';
import styles from '../styles/glassmorphism.module.css';

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
                <Building2 size={20} className="text-cyan-400" />
                Firm Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Firm Name</p>
                  <p className="text-white font-semibold">{data.details['Firm Name'] || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <span className={
                    data.details['Status']?.toLowerCase() === 'active'
                      ? styles.badgeActive
                      : styles.badgeInactive
                  }>
                    {data.details['Status']?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400">Business Type</p>
                  <p className="text-white">{data.details['Business Type'] || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Client Money Permission</p>
                  <p className="text-white">{data.details['Client Money Permission'] || 'N/A'}</p>
                </div>
              </div>
            </div>

            {data.address && (
              <div className={`${styles.glass} p-6`}>
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <MapPin size={20} className="text-purple-400" />
                  Address
                </h3>
                <p className="text-white text-sm">{renderAddress()}</p>
              </div>
            )}

            {data.requirements && data.requirements.length > 0 && (
              <div className={`${styles.glass} p-6`}>
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <AlertTriangle size={20} className="text-yellow-400" />
                  Requirements
                </h3>
                <div className="space-y-3">
                  {data.requirements.map((req, idx) => (
                    <div key={idx} className="bg-[rgba(255,255,255,0.05)] p-3 rounded-lg">
                      <p className="text-white font-semibold">{req['Requirement']}</p>
                      {req['Requirement Type'] && (
                        <p className="text-sm text-gray-400 mt-1">Type: {req['Requirement Type']}</p>
                      )}
                      {req['Description'] && (
                        <p className="text-sm text-gray-400 mt-1">{req['Description']}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="space-y-4">
            {data.permissions && data.permissions.length > 0 ? (
              data.permissions.map((permission, idx) => (
                <div key={idx} className={`${styles.glass} p-4`}>
                  <div className="flex items-start gap-3">
                    <div className={styles.iconBadge}>
                      <Shield size={20} className="text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2">
                        {permission['Permission Name']}
                      </h4>
                      {permission['Status'] && (
                        <span className={styles.badgeActive} style={{ fontSize: '11px' }}>
                          {permission['Status']}
                        </span>
                      )}
                      {permission['Details'] && Array.isArray(permission['Details']) && permission['Details'].length > 0 && (
                        <div className="mt-3 space-y-2">
                          {permission['Details'].map((detail: any, dIdx: number) => (
                            <div key={dIdx} className="text-sm text-gray-400">
                              {typeof detail === 'string' ? detail : JSON.stringify(detail)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
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
                <div key={idx} className={`${styles.glass} p-4`}>
                  <div className="flex items-start gap-3">
                    <div className={styles.iconBadge}>
                      <Users size={20} className="text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2">{person['Name']}</h4>
                      <div className="space-y-1 text-sm text-gray-400">
                        <p>IRN: {person['IRN']}</p>
                        <p>Role: {person['Role']}</p>
                        <span className={
                          person['Status']?.toLowerCase() === 'active'
                            ? styles.badgeActive
                            : styles.badgeInactive
                        } style={{ fontSize: '11px' }}>
                          {person['Status']?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>No people information available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'more' && (
          <div className="space-y-6">
            {data.names && data.names.length > 0 && (
              <div className={`${styles.glass} p-6`}>
                <h3 className="text-lg font-semibold mb-4 text-white">Trading Names</h3>
                <div className="flex flex-wrap gap-2">
                  {data.names.map((name, idx) => (
                    <span key={idx} className={styles.badgeNeutral}>
                      {name['Name']}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.regulators && data.regulators.length > 0 && (
              <div className={`${styles.glass} p-6`}>
                <h3 className="text-lg font-semibold mb-4 text-white">Regulators</h3>
                <div className="space-y-3">
                  {data.regulators.map((reg, idx) => (
                    <div key={idx} className="bg-[rgba(255,255,255,0.05)] p-3 rounded-lg">
                      <p className="text-white font-semibold">{reg['Name']}</p>
                      {reg['Category'] && (
                        <p className="text-sm text-gray-400 mt-1">Category: {reg['Category']}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.passports && data.passports.length > 0 && (
              <div className={`${styles.glass} p-6`}>
                <h3 className="text-lg font-semibold mb-4 text-white">Passports</h3>
                <div className="space-y-2">
                  {data.passports.map((passport, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <span className={styles.badgeNeutral}>{passport['Country']}</span>
                      {passport['Activity'] && <span className="text-gray-400">• {passport['Activity']}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.disciplinary && data.disciplinary.length > 0 && (
              <div className={`${styles.glass} p-6`}>
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <AlertTriangle size={20} className="text-red-400" />
                  Disciplinary History
                </h3>
                <div className="space-y-3">
                  {data.disciplinary.map((action, idx) => (
                    <div key={idx} className="bg-[rgba(239,68,68,0.1)] border-l-4 border-red-500 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <p className="text-white font-semibold">{action['Action']}</p>
                        <p className="text-sm text-gray-400">{action['Date']}</p>
                      </div>
                      {action['Details'] && (
                        <p className="text-sm text-gray-400 mt-2">{action['Details']}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.waivers && data.waivers.length > 0 && (
              <div className={`${styles.glass} p-6`}>
                <h3 className="text-lg font-semibold mb-4 text-white">Waivers</h3>
                <div className="space-y-3">
                  {data.waivers.map((waiver, idx) => (
                    <div key={idx} className="bg-[rgba(255,255,255,0.05)] p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <p className="text-white font-semibold">{waiver['Rule']}</p>
                        <span className={styles.badgeNeutral} style={{ fontSize: '11px' }}>
                          {waiver['Status']}
                        </span>
                      </div>
                      {waiver['Date'] && (
                        <p className="text-sm text-gray-400 mt-1">Date: {waiver['Date']}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!data.names?.length && !data.regulators?.length && !data.passports?.length &&
              !data.disciplinary?.length && !data.waivers?.length) && (
              <div className="text-center py-10 text-gray-400">
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
