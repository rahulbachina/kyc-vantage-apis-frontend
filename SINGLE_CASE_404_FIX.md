# Single Case 404 Error - Root Cause & Fix

## Current Status
- ✅ **List view works**: 6 cases loading correctly
- ✅ **Stats working**: Correct numbers showing
- ❌ **Single case view**: Getting 404 error when clicking on a case

## Root Cause

The issue is that Next.js with Turbopack is not properly routing requests to `/api/cases/[id]/route.ts`.

### Evidence:
1. Route file exists at: `app/api/cases/[id]/route.ts`
2. Route code is correct and updated for QueryDog API
3. Backend API works: `curl http://querydog.benjaminwootton.com:8090/api/kyc-records/{id}` returns data
4. Local API route returns 404: `curl http://localhost:3000/api/cases/{id}` fails

## Solutions

### Option 1: Disable Turbopack (Recommended)

Turbopack can have issues with dynamic routes. Try running without it:

```bash
# Stop current server (Ctrl+C)

# Start without Turbopack
npm run dev -- --no-turbo
```

Or update `package.json`:
```json
{
  "scripts": {
    "dev": "next dev --no-turbo"
  }
}
```

### Option 2: Complete Clean Rebuild

```bash
# Stop server
# Delete everything
rm -rf .next node_modules

# Reinstall
npm install

# Start fresh
npm run dev
```

### Option 3: Use next.config.ts to Configure Turbopack

Add to `next.config.ts`:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      // Disable for API routes
      rules: {
        '*.ts': ['ts-loader'],
      },
    },
  },
};

export default nextConfig;
```

### Option 4: Create a Non-Dynamic Workaround

For now, you could use the list API and filter client-side, but this isn't ideal for details.

## Testing the Fix

After applying any solution, test:

```bash
# Should return full case details:
curl "http://localhost:3000/api/cases/698b65c212f4af590b57641b"
```

Expected response:
```json
{
  "_id": "698b65c212f4af590b57641b",
  "caseId": "KYC-20260210-0001",
  "status": "ENRICHED",
  "entity": {...},
  "relationship": {...},
  ...
}
```

## Why This Happens

Next.js 16 with Turbopack (experimental) sometimes has issues with:
- Dynamic route segments `[id]`
- API routes with dynamic parameters
- Hot reload not picking up route changes

This is a known issue in Next.js 16.x with Turbopack.

## Recommended Action

**Try Option 1 first** (disable Turbopack) - it's the quickest and most likely to work.

```bash
npm run dev -- --no-turbo
```

Then refresh browser and try clicking on a case.
