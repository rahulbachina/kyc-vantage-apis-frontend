"use client"

import { useState } from 'react';
import { Shield, User, Building2, Hash, Loader2, Search, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useFcaSearch, useFirmDetails } from '@/hooks/useThirdpartyApi';
import { DetailModal } from './shared/DetailModal';
import { FcaDetailView } from './details/FcaDetailView';
import { LoadingSpinner, SearchResultsSkeleton, EmptyState } from './shared/LoadingStates';
import { ApiInteractionPanel } from './shared/ApiInteractionPanel';

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
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <Input
                type="text"
                placeholder="Search by Firm Name, FRN, or IRN..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={searchLoading}>
              {searchLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Shield className="mr-2" size={20} />}
              {searchLoading ? 'Searching...' : 'Search Register'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error State */}
      {searchError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Info className="text-red-500 flex-shrink-0" size={20} />
              <span className="text-red-700">Error: {(searchError as any).message}</span>
            </div>
          </CardContent>
        </Card>
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
                >
                  <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleResultClick(result['Reference Number'])}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg ${isFirm ? 'bg-blue-100' : 'bg-purple-100'}`}>
                          {isFirm ? (
                            <Shield size={24} className="text-blue-600" />
                          ) : (
                            <User size={24} className="text-purple-600" />
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground font-mono">
                          #{result['Reference Number']}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold mb-3 text-gray-900">
                        {result.Name}
                      </h3>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Hash size={14} className="text-blue-600" />
                          <span>{result['Reference Number']}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm flex-wrap">
                          <Building2 size={14} className="text-blue-600" />
                          <Badge variant={isActive ? 'default' : 'destructive'}>
                            {result['Status']?.toUpperCase()}
                          </Badge>
                          <span className="text-muted-foreground">• {result['Type of business or Individual']}</span>
                        </div>
                      </div>

                      <Button className="w-full mt-4" variant="outline">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
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

      {/* API Interaction Panel */}
      {searchQuery && (
        <ApiInteractionPanel
          request={{
            url: `https://register.fca.org.uk/services/V0.1/Firm?q=${encodeURIComponent(searchQuery)}`,
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'X-API-Key': '[REDACTED]'
            }
          }}
          response={!searchLoading && searchResults ? {
            status: 200,
            statusText: 'OK',
            headers: {
              'content-type': 'application/json',
              'x-ratelimit-limit': '1000',
              'x-ratelimit-remaining': '999'
            },
            body: searchResults
          } : undefined}
          timestamp={new Date().toISOString()}
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
