import type { CannedResponse, Priority, Role, TicketStatus } from "@/types"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"

export const CATEGORIES = [
  "Software",
  "Hardware",
  "Network",
  "Software Access",
  "Facilities",
  "Other",
] as const

export const DEPARTMENTS = [
  "IT Support",
  "Software Engineering",
  "Network & Security",
  "Human Resources",
  "Facilities & Operations",
] as const

export const PRIORITIES = ["Low", "Medium", "High", "Critical"] as const

export const SLA_HOURS_CONFIG: Record<Priority, number> = {
  Critical: 4,
  High: 12,
  Medium: 24,
  Low: 48,
}

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
    color: "bg-blue-100 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:ring-blue-800",
    icon: AlertCircle,
  },
  "In Progress": {
    label: "In Progress",
    color: "bg-amber-100 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-800",
    icon: Clock,
  },
  Resolved: {
    label: "Resolved",
    color: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800",
    icon: CheckCircle2,
  },
  Overdue: {
    label: "Overdue",
    color: "bg-red-100 text-red-700 ring-1 ring-red-200 dark:bg-red-950/60 dark:text-red-300 dark:ring-red-800",
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
  { name: string; email: string; role: Role; department: string }
> = {
  "employee@acme.com": {
    name: "Sarah Chen",
    email: "employee@acme.com",
    role: "employee",
    department: "Software Engineering",
  },
  "support@acme.com": {
    name: "Marcus Webb",
    email: "support@acme.com",
    role: "staff",
    department: "IT Support",
  },
  "manager@acme.com": {
    name: "Jordan Park",
    email: "manager@acme.com",
    role: "manager",
    department: "Network & Security",
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

export const CANNED_RESPONSES: CannedResponse[] = [
  {
    id: "cr-1",
    title: "Requesting Logs & Error Screenshot",
    category: "General",
    body: "Hi! To help us investigate this issue further, could you please provide a screenshot of the error message along with your system version logs?",
  },
  {
    id: "cr-2",
    title: "VPN Troubleshooting Steps",
    category: "Network",
    body: "Hi! Please try clearing your Cisco AnyConnect credentials, restart the client, and re-select gateway `vpn.acme.com:8443`. Let us know if the issue persists.",
  },
  {
    id: "cr-3",
    title: "Standard Software Access Approval",
    category: "Software Access",
    body: "Hello! Software access requests require line-manager sign-off. I have routed this request to your manager for authorization.",
  },
  {
    id: "cr-4",
    title: "Hardware Replacement Schedule",
    category: "Hardware",
    body: "Hi! We have scheduled a hardware swap at the IT Service Desk (Building B, 2nd floor). Please bring your current device between 9 AM and 4 PM.",
  },
]

