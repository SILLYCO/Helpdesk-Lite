"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, ChevronDown, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { PageHeader } from "@/components/layout/PageHeader"
import { CATEGORIES, PRIORITIES } from "@/lib/constants"
import { submitTicketSchema, type SubmitTicketFormValues } from "@/lib/validations"
import { useAuthStore } from "@/store/auth-store"
import { useTicketStore } from "@/store/ticket-store"

export default function SubmitTicketPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const addTicket = useTicketStore((s) => s.addTicket)
  const [submitted, setSubmitted] = useState(false)
  const [newTicketId, setNewTicketId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
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

  const handleFormSubmit = (data: SubmitTicketFormValues) => {
    if (!user) return

    const ticket = addTicket({
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      submittedBy: user.name,
    })

    setNewTicketId(ticket.id)
    setSubmitted(true)
  }

  const handleSubmitAnother = () => {
    reset()
    setSubmitted(false)
    setNewTicketId(null)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle2 size={32} className="text-emerald-600" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold text-[#0A1F44]">Ticket Submitted</h2>
        <p className="text-sm text-slate-500 text-center max-w-xs">
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
            className="px-5 py-2 bg-[#0A1F44] text-white rounded-lg text-sm font-medium hover:bg-[#112952] transition-colors"
          >
            Submit Another
          </button>
          {newTicketId && (
            <button
              type="button"
              onClick={() => router.push(`/tickets/${newTicketId}`)}
              className="px-5 py-2 border border-slate-200 text-[#0A1F44] rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              View Ticket
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <PageHeader
        title="Submit a Support Ticket"
        subtitle="Describe your issue and we'll get back to you shortly."
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-7 py-7">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5" noValidate>
          <div>
            <label
              htmlFor="title"
              className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5"
            >
              Ticket Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="Brief summary of your issue"
              aria-invalid={!!errors.title}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-[#0A1F44] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={5}
              placeholder="Describe the problem in detail. Include any error messages, steps to reproduce, and how it affects your work."
              aria-invalid={!!errors.description}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-[#0A1F44] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="category"
                  aria-invalid={!!errors.category}
                  className="w-full appearance-none px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-[#0A1F44] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all pr-8"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
              {errors.category && (
                <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5"
              >
                Priority
              </label>
              <div className="relative">
                <select
                  id="priority"
                  className="w-full appearance-none px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-[#0A1F44] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all pr-8"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Fields marked <span className="text-red-500">*</span> are required
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#0A1F44] hover:bg-[#112952] text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              <Send size={14} aria-hidden="true" />
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
