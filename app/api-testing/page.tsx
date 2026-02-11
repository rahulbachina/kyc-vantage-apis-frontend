import { ApiTestingContainer } from '@/components/api-testing/ApiTestingContainer';

export const metadata = {
  title: 'API Test Harness | KYC Vantage',
  description: 'Test and validate third-party API integrations including Companies House and FCA Register',
};

export default function ApiTestingPage() {
  return <ApiTestingContainer />;
}
