"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { User, UserCheck } from "lucide-react"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { PageHeader } from "@/components/layout/PageHeader"
import { PriorityLabel } from "@/components/tickets/PriorityLabel"
import { StatusBadge } from "@/components/tickets/StatusBadge"
import { TicketFilters } from "@/components/tickets/TicketFilters"
import { formatDate } from "@/lib/utils"
import { useAuthStore } from "@/store/auth-store"
import { useTicketStore } from "@/store/ticket-store"

export default function TicketQueuePage() {
  return (
    <AuthGuard allowedRoles={["staff", "manager"]}>
      <TicketQueueContent />
    </AuthGuard>
  )
}

const TicketQueueContent = () => {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const tickets = useTicketStore((s) => s.tickets)
  const assignTicket = useTicketStore((s) => s.assignTicket)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filtered = useMemo(
    () =>
      tickets.filter((t) => {
        const matchSearch =
          !search ||
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.id.toLowerCase().includes(search.toLowerCase()) ||
          t.submittedBy.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === "All" || t.status === statusFilter
        return matchSearch && matchStatus
      }),
    [tickets, search, statusFilter]
  )

  const handleAssign = (id: string) => {
    if (!user) return
    assignTicket(id, user.name, user)
  }

  return (
    <div>
      <PageHeader
        title="Ticket Queue"
        subtitle="All incoming support requests across the company."
      />

      <TicketFilters
        search={search}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        searchPlaceholder="Search by title, ID, or employee…"
        resultCount={filtered.length}
      />

      <div className="bg-white dark:bg-[#14213D] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-[#0F1930]">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-24">
                ID
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Title
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-32">
                Submitted by
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-28">
                Priority
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-32">
                Status
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-36">
                Assigned to
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-24">
                Date
              </th>
              <th className="w-28" aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                  No tickets found.
                </td>
              </tr>
            ) : (
              filtered.map((ticket, i) => (
                <tr
                  key={ticket.id}
                  className={`group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                    i < filtered.length - 1 ? "border-b border-slate-100 dark:border-slate-800/60" : ""
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => router.push(`/tickets/${ticket.id}`)}
                      className="font-mono text-xs text-[#0891B2] dark:text-[#38BDF8] hover:underline"
                    >
                      {ticket.id}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => router.push(`/tickets/${ticket.id}`)}
                      className="font-medium text-[#0A1F44] dark:text-slate-100 hover:text-[#0891B2] dark:hover:text-[#38BDF8] text-left transition-colors"
                    >
                      {ticket.title}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center shrink-0">
                        <User size={10} className="text-slate-500 dark:text-slate-300" aria-hidden="true" />
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-300">{ticket.submittedBy}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <PriorityLabel priority={ticket.priority} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    {ticket.assignedTo ? (
                      <span className="text-xs text-slate-600 dark:text-slate-300">{ticket.assignedTo}</span>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(ticket.submittedDate)}
                  </td>
                  <td className="px-3 py-3.5">
                    {!ticket.assignedTo && user?.role === "staff" && (
                      <button
                        type="button"
                        onClick={() => handleAssign(ticket.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0891B2]/10 dark:bg-[#0891B2]/20 hover:bg-[#0891B2]/20 dark:hover:bg-[#0891B2]/30 text-[#0891B2] dark:text-[#38BDF8] text-xs font-semibold transition-colors"
                        aria-label={`Assign ticket ${ticket.id} to me`}
                      >
                        <UserCheck size={12} aria-hidden="true" />
                        Assign me
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
