"use client"

import { CaseForm } from "@/components/cases/CaseForm"
import { useCreateCase } from "@/hooks/useCases"
import { CaseFormValues } from "@/schemas/case.schema"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { transformFormToKYCRecord } from "@/lib/api/transformers"

export default function CreateCasePage() {
    const router = useRouter()
    const createMutation = useCreateCase()

    const handleSubmit = async (data: CaseFormValues) => {
        try {
            // Transform frontend form data to backend KYC Master Record format
            const payload = transformFormToKYCRecord(data)

            console.log('Submitting KYC record:', payload)
            await createMutation.mutateAsync(payload as any)
            toast.success("Case created successfully")
            router.push("/kyc-records")
        } catch (error: any) {
            console.error('Create case error:', error)

            // Handle validation errors from backend
            if (error.response?.status === 422) {
                const validationData = error.response?.data
                if (validationData?.errors && Array.isArray(validationData.errors)) {
                    // Show each validation error
                    validationData.errors.forEach((err: any) => {
                        toast.error(err.message || `Validation error: ${err.field}`)
                    })
                    toast.error(validationData.detail || "Validation failed - please check all required fields")
                } else if (validationData?.detail) {
                    // Show generic validation error
                    toast.error(typeof validationData.detail === 'string'
                        ? validationData.detail
                        : "Validation failed - please check all required fields")
                } else {
                    toast.error("Some required fields are missing or invalid")
                }
            } else {
                // Show generic error for other error types
                const errorMessage = error.response?.data?.message
                    || error.response?.data?.detail
                    || error.message
                    || "Failed to create case"
                toast.error(errorMessage)
            }
        }
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Create New Case</h2>
            </div>
            <CaseForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
        </div>
    )
}
