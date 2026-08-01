interface PageHeaderProps {
  title: string
  subtitle?: string
}

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => (
  <div className="mb-7">
    <h1 className="text-xl font-semibold text-[#0A1F44]">{title}</h1>
    {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
  </div>
)
