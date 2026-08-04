"use client"

import { useMemo, useState } from "react"
import {
  CheckCircle2,
  Clock,
  Filter,
  History,
  MessageSquare,
  PlusCircle,
  RefreshCw,
  UserCheck,
} from "lucide-react"
import type { AuditActionType, AuditLogEntry } from "@/types"

interface AuditLogTimelineProps {
  history: AuditLogEntry[]
}

const ACTION_CONFIG: Record<
  AuditActionType,
  {
    icon: typeof PlusCircle
    bgColor: string
    textColor: string
    label: string
  }
> = {
  created: {
    icon: PlusCircle,
    bgColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
    textColor: "text-emerald-700",
    label: "Created",
  },
  status_change: {
    icon: RefreshCw,
    bgColor: "bg-blue-50 text-blue-600 border-blue-200",
    textColor: "text-blue-700",
    label: "Status Update",
  },
  assigned: {
    icon: UserCheck,
    bgColor: "bg-purple-50 text-purple-600 border-purple-200",
    textColor: "text-purple-700",
    label: "Assignment",
  },
  comment_added: {
    icon: MessageSquare,
    bgColor: "bg-[#0891B2]/10 text-[#0891B2] border-[#0891B2]/20",
    textColor: "text-[#0891B2]",
    label: "Comment",
  },
  priority_change: {
    icon: CheckCircle2,
    bgColor: "bg-amber-50 text-amber-600 border-amber-200",
    textColor: "text-amber-700",
    label: "Priority Update",
  },
}

export function AuditLogTimeline({ history = [] }: AuditLogTimelineProps) {
  const [filterAction, setFilterAction] = useState<string>("all")

  const sortedHistory = useMemo(() => {
    return [...history].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }, [history])

  const filteredHistory = useMemo(() => {
    if (filterAction === "all") return sortedHistory
    return sortedHistory.filter((item) => item.action === filterAction)
  }, [sortedHistory, filterAction])

  if (!history || history.length === 0) {
    return (
      <div className="py-8 text-center text-slate-400 text-sm italic">
        No audit log history available for this ticket yet.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header and Filter */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <History size={16} className="text-[#0891B2]" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-[#0A1F44] dark:text-slate-100">
            Audit Trail ({filteredHistory.length})
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <Filter size={13} className="text-slate-400 dark:text-slate-500" aria-hidden="true" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            aria-label="Filter audit log action type"
            className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1930] text-xs text-[#0A1F44] dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0891B2]"
          >
            <option value="all">All Events</option>
            <option value="status_change">Status Updates</option>
            <option value="assigned">Assignments</option>
            <option value="comment_added">Comments</option>
            <option value="created">Ticket Creation</option>
          </select>
        </div>
      </div>

      {/* Timeline view */}
      <div className="relative pl-4 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {filteredHistory.map((item) => {
          const config = ACTION_CONFIG[item.action] || ACTION_CONFIG.status_change
          const IconComponent = config.icon

          return (
            <div key={item.id} className="relative flex gap-3.5 group">
              {/* Node Icon */}
              <div
                className={`absolute -left-4 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center bg-white dark:bg-slate-900 z-10 shadow-xs ${config.bgColor}`}
              >
                <IconComponent size={11} aria-hidden="true" />
              </div>

              {/* Content Card */}
              <div className="flex-1 bg-slate-50/70 dark:bg-[#0F1930]/80 border border-slate-100 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-700 dark:text-slate-300 transition-colors group-hover:border-slate-200 dark:group-hover:border-slate-700">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[#0A1F44] dark:text-slate-100">
                      {item.performedBy}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.role}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${config.bgColor}`}
                    >
                      {config.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                    <Clock size={11} aria-hidden="true" />
                    <span>{item.timestamp}</span>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">{item.description}</p>

                {/* Diff callout if values changed */}
                {item.changes && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2 text-[11px]">
                    <span className="text-slate-400 dark:text-slate-500 uppercase font-semibold tracking-wider text-[9px]">
                      {item.changes.field}:
                    </span>
                    {item.changes.oldValue && (
                      <span className="px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 line-through font-mono">
                        {item.changes.oldValue}
                      </span>
                    )}
                    <span className="text-slate-400 dark:text-slate-500">→</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold font-mono">
                      {item.changes.newValue}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
