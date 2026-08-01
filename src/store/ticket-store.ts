import { create } from "zustand"
import { persist } from "zustand/middleware"
import { SEED_TICKETS } from "@/data/seed-tickets"
import { getCommentRoleLabel } from "@/lib/constants"
import { formatTimestamp, generateTicketId } from "@/lib/utils"
import type { Priority, TicketComment, TicketItem, TicketStatus, User } from "@/types"

interface TicketState {
  tickets: TicketItem[]
  addTicket: (data: {
    title: string
    description: string
    category: string
    priority: Priority
    submittedBy: string
  }) => TicketItem
  updateStatus: (id: string, status: TicketStatus) => void
  assignTicket: (id: string, assigneeName: string) => void
  addComment: (id: string, body: string, user: User) => void
  getTicketById: (id: string) => TicketItem | undefined
  resetTickets: () => void
}

export const useTicketStore = create<TicketState>()(
  persist(
    (set, get) => ({
      tickets: SEED_TICKETS,

      addTicket: (data) => {
        const newTicket: TicketItem = {
          id: generateTicketId(get().tickets.map((t) => t.id)),
          title: data.title,
          description: data.description,
          category: data.category,
          priority: data.priority,
          status: "Open",
          submittedBy: data.submittedBy,
          submittedDate: new Date().toISOString().split("T")[0],
          assignedTo: null,
          comments: [],
        }

        set((state) => ({ tickets: [newTicket, ...state.tickets] }))
        return newTicket
      },

      updateStatus: (id, status) => {
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === id ? { ...t, status } : t
          ),
        }))
      },

      assignTicket: (id, assigneeName) => {
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === id
              ? { ...t, assignedTo: assigneeName, status: "In Progress" as TicketStatus }
              : t
          ),
        }))
      },

      addComment: (id, body, user) => {
        const comment: TicketComment = {
          id: `c${Date.now()}`,
          author: user.name,
          role: getCommentRoleLabel(user.role),
          body,
          timestamp: formatTimestamp(),
        }

        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === id ? { ...t, comments: [...t.comments, comment] } : t
          ),
        }))
      },

      getTicketById: (id) => get().tickets.find((t) => t.id === id),

      resetTickets: () => set({ tickets: SEED_TICKETS }),
    }),
    { name: "helpdesk-tickets" }
  )
)
