import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { AlertTriangle, ShieldCheck, TrendingUp, TrendingDown } from "lucide-react"

interface RiskTierBadgeProps {
    riskTier: "Higher Risk" | "Lower Risk" | string
    className?: string
    showIcon?: boolean
}

export function RiskTierBadge({ riskTier, className, showIcon = true }: RiskTierBadgeProps) {
    const isHighRisk = riskTier === "Higher Risk"

    return (
        <Badge
            variant="outline"
            className={cn(
                "whitespace-nowrap font-medium px-3 py-1 transition-all",
                isHighRisk
                    ? "bg-red-500/10 text-red-700 border-red-200 hover:bg-red-500/20"
                    : "bg-green-500/10 text-green-700 border-green-200 hover:bg-green-500/20",
                className
            )}
        >
            <div className="flex items-center gap-1.5">
                {showIcon && (
                    isHighRisk ? (
                        <AlertTriangle className="h-3.5 w-3.5" />
                    ) : (
                        <ShieldCheck className="h-3.5 w-3.5" />
                    )
                )}
                <span className="text-xs font-semibold">{riskTier}</span>
                {showIcon && (
                    isHighRisk ? (
                        <TrendingUp className="h-3 w-3 opacity-60" />
                    ) : (
                        <TrendingDown className="h-3 w-3 opacity-60" />
                    )
                )}
            </div>
        </Badge>
    )
}
