"use client"

import { Clock, ShieldAlert } from "lucide-react"
import type { Priority, TicketStatus } from "@/types"

interface SlaBadgeProps {
  priority: Priority
  status: TicketStatus
  slaDueDate?: string
}

export function SlaBadge({ priority, status, slaDueDate }: SlaBadgeProps) {
  if (status === "Resolved") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
        <Clock size={11} aria-hidden="true" />
        SLA Met
      </span>
    )
  }

  if (status === "Overdue") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800 animate-pulse">
        <ShieldAlert size={11} aria-hidden="true" />
        SLA Breached
      </span>
    )
  }

  if (!slaDueDate) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <Clock size={11} aria-hidden="true" />
        Target: {priority} SLA
      </span>
    )
  }

  const due = new Date(slaDueDate).getTime()
  const now = new Date().getTime()
  const diffHours = Math.round((due - now) / (1000 * 60 * 60))

  const isWarning = diffHours <= 4 && diffHours > 0
  const isBreached = diffHours <= 0

  if (isBreached) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800">
        <ShieldAlert size={11} aria-hidden="true" />
        SLA Breached
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
        isWarning
          ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
          : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300"
      }`}
    >
      <Clock size={11} aria-hidden="true" />
      SLA: ~{diffHours}h left
    </span>
  )
}
