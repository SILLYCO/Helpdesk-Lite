"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Calendar,
  ChevronDown,
  History,
  MessageSquare,
  Send,
  Tag,
  User,
  UserCheck,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { AuditLogTimeline } from "@/components/tickets/AuditLogTimeline"
import { PriorityLabel } from "@/components/tickets/PriorityLabel"
import { StatusBadge } from "@/components/tickets/StatusBadge"
import { STATUS_OPTIONS } from "@/lib/constants"
import { formatDate } from "@/lib/utils"
import { commentSchema, type CommentFormValues } from "@/lib/validations"
import { useAuthStore } from "@/store/auth-store"
import { useTicketStore } from "@/store/ticket-store"
import type { TicketStatus } from "@/types"

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.id as string
  const user = useAuthStore((s) => s.user)
  const tickets = useTicketStore((s) => s.tickets)
  const updateStatus = useTicketStore((s) => s.updateStatus)
  const assignTicket = useTicketStore((s) => s.assignTicket)
  const addComment = useTicketStore((s) => s.addComment)

  const ticket = tickets.find((t) => t.id === ticketId)
  const [newStatus, setNewStatus] = useState<TicketStatus | null>(null)
  const [activeTab, setActiveTab] = useState<"discussion" | "audit">("discussion")

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { body: "" },
  })

  const commentBody = watch("body")

  useEffect(() => {
    if (ticket) {
      setNewStatus(ticket.status)
    }
  }, [ticket])

  useEffect(() => {
    if (!ticket && user) {
      router.replace("/tickets")
    }
  }, [ticket, user, router])

  if (!ticket || !user || !newStatus) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span
          className="w-8 h-8 border-2 border-[#0891B2]/30 border-t-[#0891B2] rounded-full animate-spin"
          role="status"
          aria-label="Loading ticket"
        />
      </div>
    )
  }

  const isEmployee = user.role === "employee"
  const isOwner = ticket.submittedBy === user.name
  const canView = !isEmployee || isOwner
  const canUpdateStatus = user.role === "staff" || user.role === "manager"

  if (!canView) {
    router.replace("/tickets")
    return null
  }

  const handleSaveStatus = () => {
    if (newStatus !== ticket.status) {
      updateStatus(ticket.id, newStatus, user)
    }
  }

  const handleAssignToMe = () => {
    assignTicket(ticket.id, user.name, user)
    setNewStatus("In Progress")
  }

  const handleAddComment = (data: CommentFormValues) => {
    addComment(ticket.id, data.body, user)
    reset()
  }

  const backHref =
    user.role === "manager"
      ? "/overview"
      : user.role === "staff"
        ? "/queue"
        : "/tickets"

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
        <Link
          href={backHref}
          className="hover:text-[#0891B2] transition-colors font-medium"
        >
          ← Back
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-mono text-xs">{ticket.id}</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-7 py-6 mb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={ticket.status} />
              <PriorityLabel priority={ticket.priority} />
            </div>
            <h2 className="text-lg font-semibold text-[#0A1F44] leading-snug">
              {ticket.title}
            </h2>
          </div>

          {canUpdateStatus && (
            <div className="flex items-center gap-2 shrink-0">
              {!ticket.assignedTo && (
                <button
                  type="button"
                  onClick={handleAssignToMe}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0891B2]/10 hover:bg-[#0891B2]/20 text-[#0891B2] text-sm font-semibold transition-colors"
                >
                  <UserCheck size={14} aria-hidden="true" />
                  Assign to me
                </button>
              )}
              <div className="relative">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as TicketStatus)}
                  aria-label="Update ticket status"
                  className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-[#0A1F44] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveStatus}
                disabled={newStatus === ticket.status}
                className="px-4 py-2 bg-[#0A1F44] hover:bg-[#112952] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Update
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100">
          {[
            { label: "Ticket ID", value: ticket.id, icon: Tag, mono: true },
            { label: "Submitted by", value: ticket.submittedBy, icon: User, mono: false },
            {
              label: "Date submitted",
              value: formatDate(ticket.submittedDate),
              icon: Calendar,
              mono: false,
            },
            {
              label: "Assigned to",
              value: ticket.assignedTo ?? "Unassigned",
              icon: UserCheck,
              mono: false,
            },
          ].map(({ label, value, icon: Icon, mono }) => (
            <div key={label}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Icon size={11} aria-hidden="true" />
                {label}
              </p>
              <p
                className={`text-sm font-medium text-[#0A1F44] ${mono ? "font-mono text-xs" : ""}`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-5 items-start">
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-7 py-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Description
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-7 py-6">
            {/* Tabs for Activity vs Audit Log */}
            <div className="flex items-center gap-6 border-b border-slate-100 pb-3 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab("discussion")}
                className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide pb-1.5 transition-colors relative ${
                  activeTab === "discussion"
                    ? "text-[#0891B2]"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <MessageSquare size={13} aria-hidden="true" />
                Discussion ({ticket.comments.length})
                {activeTab === "discussion" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0891B2] rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("audit")}
                className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide pb-1.5 transition-colors relative ${
                  activeTab === "audit"
                    ? "text-[#0891B2]"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <History size={13} aria-hidden="true" />
                Audit Log ({ticket.history?.length || 0})
                {activeTab === "audit" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0891B2] rounded-full" />
                )}
              </button>
            </div>

            {activeTab === "discussion" ? (
              <>
                {ticket.comments.length > 0 ? (
                  <div className="flex flex-col gap-5 mb-5">
                    {ticket.comments.map((c) => (
                      <div key={c.id} className="flex gap-3">
                        <div className="w-7 h-7 bg-[#0A1F44]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <User size={13} className="text-[#0A1F44]" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-sm font-semibold text-[#0A1F44]">
                              {c.author}
                            </span>
                            <span className="text-xs text-slate-400">{c.role}</span>
                            <span className="text-xs text-slate-400 ml-auto">
                              {c.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">{c.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 mb-5 italic">No comments yet.</p>
                )}

                <form
                  onSubmit={handleSubmit(handleAddComment)}
                  className="flex flex-col gap-2.5 pt-4 border-t border-slate-100"
                >
                  <textarea
                    rows={3}
                    placeholder="Add an update or response…"
                    aria-label="Comment body"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-[#0A1F44] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all resize-none"
                    {...register("body")}
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!commentBody?.trim() || isSubmitting}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#0891B2] hover:bg-[#0780A0] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send size={13} aria-hidden="true" />
                      Post Update
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <AuditLogTimeline history={ticket.history || []} />
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-5">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
            Details
          </h3>
          <div className="flex flex-col gap-3.5">
            {[
              { label: "Category", value: ticket.category },
              { label: "Priority", value: ticket.priority },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0"
              >
                <span className="text-xs text-slate-500 font-medium">{label}</span>
                <span className="text-xs font-semibold text-[#0A1F44]">{value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2.5">
              <span className="text-xs text-slate-500 font-medium">Status</span>
              <StatusBadge status={ticket.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

