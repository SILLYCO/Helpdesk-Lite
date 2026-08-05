import { create } from "zustand"
import { persist } from "zustand/middleware"
import { SEED_TICKETS } from "@/data/seed-tickets"
import { getCommentRoleLabel, SLA_HOURS_CONFIG } from "@/lib/constants"
import { formatTimestamp, generateTicketId } from "@/lib/utils"
import type { Attachment, AuditLogEntry, Priority, TicketComment, TicketItem, TicketStatus, User } from "@/types"

interface TicketState {
  tickets: TicketItem[]
  addTicket: (data: {
    title: string
    description: string
    category: string
    department?: string
    priority: Priority
    submittedBy: string
    userRole?: User["role"]
    attachments?: Attachment[]
  }) => TicketItem
  updateStatus: (id: string, status: TicketStatus, user?: User) => void
  assignTicket: (id: string, assigneeName: string, user?: User) => void
  addComment: (id: string, body: string, user: User, isInternal?: boolean, attachments?: Attachment[]) => void
  editTicket: (
    id: string,
    updates: Partial<Pick<TicketItem, "title" | "description" | "category" | "priority" | "department">>,
    user: User
  ) => void
  bulkAssign: (ids: string[], assigneeName: string, user: User) => void
  bulkUpdateStatus: (ids: string[], status: TicketStatus, user: User) => void
  bulkDelete: (ids: string[]) => void
  addCsatRating: (id: string, rating: number, feedback?: string) => void
  linkRelatedTicket: (id: string, targetTicketId: string, user: User) => void
  getTicketById: (id: string) => TicketItem | undefined
  resetTickets: () => void
}

const calculateSlaDueDate = (priority: Priority): string => {
  const hours = SLA_HOURS_CONFIG[priority] || 24
  const date = new Date()
  date.setHours(date.getHours() + hours)
  return date.toISOString()
}

export const useTicketStore = create<TicketState>()(
  persist(
    (set, get) => ({
      tickets: SEED_TICKETS,

      addTicket: (data) => {
        const id = generateTicketId(get().tickets.map((t) => t.id))
        const timestamp = formatTimestamp()
        const userRoleLabel = data.userRole ? getCommentRoleLabel(data.userRole) : "Employee"
        const slaDueDate = calculateSlaDueDate(data.priority)

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
          department: data.department || "IT Support",
          priority: data.priority,
          status: "Open",
          submittedBy: data.submittedBy,
          submittedDate: new Date().toISOString().split("T")[0],
          assignedTo: null,
          comments: [],
          history: [initialAudit],
          attachments: data.attachments || [],
          slaDueDate,
          relatedTicketIds: [],
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

      addComment: (id, body, user, isInternal = false, attachments = []) => {
        const timestamp = formatTimestamp()
        const comment: TicketComment = {
          id: `c${Date.now()}`,
          author: user.name,
          role: getCommentRoleLabel(user.role),
          body,
          timestamp,
          isInternal,
          attachments,
        }

        const commentAudit: AuditLogEntry = {
          id: `h${Date.now()}-comment`,
          ticketId: id,
          action: "comment_added",
          performedBy: user.name,
          role: getCommentRoleLabel(user.role),
          timestamp,
          description: isInternal ? "Added internal note" : "Posted a public comment",
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

      editTicket: (id, updates, user) => {
        const timestamp = formatTimestamp()
        set((state) => ({
          tickets: state.tickets.map((t) => {
            if (t.id !== id) return t

            const changesList: string[] = []
            if (updates.title && updates.title !== t.title) changesList.push(`Title`)
            if (updates.description && updates.description !== t.description) changesList.push(`Description`)
            if (updates.category && updates.category !== t.category) changesList.push(`Category (${updates.category})`)
            if (updates.priority && updates.priority !== t.priority) changesList.push(`Priority (${updates.priority})`)
            if (updates.department && updates.department !== t.department) changesList.push(`Department (${updates.department})`)

            if (changesList.length === 0) return t

            const editAudit: AuditLogEntry = {
              id: `h${Date.now()}-edit`,
              ticketId: id,
              action: "edited",
              performedBy: user.name,
              role: getCommentRoleLabel(user.role),
              timestamp,
              description: `Updated ticket ${changesList.join(", ")}`,
            }

            const updatedSla = updates.priority && updates.priority !== t.priority
              ? calculateSlaDueDate(updates.priority)
              : t.slaDueDate

            return {
              ...t,
              ...updates,
              slaDueDate: updatedSla,
              history: [editAudit, ...(t.history || [])],
            }
          }),
        }))
      },

      bulkAssign: (ids, assigneeName, user) => {
        const timestamp = formatTimestamp()
        set((state) => ({
          tickets: state.tickets.map((t) => {
            if (!ids.includes(t.id)) return t
            const assignAudit: AuditLogEntry = {
              id: `h${Date.now()}-bulkassign`,
              ticketId: t.id,
              action: "bulk_updated",
              performedBy: user.name,
              role: getCommentRoleLabel(user.role),
              timestamp,
              description: `Bulk assigned to ${assigneeName}`,
            }
            return {
              ...t,
              assignedTo: assigneeName,
              status: t.status === "Open" ? "In Progress" : t.status,
              history: [assignAudit, ...(t.history || [])],
            }
          }),
        }))
      },

      bulkUpdateStatus: (ids, status, user) => {
        const timestamp = formatTimestamp()
        set((state) => ({
          tickets: state.tickets.map((t) => {
            if (!ids.includes(t.id)) return t
            const statusAudit: AuditLogEntry = {
              id: `h${Date.now()}-bulkstatus`,
              ticketId: t.id,
              action: "bulk_updated",
              performedBy: user.name,
              role: getCommentRoleLabel(user.role),
              timestamp,
              description: `Bulk updated status to ${status}`,
            }
            return {
              ...t,
              status,
              history: [statusAudit, ...(t.history || [])],
            }
          }),
        }))
      },

      bulkDelete: (ids) => {
        set((state) => ({
          tickets: state.tickets.filter((t) => !ids.includes(t.id)),
        }))
      },

      addCsatRating: (id, rating, feedback) => {
        const timestamp = formatTimestamp()
        set((state) => ({
          tickets: state.tickets.map((t) => {
            if (t.id !== id) return t
            const csatAudit: AuditLogEntry = {
              id: `h${Date.now()}-csat`,
              ticketId: id,
              action: "csat_rated",
              performedBy: t.submittedBy,
              role: "Employee",
              timestamp,
              description: `Submitted ${rating}-star CSAT rating`,
            }
            return {
              ...t,
              csatRating: rating,
              csatFeedback: feedback,
              history: [csatAudit, ...(t.history || [])],
            }
          }),
        }))
      },

      linkRelatedTicket: (id, targetTicketId, user) => {
        const timestamp = formatTimestamp()
        set((state) => ({
          tickets: state.tickets.map((t) => {
            if (t.id !== id) return t
            const existing = t.relatedTicketIds || []
            if (existing.includes(targetTicketId)) return t
            const linkAudit: AuditLogEntry = {
              id: `h${Date.now()}-link`,
              ticketId: id,
              action: "edited",
              performedBy: user.name,
              role: getCommentRoleLabel(user.role),
              timestamp,
              description: `Linked related ticket ${targetTicketId}`,
            }
            return {
              ...t,
              relatedTicketIds: [...existing, targetTicketId],
              history: [linkAudit, ...(t.history || [])],
            }
          }),
        }))
      },

      getTicketById: (id) => get().tickets.find((t) => t.id === id),

      resetTickets: () => set({ tickets: SEED_TICKETS }),
    }),
    { name: "helpdesk-tickets" }
  )
)
