import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { NotificationItem } from "@/types"

interface NotificationState {
  notifications: NotificationItem[]
  addNotification: (notification: Omit<NotificationItem, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: (userId: string) => void
  clearAll: (userId: string) => void
  getUnreadCount: (userId: string) => number
}

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    userId: "Sarah Chen",
    title: "Ticket Status Updated",
    message: "Ticket TKT-1042 status was updated to In Progress by Marcus Webb.",
    ticketId: "TKT-1042",
    read: false,
    timestamp: "2026-07-28 14:32",
    type: "status",
  },
  {
    id: "n-2",
    userId: "Marcus Webb",
    title: "New Ticket Assigned",
    message: "You have been assigned to ticket TKT-1042 (VPN disconnects).",
    ticketId: "TKT-1042",
    read: false,
    timestamp: "2026-07-28 14:30",
    type: "assignment",
  },
]

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: SEED_NOTIFICATIONS,

      addNotification: (data) => {
        const newNotif: NotificationItem = {
          ...data,
          id: `n-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
        }
        set((state) => ({ notifications: [newNotif, ...state.notifications] }))
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }))
      },

      markAllAsRead: (userId) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.userId === userId ? { ...n, read: true } : n
          ),
        }))
      },

      clearAll: (userId) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.userId !== userId),
        }))
      },

      getUnreadCount: (userId) => {
        return get().notifications.filter((n) => n.userId === userId && !n.read).length
      },
    }),
    { name: "helpdesk-notifications" }
  )
)
