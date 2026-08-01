import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

export const formatTimestamp = () =>
  new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })

export const generateTicketId = (existingIds: string[]): string => {
  const numbers = existingIds
    .map((id) => parseInt(id.replace("TKT-", ""), 10))
    .filter((n) => !Number.isNaN(n))
  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1043
  return `TKT-${next}`
}
