/**
 * Data transformation utilities to convert between frontend and backend formats
 */

import { CaseFormValues } from "@/schemas/case.schema"

/**
 * Transform frontend form data to backend KYC Master Record format
 */
export function transformFormToKYCRecord(formData: CaseFormValues) {
  const now = new Date().toISOString()

  return {
    caseId: formData.caseId,
    clientRef: formData.clientRef,
    status: formData.status,
    version: 1,
    entity: {
      legalName: formData.beForm.legalName,
      jurisdiction: formData.beForm.country,
      contactEmail: formData.beForm.statementEmail,
    },
    relationship: {
      type: "NEW", // Default to NEW for new cases
      systemRequired: formData.businessUnit || "Vantage", // Use business unit as system
    },
    role: {
      primary: formData.beForm.roleType || "CLIENT",
      subType: formData.beForm.customerType,
    },
    rulesOutcome: {
      ruleSetId: "DEFAULT_RULESET_V1",
      requiredDocuments: [
        "Certificate of Incorporation",
        "Proof of Address",
        "ID Verification"
      ],
      optionalDocuments: [
        "Financial Statements",
        "Bank Reference"
      ],
    },
    documents: [],
    enrichment: {
      companiesHouse: {
        status: formData.automationResults?.companiesHouse?.status?.toUpperCase() || "PENDING",
        companyNumber: formData.beForm.registrationNumber || null,
        companyStatus: null,
        registeredAddress: formData.beForm.addressLine1 ? {
          line1: formData.beForm.addressLine1,
          city: formData.beForm.city,
          postcode: formData.beForm.postcode,
          country: formData.beForm.country,
        } : null,
        checkedAt: now,
      },
      fca: {
        status: formData.automationResults?.fca?.status?.toUpperCase() || "PENDING",
        firmReferenceNumber: null,
        regulated: null,
        checkedAt: now,
      },
      dnb: {
        status: formData.automationResults?.dAndB?.status?.toUpperCase() || "PENDING",
        dunsNumber: null,
        confidenceScore: null,
        checkedAt: now,
      },
      lexisNexis: {
        status: formData.automationResults?.lexisNexis?.status?.toUpperCase() || "PENDING",
        matchesFound: null,
        checkedAt: now,
      },
    },
    flags: [],
    approvals: [],
    decision: {
      outcome: null,
      decidedBy: null,
      decidedAt: null,
      rationale: null,
    },
    changeHistory: [],
  }
}

/**
 * Transform backend KYC Master Record to frontend form format
 */
export function transformKYCRecordToForm(record: any): Partial<CaseFormValues> {
  return {
    caseId: record.caseId,
    clientRef: record.clientRef,
    entityName: record.entity?.legalName || "",
    status: record.status,
    riskTier: "Lower Risk", // Default, as backend doesn't have this
    assignedUser: "-", // Backend doesn't have this
    businessUnit: record.relationship?.systemRequired || "",
    beForm: {
      legalName: record.entity?.legalName || "",
      tradingName: record.entity?.legalName || "",
      country: record.entity?.jurisdiction || "",
      roleType: record.role?.primary || "",
      addressLine1: record.enrichment?.companiesHouse?.registeredAddress?.line1 || "",
      addressLine2: record.enrichment?.companiesHouse?.registeredAddress?.line2 || null,
      city: record.enrichment?.companiesHouse?.registeredAddress?.city || "",
      postcode: record.enrichment?.companiesHouse?.registeredAddress?.postcode || "",
      registrationNumber: record.enrichment?.companiesHouse?.companyNumber || "",
      customerType: record.role?.subType || "Medium",
      statementEmail: record.entity?.contactEmail || "",
      creditControllerEmail: record.entity?.contactEmail || "",
      bankDetailsRequired: false,
      bankName: null,
      bankAccountNumber: null,
      bankSortCode: null,
    },
    automationResults: {
      companiesHouse: {
        status: record.enrichment?.companiesHouse?.status?.toLowerCase() || "pending",
      },
      fca: {
        status: record.enrichment?.fca?.status?.toLowerCase() || "pending",
      },
      dAndB: {
        status: record.enrichment?.dnb?.status?.toLowerCase() || "pending",
      },
      lexisNexis: {
        status: record.enrichment?.lexisNexis?.status?.toLowerCase() || "pending",
      },
    },
    attachments: record.documents || [],
  }
}
