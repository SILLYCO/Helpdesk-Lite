"use client"

import { useMemo } from "react"
import Link from "next/link"
import { BookOpen, ExternalLink, HelpCircle } from "lucide-react"
import { SEED_KB_ARTICLES } from "@/data/seed-kb"

interface KbDeflectionBoxProps {
  title: string
  description: string
}

export function KbDeflectionBox({ title, description }: KbDeflectionBoxProps) {
  const matchingArticles = useMemo(() => {
    const query = `${title} ${description}`.toLowerCase()
    if (query.trim().length < 4) return []

    return SEED_KB_ARTICLES.filter((article) => {
      const matchTitle = article.title.toLowerCase().includes(query) || query.split(" ").some((w) => w.length > 3 && article.title.toLowerCase().includes(w))
      const matchSummary = article.summary.toLowerCase().includes(query)
      const matchTag = article.tags.some((t) => query.includes(t.toLowerCase()))
      return matchTitle || matchSummary || matchTag
    }).slice(0, 3)
  }, [title, description])

  if (matchingArticles.length === 0) return null

  return (
    <div className="bg-cyan-50/80 dark:bg-[#0891B2]/10 border border-cyan-200 dark:border-[#0891B2]/30 rounded-xl p-4 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle size={16} className="text-[#0891B2] shrink-0" aria-hidden="true" />
        <h4 className="text-xs font-semibold text-[#0A1F44] dark:text-slate-100 uppercase tracking-wide">
          Suggested Knowledge Base Solutions
        </h4>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
        Before submitting your ticket, check if one of these self-service guides resolves your issue:
      </p>

      <div className="flex flex-col gap-2">
        {matchingArticles.map((art) => (
          <Link
            key={art.id}
            href={`/kb/${art.id}`}
            target="_blank"
            className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-white dark:bg-[#14213D] border border-cyan-100 dark:border-slate-800 hover:border-[#0891B2] transition-colors group"
          >
            <div>
              <p className="text-xs font-semibold text-[#0A1F44] dark:text-slate-100 group-hover:text-[#0891B2] transition-colors flex items-center gap-1.5">
                <BookOpen size={12} className="text-[#0891B2]" />
                {art.title}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {art.summary}
              </p>
            </div>
            <ExternalLink size={12} className="text-slate-400 group-hover:text-[#0891B2] shrink-0 mt-0.5" />
          </Link>
        ))}
      </div>
    </div>
  )
}
