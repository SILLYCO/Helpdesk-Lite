import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types"
import { DEFAULT_LANDING, DEMO_USERS } from "@/lib/constants"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string) => { success: boolean; redirectTo: string; error?: string }
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string) => {
        const normalized = email.toLowerCase().trim()
        const demoUser = DEMO_USERS[normalized]

        if (!demoUser) {
          return {
            success: false,
            redirectTo: "/login",
            error: "Unknown email. Use a demo account listed below.",
          }
        }

        const user: User = {
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
        }

        set({ user, isAuthenticated: true })
        return { success: true, redirectTo: DEFAULT_LANDING[demoUser.role] }
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "helpdesk-auth" }
  )
)
