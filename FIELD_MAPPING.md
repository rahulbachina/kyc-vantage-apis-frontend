# QueryDog API to Frontend Field Mapping

## ✅ Current Mapping (Working)

| Frontend Field | QueryDog API Field | Notes |
|---------------|-------------------|-------|
| `id` | `id` | ✅ Direct mapping |
| `entityName` | `entityName` | ✅ Direct mapping |
| `status` | `status` | ✅ Direct mapping |
| `businessUnit` | `jurisdiction` | ✅ Mapped (was missing) |
| `riskTier` | `primaryRole` | ⚠️ Different semantics |
| `assignedUser` | `-` | ❌ Not available in API |

## 📊 QueryDog API Fields Available

```json
{
  "id": "698b65c212f4af590b57641b",
  "caseId": "KYC-20260210-0001",
  "clientRef": "price_forbes_underwriting_usa_underwriter_20260210_v1",
  "status": "ENRICHED",
  "entityName": "Price Forbes Underwriting LLC",
  "jurisdiction": "USA",
  "primaryRole": "UNDERWRITER",
  "relationshipType": "EXISTING",
  "createdAt": "2026-01-15T09:35:00Z",
  "lastUpdatedAt": "2026-01-17T10:00:00Z"
}
```

## 🔄 Status Values in QueryDog API

- `DRAFT`
- `ENRICHED`
- `UNDER_REVIEW`
- `IN_PROGRESS`
- `APPROVED`
- `REJECTED`

**Note:** Frontend looks for `COMPLETED` but API has `APPROVED`/`ENRICHED`

## 🎯 Primary Role Values (mapped to Risk Tier)

- `UNDERWRITER`
- `BROKER`
- `CLIENT`
- `SERVICE_PROVIDER`
- `REINSURER`

**Note:** These are not risk tiers! They're business roles.

## 🔧 Recommended Adjustments

### Option 1: Keep Current Mapping (Simpler)
- Accept that "Risk Tier" shows business roles
- Accept that "Assigned To" shows "-"
- Update stats to use correct status values

### Option 2: Update UI Labels (Better UX)
- Rename "Risk Tier" column to "Primary Role"
- Hide or remove "Assigned To" column
- Update stats logic to match API statuses

### Option 3: Request Backend Changes
- Ask backend to add `assignedUser` field
- Ask backend to add actual `riskTier` field
- Add `COMPLETED` status or map `APPROVED` → `COMPLETED`

## 📝 Stats Card Mapping Issues

Current code:
```typescript
const completedCases = data?.content?.filter(c => c.status === "COMPLETED").length || 0
```

Should be:
```typescript
const completedCases = data?.content?.filter(c =>
  c.status === "APPROVED" || c.status === "ENRICHED"
).length || 0
```

Current code:
```typescript
const highRiskCases = data?.content?.filter(c => c.riskTier === "Higher Risk").length || 0
```

This will always be 0 because `riskTier` now contains role names like "UNDERWRITER", not risk levels.

## ✅ What's Working Great

1. ✅ **6 records loading** from MongoDB via QueryDog API
2. ✅ **Proxy working** - no CORS issues
3. ✅ **Table displaying** all records correctly
4. ✅ **Jurisdiction showing** as Business Unit
5. ✅ **Statuses showing** correctly with badges
6. ✅ **Primary roles** displaying (even though labeled as Risk Tier)

## 🎯 Quick Wins

To make the UI match the API better, update:

1. **Stats calculation** in `app/cases/page.tsx`:
   - Change `COMPLETED` to `APPROVED` or `ENRICHED`
   - Remove "High Risk" count or base it on something else

2. **Column headers** in table:
   - "Risk Tier" → "Primary Role"
   - Hide "Assigned To" column (optional)

3. **Add Case ID** to the table:
   - Show `caseId` field which is more meaningful than the MongoDB `_id`
