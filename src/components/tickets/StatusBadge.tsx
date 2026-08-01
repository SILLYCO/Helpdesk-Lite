import type { TicketStatus } from "@/types"
import { STATUS_CONFIG } from "@/lib/constants"

interface StatusBadgeProps {
  status: TicketStatus
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.icon

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}
    >
      <Icon size={11} aria-hidden="true" />
      {cfg.label}
    </span>
  )
}
