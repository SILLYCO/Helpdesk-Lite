import { create } from "zustand"
import { persist } from "zustand/middleware"
import { SEED_KB_ARTICLES } from "@/data/seed-kb"
import type { KnowledgeArticle } from "@/types"

interface KbState {
  articles: KnowledgeArticle[]
  incrementHelpful: (id: string, isHelpful: boolean) => void
  incrementViews: (id: string) => void
  getArticleById: (id: string) => KnowledgeArticle | undefined
}

export const useKbStore = create<KbState>()(
  persist(
    (set, get) => ({
      articles: SEED_KB_ARTICLES,

      incrementHelpful: (id, isHelpful) => {
        set((state) => ({
          articles: state.articles.map((a) => {
            if (a.id !== id) return a
            return {
              ...a,
              helpfulCount: isHelpful ? a.helpfulCount + 1 : a.helpfulCount,
              unhelpfulCount: !isHelpful ? a.unhelpfulCount + 1 : a.unhelpfulCount,
            }
          }),
        }))
      },

      incrementViews: (id) => {
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id ? { ...a, views: a.views + 1 } : a
          ),
        }))
      },

      getArticleById: (id) => get().articles.find((a) => a.id === id),
    }),
    { name: "helpdesk-kb" }
  )
)
