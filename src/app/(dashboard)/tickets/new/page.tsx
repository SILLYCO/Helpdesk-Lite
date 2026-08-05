"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, ChevronDown, Send } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { AttachmentUploader } from "@/components/tickets/AttachmentUploader"
import { KbDeflectionBox } from "@/components/kb/KbDeflectionBox"
import { CATEGORIES, DEPARTMENTS, PRIORITIES } from "@/lib/constants"
import { submitTicketSchema, type SubmitTicketFormValues } from "@/lib/validations"
import { useAuthStore } from "@/store/auth-store"
import { useTicketStore } from "@/store/ticket-store"
import type { Attachment } from "@/types"

export default function SubmitTicketPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const addTicket = useTicketStore((s) => s.addTicket)
  const [submitted, setSubmitted] = useState(false)
  const [newTicketId, setNewTicketId] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [department, setDepartment] = useState<string>("IT Support")

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SubmitTicketFormValues>({
    resolver: zodResolver(submitTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      category: undefined,
      priority: "Medium",
    },
  })

  const watchTitle = watch("title")
  const watchDescription = watch("description")

  const handleFormSubmit = (data: SubmitTicketFormValues) => {
    if (!user) return

    const ticket = addTicket({
      title: data.title,
      description: data.description,
      category: data.category,
      department,
      priority: data.priority,
      submittedBy: user.name,
      userRole: user.role,
      attachments,
    })

    setNewTicketId(ticket.id)
    setSubmitted(true)
  }

  const handleSubmitAnother = () => {
    reset()
    setAttachments([])
    setSubmitted(false)
    setNewTicketId(null)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center">
          <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold text-[#0A1F44] dark:text-slate-100">Ticket Submitted</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs">
          Your support request has been received. Our team will respond within 1 business day.
          {newTicketId && (
            <>
              {" "}
              Reference: <span className="font-mono font-medium">{newTicketId}</span>
            </>
          )}
        </p>
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={handleSubmitAnother}
            className="px-5 py-2 bg-[#0A1F44] dark:bg-[#0891B2] text-white rounded-lg text-sm font-medium hover:bg-[#112952] transition-colors"
          >
            Submit Another
          </button>
          {newTicketId && (
            <button
              type="button"
              onClick={() => router.push(`/tickets/${newTicketId}`)}
              className="px-5 py-2 border border-slate-200 dark:border-slate-800 text-[#0A1F44] dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              View Ticket
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Submit a Support Ticket"
        subtitle="Describe your issue and we'll get back to you shortly."
      />

      <div className="flex flex-col gap-5">
        <KbDeflectionBox title={watchTitle || ""} description={watchDescription || ""} />

        <div className="bg-white dark:bg-[#14213D] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm px-7 py-7 transition-colors">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5" noValidate>
            <div>
              <label
                htmlFor="title"
                className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5"
              >
                Ticket Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="Brief summary of your issue"
                aria-invalid={!!errors.title}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1930] text-sm text-[#0A1F44] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={5}
                placeholder="Describe the problem in detail. Include any error messages, steps to reproduce, and how it affects your work."
                aria-invalid={!!errors.description}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1930] text-sm text-[#0A1F44] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all resize-none"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="category"
                  className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="category"
                    aria-invalid={!!errors.category}
                    className="w-full appearance-none px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1930] text-sm text-[#0A1F44] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all pr-8"
                    {...register("category")}
                  >
                    <option value="">Select…</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
                {errors.category && (
                  <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5"
                >
                  Department
                </label>
                <div className="relative">
                  <select
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full appearance-none px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1930] text-sm text-[#0A1F44] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all pr-8"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5"
                >
                  Priority
                </label>
                <div className="relative">
                  <select
                    id="priority"
                    className="w-full appearance-none px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1930] text-sm text-[#0A1F44] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all pr-8"
                    {...register("priority")}
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                Attachments
              </label>
              <AttachmentUploader attachments={attachments} onChange={setAttachments} />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Fields marked <span className="text-red-500">*</span> are required
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#0A1F44] dark:bg-[#0891B2] hover:bg-[#112952] dark:hover:bg-[#0780A0] text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                <Send size={14} aria-hidden="true" />
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
