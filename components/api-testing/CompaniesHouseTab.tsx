"use client"

import { useState } from 'react';
import { Building2, Hash, Loader2, Search, Info, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompaniesHouseSearch, useCompanyDetails } from '@/hooks/useThirdpartyApi';
import { DetailModal } from './shared/DetailModal';
import { CompaniesHouseDetailView } from './details/CompaniesHouseDetailView';
import { LoadingSpinner, SearchResultsSkeleton, EmptyState } from './shared/LoadingStates';
import styles from './styles/glassmorphism.module.css';

export function CompaniesHouseTab() {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyNumber, setSelectedCompanyNumber] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: searchResults, isLoading: searchLoading, error: searchError } = useCompaniesHouseSearch(searchQuery, !!searchQuery);
  const { data: companyData, isLoading: detailLoading } = useCompanyDetails(selectedCompanyNumber || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query);
    }
  };

  const handleResultClick = (companyNumber: string) => {
    setSelectedCompanyNumber(companyNumber);
    setIsModalOpen(true);
  };

  const results = searchResults?.items || [];

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className={`${styles.glass} p-8`}>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              className={styles.inputGlass}
              placeholder="Search by Company Name or Number..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ paddingLeft: '56px' }}
            />
          </div>
          <button type="submit" className={styles.btnPrimary} disabled={searchLoading}>
            {searchLoading ? <Loader2 className="animate-spin" size={20} /> : <Building2 size={20} />}
            {searchLoading ? 'Searching...' : 'Search Companies'}
          </button>
        </form>
      </div>

      {/* Error State */}
      {searchError && (
        <div className={styles.errorContainer}>
          <Info className="text-red-500 flex-shrink-0" size={20} />
          <span>Error: {(searchError as any).message}</span>
        </div>
      )}

      {/* Loading State */}
      {searchLoading && <SearchResultsSkeleton />}

      {/* Results Grid */}
      {!searchLoading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {results.map((result: any, idx: number) => (
              <motion.div
                key={result.company_number || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.1 }}
                className={`${styles.glass} ${styles.cardAnim} p-6 cursor-pointer`}
                onClick={() => handleResultClick(result.company_number)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={styles.iconBadge}>
                    <Building2 size={24} className="text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-600 font-mono">
                    #{result.company_number}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-3 text-gray-900">
                  {result.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Hash size={14} className="text-blue-500" />
                    <span>{result.company_number}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 size={14} className="text-cyan-500" />
                    <span className={
                      result.company_status?.toLowerCase() === 'active'
                        ? styles.badgeActive
                        : styles.badgeInactive
                    } style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                      {result.company_status?.toUpperCase() || 'ACTIVE'}
                    </span>
                    <span className="text-gray-600">• {result.company_type?.replace('-', ' ').toUpperCase() || 'LTD'}</span>
                  </div>
                  {result.address_snippet && (
                    <div className="flex items-start gap-2 text-xs text-gray-500 mt-2">
                      <MapPin size={12} className="text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{result.address_snippet}</span>
                    </div>
                  )}
                </div>

                <button className={`${styles.btnPrimary} w-full text-sm`}>
                  View Details
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!searchLoading && results.length === 0 && searchQuery && (
        <EmptyState
          icon={Building2}
          title="No Companies Found"
          description="Try a different search term"
        />
      )}

      {/* Detail Modal */}
      <DetailModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCompanyNumber(null);
        }}
        title={companyData?.details?.company_name || 'Loading...'}
      >
        {detailLoading ? (
          <LoadingSpinner />
        ) : companyData ? (
          <CompaniesHouseDetailView data={companyData} />
        ) : null}
      </DetailModal>
    </div>
  );
}
