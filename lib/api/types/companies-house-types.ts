// Companies House API Type Definitions

export interface CHSearchResult {
  company_number: string;
  title: string;
  company_type: string;
  company_status: string;
  address_snippet: string;
}

export interface CHAddress {
  address_line_1?: string;
  address_line_2?: string;
  locality?: string;
  postal_code?: string;
  country?: string;
  region?: string;
}

export interface CHCompanyProfile {
  company_number: string;
  company_name: string;
  type: string;
  company_status: string;
  date_of_creation: string;
  registered_office_address: CHAddress;
  sic_codes?: string[];
  [key: string]: any;
}

export interface CHOfficer {
  name: string;
  officer_role: string;
  appointed_on: string;
  occupation?: string;
  nationality?: string;
  country_of_residence?: string;
  [key: string]: any;
}

export interface CHPSC {
  name: string;
  kind: string;
  nature_of_control: string[];
  notified_on: string;
  [key: string]: any;
}

export interface CHFilingItem {
  date: string;
  type: string;
  description: string;
  description_blob?: string;
  [key: string]: any;
}

export interface CHCompanyData {
  source: 'ch';
  details: CHCompanyProfile;
  individuals: CHOfficer[];
  psc: CHPSC[];
  filing_history: CHFilingItem[];
  address: CHAddress;
}

export interface CHSearchResponse {
  items: CHSearchResult[];
  [key: string]: any;
}

export interface CHCompanyResponse {
  profile: CHCompanyProfile;
  officers?: { items: CHOfficer[] };
  psc?: { items: CHPSC[] };
  filing_history?: { items: CHFilingItem[] };
  [key: string]: any;
}
