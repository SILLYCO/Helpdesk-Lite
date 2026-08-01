import type { Priority } from "@/types"
import { PRIORITY_CONFIG } from "@/lib/constants"

interface PriorityLabelProps {
  priority: Priority
}

export const PriorityLabel = ({ priority }: PriorityLabelProps) => {
  const cfg = PRIORITY_CONFIG[priority]

  return (
    <span
      className={`text-xs font-semibold uppercase tracking-wide ${cfg.color}`}
    >
      {priority}
    </span>
  )
}
