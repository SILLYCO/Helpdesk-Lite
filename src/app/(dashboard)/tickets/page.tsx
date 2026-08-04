"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Tag } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { StatusBadge } from "@/components/tickets/StatusBadge"
import { TicketFilters } from "@/components/tickets/TicketFilters"
import { formatDate } from "@/lib/utils"
import { useAuthStore } from "@/store/auth-store"
import { useTicketStore } from "@/store/ticket-store"

export default function MyTicketsPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const tickets = useTicketStore((s) => s.tickets)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const myTickets = useMemo(
    () => tickets.filter((t) => t.submittedBy === user?.name),
    [tickets, user?.name]
  )

  const filtered = useMemo(
    () =>
      myTickets.filter((t) => {
        const matchSearch =
          !search ||
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.id.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === "All" || t.status === statusFilter
        return matchSearch && matchStatus
      }),
    [myTickets, search, statusFilter]
  )

  const handleSelectTicket = (id: string) => {
    router.push(`/tickets/${id}`)
  }

  return (
    <div>
      <PageHeader
        title="My Tickets"
        subtitle="All support requests you've submitted."
      />

      <TicketFilters
        search={search}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
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
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-28">
                Category
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-32">
                Status
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-28">
                Submitted
              </th>
              <th className="w-8" aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                  No tickets found.
                </td>
              </tr>
            ) : (
              filtered.map((ticket, i) => (
                <tr
                  key={ticket.id}
                  onClick={() => handleSelectTicket(ticket.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handleSelectTicket(ticket.id)
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ticket ${ticket.id}: ${ticket.title}`}
                  className={`cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-800/50 ${
                    i < filtered.length - 1 ? "border-b border-slate-100 dark:border-slate-800/60" : ""
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{ticket.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-[#0A1F44] dark:text-slate-100">{ticket.title}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
                      <Tag size={11} className="text-slate-400 dark:text-slate-500" aria-hidden="true" />
                      {ticket.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(ticket.submittedDate)}
                  </td>
                  <td className="px-3 py-3.5">
                    <ChevronRight size={15} className="text-slate-300 dark:text-slate-600" aria-hidden="true" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
        {filtered.length} ticket{filtered.length !== 1 ? "s" : ""}
      </p>
    </div>
  )
}
