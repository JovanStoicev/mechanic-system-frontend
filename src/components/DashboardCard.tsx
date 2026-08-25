import { Link } from "react-router-dom";

export default function DashboardCard({ label, value, detail, to }: { label:string; value:string|number; detail:string; to:string }) {
  return <Link to={to} className="group rounded-xl border bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-sm">
    <p className="text-sm font-medium text-slate-600">{label}</p>
    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
    <p className="mt-2 text-xs text-slate-500 group-hover:text-slate-700">{detail} →</p>
  </Link>;
}
