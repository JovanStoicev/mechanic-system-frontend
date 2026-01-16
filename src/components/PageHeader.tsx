import { Link } from "react-router-dom"

export type Crumb = {
  label: string
  to?: string
}

export default function PageHeader({
  title,
  subtitle,
  crumbs,
}: {
  title: string
  subtitle?: string
  crumbs?: Crumb[]
}) {
  return (
    <div className="mb-4">
      {crumbs && crumbs.length > 0 && (
        <nav className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            {crumbs.map((c, idx) => {
              const isLast = idx === crumbs.length - 1
              return (
                <li key={`${c.label}-${idx}`} className="flex items-center gap-2">
                  {c.to && !isLast ? (
                    <Link to={c.to} className="hover:text-slate-700 hover:underline">
                      {c.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "text-slate-700 font-medium" : ""}>
                      {c.label}
                    </span>
                  )}
                  {!isLast && <span className="text-slate-400">/</span>}
                </li>
              )
            })}
          </ol>
        </nav>
      )}

      <h2 className="mt-2 text-xl font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}

      <div className="mt-4 h-px bg-slate-200" />
    </div>
  )
}
