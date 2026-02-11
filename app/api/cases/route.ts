import { NextRequest, NextResponse } from 'next/server';

// Updated to QueryDog API
const API_BASE_URL = 'http://querydog.benjaminwootton.com:8090';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();
  // Changed endpoint from /api/cases to /api/kyc-records
  const url = `${API_BASE_URL}/api/kyc-records${queryString ? `?${queryString}` : ''}`;

  console.log('[Proxy GET /api/kyc-records]', url);

  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      cache: 'no-store', // Disable caching for API routes
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('[Proxy] Response not OK:', response.status, response.statusText);
      return NextResponse.json({
        error: `Backend API error: ${response.statusText}`,
        content: [],
        totalElements: 0,
        page: 0,
        pageSize: 25
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('[Proxy] Success - got', data?.totalElements || 0, 'total elements');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Proxy] Error:', error.message || error);
    if (error.name === 'AbortError') {
      return NextResponse.json({
        error: 'Request timeout',
        content: [],
        totalElements: 0,
        page: 0,
        pageSize: 25
      }, { status: 504 });
    }
    return NextResponse.json({
      error: 'Failed to fetch data',
      content: [],
      totalElements: 0,
      page: 0,
      pageSize: 25
    }, { status: 500 });
  }
}

// Disable static optimization for this route to ensure it runs on every request
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.json();
  // Changed endpoint from /api/cases to /api/kyc-records
  const url = `${API_BASE_URL}/api/kyc-records`;

  console.log('[Proxy POST /api/kyc-records]', url);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to post data' }, { status: 500 });
  }
}
