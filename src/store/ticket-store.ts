import { create } from "zustand"
import { persist } from "zustand/middleware"
import { SEED_TICKETS } from "@/data/seed-tickets"
import { getCommentRoleLabel } from "@/lib/constants"
import { formatTimestamp, generateTicketId } from "@/lib/utils"
import type { AuditLogEntry, Priority, TicketComment, TicketItem, TicketStatus, User } from "@/types"

interface TicketState {
  tickets: TicketItem[]
  addTicket: (data: {
    title: string
    description: string
    category: string
    priority: Priority
    submittedBy: string
    userRole?: User["role"]
  }) => TicketItem
  updateStatus: (id: string, status: TicketStatus, user?: User) => void
  assignTicket: (id: string, assigneeName: string, user?: User) => void
  addComment: (id: string, body: string, user: User) => void
  getTicketById: (id: string) => TicketItem | undefined
  resetTickets: () => void
}

export const useTicketStore = create<TicketState>()(
  persist(
    (set, get) => ({
      tickets: SEED_TICKETS,

      addTicket: (data) => {
        const id = generateTicketId(get().tickets.map((t) => t.id))
        const timestamp = formatTimestamp()
        const userRoleLabel = data.userRole ? getCommentRoleLabel(data.userRole) : "Employee"

        const initialAudit: AuditLogEntry = {
          id: `h${Date.now()}-created`,
          ticketId: id,
          action: "created",
          performedBy: data.submittedBy,
          role: userRoleLabel,
          timestamp,
          description: "Created support ticket",
        }

        const newTicket: TicketItem = {
          id,
          title: data.title,
          description: data.description,
          category: data.category,
          priority: data.priority,
          status: "Open",
          submittedBy: data.submittedBy,
          submittedDate: new Date().toISOString().split("T")[0],
          assignedTo: null,
          comments: [],
          history: [initialAudit],
        }

        set((state) => ({ tickets: [newTicket, ...state.tickets] }))
        return newTicket
      },

      updateStatus: (id, status, user) => {
        const timestamp = formatTimestamp()
        set((state) => ({
          tickets: state.tickets.map((t) => {
            if (t.id !== id || t.status === status) return t
            const oldStatus = t.status
            const performerName = user ? user.name : "System"
            const performerRole = user ? getCommentRoleLabel(user.role) : "System"

            const auditEntry: AuditLogEntry = {
              id: `h${Date.now()}-status`,
              ticketId: id,
              action: "status_change",
              performedBy: performerName,
              role: performerRole,
              timestamp,
              description: `Changed status from ${oldStatus} to ${status}`,
              changes: { field: "status", oldValue: oldStatus, newValue: status },
            }

            return {
              ...t,
              status,
              history: [auditEntry, ...(t.history || [])],
            }
          }),
        }))
      },

      assignTicket: (id, assigneeName, user) => {
        const timestamp = formatTimestamp()
        set((state) => ({
          tickets: state.tickets.map((t) => {
            if (t.id !== id) return t
            const oldAssignee = t.assignedTo
            const oldStatus = t.status
            const newStatus: TicketStatus = t.status === "Open" ? "In Progress" : t.status
            const performerName = user ? user.name : assigneeName
            const performerRole = user ? getCommentRoleLabel(user.role) : "IT Support"

            const newHistory = [...(t.history || [])]

            const assignAudit: AuditLogEntry = {
              id: `h${Date.now()}-assign`,
              ticketId: id,
              action: "assigned",
              performedBy: performerName,
              role: performerRole,
              timestamp,
              description: `Assigned ticket to ${assigneeName}`,
              changes: { field: "assignedTo", oldValue: oldAssignee, newValue: assigneeName },
            }
            newHistory.unshift(assignAudit)

            if (oldStatus !== newStatus) {
              const statusAudit: AuditLogEntry = {
                id: `h${Date.now()}-status`,
                ticketId: id,
                action: "status_change",
                performedBy: performerName,
                role: performerRole,
                timestamp,
                description: `Changed status from ${oldStatus} to ${newStatus}`,
                changes: { field: "status", oldValue: oldStatus, newValue: newStatus },
              }
              newHistory.unshift(statusAudit)
            }

            return {
              ...t,
              assignedTo: assigneeName,
              status: newStatus,
              history: newHistory,
            }
          }),
        }))
      },

      addComment: (id, body, user) => {
        const timestamp = formatTimestamp()
        const comment: TicketComment = {
          id: `c${Date.now()}`,
          author: user.name,
          role: getCommentRoleLabel(user.role),
          body,
          timestamp,
        }

        const commentAudit: AuditLogEntry = {
          id: `h${Date.now()}-comment`,
          ticketId: id,
          action: "comment_added",
          performedBy: user.name,
          role: getCommentRoleLabel(user.role),
          timestamp,
          description: "Posted a comment",
        }

        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === id
              ? {
                  ...t,
                  comments: [...t.comments, comment],
                  history: [commentAudit, ...(t.history || [])],
                }
              : t
          ),
        }))
      },

      getTicketById: (id) => get().tickets.find((t) => t.id === id),

      resetTickets: () => set({ tickets: SEED_TICKETS }),
    }),
    { name: "helpdesk-tickets" }
  )
)

