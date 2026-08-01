export type Role = "employee" | "staff" | "manager"

export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Overdue"

export type Priority = "Low" | "Medium" | "High" | "Critical"

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
}
