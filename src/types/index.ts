export type Role = "employee" | "staff" | "manager"

export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Overdue"

export type Priority = "Low" | "Medium" | "High" | "Critical"

export type AuditActionType =
  | "created"
  | "status_change"
  | "assigned"
  | "comment_added"
  | "priority_change"
  | "edited"
  | "csat_rated"
  | "sla_breached"
  | "bulk_updated"

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
  department?: string
}

export interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export interface TicketComment {
  id: string
  author: string
  role: string
  body: string
  timestamp: string
  isInternal?: boolean
  attachments?: Attachment[]
}

export interface TicketItem {
  id: string
  title: string
  description: string
  category: string
  department?: string
  priority: Priority
  status: TicketStatus
  submittedBy: string
  submittedDate: string
  assignedTo: string | null
  comments: TicketComment[]
  history: AuditLogEntry[]
  attachments?: Attachment[]
  slaDueDate?: string
  csatRating?: number
  csatFeedback?: string
  relatedTicketIds?: string[]
}

export interface KnowledgeArticle {
  id: string
  title: string
  category: string
  summary: string
  content: string
  tags: string[]
  helpfulCount: number
  unhelpfulCount: number
  views: number
  updatedAt: string
}

export interface NotificationItem {
  id: string
  userId: string
  title: string
  message: string
  ticketId?: string
  read: boolean
  timestamp: string
  type: "status" | "comment" | "assignment" | "sla"
}

export interface CannedResponse {
  id: string
  title: string
  category: string
  body: string
}


