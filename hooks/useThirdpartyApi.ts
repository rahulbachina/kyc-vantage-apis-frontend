import { useQuery } from '@tanstack/react-query';
import { thirdpartyApi } from '@/lib/api/thirdparty-client';
import type { FcaFirmData } from '@/lib/api/types/fca-types';
import type { CHCompanyData } from '@/lib/api/types/companies-house-types';

// FCA Register Hooks

export const useFcaSearch = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['fca-search', query],
    queryFn: () => thirdpartyApi.fca.search(query),
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFirmDetails = (frn: string) => {
  return useQuery({
    queryKey: ['fca-firm', frn],
    queryFn: async (): Promise<FcaFirmData> => {
      // Fetch all FCA firm data in parallel for better performance
      const [
        details,
        individuals,
        permissions,
        address,
        requirements,
        regulators,
        passports,
        disciplinary,
        waivers,
        names
      ] = await Promise.all([
        thirdpartyApi.fca.firmDetails(frn),
        thirdpartyApi.fca.individuals(frn),
        thirdpartyApi.fca.permissions(frn),
        thirdpartyApi.fca.address(frn),
        thirdpartyApi.fca.requirements(frn),
        thirdpartyApi.fca.regulators(frn),
        thirdpartyApi.fca.passports(frn),
        thirdpartyApi.fca.disciplinary(frn),
        thirdpartyApi.fca.waivers(frn),
        thirdpartyApi.fca.names(frn),
      ]);

      // Normalize permissions: FCA API sometimes returns object, sometimes array
      const rawPermissions = permissions?.Data;
      const normalizedPermissions = !rawPermissions ? [] : (
        Array.isArray(rawPermissions) ? rawPermissions :
          Object.entries(rawPermissions).map(([name, details]) => ({
            'Permission Name': name,
            'Details': details
          }))
      );

      return {
        source: 'fca',
        details: details?.Data?.[0] || {},
        individuals: individuals?.Data || [],
        permissions: normalizedPermissions,
        address: address?.Data?.[0] || null,
        requirements: requirements?.Data || [],
        regulators: regulators?.Data || [],
        passports: passports?.Data || [],
        disciplinary: disciplinary?.Data || [],
        waivers: waivers?.Data || [],
        names: names?.Data || []
      };
    },
    enabled: !!frn,
    staleTime: 10 * 60 * 1000, // 10 minutes for detail views
  });
};

// Companies House Hooks

export const useCompaniesHouseSearch = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['ch-search', query],
    queryFn: () => thirdpartyApi.companiesHouse.search(query),
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCompanyDetails = (companyNumber: string) => {
  return useQuery({
    queryKey: ['ch-company', companyNumber],
    queryFn: async (): Promise<CHCompanyData> => {
      const data = await thirdpartyApi.companiesHouse.companyDetails(companyNumber);

      return {
        source: 'ch',
        details: data.profile || {},
        individuals: data.officers?.items || [],
        psc: data.psc?.items || [],
        filing_history: data.filing_history?.items || [],
        address: data.profile?.registered_office_address || {}
      };
    },
    enabled: !!companyNumber,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
