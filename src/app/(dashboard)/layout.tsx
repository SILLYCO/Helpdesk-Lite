"use client"

import { AuthGuard } from "@/components/auth/AuthGuard"
import { Sidebar } from "@/components/layout/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#F1F4F8]">
        <Sidebar />
        <main className="flex-1 px-8 py-8 overflow-auto min-h-screen">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
