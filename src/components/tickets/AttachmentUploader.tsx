"use client"

import { useRef, useState } from "react"
import { FileText, Paperclip, X } from "lucide-react"
import type { Attachment } from "@/types"

interface AttachmentUploaderProps {
  attachments: Attachment[]
  onChange: (attachments: Attachment[]) => void
}

export function AttachmentUploader({ attachments, onChange }: AttachmentUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const newFiles = Array.from(e.target.files).map((file) => ({
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      url: URL.createObjectURL(file),
    }))

    onChange([...attachments, ...newFiles])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleRemove = (id: string) => {
    onChange(attachments.filter((a) => a.id !== id))
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        id="file-upload-input"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0F1930] hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors w-fit"
      >
        <Paperclip size={13} className="text-[#0891B2]" aria-hidden="true" />
        Attach Files / Screenshots
      </button>

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs border border-slate-200 dark:border-slate-700"
            >
              <FileText size={12} className="text-[#0891B2]" />
              <span className="max-w-[140px] truncate">{att.name}</span>
              <span className="text-[10px] text-slate-400">({Math.round(att.size / 1024)} KB)</span>
              <button
                type="button"
                onClick={() => handleRemove(att.id)}
                className="text-slate-400 hover:text-red-500 ml-1"
                aria-label={`Remove ${att.name}`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
