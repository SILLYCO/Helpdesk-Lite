import type { Priority, Role, TicketStatus } from "@/types"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"

export const CATEGORIES = [
  "Software",
  "Hardware",
  "Network",
  "Software Access",
  "Facilities",
  "Other",
] as const

export const PRIORITIES = ["Low", "Medium", "High", "Critical"] as const

export const STATUS_OPTIONS: TicketStatus[] = [
  "Open",
  "In Progress",
  "Resolved",
  "Overdue",
]

export const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; color: string; icon: typeof CheckCircle2 }
> = {
  Open: {
    label: "Open",
    color: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
    icon: AlertCircle,
  },
  "In Progress": {
    label: "In Progress",
    color: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    icon: Clock,
  },
  Resolved: {
    label: "Resolved",
    color: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    icon: CheckCircle2,
  },
  Overdue: {
    label: "Overdue",
    color: "bg-red-100 text-red-700 ring-1 ring-red-200",
    icon: AlertCircle,
  },
}

export const PRIORITY_CONFIG: Record<Priority, { color: string }> = {
  Low: { color: "text-slate-500" },
  Medium: { color: "text-amber-600" },
  High: { color: "text-orange-600" },
  Critical: { color: "text-red-600" },
}

export const CHART_COLORS = ["#0891B2", "#F59E0B", "#10B981", "#DC2626"]

export const DEMO_USERS: Record<
  string,
  { name: string; email: string; role: Role }
> = {
  "employee@acme.com": {
    name: "Sarah Chen",
    email: "employee@acme.com",
    role: "employee",
  },
  "support@acme.com": {
    name: "Marcus Webb",
    email: "support@acme.com",
    role: "staff",
  },
  "manager@acme.com": {
    name: "Jordan Park",
    email: "manager@acme.com",
    role: "manager",
  },
}

export const ROLE_LABELS: Record<Role, string> = {
  employee: "Employee",
  staff: "Support Staff",
  manager: "Manager",
}

export const DEFAULT_LANDING: Record<Role, string> = {
  employee: "/tickets",
  staff: "/queue",
  manager: "/overview",
}

export const getCommentRoleLabel = (role: Role): string => {
  if (role === "staff") return "IT Support"
  if (role === "manager") return "Manager"
  return "Employee"
}
