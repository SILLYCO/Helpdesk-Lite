export type Role = "employee" | "staff" | "manager"

export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Overdue"

export type Priority = "Low" | "Medium" | "High" | "Critical"

export type AuditActionType =
  | "created"
  | "status_change"
  | "assigned"
  | "comment_added"
  | "priority_change"

export interface AuditFieldChange {
  field: string
  oldValue?: string | null
  newValue?: string | null
}

export interface AuditLogEntry {
  id: string
  ticketId: string
  action: AuditActionType
  performedBy: string
  role: string
  timestamp: string
  description: string
  changes?: AuditFieldChange
}

export interface User {
  name: string
  email: string
  role: Role
}

export interface TicketComment {
  id: string
  author: string
  role: string
  body: string
  timestamp: string
}

export interface TicketItem {
  id: string
  title: string
  description: string
  category: string
  priority: Priority
  status: TicketStatus
  submittedBy: string
  submittedDate: string
  assignedTo: string | null
  comments: TicketComment[]
  history: AuditLogEntry[]
}

