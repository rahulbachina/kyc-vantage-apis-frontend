"use client"

import { useState } from 'react';
import { Shield, User, Building2, Hash, Loader2, Search, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFcaSearch, useFirmDetails } from '@/hooks/useThirdpartyApi';
import { DetailModal } from './shared/DetailModal';
import { FcaDetailView } from './details/FcaDetailView';
import { LoadingSpinner, SearchResultsSkeleton, EmptyState } from './shared/LoadingStates';
import styles from './styles/glassmorphism.module.css';

export function FcaRegisterTab() {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFrn, setSelectedFrn] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: searchResults, isLoading: searchLoading, error: searchError } = useFcaSearch(searchQuery, !!searchQuery);
  const { data: firmData, isLoading: detailLoading } = useFirmDetails(selectedFrn || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query);
    }
  };

  const handleResultClick = (frn: string) => {
    setSelectedFrn(frn);
    setIsModalOpen(true);
  };

  const results = searchResults?.Data || [];

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
              placeholder="Search by Firm Name, FRN, or IRN..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ paddingLeft: '56px' }}
            />
          </div>
          <button type="submit" className={styles.btnPrimary} disabled={searchLoading}>
            {searchLoading ? <Loader2 className="animate-spin" size={20} /> : <Shield size={20} />}
            {searchLoading ? 'Searching...' : 'Search Register'}
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
            {results.map((result: any, idx: number) => {
              const isFirm = result['Type of business or Individual'] === 'Firm';
              const isActive = result['Status']?.toLowerCase() === 'active';

              return (
                <motion.div
                  key={result['Reference Number'] || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`${styles.glass} ${styles.cardAnim} p-6 cursor-pointer`}
                  onClick={() => handleResultClick(result['Reference Number'])}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={styles.iconBadge} style={{
                      background: isFirm ? 'rgba(0, 210, 255, 0.2)' : 'rgba(157, 80, 187, 0.2)'
                    }}>
                      {isFirm ? (
                        <Shield size={24} className="text-cyan-400" />
                      ) : (
                        <User size={24} className="text-purple-400" />
                      )}
                    </div>
                    <span className="text-sm text-gray-600 font-mono">
                      #{result['Reference Number']}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    {result.Name}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Hash size={14} className="text-cyan-500" />
                      <span>{result['Reference Number']}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 size={14} className="text-purple-500" />
                      <span className={isActive ? styles.badgeActive : styles.badgeInactive}>
                        {result['Status']?.toUpperCase()}
                      </span>
                      <span className="text-gray-600">• {result['Type of business or Individual']}</span>
                    </div>
                  </div>

                  <button className={`${styles.btnPrimary} w-full mt-4 text-sm`}>
                    View Details
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!searchLoading && results.length === 0 && searchQuery && (
        <EmptyState
          icon={Shield}
          title="No Results Found"
          description="Try a different search term"
        />
      )}

      {/* Detail Modal */}
      <DetailModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFrn(null);
        }}
        title={firmData?.details?.['Firm Name'] || 'Loading...'}
      >
        {detailLoading ? (
          <LoadingSpinner />
        ) : firmData ? (
          <FcaDetailView data={firmData} />
        ) : null}
      </DetailModal>
    </div>
  );
}
