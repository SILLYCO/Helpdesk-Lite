"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { PageHeader } from "@/components/layout/PageHeader"
import { StatusBadge } from "@/components/tickets/StatusBadge"
import { CHART_COLORS } from "@/lib/constants"
import { formatDate } from "@/lib/utils"
import { useTicketStore } from "@/store/ticket-store"

export default function ManagerOverviewPage() {
  return (
    <AuthGuard allowedRoles={["manager"]}>
      <ManagerOverviewContent />
    </AuthGuard>
  )
}

const ManagerOverviewContent = () => {
  const router = useRouter()
  const tickets = useTicketStore((s) => s.tickets)

  const stats = useMemo(() => {
    const open = tickets.filter((t) => t.status === "Open").length
    const inProgress = tickets.filter((t) => t.status === "In Progress").length
    const resolved = tickets.filter((t) => t.status === "Resolved").length
    const overdue = tickets.filter((t) => t.status === "Overdue").length
    return { open, inProgress, resolved, overdue }
  }, [tickets])

  const pieData = [
    { name: "Open", value: stats.open },
    { name: "In Progress", value: stats.inProgress },
    { name: "Resolved", value: stats.resolved },
    { name: "Overdue", value: stats.overdue },
  ].filter((d) => d.value > 0)

  const barData = useMemo(() => {
    const categoryMap = new Map<string, { open: number; resolved: number }>()

    tickets.forEach((t) => {
      const key = t.category.length > 10 ? t.category.slice(0, 10) : t.category
      const current = categoryMap.get(key) ?? { open: 0, resolved: 0 }
      if (t.status === "Resolved") {
        current.resolved += 1
      } else {
        current.open += 1
      }
      categoryMap.set(key, current)
    })

    return Array.from(categoryMap.entries()).map(([category, counts]) => ({
      category,
      ...counts,
    }))
  }, [tickets])

  const summaryCards = [
    {
      label: "Open",
      value: stats.open,
      color: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60",
      textColor: "text-blue-700 dark:text-blue-400",
      icon: AlertCircle,
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      color: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60",
      textColor: "text-amber-700 dark:text-amber-400",
      icon: Clock,
    },
    {
      label: "Resolved",
      value: stats.resolved,
      color: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60",
      textColor: "text-emerald-700 dark:text-emerald-400",
      icon: CheckCircle2,
    },
    {
      label: "Overdue",
      value: stats.overdue,
      color: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60",
      textColor: "text-red-700 dark:text-red-400",
      icon: AlertCircle,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Manager Overview"
        subtitle="Organization-wide support ticket summary."
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        {summaryCards.map(({ label, value, color, textColor, icon: Icon }) => (
          <div
            key={label}
            className={`rounded-xl border shadow-sm px-5 py-5 transition-colors ${color}`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {label}
              </p>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={14} className={textColor} aria-hidden="true" />
              </div>
            </div>
            <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">active tickets</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5 mb-6">
        <div className="bg-white dark:bg-[#14213D] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm px-6 py-5 transition-colors">
          <h3 className="text-sm font-semibold text-[#0A1F44] dark:text-slate-100 mb-4">
            Tickets by Category
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} barSize={22} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94A3B820" vertical={false} />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #334155",
                  backgroundColor: "#0F1930",
                  color: "#F8FAFC",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              />
              <Bar dataKey="open" name="Open" fill="#0891B2" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" name="Resolved" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-[#14213D] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm px-6 py-5 transition-colors">
          <h3 className="text-sm font-semibold text-[#0A1F44] dark:text-slate-100 mb-4">
            Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={76}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>{value}</span>
                )}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #334155",
                  backgroundColor: "#0F1930",
                  color: "#F8FAFC",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-[#14213D] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#0A1F44] dark:text-slate-100">All Tickets</h3>
          <span className="text-xs text-slate-400 dark:text-slate-500">{tickets.length} total</span>
        </div>
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
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-36">
                Assigned to
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-32">
                Status
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-24">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, i) => (
              <tr
                key={ticket.id}
                onClick={() => router.push(`/tickets/${ticket.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    router.push(`/tickets/${ticket.id}`)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View ticket ${ticket.id}`}
                className={`cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-800/50 ${
                  i < tickets.length - 1 ? "border-b border-slate-100 dark:border-slate-800/60" : ""
                }`}
              >
                <td className="px-5 py-3.5">
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{ticket.id}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-medium text-[#0A1F44] dark:text-slate-100">{ticket.title}</span>
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-300">
                  {ticket.submittedBy}
                </td>
                <td className="px-5 py-3.5">
                  {ticket.assignedTo ? (
                    <span className="text-xs text-slate-600 dark:text-slate-300">{ticket.assignedTo}</span>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-slate-500 italic">Unassigned</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(ticket.submittedDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
