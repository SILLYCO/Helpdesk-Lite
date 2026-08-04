"use client"

import { Laptop, Moon, Sun } from "lucide-react"
import { useTheme, type Theme } from "./ThemeProvider"

interface ThemeToggleProps {
  variant?: "icon-only" | "compact" | "full"
  className?: string
}

export function ThemeToggle({ variant = "compact", className = "" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  if (variant === "icon-only") {
    return (
      <button
        type="button"
        onClick={cycleTheme}
        className={`p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center ${className}`}
        title={`Current: ${theme} (Click to change)`}
        aria-label="Toggle theme"
      >
        {resolvedTheme === "dark" ? (
          <Moon size={16} className="text-amber-400" aria-hidden="true" />
        ) : (
          <Sun size={16} className="text-amber-400" aria-hidden="true" />
        )}
      </button>
    )
  }

  const options: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
  ]

  return (
    <div
      className={`flex items-center bg-white/10 p-1 rounded-lg gap-0.5 backdrop-blur-xs ${className}`}
      role="radiogroup"
      aria-label="Theme switcher"
    >
      {options.map(({ value, label, icon: Icon }) => {
        const isActive = theme === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
              isActive
                ? "bg-[#0891B2] text-white shadow-xs"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
            role="radio"
            aria-checked={isActive}
            aria-label={`${label} theme`}
          >
            <Icon size={13} aria-hidden="true" />
            <span className="capitalize">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
