"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Download, Trash2, User, UserCheck, CheckCircle2, Clock } from "lucide-react"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { PageHeader } from "@/components/layout/PageHeader"
import { PriorityLabel } from "@/components/tickets/PriorityLabel"
import { SlaBadge } from "@/components/tickets/SlaBadge"
import { StatusBadge } from "@/components/tickets/StatusBadge"
import { TicketFilters } from "@/components/tickets/TicketFilters"
import { DEPARTMENTS } from "@/lib/constants"
import { formatDate } from "@/lib/utils"
import { useAuthStore } from "@/store/auth-store"
import { useTicketStore } from "@/store/ticket-store"
import type { TicketStatus } from "@/types"

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
  const bulkAssign = useTicketStore((s) => s.bulkAssign)
  const bulkUpdateStatus = useTicketStore((s) => s.bulkUpdateStatus)
  const bulkDelete = useTicketStore((s) => s.bulkDelete)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [deptFilter, setDeptFilter] = useState("All")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const filtered = useMemo(
    () =>
      tickets.filter((t) => {
        const matchSearch =
          !search ||
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.id.toLowerCase().includes(search.toLowerCase()) ||
          t.submittedBy.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === "All" || t.status === statusFilter
        const matchDept = deptFilter === "All" || t.department === deptFilter
        return matchSearch && matchStatus && matchDept
      }),
    [tickets, search, statusFilter, deptFilter]
  )

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filtered.map((t) => t.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleBulkAssign = () => {
    if (!user || selectedIds.length === 0) return
    bulkAssign(selectedIds, user.name, user)
    setSelectedIds([])
  }

  const handleBulkStatus = (status: TicketStatus) => {
    if (!user || selectedIds.length === 0) return
    bulkUpdateStatus(selectedIds, status, user)
    setSelectedIds([])
  }

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return
    if (confirm(`Are you sure you want to delete ${selectedIds.length} tickets?`)) {
      bulkDelete(selectedIds)
      setSelectedIds([])
    }
  }

  const handleExportCsv = () => {
    const headers = ["ID", "Title", "Category", "Department", "Priority", "Status", "SubmittedBy", "AssignedTo", "Date"]
    const rows = filtered.map((t) => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.department || "IT Support",
      t.priority,
      t.status,
      t.submittedBy,
      t.assignedTo || "Unassigned",
      t.submittedDate,
    ])

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `helpdesk_queue_export_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAssignSingle = (id: string) => {
    if (!user) return
    assignTicket(id, user.name, user)
  }

  return (
    <div>
      <PageHeader
        title="Ticket Queue"
        subtitle="All incoming support requests across the company."
        action={
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#14213D] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-[#0A1F44] dark:text-slate-200 transition-colors shadow-xs"
          >
            <Download size={14} className="text-[#0891B2]" />
            Export CSV
          </button>
        }
      />

      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center gap-3">
          <TicketFilters
            search={search}
            statusFilter={statusFilter}
            onSearchChange={setSearch}
            onStatusChange={setStatusFilter}
            searchPlaceholder="Search by title, ID, or employee…"
            resultCount={filtered.length}
          />
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium shrink-0">Dept:</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#14213D] text-xs text-[#0A1F44] dark:text-slate-100 focus:outline-none"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="bg-[#0A1F44] text-white rounded-xl p-3.5 px-5 flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
            <span className="text-xs font-semibold">
              {selectedIds.length} ticket{selectedIds.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBulkAssign}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0891B2] hover:bg-[#0780A0] text-xs font-semibold transition-colors"
              >
                <UserCheck size={13} /> Bulk Assign to Me
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatus("In Progress")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-xs font-semibold transition-colors"
              >
                <Clock size={13} /> Mark In Progress
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatus("Resolved")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold transition-colors"
              >
                <CheckCircle2 size={13} /> Mark Resolved
              </button>
              {user?.role === "manager" && (
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-semibold transition-colors ml-2"
                >
                  <Trash2 size={13} /> Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#14213D] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-[#0F1930]">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && selectedIds.length === filtered.length}
                  onChange={handleSelectAll}
                  aria-label="Select all tickets"
                  className="rounded border-slate-300 dark:border-slate-700 text-[#0891B2] focus:ring-[#0891B2]"
                />
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-24">
                ID
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Title
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-32">
                Submitted by
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-24">
                Priority
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-28">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-32">
                SLA Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-32">
                Assigned to
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-24">
                Date
              </th>
              <th className="w-24" aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                  No tickets found matching the criteria.
                </td>
              </tr>
            ) : (
              filtered.map((ticket, i) => {
                const isSelected = selectedIds.includes(ticket.id)
                return (
                  <tr
                    key={ticket.id}
                    className={`group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                      isSelected ? "bg-cyan-50/50 dark:bg-[#0891B2]/10" : ""
                    } ${i < filtered.length - 1 ? "border-b border-slate-100 dark:border-slate-800/60" : ""}`}
                  >
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(ticket.id)}
                        aria-label={`Select ticket ${ticket.id}`}
                        className="rounded border-slate-300 dark:border-slate-700 text-[#0891B2] focus:ring-[#0891B2]"
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => router.push(`/tickets/${ticket.id}`)}
                        className="font-mono text-xs text-[#0891B2] dark:text-[#38BDF8] hover:underline"
                      >
                        {ticket.id}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => router.push(`/tickets/${ticket.id}`)}
                        className="font-medium text-[#0A1F44] dark:text-slate-100 hover:text-[#0891B2] dark:hover:text-[#38BDF8] text-left transition-colors"
                      >
                        {ticket.title}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center shrink-0">
                          <User size={10} className="text-slate-500 dark:text-slate-300" aria-hidden="true" />
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-300">{ticket.submittedBy}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <PriorityLabel priority={ticket.priority} />
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <SlaBadge priority={ticket.priority} status={ticket.status} slaDueDate={ticket.slaDueDate} />
                    </td>
                    <td className="px-4 py-3.5">
                      {ticket.assignedTo ? (
                        <span className="text-xs text-slate-600 dark:text-slate-300">{ticket.assignedTo}</span>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(ticket.submittedDate)}
                    </td>
                    <td className="px-3 py-3.5">
                      {!ticket.assignedTo && user?.role === "staff" && (
                        <button
                          type="button"
                          onClick={() => handleAssignSingle(ticket.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#0891B2]/10 dark:bg-[#0891B2]/20 hover:bg-[#0891B2]/20 text-[#0891B2] dark:text-[#38BDF8] text-xs font-semibold transition-colors"
                          aria-label={`Assign ticket ${ticket.id} to me`}
                        >
                          <UserCheck size={11} /> Assign me
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
