import { NotificationBell } from "@/components/notifications/NotificationBell"

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => (
  <div className="mb-7 flex items-start justify-between gap-4">
    <div>
      <h1 className="text-xl font-semibold text-[#0A1F44] dark:text-slate-100">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
    <div className="flex items-center gap-3">
      {action}
      <NotificationBell />
    </div>
  </div>
)
