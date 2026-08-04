"use client"

import { ChevronDown, Filter, Search } from "lucide-react"
import { STATUS_OPTIONS } from "@/lib/constants"

interface TicketFiltersProps {
  search: string
  statusFilter: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  searchPlaceholder?: string
  resultCount?: number
}

export const TicketFilters = ({
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
  searchPlaceholder = "Search tickets…",
  resultCount,
}: TicketFiltersProps) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="relative flex-1 max-w-xs">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        aria-hidden="true"
      />
      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        aria-label="Search tickets"
        className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#14213D] text-sm text-[#0A1F44] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
      />
    </div>
    <div className="relative">
      <Filter
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        aria-hidden="true"
      />
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        aria-label="Filter by status"
        className="pl-9 pr-8 py-2 appearance-none rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#14213D] text-sm text-[#0A1F44] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
      >
        <option value="All">All</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
        aria-hidden="true"
      />
    </div>
    {resultCount !== undefined && (
      <div className="ml-auto text-xs text-slate-400 dark:text-slate-500 font-medium">
        {resultCount} tickets
      </div>
    )}
  </div>
)
