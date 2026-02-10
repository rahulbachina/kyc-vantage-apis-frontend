"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { api } from "@/lib/api/client"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"

const sendToPasSchema = z.object({
    sentToRpaBy: z.string().email(),
    priority: z.enum(["High", "Medium", "Low"]),
    referencePrefix: z.string().min(1),
})

type SendToPasValues = z.infer<typeof sendToPasSchema>

export default function SendToPasPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const form = useForm<SendToPasValues>({
        resolver: zodResolver(sendToPasSchema),
        defaultValues: {
            sentToRpaBy: "system@example.com",
            priority: "High",
            referencePrefix: "CASE",
        },
    })

    const mutation = useMutation({
        mutationFn: (values: SendToPasValues) => api.cases.sendToPas(id, values),
        onSuccess: () => {
            toast.success("Case sent to PAS successfully")
            router.push(`/cases/${id}`)
        },
        onError: (error) => {
            toast.error("Failed to send to PAS")
            console.error(error)
        }
    })

    const onSubmit = (data: SendToPasValues) => {
        mutation.mutate(data)
    }

    return (
        <div className="max-w-md mx-auto p-8 pt-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4 pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h2 className="text-2xl font-bold mb-6">Send to PAS Queue</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="sentToRpaBy"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sent To RPA By (Email)</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="referencePrefix"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reference Prefix</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={mutation.isPending}>
                        {mutation.isPending ? "Sending..." : "Send to PAS"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
