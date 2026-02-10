import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    Mail,
    Shield,
    UserCheck,
    ThumbsUp,
    Users,
    FileCheck,
    Database,
    XCircle
} from "lucide-react"

interface StatusBadgeProps {
    status: string
    className?: string
    showIcon?: boolean
}

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    "ONBOARDING_COMPLETE": {
        color: "bg-blue-500/10 text-blue-700 border-blue-200 hover:bg-blue-500/20",
        icon: CheckCircle2,
        label: "Onboarding Complete"
    },
    "AUTOMATION_IN_PROGRESS": {
        color: "bg-yellow-500/10 text-yellow-700 border-yellow-200 hover:bg-yellow-500/20",
        icon: Clock,
        label: "Automation In Progress"
    },
    "AWAITING_KYC_REVIEW": {
        color: "bg-orange-500/10 text-orange-700 border-orange-200 hover:bg-orange-500/20",
        icon: AlertCircle,
        label: "Awaiting KYC Review"
    },
    "AWAITING_EXTERNAL_RESPONSE": {
        color: "bg-purple-500/10 text-purple-700 border-purple-200 hover:bg-purple-500/20",
        icon: Mail,
        label: "Awaiting External Response"
    },
    "FINANCIAL_CRIME_REVIEW": {
        color: "bg-red-500/10 text-red-700 border-red-200 hover:bg-red-500/20",
        icon: Shield,
        label: "Financial Crime Review"
    },
    "READY_KYC_MANAGER_REVIEW": {
        color: "bg-indigo-500/10 text-indigo-700 border-indigo-200 hover:bg-indigo-500/20",
        icon: UserCheck,
        label: "Ready KYC Manager Review"
    },
    "DIVISIONAL_APPROVAL_LOW_RISK": {
        color: "bg-green-500/10 text-green-700 border-green-200 hover:bg-green-500/20",
        icon: ThumbsUp,
        label: "Divisional Approval Low Risk"
    },
    "DIVISIONAL_APPROVAL_HIGH_RISK": {
        color: "bg-pink-500/10 text-pink-700 border-pink-200 hover:bg-pink-500/20",
        icon: AlertCircle,
        label: "Divisional Approval High Risk"
    },
    "AWAITING_SECURITY_COMMITTEE": {
        color: "bg-gray-500/10 text-gray-700 border-gray-200 hover:bg-gray-500/20",
        icon: Users,
        label: "Awaiting Security Committee"
    },
    "READY_FOR_PAS": {
        color: "bg-emerald-500/10 text-emerald-700 border-emerald-200 hover:bg-emerald-500/20",
        icon: FileCheck,
        label: "Ready For PAS"
    },
    "CREATED_IN_PAS": {
        color: "bg-teal-500/10 text-teal-700 border-teal-200 hover:bg-teal-500/20",
        icon: Database,
        label: "Created In PAS"
    },
    "COMPLETED": {
        color: "bg-green-600 text-white border-green-600 hover:bg-green-700 shadow-sm",
        icon: CheckCircle2,
        label: "Completed"
    },
    "REJECTED": {
        color: "bg-red-600 text-white border-red-600 hover:bg-red-700 shadow-sm",
        icon: XCircle,
        label: "Rejected"
    },
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
    const config = statusConfig[status] || {
        color: "bg-gray-500/10 text-gray-700 border-gray-200 hover:bg-gray-500/20",
        icon: Clock,
        label: status.replace(/_/g, " ")
    }

    const Icon = config.icon

    return (
        <Badge
            variant="outline"
            className={cn(
                "whitespace-nowrap font-medium px-3 py-1 transition-all",
                config.color,
                className
            )}
        >
            <div className="flex items-center gap-1.5">
                {showIcon && <Icon className="h-3.5 w-3.5" />}
                <span className="text-xs">{config.label}</span>
            </div>
        </Badge>
    )
}
