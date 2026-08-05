"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { BookOpen, Eye, ThumbsDown, ThumbsUp } from "lucide-react"
import { useKbStore } from "@/store/kb-store"

export default function KbArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const articleId = params.id as string
  const articles = useKbStore((s) => s.articles)
  const incrementHelpful = useKbStore((s) => s.incrementHelpful)
  const incrementViews = useKbStore((s) => s.incrementViews)

  const article = articles.find((a) => a.id === articleId)
  const [userVoted, setUserVoted] = useState<boolean | null>(null)

  useEffect(() => {
    if (articleId) {
      incrementViews(articleId)
    }
  }, [articleId, incrementViews])

  if (!article) {
    return (
      <div className="py-12 text-center text-slate-400">
        Article not found. <Link href="/kb" className="text-[#0891B2] underline">Back to Knowledge Base</Link>
      </div>
    )
  }

  const handleVote = (isHelpful: boolean) => {
    if (userVoted !== null) return
    incrementHelpful(article.id, isHelpful)
    setUserVoted(isHelpful)
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
        <Link href="/kb" className="hover:text-[#0891B2] transition-colors font-medium">
          ← Knowledge Base
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-mono text-xs text-slate-400">{article.category}</span>
      </div>

      <div className="bg-white dark:bg-[#14213D] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-cyan-50 dark:bg-[#0891B2]/20 text-[#0891B2] dark:text-[#38BDF8] mb-2">
              {article.category}
            </span>
            <h1 className="text-xl font-bold text-[#0A1F44] dark:text-slate-100 leading-snug">
              {article.title}
            </h1>
          </div>
        </div>

        <div className="prose dark:prose-invert text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap mb-8">
          {article.content}
        </div>

        <div className="bg-slate-50 dark:bg-[#0F1930] rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <BookOpen size={14} className="text-[#0891B2]" />
            <span>Was this article helpful?</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleVote(true)}
              disabled={userVoted !== null}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                userVoted === true
                  ? "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
              }`}
            >
              <ThumbsUp size={12} className="text-emerald-500" />
              Yes ({article.helpfulCount})
            </button>

            <button
              type="button"
              onClick={() => handleVote(false)}
              disabled={userVoted !== null}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                userVoted === false
                  ? "bg-red-100 border-red-300 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
              }`}
            >
              <ThumbsDown size={12} className="text-red-500" />
              No ({article.unhelpfulCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
