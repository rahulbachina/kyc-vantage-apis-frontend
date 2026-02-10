"use client"

import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X, Filter, Building2, CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface CaseFiltersProps {
    onSearch: (value: string) => void
    onStatusChange: (value: string) => void
    onBusinessUnitChange: (value: string) => void
    filters: {
        search?: string
        status?: string
        businessUnit?: string
    }
}

export function CaseFilters({
    onSearch,
    onStatusChange,
    onBusinessUnitChange,
    filters,
}: CaseFiltersProps) {
    const [searchValue, setSearchValue] = useState(filters.search || "")

    const handleSearch = () => {
        onSearch(searchValue)
    }

    const handleClear = () => {
        setSearchValue("")
        onSearch("")
        onStatusChange("")
        onBusinessUnitChange("")
    }

    const hasActiveFilters = filters.search || filters.status || filters.businessUnit

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filter Cases</span>
                {hasActiveFilters && (
                    <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        Active
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by entity name or case ID..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="pl-10 h-10 bg-background/50 border-muted focus-visible:ring-primary"
                    />
                    {searchValue && (
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                                setSearchValue("")
                                onSearch("")
                            }}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2 md:w-auto w-full">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Status:</span>
                    </div>
                    <Select
                        value={filters.status || "all"}
                        onValueChange={(val) => onStatusChange(val === "all" ? "" : val)}
                    >
                        <SelectTrigger className="w-[200px] h-10 bg-background/50 border-muted">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={4}>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="ONBOARDING_COMPLETE">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    Onboarding Complete
                                </div>
                            </SelectItem>
                            <SelectItem value="AUTOMATION_IN_PROGRESS">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                    Automation In Progress
                                </div>
                            </SelectItem>
                            <SelectItem value="AWAITING_KYC_REVIEW">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                                    Awaiting KYC Review
                                </div>
                            </SelectItem>
                            <SelectItem value="COMPLETED">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    Completed
                                </div>
                            </SelectItem>
                            <SelectItem value="REJECTED">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    Rejected
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Business Unit Filter */}
                <div className="flex items-center gap-2 md:w-auto w-full">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                        <Building2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Unit:</span>
                    </div>
                    <Select
                        value={filters.businessUnit || "all"}
                        onValueChange={(val) => onBusinessUnitChange(val === "all" ? "" : val)}
                    >
                        <SelectTrigger className="w-[200px] h-10 bg-background/50 border-muted">
                            <SelectValue placeholder="All Units" />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={4}>
                            <SelectItem value="all">All Business Units</SelectItem>
                            <SelectItem value="Ardonagh Specialty">
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-3 w-3 text-muted-foreground" />
                                    Ardonagh Specialty
                                </div>
                            </SelectItem>
                            <SelectItem value="Price Forbes">
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-3 w-3 text-muted-foreground" />
                                    Price Forbes
                                </div>
                            </SelectItem>
                            <SelectItem value="Bishopsgate">
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-3 w-3 text-muted-foreground" />
                                    Bishopsgate
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        onClick={handleClear}
                        className="h-10 border-dashed hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Clear All
                    </Button>
                )}
            </div>
        </div>
    )
}
