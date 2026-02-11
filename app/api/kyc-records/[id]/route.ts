import { NextRequest, NextResponse } from 'next/server';

// Updated to QueryDog API
const API_BASE_URL = 'http://querydog.benjaminwootton.com:8090';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const url = `${API_BASE_URL}/api/kyc-records/${id}`;

  console.log('[Proxy GET /api/kyc-records/:id]', url);

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
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('[Proxy] Response not OK:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('[Proxy] Error body:', errorText);
      return NextResponse.json({
        error: `Backend API error: ${response.statusText}`,
        details: errorText
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('[Proxy] Success - got record:', id);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Proxy] Error:', error.message || error);
    if (error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 504 });
    }
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// Disable static optimization for this route
export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();
  const url = `${API_BASE_URL}/api/kyc-records/${id}`;

  console.log('[Proxy PUT /api/kyc-records/:id]', url);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const url = `${API_BASE_URL}/api/kyc-records/${id}`;

  console.log('[Proxy DELETE /api/kyc-records/:id]', url);

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}
