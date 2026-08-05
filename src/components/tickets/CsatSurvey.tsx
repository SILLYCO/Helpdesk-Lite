"use client"

import { useState } from "react"
import { Star, ThumbsUp } from "lucide-react"

interface CsatSurveyProps {
  initialRating?: number
  initialFeedback?: string
  onSubmitRating: (rating: number, feedback?: string) => void
}

export function CsatSurvey({ initialRating, initialFeedback, onSubmitRating }: CsatSurveyProps) {
  const [rating, setRating] = useState<number>(initialRating || 0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [feedback, setFeedback] = useState<string>(initialFeedback || "")
  const [submitted, setSubmitted] = useState<boolean>(!!initialRating)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return
    onSubmitRating(rating, feedback)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ThumbsUp size={16} className="text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="font-semibold">Thank you for rating our support!</p>
            <p className="text-[11px] opacity-80">Your feedback helps us continuously improve our service.</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              className={star <= (initialRating || rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-cyan-50/70 dark:bg-[#0F1930] border border-cyan-200/80 dark:border-slate-800 rounded-xl p-4 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-[#0A1F44] dark:text-slate-100 uppercase tracking-wide">
          How satisfied were you with the resolution?
        </h4>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="p-0.5 focus:outline-none"
              aria-label={`Rate ${star} out of 5 stars`}
            >
              <Star
                size={18}
                className={`transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-amber-400 text-amber-400 scale-110"
                    : "text-slate-300 dark:text-slate-600"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {rating > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          <textarea
            rows={2}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Optional feedback or comments on support..."
            aria-label="CSAT feedback"
            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#14213D] text-xs text-[#0A1F44] dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0891B2]"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-3 py-1 bg-[#0891B2] hover:bg-[#0780A0] text-white rounded-md text-xs font-medium transition-colors"
            >
              Submit Rating
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
