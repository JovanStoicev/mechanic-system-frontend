import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../auth/AuthContext";
import { cancelJob, completeJob, getMechanicJobs, type JobRow } from "../../api/jobs";

export default function MyJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMechanicJobs()
      .then((rows) => setJobs(rows.filter((job) => job.status !== "PENDING_APPROVAL" && job.status !== "REJECTED")))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load jobs"))
      .finally(() => setLoading(false));
  }, []);

  async function markDone(id: number) {
    try {
      const updated = await completeJob(id);
      setJobs((current) => current.map((job) => (job.id === id ? updated : job)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to complete job");
    }
  }

  async function cancel(id: number) {
    if (!window.confirm("Cancel this job and return all reserved parts to stock?")) return;
    try {
      const updated = await cancelJob(id);
      setJobs((current) => current.map((job) => (job.id === id ? updated : job)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to cancel job");
    }
  }

  return (
    <div>
      <PageHeader title="My jobs" subtitle={`Logged in as: ${user?.name ?? "Mechanic"}`} crumbs={[{ label: "Mechanic", to: "/mechanic/jobs" }, { label: "My jobs" }]} />
      {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {loading ? <div className="mt-4 text-sm text-slate-600">Loading...</div> : (
        <div className="mt-4 overflow-x-auto rounded-xl border">
          <table className="w-full text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3 text-left">Description</th><th className="px-4 py-3 text-left">Estimate</th><th className="px-4 py-3 text-left">Parts</th><th className="px-4 py-3 text-left">Mechanic work</th><th className="px-4 py-3 text-left">Total</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Action</th></tr></thead>
            <tbody>{jobs.map((job) => { const estimate = job.estimatedMinutes ?? 0; return <tr key={job.id} className="border-t"><td className="px-4 py-3">{job.description}</td><td className="px-4 py-3">{job.estimatedMinutes ? `${Math.floor(estimate / 1440)}d ${Math.floor((estimate % 1440) / 60)}h` : "—"}</td><td className="px-4 py-3">€{job.partsCost.toFixed(2)}</td><td className="px-4 py-3">€{job.labourCost.toFixed(2)}</td><td className="px-4 py-3">€{job.totalCost.toFixed(2)}</td><td className="px-4 py-3">{job.status}</td><td className="px-4 py-3">{job.status === "OPEN" && <div className="flex gap-2"><button onClick={() => markDone(job.id)} className="rounded-lg bg-slate-900 px-3 py-1.5 text-white">Mark done</button><button onClick={() => cancel(job.id)} className="rounded-lg border border-red-300 px-3 py-1.5 text-red-700">Cancel</button></div>}</td></tr>; })}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
