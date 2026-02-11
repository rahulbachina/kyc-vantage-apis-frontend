// FCA Register API Type Definitions

export interface FcaSearchResult {
  'URL'?: string;
  'Status'?: string;
  'Reference Number'?: string;
  'Type of business or Individual'?: string;
  'Name'?: string;
}

export interface FcaFirmDetails {
  'Firm Name': string;
  'Status': string;
  'Business Type': string;
  'Client Money Permission'?: string;
  [key: string]: any;
}

export interface FcaIndividual {
  'Name': string;
  'IRN': string;
  'Role': string;
  'Status': string;
  [key: string]: any;
}

export interface FcaPermission {
  'Permission Name': string;
  'Status'?: string;
  'Details'?: any[];
  [key: string]: any;
}

export interface FcaRequirement {
  'Requirement': string;
  'Requirement Type'?: string;
  'Description'?: string;
  [key: string]: any;
}

export interface FcaRegulator {
  'Name': string;
  'Category'?: string;
  [key: string]: any;
}

export interface FcaPassport {
  'Country': string;
  'Activity'?: string;
  [key: string]: any;
}

export interface FcaDisciplinary {
  'Date': string;
  'Action': string;
  'Details'?: string;
  [key: string]: any;
}

export interface FcaWaiver {
  'Rule': string;
  'Status': string;
  'Date'?: string;
  [key: string]: any;
}

export interface FcaAddress {
  'Address Line 1'?: string;
  'Address Line 2'?: string;
  'City'?: string;
  'Postcode'?: string;
  'Country'?: string;
  [key: string]: any;
}

export interface FcaTradingName {
  'Name': string;
  [key: string]: any;
}

export interface FcaFirmData {
  source: 'fca';
  details: FcaFirmDetails;
  individuals: FcaIndividual[];
  permissions: FcaPermission[];
  address: FcaAddress | null;
  requirements: FcaRequirement[];
  regulators: FcaRegulator[];
  passports: FcaPassport[];
  disciplinary: FcaDisciplinary[];
  waivers: FcaWaiver[];
  names: FcaTradingName[];
}

export interface FcaApiResponse<T = any> {
  Data?: T;
  [key: string]: any;
}
