"use client"

import { useState } from 'react';
import { Building2, Hash, Loader2, Search, Info, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCompaniesHouseSearch, useCompanyDetails } from '@/hooks/useThirdpartyApi';
import { DetailModal } from './shared/DetailModal';
import { CompaniesHouseDetailView } from './details/CompaniesHouseDetailView';
import { LoadingSpinner, SearchResultsSkeleton, EmptyState } from './shared/LoadingStates';
import { ApiInteractionPanel } from './shared/ApiInteractionPanel';

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
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <Input
                type="text"
                placeholder="Search by Company Name or Number..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={searchLoading}>
              {searchLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Building2 className="mr-2" size={20} />}
              {searchLoading ? 'Searching...' : 'Search Companies'}
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
            {results.map((result: any, idx: number) => (
              <motion.div
                key={result.company_number || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleResultClick(result.company_number)}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Building2 size={24} className="text-blue-600" />
                      </div>
                      <span className="text-sm text-muted-foreground font-mono">
                        #{result.company_number}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold mb-3 text-gray-900">
                      {result.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Hash size={14} className="text-blue-600" />
                        <span>{result.company_number}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm flex-wrap">
                        <Building2 size={14} className="text-blue-600" />
                        <Badge variant={result.company_status?.toLowerCase() === 'active' ? 'default' : 'destructive'}>
                          {result.company_status?.toUpperCase() || 'ACTIVE'}
                        </Badge>
                        <span className="text-muted-foreground">• {result.company_type?.replace('-', ' ').toUpperCase() || 'LTD'}</span>
                      </div>
                      {result.address_snippet && (
                        <div className="flex items-start gap-2 text-xs text-muted-foreground mt-2">
                          <MapPin size={12} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{result.address_snippet}</span>
                        </div>
                      )}
                    </div>

                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
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

      {/* API Interaction Panel */}
      {searchQuery && !searchLoading && (
        <ApiInteractionPanel
          request={{
            url: `https://api.company-information.service.gov.uk/search/companies?q=${encodeURIComponent(searchQuery)}`,
            method: 'GET',
            headers: {
              'Authorization': 'Basic [REDACTED]',
              'Accept': 'application/json'
            }
          }}
          response={searchResults ? {
            status: 200,
            statusText: 'OK',
            headers: {
              'content-type': 'application/json',
              'x-ratelimit-limit': '600',
              'x-ratelimit-remaining': '599'
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
