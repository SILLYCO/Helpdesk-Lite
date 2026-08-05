"use client"

import { useState } from "react"
import { AlertCircle, Edit3, X } from "lucide-react"
import { CATEGORIES, DEPARTMENTS, PRIORITIES } from "@/lib/constants"
import type { Priority, TicketItem } from "@/types"

interface EditTicketModalProps {
  ticket: TicketItem
  isOpen: boolean
  onClose: () => void
  onSave: (updates: Partial<Pick<TicketItem, "title" | "description" | "category" | "priority" | "department">>) => void
}

export function EditTicketModal({ ticket, isOpen, onClose, onSave }: EditTicketModalProps) {
  const [title, setTitle] = useState(ticket.title)
  const [description, setDescription] = useState(ticket.description)
  const [category, setCategory] = useState(ticket.category)
  const [priority, setPriority] = useState<Priority>(ticket.priority)
  const [department, setDepartment] = useState(ticket.department || "IT Support")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return
    onSave({ title, description, category, priority, department })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#14213D] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden transition-colors">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 size={16} className="text-[#0891B2]" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-[#0A1F44] dark:text-slate-100">
              Edit Ticket {ticket.id}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label htmlFor="edit-title" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Title
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1930] text-sm text-[#0A1F44] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
              required
            />
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Description
            </label>
            <textarea
              id="edit-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1930] text-sm text-[#0A1F44] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0891B2] resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="edit-category" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Category
              </label>
              <select
                id="edit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1930] text-xs text-[#0A1F44] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="edit-priority" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Priority
              </label>
              <select
                id="edit-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1930] text-xs text-[#0A1F44] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="edit-department" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Department
              </label>
              <select
                id="edit-department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1930] text-xs text-[#0A1F44] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0891B2] hover:bg-[#0780A0] text-white rounded-lg text-xs font-medium transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
