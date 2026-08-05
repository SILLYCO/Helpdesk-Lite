"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, CheckCheck, Clock, Trash2, X } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { useNotificationStore } from "@/store/notification-store"

export function NotificationBell() {
  const user = useAuthStore((s) => s.user)
  const notifications = useNotificationStore((s) => s.notifications)
  const markAsRead = useNotificationStore((s) => s.markAsRead)
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead)
  const clearAll = useNotificationStore((s) => s.clearAll)
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const userNotifs = notifications.filter((n) => n.userId === user.name || n.userId === user.email || n.userId === "all")
  const unreadCount = userNotifs.filter((n) => !n.read).length

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-500 hover:text-[#0A1F44] dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
        aria-label="View notifications"
      >
        <Bell size={18} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#14213D] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={15} className="text-[#0891B2]" aria-hidden="true" />
              <h4 className="text-xs font-semibold text-[#0A1F44] dark:text-slate-100 uppercase tracking-wide">
                Notifications ({unreadCount} new)
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllAsRead(user.name)}
                  className="text-[11px] text-[#0891B2] hover:underline flex items-center gap-1"
                >
                  <CheckCheck size={12} /> Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {userNotifs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 italic">
                No notifications.
              </div>
            ) : (
              userNotifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markAsRead(n.id)
                    setIsOpen(false)
                  }}
                  className={`p-3.5 text-xs transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                    !n.read ? "bg-cyan-50/40 dark:bg-[#0891B2]/10 font-medium" : "opacity-80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-[#0A1F44] dark:text-slate-100">
                      {n.title}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Clock size={10} /> {n.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-snug">{n.message}</p>
                  {n.ticketId && (
                    <Link
                      href={`/tickets/${n.ticketId}`}
                      className="inline-block mt-1.5 font-mono text-[11px] text-[#0891B2] hover:underline"
                    >
                      View Ticket {n.ticketId} →
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>

          {userNotifs.length > 0 && (
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1930] flex justify-end">
              <button
                type="button"
                onClick={() => clearAll(user.name)}
                className="text-[11px] text-slate-500 hover:text-red-500 flex items-center gap-1"
              >
                <Trash2 size={11} /> Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
