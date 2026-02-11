"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Building2, Shield, Database, Briefcase } from 'lucide-react';
import { CompaniesHouseTab } from './CompaniesHouseTab';
import { FcaRegisterTab } from './FcaRegisterTab';
import { PlaceholderTab } from './PlaceholderTab';
import styles from './styles/glassmorphism.module.css';

export function ApiTestingContainer() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold mb-3 text-gray-900">
          API <span className={styles.textGradient}>Test Harness</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Test and validate third-party API integrations
        </p>
      </header>

      {/* Tabs */}
      <Tabs defaultValue="companies-house" className="w-full">
        <TabsList className={`${styles.glass} mb-6 w-full flex flex-wrap justify-start gap-2 p-4`}>
          <TabsTrigger
            value="companies-house"
            className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-100"
          >
            <Building2 size={18} />
            Companies House
          </TabsTrigger>
          <TabsTrigger
            value="fca"
            className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-100"
          >
            <Shield size={18} />
            FCA Register
          </TabsTrigger>
          <TabsTrigger
            value="lexisnexis"
            disabled
            className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all opacity-50 cursor-not-allowed text-gray-400"
          >
            <Database size={18} />
            LexisNexis
          </TabsTrigger>
          <TabsTrigger
            value="dnb"
            disabled
            className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all opacity-50 cursor-not-allowed text-gray-400"
          >
            <Briefcase size={18} />
            Dun & Bradstreet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="companies-house" className="mt-0">
          <CompaniesHouseTab />
        </TabsContent>

        <TabsContent value="fca" className="mt-0">
          <FcaRegisterTab />
        </TabsContent>

        <TabsContent value="lexisnexis" className="mt-0">
          <PlaceholderTab
            name="LexisNexis"
            description="Legal and regulatory data provider integration for enhanced due diligence and risk assessment."
            icon={Database}
          />
        </TabsContent>

        <TabsContent value="dnb" className="mt-0">
          <PlaceholderTab
            name="Dun & Bradstreet"
            description="Business intelligence and credit reporting integration for comprehensive company analysis."
            icon={Briefcase}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
