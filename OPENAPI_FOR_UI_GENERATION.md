# OpenAPI Spec for UI Generation
## Vantage KYC API - Next.js UI

---

## 📄 Files Generated

Two OpenAPI JSON files have been created for you:

### 1. **vantage-kyc-openapi.json** (31KB)
- Original OpenAPI spec from the API
- Direct export from FastAPI

### 2. **vantage-kyc-openapi-enhanced.json** (64KB) ⭐ **RECOMMENDED**
- Enhanced version with server URL configured
- Includes: `http://37.27.255.95:8090`
- Ready for UI generation tools
- Better metadata for code generation

---

## 🎯 Recommended File for Vibecoding Tool

**Use this file:** `vantage-kyc-openapi-enhanced.json`

**File Location:**
```
C:\Users\rahul\Desktop\Ardonagh Client\mongo_sunday\mongo\vantage-kyc-openapi-enhanced.json
```

---

## 🚀 What's Included in the OpenAPI Spec

### API Endpoints

#### **Health Check**
- `GET /` - API health check

#### **Cases Management**
- `GET /api/cases` - List cases (with pagination, filtering, sorting)
- `POST /api/cases` - Create new case
- `GET /api/cases/{case_id}` - Get case by ID
- `PUT /api/cases/{case_id}` - Update case
- `DELETE /api/cases/{case_id}` - Delete case

#### **PAS Integration**
- `POST /api/cases/{case_id}/convert-to-pas` - Convert to PAS format
- `POST /api/cases/{case_id}/send-to-pas` - Send to PAS system

### Data Models (Schemas)

All schemas are fully defined in the OpenAPI spec:

- `CaseCreate` - Create/Update case payload
- `CaseDetail` - Full case details
- `CasesListResponse` - Paginated list response
- `BEForm` - BE form data structure
- `AutomationResults` - Companies House, FCA, D&B, LexisNexis data
- `Attachment` - File attachment structure
- `PASClientProcess` - PAS conversion format

### Query Parameters

The spec includes all query parameters for filtering:
- `page`, `pageSize` - Pagination
- `sortBy`, `sortOrder` - Sorting
- `status`, `businessUnit`, `assignedUser` - Filtering
- `search` - Free-text search

---

## 🔧 API Server Configuration

**Base URL:** `http://37.27.255.95:8090`

The enhanced OpenAPI spec includes:
```json
{
  "servers": [
    {
      "url": "http://37.27.255.95:8090",
      "description": "Production API Server"
    }
  ]
}
```

This means your vibecoding tool will automatically configure API calls to the correct endpoint.

---

## 💻 What Your Vibecoding Tool Should Generate

### Suggested UI Components

#### 1. **Cases List Page**
- Table/Grid view of all cases
- Pagination controls
- Filters (status, business unit, assigned user)
- Search bar
- Sort controls
- "Create New Case" button

#### 2. **Case Detail Page**
- Case header (entity name, status, risk tier)
- Tabs:
  - Overview
  - BE Form Data
  - Automation Results
  - Attachments
  - History
- Action buttons (Edit, Delete, Send to PAS)

#### 3. **Create/Edit Case Form**
- Multi-step form or single page
- Sections:
  - Basic Information
  - BE Form Details
  - Bank Details (conditional)
- Validation based on schema
- Submit/Cancel buttons

#### 4. **Filters Sidebar**
- Status dropdown
- Business Unit dropdown
- Assigned User dropdown
- Risk Tier filter
- Date range picker

---

## 📋 Key Features to Implement

### Must-Have Features
1. ✅ List cases with pagination
2. ✅ View case details
3. ✅ Create new case
4. ✅ Edit existing case
5. ✅ Delete case
6. ✅ Search cases
7. ✅ Filter by status, business unit, assigned user
8. ✅ Sort by any field

### Nice-to-Have Features
1. 📊 Dashboard with statistics
2. 🔔 Real-time updates (polling)
3. 📥 Export to CSV/Excel
4. 📎 File upload for attachments
5. 🔄 Send to PAS with confirmation
6. 📈 Charts for case distribution

---

## 🎨 Suggested Tech Stack (Next.js)

### Core
- **Next.js 14+** (App Router)
- **TypeScript** (types from OpenAPI)
- **React Query** or **SWR** for data fetching

### UI Components
- **shadcn/ui** or **Material-UI** or **Ant Design**
- **TailwindCSS** for styling
- **React Hook Form** for forms
- **Zod** for validation

### API Client
- **OpenAPI TypeScript Codegen** to generate types
- **Axios** or **Fetch API** for HTTP calls

---

## 🔐 Important Notes

### CORS
The API may need CORS configuration. If you get CORS errors in the browser:
1. Contact backend team to add CORS headers
2. Or use Next.js API routes as a proxy

### Authentication
Currently, the API has **NO authentication**. Add auth later if needed.

### Environment Variables
In your Next.js app, create `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://37.27.255.95:8090
```

---

## 🧪 Testing the API

Before building the UI, test the API:

### Health Check
```bash
curl http://37.27.255.95:8090/
```

### Get Cases
```bash
curl http://37.27.255.95:8090/api/cases
```

### Get Specific Case
```bash
curl http://37.27.255.95:8090/api/cases/{case_id}
```

---

## 📦 OpenAPI Spec Summary

**API Title:** Vantage KYC API
**Version:** 2.0.0
**Description:** Vantage KYC Case Management API - Ardonagh Specialities
**Base URL:** http://37.27.255.95:8090

**Total Endpoints:** 8
**Total Schemas:** 30+
**File Size:** 64KB (enhanced version)

---

## 🎯 Instructions for Your Vibecoding Tool

1. **Upload/Provide:** `vantage-kyc-openapi-enhanced.json`

2. **Request:** "Generate a Next.js 14 application with TypeScript for this API"

3. **Specify Requirements:**
   - Use App Router
   - Use shadcn/ui components
   - Generate TypeScript types from OpenAPI
   - Implement all CRUD operations
   - Add pagination and filtering
   - Use React Query for data fetching
   - Add form validation with Zod

4. **Expected Output:**
   - Next.js project structure
   - API client with TypeScript types
   - Pages for list, detail, create, edit
   - Reusable components
   - Forms with validation
   - Responsive design

---

## 📞 Support

If the vibecoding tool needs additional information:
- **API Documentation:** http://37.27.255.95:8090/docs
- **Alternative Docs:** http://37.27.255.95:8090/redoc
- **OpenAPI Spec:** http://37.27.255.95:8090/openapi.json

---

**Your OpenAPI spec is ready for UI generation!** 🚀

Simply provide the `vantage-kyc-openapi-enhanced.json` file to your vibecoding tool and let it generate your Next.js UI!
