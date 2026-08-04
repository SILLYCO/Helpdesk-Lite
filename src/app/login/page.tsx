"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { DEFAULT_LANDING } from "@/lib/constants"
import { loginSchema, type LoginFormValues } from "@/lib/validations"
import { useAuthStore } from "@/store/auth-store"

import { ThemeToggle } from "@/components/theme/ThemeToggle"

const DEMO_ACCOUNTS = [
  { email: "employee@acme.com", label: "Employee" },
  { email: "support@acme.com", label: "Support Staff" },
  { email: "manager@acme.com", label: "Manager" },
]

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [hydrated, setHydrated] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && isAuthenticated && user) {
      router.replace(DEFAULT_LANDING[user.role] ?? "/tickets")
    }
  }, [hydrated, isAuthenticated, user, router])

  const handleFormSubmit = async (data: LoginFormValues) => {
    setFormError(null)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const result = login(data.email)

    if (!result.success) {
      setFormError(result.error ?? "Login failed")
      return
    }

    router.push(result.redirectTo)
  }

  const handleDemoClick = (email: string) => {
    setValue("email", email, { shouldValidate: true })
    setFormError(null)
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#F1F4F8] dark:bg-[#0B132B] flex items-center justify-center">
        <span
          className="w-8 h-8 border-2 border-[#0891B2]/30 border-t-[#0891B2] rounded-full animate-spin"
          role="status"
          aria-label="Loading"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F1F4F8] dark:bg-[#0B132B] flex items-center justify-center px-4 transition-colors">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 relative">
          <div className="absolute -top-4 right-0">
            <ThemeToggle variant="icon-only" />
          </div>
          <div className="w-14 h-14 bg-[#0A1F44] dark:bg-[#14213D] rounded-2xl flex items-center justify-center mb-4 shadow-lg border border-transparent dark:border-slate-800">
            <Shield size={26} className="text-[#0891B2] dark:text-[#38BDF8]" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold text-[#0A1F44] dark:text-slate-100">HelpDesk Lite</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Internal Support Portal</p>
        </div>

        <div className="bg-white dark:bg-[#14213D] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 px-8 py-8 transition-colors">
          <h2 className="text-base font-semibold text-[#0A1F44] dark:text-slate-100 mb-6">
            Sign in to your account
          </h2>

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                placeholder="you@acme.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1930] text-sm text-[#0A1F44] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
                {...register("email")}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1930] text-sm text-[#0A1F44] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
                {...register("password")}
              />
              {errors.password && (
                <p id="password-error" className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {formError && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/40 px-3 py-2 rounded-lg" role="alert">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full bg-[#0A1F44] dark:bg-[#0891B2] hover:bg-[#112952] dark:hover:bg-[#0780A0] text-white py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    aria-hidden="true"
                  />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-2">Demo logins:</p>
            <div className="flex flex-col gap-1">
              {DEMO_ACCOUNTS.map(({ email, label }) => (
                <button
                  key={email}
                  type="button"
                  onClick={() => handleDemoClick(email)}
                  className="text-left text-xs text-[#0891B2] dark:text-[#38BDF8] hover:text-[#0A1F44] dark:hover:text-white transition-colors font-mono"
                  aria-label={`Use demo account ${email} as ${label}`}
                >
                  {email}{" "}
                  <span className="font-sans text-slate-400 dark:text-slate-500">— {label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">Any password works for demo accounts.</p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
          © 2026 Acme Corp · Internal Use Only
        </p>
      </div>
    </div>
  )
}
