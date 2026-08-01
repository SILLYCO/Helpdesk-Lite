"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  InboxIcon,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Shield,
  Ticket,
} from "lucide-react"
import type { Role } from "@/types"
import { ROLE_LABELS } from "@/lib/constants"
import { useAuthStore } from "@/store/auth-store"

interface NavItem {
  href: string
  label: string
  icon: typeof Ticket
  roles: Role[]
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/tickets",
    label: "My Tickets",
    icon: Ticket,
    roles: ["employee", "staff", "manager"],
  },
  {
    href: "/tickets/new",
    label: "Submit Ticket",
    icon: PlusCircle,
    roles: ["employee", "staff", "manager"],
  },
  {
    href: "/queue",
    label: "Ticket Queue",
    icon: InboxIcon,
    roles: ["staff", "manager"],
  },
  {
    href: "/overview",
    label: "Manager View",
    icon: LayoutDashboard,
    roles: ["manager"],
  },
]

export const Sidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  if (!user) return null

  const navItems = NAV_ITEMS.filter((item) => item.roles.includes(user.role))

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const isActive = (href: string) => {
    if (href === "/tickets") {
      return (
        pathname === "/tickets" ||
        (pathname.startsWith("/tickets/") && !pathname.startsWith("/tickets/new"))
      )
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-60 min-h-screen bg-[#0A1F44] flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0891B2] rounded-lg flex items-center justify-center shrink-0">
            <Shield size={16} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">
              HelpDesk Lite
            </p>
            <p className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">
              {ROLE_LABELS[user.role]}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-[#0891B2] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={16} aria-hidden="true" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 py-2 mb-1">
          <p className="text-white text-sm font-medium leading-none">{user.name}</p>
          <p className="text-white/40 text-xs mt-1">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all text-left"
          aria-label="Sign out"
        >
          <LogOut size={15} aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
