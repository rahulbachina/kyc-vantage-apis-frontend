"use client"

import { CaseForm } from "@/components/cases/CaseForm"
import { useCase, useUpdateCase } from "@/hooks/useCases"
import { CaseFormValues } from "@/schemas/case.schema"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditCasePage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string
    const { data: caseDetail, isLoading: isLoadingCase } = useCase(id)
    const updateMutation = useUpdateCase()

    const handleSubmit = async (data: CaseFormValues) => {
        try {
            // Merge existing data that might not be in the form but is required by API
            const payload = {
                ...data,
                // automationResults is required by API but optional in form schema.
                // We preserve existing results if not present in form data.
                automationResults: data.automationResults || (caseDetail?.automationResults as any),
                // attachments might be empty array if not touched
                attachments: data.attachments || caseDetail?.attachments || [],
                cpiScore: caseDetail?.cpiScore,
                daysOpen: caseDetail?.daysOpen,
                // Ensure other read-only fields are not overwritten if API ignores them, 
                // but usually PUT requires full object or specific fields.
                // The API definition says "CaseCreate" which doesn't have ID, createdAt, etc.
                // So we stick to CaseCreate fields.
            }

            await updateMutation.mutateAsync({ id, data: payload })
            toast.success("Case updated successfully")
            router.push(`/cases/${id}`)
        } catch (error) {
            toast.error("Failed to update case")
            console.error(error)
        }
    }

    if (isLoadingCase) {
        return <div className="p-8"><Skeleton className="h-[400px] w-full" /></div>
    }

    if (!caseDetail) {
        return <div className="p-8">Case not found</div>
    }

    // Map API response to Form Values if structure differs slightly, 
    // but Zod schema matches API mostly.
    const defaultValues: Partial<CaseFormValues> = {
        entityName: caseDetail.entityName,
        status: caseDetail.status,
        riskTier: caseDetail.riskTier,
        assignedUser: caseDetail.assignedUser,
        businessUnit: caseDetail.businessUnit,
        beForm: caseDetail.beForm,
        automationResults: caseDetail.automationResults,
        attachments: caseDetail.attachments,
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Edit Case</h2>
            </div>
            <CaseForm
                defaultValues={defaultValues}
                onSubmit={handleSubmit}
                isLoading={updateMutation.isPending}
                isEdit
            />
        </div>
    )
}
