import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { getSalaryReport, type SalaryReport } from "../../api/salaries";

const currentMonth = new Date().toISOString().slice(0, 7);

export default function SalaryReportPage() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [report, setReport] = useState<SalaryReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    getSalaryReport(year, month).then(setReport)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load salaries"))
      .finally(() => setLoading(false));
  }, [selectedMonth]);

  return <div><PageHeader title="Monthly salaries" subtitle="Fixed salary plus 10% of completed labour." crumbs={[{ label: "Boss", to: "/boss/mechanics" }, { label: "Salaries" }]} />
    <label className="block text-sm font-medium">Report month<input type="month" value={selectedMonth} min="2000-01" max="2100-12" onChange={(e) => { setLoading(true); setError(null); setSelectedMonth(e.target.value); }} className="mt-1 block rounded-lg border px-3 py-2" /></label>
    {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {loading ? <div className="mt-4 text-sm text-slate-600">Loading...</div> : report && <div className="mt-4 space-y-4">{report.mechanics.map((mechanic) => <section key={mechanic.mechanicId} className="rounded-xl border p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold">{mechanic.mechanicName}</h2><p className="mt-1 text-xs text-slate-500">{mechanic.completedJobs} completed jobs</p></div><div className="text-right"><p className="text-xs text-slate-500">Total salary</p><p className="text-xl font-bold">€{mechanic.totalSalary.toFixed(2)}</p></div></div>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><div className="rounded-lg bg-slate-50 p-3"><dt className="text-slate-500">Fixed salary</dt><dd className="mt-1 font-semibold">€{mechanic.fixedSalary.toFixed(2)}</dd></div><div className="rounded-lg bg-slate-50 p-3"><dt className="text-slate-500">Completed labour</dt><dd className="mt-1 font-semibold">€{mechanic.labourTotal.toFixed(2)}</dd></div><div className="rounded-lg bg-slate-50 p-3"><dt className="text-slate-500">Bonus (10%)</dt><dd className="mt-1 font-semibold">€{mechanic.bonus.toFixed(2)}</dd></div></dl>
      {mechanic.jobs.length > 0 && <div className="mt-4 overflow-x-auto"><table className="w-full text-sm"><thead className="text-slate-500"><tr><th className="py-2 text-left">Job</th><th className="py-2 text-left">Car</th><th className="py-2 text-left">Completed</th><th className="py-2 text-right">Labour</th></tr></thead><tbody>{mechanic.jobs.map((job) => <tr key={job.jobId} className="border-t"><td className="py-2"><Link className="underline" to={`/boss/jobs/${job.jobId}`}>#{job.jobId}</Link> — {job.description}</td><td>{job.carBrand} {job.carModel}</td><td>{new Date(job.completedAt).toLocaleDateString()}</td><td className="text-right">€{job.labourCost.toFixed(2)}</td></tr>)}</tbody></table></div>}
    </section>)}</div>}</div>;
}
