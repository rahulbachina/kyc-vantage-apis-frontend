import axios, { AxiosInstance } from 'axios';
import type { FcaApiResponse } from './types/fca-types';
import type { CHSearchResponse, CHCompanyResponse } from './types/companies-house-types';

const baseURL = process.env.NEXT_PUBLIC_THIRDPARTY_API_URL || 'http://querydog.benjaminwootton.com:8091';

const thirdpartyClient: AxiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Response interceptor for error handling
thirdpartyClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Third Party API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export const thirdpartyApi = {
  fca: {
    search: async (query: string, type: string = 'firm', perPage: number = 10): Promise<FcaApiResponse> => {
      const response = await thirdpartyClient.get(`/api/search`, {
        params: { q: query, type, per_page: perPage }
      });
      return response.data;
    },

    firmDetails: async (frn: string): Promise<FcaApiResponse> => {
      const response = await thirdpartyClient.get(`/api/firm/${frn}`);
      return response.data;
    },

    individuals: async (frn: string): Promise<FcaApiResponse> => {
      const response = await thirdpartyClient.get(`/api/firm/${frn}/individuals`);
      return response.data;
    },

    permissions: async (frn: string): Promise<FcaApiResponse> => {
      const response = await thirdpartyClient.get(`/api/firm/${frn}/permissions`);
      return response.data;
    },

    address: async (frn: string): Promise<FcaApiResponse> => {
      const response = await thirdpartyClient.get(`/api/firm/${frn}/address`);
      return response.data;
    },

    requirements: async (frn: string): Promise<FcaApiResponse> => {
      const response = await thirdpartyClient.get(`/api/firm/${frn}/requirements`);
      return response.data;
    },

    regulators: async (frn: string): Promise<FcaApiResponse> => {
      const response = await thirdpartyClient.get(`/api/firm/${frn}/regulators`);
      return response.data;
    },

    passports: async (frn: string): Promise<FcaApiResponse> => {
      const response = await thirdpartyClient.get(`/api/firm/${frn}/passports`);
      return response.data;
    },

    disciplinary: async (frn: string): Promise<FcaApiResponse> => {
      const response = await thirdpartyClient.get(`/api/firm/${frn}/disciplinary`);
      return response.data;
    },

    waivers: async (frn: string): Promise<FcaApiResponse> => {
      const response = await thirdpartyClient.get(`/api/firm/${frn}/waivers`);
      return response.data;
    },

    names: async (frn: string): Promise<FcaApiResponse> => {
      const response = await thirdpartyClient.get(`/api/firm/${frn}/names`);
      return response.data;
    },

    individualDetails: async (irn: string): Promise<FcaApiResponse> => {
      const response = await thirdpartyClient.get(`/api/individual/${irn}`);
      return response.data;
    }
  },

  companiesHouse: {
    search: async (query: string, itemsPerPage: number = 10): Promise<CHSearchResponse> => {
      const response = await thirdpartyClient.get(`/api/companies/search`, {
        params: { q: query, items_per_page: itemsPerPage }
      });
      return response.data;
    },

    companyDetails: async (companyNumber: string): Promise<CHCompanyResponse> => {
      const response = await thirdpartyClient.get(`/api/companies/${companyNumber}`);
      return response.data;
    }
  }
};

export default thirdpartyClient;
