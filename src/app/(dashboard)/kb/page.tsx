"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { BookOpen, Eye, Search, ThumbsUp, Tag } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { CATEGORIES } from "@/lib/constants"
import { useKbStore } from "@/store/kb-store"

export default function KnowledgeBasePage() {
  const articles = useKbStore((s) => s.articles)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchSearch =
        !search ||
        art.title.toLowerCase().includes(search.toLowerCase()) ||
        art.summary.toLowerCase().includes(search.toLowerCase()) ||
        art.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      const matchCategory = selectedCategory === "All" || art.category === selectedCategory
      return matchSearch && matchCategory
    })
  }, [articles, search, selectedCategory])

  return (
    <div>
      <PageHeader
        title="Knowledge Base & Self-Service"
        subtitle="Browse help guides, troubleshooting steps, and standard operating procedures."
      />

      <div className="bg-white dark:bg-[#14213D] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between transition-colors">
        <div className="relative flex-1 w-full">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help articles by topic, keyword, or tag (e.g. VPN, Figma, MFA)…"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1930] text-sm text-[#0A1F44] dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === "All"
                ? "bg-[#0891B2] text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            All Topics
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-[#0891B2] text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
            No knowledge base articles found matching your search.
          </div>
        ) : (
          filteredArticles.map((art) => (
            <Link
              key={art.id}
              href={`/kb/${art.id}`}
              className="bg-white dark:bg-[#14213D] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 hover:border-[#0891B2] transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0891B2] dark:text-[#38BDF8] bg-cyan-50 dark:bg-[#0891B2]/15 px-2 py-0.5 rounded-md">
                    <Tag size={10} /> {art.category}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">Updated {art.updatedAt}</span>
                </div>
                <h3 className="text-base font-semibold text-[#0A1F44] dark:text-slate-100 group-hover:text-[#0891B2] transition-colors leading-snug mb-1.5">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {art.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={12} className="text-emerald-500" /> {art.helpfulCount} helpful
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> {art.views} views
                  </span>
                </div>
                <span className="font-semibold text-[#0891B2] dark:text-[#38BDF8] group-hover:underline flex items-center gap-1">
                  <BookOpen size={12} /> Read Article →
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
