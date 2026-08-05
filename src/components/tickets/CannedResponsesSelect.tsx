"use client"

import { MessageSquareText } from "lucide-react"
import { CANNED_RESPONSES } from "@/lib/constants"

interface CannedResponsesSelectProps {
  onSelect: (body: string) => void
}

export function CannedResponsesSelect({ onSelect }: CannedResponsesSelectProps) {
  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-1 text-xs text-[#0891B2]">
        <MessageSquareText size={13} aria-hidden="true" />
        <select
          onChange={(e) => {
            if (e.target.value) {
              onSelect(e.target.value)
              e.target.value = ""
            }
          }}
          defaultValue=""
          aria-label="Insert canned response template"
          className="bg-transparent text-xs text-[#0891B2] dark:text-[#38BDF8] font-medium hover:underline cursor-pointer focus:outline-none"
        >
          <option value="" disabled>
            Insert Canned Response…
          </option>
          {CANNED_RESPONSES.map((cr) => (
            <option key={cr.id} value={cr.body} className="text-slate-800 dark:text-slate-200 bg-white dark:bg-[#14213D]">
              [{cr.category}] {cr.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
