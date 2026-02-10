import { z } from "zod"

export const beFormSchema = z.object({
    legalName: z.string().min(1, "Legal Name is required"),
    tradingName: z.string().min(1, "Trading Name is required"),
    country: z.string().min(1, "Country is required"),
    roleType: z.string().min(1, "Role Type is required"),
    addressLine1: z.string().min(1, "Address Line 1 is required"),
    addressLine2: z.string().optional().nullable(),
    city: z.string().min(1, "City is required"),
    postcode: z.string().min(1, "Postcode is required"),
    registrationNumber: z.string().min(1, "Registration Number is required"),
    customerType: z.enum(["Micro", "Small", "Medium", "Large", "Consumer"]),
    statementEmail: z.string().email("Invalid email address"),
    creditControllerEmail: z.string().email("Invalid email address"),
    bankName: z.string().optional().nullable(),
    bankAccountNumber: z.string().optional().nullable(),
    bankSortCode: z.string().optional().nullable(),
    bankDetailsRequired: z.boolean().default(false),
})

export const caseSchema = z.object({
    entityName: z.string().min(1, "Entity Name is required"),
    status: z.enum([
        "ONBOARDING_COMPLETE",
        "AUTOMATION_IN_PROGRESS",
        "AWAITING_KYC_REVIEW",
        "AWAITING_EXTERNAL_RESPONSE",
        "FINANCIAL_CRIME_REVIEW",
        "READY_KYC_MANAGER_REVIEW",
        "DIVISIONAL_APPROVAL_LOW_RISK",
        "DIVISIONAL_APPROVAL_HIGH_RISK",
        "AWAITING_SECURITY_COMMITTEE",
        "READY_FOR_PAS",
        "CREATED_IN_PAS",
        "COMPLETED",
        "REJECTED"
    ]),
    riskTier: z.enum(["Higher Risk", "Lower Risk"]),
    assignedUser: z.string().min(1, "Assigned User is required"),
    businessUnit: z.string().min(1, "Business Unit is required"),
    beForm: beFormSchema,
    // Automation results are required by API but might be partial/optional in form.
    // We use z.any().optional() to allow flexible handling in form, 
    // but we must ensure it is present when submitting to API.
    automationResults: z.any().optional(),
    attachments: z.array(z.any()),
})

export type CaseFormValues = z.infer<typeof caseSchema>
