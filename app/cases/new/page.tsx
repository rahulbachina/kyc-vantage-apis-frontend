"use client"

import { CaseForm } from "@/components/cases/CaseForm"
import { useCreateCase } from "@/hooks/useCases"
import { CaseFormValues } from "@/schemas/case.schema"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function CreateCasePage() {
    const router = useRouter()
    const createMutation = useCreateCase()

    const handleSubmit = async (data: CaseFormValues) => {
        try {
            // Ensure required fields for API are present, defaulting if form didn't capture them
            const payload = {
                ...data,
                // Default automation results for new case if not in form data
                automationResults: data.automationResults || {
                    companiesHouse: { status: "pending" },
                    fca: { status: "pending" },
                    dAndB: { status: "pending" },
                    lexisNexis: { status: "pending" }
                } as any,
                attachments: data.attachments || [],
            }
            await createMutation.mutateAsync(payload)
            toast.success("Case created successfully")
            router.push("/cases")
        } catch (error) {
            toast.error("Failed to create case")
            console.error(error)
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
