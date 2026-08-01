"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Role } from "@/types"
import { DEFAULT_LANDING } from "@/lib/constants"
import { useAuthStore } from "@/store/auth-store"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: Role[]
}

export const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return

    if (!isAuthenticated || !user) {
      router.replace("/login")
      return
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace(DEFAULT_LANDING[user.role])
    }
  }, [hydrated, isAuthenticated, user, allowedRoles, router])

  if (!hydrated || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#F1F4F8] flex items-center justify-center">
        <span
          className="w-8 h-8 border-2 border-[#0891B2]/30 border-t-[#0891B2] rounded-full animate-spin"
          role="status"
          aria-label="Loading"
        />
      </div>
    )
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
