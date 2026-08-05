"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Calendar,
  ChevronDown,
  Edit3,
  FileText,
  History,
  Lock,
  MessageSquare,
  Paperclip,
  Send,
  Tag,
  User,
  UserCheck,
} from "lucide-react"
import { AuditLogTimeline } from "@/components/tickets/AuditLogTimeline"
import { CannedResponsesSelect } from "@/components/tickets/CannedResponsesSelect"
import { CsatSurvey } from "@/components/tickets/CsatSurvey"
import { EditTicketModal } from "@/components/tickets/EditTicketModal"
import { PriorityLabel } from "@/components/tickets/PriorityLabel"
import { SlaBadge } from "@/components/tickets/SlaBadge"
import { StatusBadge } from "@/components/tickets/StatusBadge"
import { STATUS_OPTIONS } from "@/lib/constants"
import { formatDate } from "@/lib/utils"
import { commentSchema, type CommentFormValues } from "@/lib/validations"
import { useAuthStore } from "@/store/auth-store"
import { useNotificationStore } from "@/store/notification-store"
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
  const editTicket = useTicketStore((s) => s.editTicket)
  const addCsatRating = useTicketStore((s) => s.addCsatRating)
  const linkRelatedTicket = useTicketStore((s) => s.linkRelatedTicket)
  const addNotification = useNotificationStore((s) => s.addNotification)

  const ticket = tickets.find((t) => t.id === ticketId)
  const [newStatus, setNewStatus] = useState<TicketStatus | null>(null)
  const [activeTab, setActiveTab] = useState<"discussion" | "audit">("discussion")
  const [isInternalNote, setIsInternalNote] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [relatedInput, setRelatedInput] = useState<string>("")

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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
  const isStaffOrManager = user.role === "staff" || user.role === "manager"
  const isOwner = ticket.submittedBy === user.name
  const canView = !isEmployee || isOwner
  const canUpdateStatus = isStaffOrManager

  if (!canView) {
    router.replace("/tickets")
    return null
  }

  const handleSaveStatus = () => {
    if (newStatus !== ticket.status) {
      updateStatus(ticket.id, newStatus, user)
      addNotification({
        userId: ticket.submittedBy,
        title: `Ticket Status Updated`,
        message: `Ticket ${ticket.id} status was changed to ${newStatus} by ${user.name}`,
        ticketId: ticket.id,
        type: "status",
      })
    }
  }

  const handleAssignToMe = () => {
    assignTicket(ticket.id, user.name, user)
    setNewStatus("In Progress")
    addNotification({
      userId: ticket.submittedBy,
      title: `Agent Assigned`,
      message: `Ticket ${ticket.id} was assigned to ${user.name}`,
      ticketId: ticket.id,
      type: "assignment",
    })
  }

  const handleAddComment = (data: CommentFormValues) => {
    addComment(ticket.id, data.body, user, isInternalNote)
    if (!isInternalNote && user.name !== ticket.submittedBy) {
      addNotification({
        userId: ticket.submittedBy,
        title: `New Comment on Ticket`,
        message: `${user.name} commented on ticket ${ticket.id}`,
        ticketId: ticket.id,
        type: "comment",
      })
    }
    reset()
  }

  const handleEditSave = (updates: any) => {
    editTicket(ticket.id, updates, user)
  }

  const handleLinkTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!relatedInput.trim()) return
    linkRelatedTicket(ticket.id, relatedInput.trim().toUpperCase(), user)
    setRelatedInput("")
  }

  const backHref =
    user.role === "manager"
      ? "/overview"
      : user.role === "staff"
        ? "/queue"
        : "/tickets"

  const visibleComments = isStaffOrManager
    ? ticket.comments
    : ticket.comments.filter((c) => !c.isInternal)

  return (
    <div>
      <EditTicketModal
        ticket={ticket}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
      />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link
            href={backHref}
            className="hover:text-[#0891B2] transition-colors font-medium"
          >
            ← Back
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-mono text-xs">{ticket.id}</span>
        </div>

        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#14213D] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-[#0A1F44] dark:text-slate-200 transition-colors"
        >
          <Edit3 size={13} className="text-[#0891B2]" /> Edit Ticket
        </button>
      </div>

      <div className="bg-white dark:bg-[#14213D] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm px-7 py-6 mb-5 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <StatusBadge status={ticket.status} />
              <PriorityLabel priority={ticket.priority} />
              <SlaBadge priority={ticket.priority} status={ticket.status} slaDueDate={ticket.slaDueDate} />
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Dept: {ticket.department || "IT Support"}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-[#0A1F44] dark:text-slate-100 leading-snug">
              {ticket.title}
            </h2>
          </div>

          {canUpdateStatus && (
            <div className="flex items-center gap-2 shrink-0">
              {!ticket.assignedTo && (
                <button
                  type="button"
                  onClick={handleAssignToMe}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0891B2]/10 dark:bg-[#0891B2]/20 hover:bg-[#0891B2]/20 dark:hover:bg-[#0891B2]/30 text-[#0891B2] dark:text-[#38BDF8] text-sm font-semibold transition-colors"
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
                  className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1930] text-sm text-[#0A1F44] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveStatus}
                disabled={newStatus === ticket.status}
                className="px-4 py-2 bg-[#0A1F44] dark:bg-[#0891B2] hover:bg-[#112952] dark:hover:bg-[#0780A0] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Update
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
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
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Icon size={11} aria-hidden="true" />
                {label}
              </p>
              <p
                className={`text-sm font-medium text-[#0A1F44] dark:text-slate-200 ${mono ? "font-mono text-xs" : ""}`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {isEmployee && ticket.status === "Resolved" && (
        <div className="mb-5">
          <CsatSurvey
            initialRating={ticket.csatRating}
            initialFeedback={ticket.csatFeedback}
            onSubmitRating={(rating, feedback) => addCsatRating(ticket.id, rating, feedback)}
          />
        </div>
      )}

      <div className="grid grid-cols-[1fr_320px] gap-5 items-start">
        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-[#14213D] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm px-7 py-6 transition-colors">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
              Description
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>

            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-2 flex items-center gap-1">
                  <Paperclip size={12} /> Attachments ({ticket.attachments.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {ticket.attachments.map((att) => (
                    <a
                      key={att.id}
                      href={att.url}
                      download={att.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0F1930] border border-slate-200 dark:border-slate-800 text-xs text-[#0891B2] dark:text-[#38BDF8] hover:underline"
                    >
                      <FileText size={13} />
                      <span className="font-medium">{att.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#14213D] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm px-7 py-6 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("discussion")}
                  className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide pb-1.5 transition-colors relative ${
                    activeTab === "discussion"
                      ? "text-[#0891B2] dark:text-[#38BDF8]"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  <MessageSquare size={13} aria-hidden="true" />
                  Discussion ({visibleComments.length})
                  {activeTab === "discussion" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0891B2] dark:bg-[#38BDF8] rounded-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("audit")}
                  className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide pb-1.5 transition-colors relative ${
                    activeTab === "audit"
                      ? "text-[#0891B2] dark:text-[#38BDF8]"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  <History size={13} aria-hidden="true" />
                  Audit Log ({ticket.history?.length || 0})
                  {activeTab === "audit" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0891B2] dark:bg-[#38BDF8] rounded-full" />
                  )}
                </button>
              </div>

              {isStaffOrManager && activeTab === "discussion" && (
                <CannedResponsesSelect onSelect={(text) => setValue("body", text)} />
              )}
            </div>

            {activeTab === "discussion" ? (
              <>
                {visibleComments.length > 0 ? (
                  <div className="flex flex-col gap-5 mb-5">
                    {visibleComments.map((c) => (
                      <div
                        key={c.id}
                        className={`flex gap-3 p-3 rounded-xl transition-colors ${
                          c.isInternal
                            ? "bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60"
                            : ""
                        }`}
                      >
                        <div className="w-7 h-7 bg-[#0A1F44]/10 dark:bg-slate-700/60 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <User size={13} className="text-[#0A1F44] dark:text-slate-200" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-sm font-semibold text-[#0A1F44] dark:text-slate-100">
                              {c.author}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">{c.role}</span>
                            {c.isInternal && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                                <Lock size={9} /> Internal Staff Note
                              </span>
                            )}
                            <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">
                              {c.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{c.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 dark:text-slate-500 mb-5 italic">No comments yet.</p>
                )}

                <form
                  onSubmit={handleSubmit(handleAddComment)}
                  className="flex flex-col gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800"
                >
                  {isStaffOrManager && (
                    <div className="flex items-center gap-4 text-xs mb-1">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="noteType"
                          checked={!isInternalNote}
                          onChange={() => setIsInternalNote(false)}
                          className="text-[#0891B2]"
                        />
                        <span className="font-medium text-slate-700 dark:text-slate-300">Public Reply</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-amber-700 dark:text-amber-400">
                        <input
                          type="radio"
                          name="noteType"
                          checked={isInternalNote}
                          onChange={() => setIsInternalNote(true)}
                          className="text-amber-600"
                        />
                        <span className="font-semibold flex items-center gap-1">
                          <Lock size={11} /> Internal Staff Note (Staff Only)
                        </span>
                      </label>
                    </div>
                  )}

                  <textarea
                    rows={3}
                    placeholder={
                      isInternalNote
                        ? "Write an internal note for staff members only…"
                        : "Add an update or response…"
                    }
                    aria-label="Comment body"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#0A1F44] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                      isInternalNote
                        ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 focus:ring-amber-500"
                        : "bg-slate-50 dark:bg-[#0F1930] border-slate-200 dark:border-slate-800 focus:ring-[#0891B2]/30 focus:border-[#0891B2]"
                    }`}
                    {...register("body")}
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!commentBody?.trim() || isSubmitting}
                      className={`flex items-center gap-1.5 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                        isInternalNote
                          ? "bg-amber-600 hover:bg-amber-700"
                          : "bg-[#0891B2] hover:bg-[#0780A0]"
                      }`}
                    >
                      <Send size={13} aria-hidden="true" />
                      {isInternalNote ? "Post Internal Note" : "Post Update"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <AuditLogTimeline history={ticket.history || []} />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-[#14213D] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm px-5 py-5 transition-colors">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">
              Details
            </h3>
            <div className="flex flex-col gap-3.5">
              {[
                { label: "Category", value: ticket.category },
                { label: "Department", value: ticket.department || "IT Support" },
                { label: "Priority", value: ticket.priority },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/80 last:border-0"
                >
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</span>
                  <span className="text-xs font-semibold text-[#0A1F44] dark:text-slate-200">{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Status</span>
                <StatusBadge status={ticket.status} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#14213D] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm px-5 py-5 transition-colors">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
              Related Tickets
            </h3>

            {ticket.relatedTicketIds && ticket.relatedTicketIds.length > 0 ? (
              <div className="flex flex-col gap-1.5 mb-3">
                {ticket.relatedTicketIds.map((relId) => (
                  <Link
                    key={relId}
                    href={`/tickets/${relId}`}
                    className="text-xs font-mono text-[#0891B2] dark:text-[#38BDF8] hover:underline flex items-center gap-1"
                  >
                    🔗 {relId}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic mb-3">No related tickets linked.</p>
            )}

            <form onSubmit={handleLinkTicketSubmit} className="flex gap-2">
              <input
                type="text"
                value={relatedInput}
                onChange={(e) => setRelatedInput(e.target.value)}
                placeholder="Link TKT-#…"
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1930] text-xs font-mono text-[#0A1F44] dark:text-slate-100 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
              >
                Link
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
