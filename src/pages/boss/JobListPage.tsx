import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { getBossJobs, type BossJobRow } from "../../api/jobs";

export default function JobsListPage() {
  const [jobs, setJobs] = useState<BossJobRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { getBossJobs().then(setJobs).catch((e) => setError(e instanceof Error ? e.message : "Failed to load jobs")); }, []);
  return <div>
    <PageHeader title="Jobs" subtitle="All workshop jobs." crumbs={[{ label: "Boss", to: "/boss/mechanics" }, { label: "Jobs" }]} />
    {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <div className="mt-4 overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3 text-left">Car</th><th className="px-4 py-3 text-left">Mechanic</th><th className="px-4 py-3 text-left">Description</th><th className="px-4 py-3 text-left">Estimate</th><th className="px-4 py-3 text-left">Mechanic work</th><th className="px-4 py-3 text-left">Total</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Action</th></tr></thead>
      <tbody>{jobs.map((job) => { const estimate = job.estimatedMinutes ?? 0; return <tr key={job.id} className="border-t"><td className="px-4 py-3"><div>{job.carBrand} {job.carModel}</div><div className="font-mono text-xs text-slate-500">{job.vin}</div></td><td className="px-4 py-3">{job.mechanicName}</td><td className="px-4 py-3">{job.description}</td><td className="px-4 py-3">{job.estimatedMinutes ? `${Math.floor(estimate / 1440)}d ${Math.floor((estimate % 1440) / 60)}h` : "—"}</td><td className="px-4 py-3">€{job.labourCost.toFixed(2)}</td><td className="px-4 py-3">€{job.totalCost.toFixed(2)}</td><td className="px-4 py-3">{job.status.replaceAll("_", " ")}</td><td className="px-4 py-3"><Link className="rounded-lg border px-3 py-1" to={`/boss/jobs/${job.id}`}>View</Link></td></tr>; })}</tbody>
    </table></div>
  </div>;
}
