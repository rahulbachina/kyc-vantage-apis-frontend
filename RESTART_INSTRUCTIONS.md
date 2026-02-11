# 🔧 Fix for Single Case 404 Error

## Issue
When clicking on a case to view details, you're getting a 404 error.

## Root Cause
The Next.js dev server needs to be restarted to pick up the updated API route at `/api/cases/[id]/route.ts`.

## Solution

### **Restart the Dev Server**

1. **Stop the current server** (press `Ctrl+C` in terminal)

2. **Restart it:**
   ```bash
   cd "C:\Users\rahul\Desktop\Ardonagh Client\KYCAPI UI\kycapyfront"
   npm run dev
   ```

   OR use the batch file:
   ```bash
   restart-dev.bat
   ```

3. **Wait for** the message:
   ```
   ✓ Ready in XXXms
   ```

4. **Refresh your browser** at `http://localhost:3000/cases` (or whatever port it starts on)

5. **Click on a case** to view details - it should work now!

---

## What We Fixed

The API route at `/app/api/cases/[id]/route.ts` now:
- ✅ Has proper timeout handling (10 seconds)
- ✅ Logs errors clearly
- ✅ Returns proper error responses
- ✅ Uses `force-dynamic` to avoid caching

The route will proxy to:
```
http://querydog.benjaminwootton.com:8090/api/kyc-records/{id}
```

And return the full case details including:
- Entity information
- Relationship details
- Role information
- Rules outcomes
- Enrichment data (Companies House, FCA, D&B, LexisNexis)
- Approval history
- Audit trail

---

## Testing

After restart, test with this command:
```bash
curl "http://localhost:3000/api/cases/698b65c212f4af590b57641b"
```

You should see a full JSON response with the case details.

---

## Alternative: Use Port 3001

If port 3000 is still occupied, the server might start on 3001:
```bash
curl "http://localhost:3001/api/cases/698b65c212f4af590b57641b"
```

Then use: `http://localhost:3001/cases` in your browser
