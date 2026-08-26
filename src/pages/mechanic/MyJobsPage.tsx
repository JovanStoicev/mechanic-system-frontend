import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../auth/AuthContext";
import { cancelJob, completeJob, getMechanicJobs, type JobRow } from "../../api/jobs";

export default function MyJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<JobRow | null>(null);
  const [nextServiceDate, setNextServiceDate] = useState("");
  const [nextServiceMileage, setNextServiceMileage] = useState("");
  const [minimumNextServiceDate] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10));

  useEffect(() => {
    getMechanicJobs()
      .then((rows) => setJobs(rows.filter((job) => job.status !== "PENDING_APPROVAL" && job.status !== "REJECTED")))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load jobs"))
      .finally(() => setLoading(false));
  }, []);

  async function markDone() {
    if (!completing) return;
    try {
      setError(null);
      const mileage = nextServiceMileage === "" ? null : Number(nextServiceMileage);
      if (mileage !== null && mileage <= completing.mileage) {
        setError(`Next service mileage must be greater than ${completing.mileage.toLocaleString()} km`); return;
      }
      const updated = await completeJob(completing.id, { nextServiceDate: nextServiceDate || null, nextServiceMileage: mileage });
      setJobs((current) => current.map((job) => (job.id === completing.id ? updated : job)));
      setCompleting(null); setNextServiceDate(""); setNextServiceMileage("");
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
            <tbody>{jobs.map((job) => { const estimate = job.estimatedMinutes ?? 0; return <tr key={job.id} className="border-t"><td className="px-4 py-3">{job.description}</td><td className="px-4 py-3">{job.estimatedMinutes ? `${Math.floor(estimate / 1440)}d ${Math.floor((estimate % 1440) / 60)}h` : "—"}</td><td className="px-4 py-3">€{job.partsCost.toFixed(2)}</td><td className="px-4 py-3">€{job.labourCost.toFixed(2)}</td><td className="px-4 py-3">€{job.totalCost.toFixed(2)}</td><td className="px-4 py-3">{job.status}</td><td className="px-4 py-3">{job.status === "OPEN" && <div className="flex gap-2"><button onClick={() => { setCompleting(job); setNextServiceMileage(""); setNextServiceDate(""); }} className="rounded-lg bg-slate-900 px-3 py-1.5 text-white">Mark done</button><button onClick={() => cancel(job.id)} className="rounded-lg border border-red-300 px-3 py-1.5 text-red-700">Cancel</button></div>}</td></tr>; })}</tbody>
          </table>
        </div>
      )}
      {completing && <div className="mt-4 rounded-xl border bg-slate-50 p-4"><h2 className="font-semibold">Complete job #{completing.id}</h2><p className="mt-1 text-sm text-slate-600">Optionally recommend the next service. The customer will see it in the car's service history.</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium">Next service date<input className="mt-1 w-full rounded-lg border bg-white px-3 py-2 font-normal" type="date" min={minimumNextServiceDate} value={nextServiceDate} onChange={(event) => setNextServiceDate(event.target.value)} /></label><label className="text-sm font-medium">Next service mileage (km)<input className="mt-1 w-full rounded-lg border bg-white px-3 py-2 font-normal" type="number" min={completing.mileage + 1} placeholder={`More than ${completing.mileage.toLocaleString()}`} value={nextServiceMileage} onChange={(event) => setNextServiceMileage(event.target.value)} /></label></div><div className="mt-4 flex flex-wrap gap-2"><button onClick={markDone} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white">Complete job</button><button onClick={() => setCompleting(null)} className="rounded-lg border bg-white px-3 py-2 text-sm font-medium">Keep job open</button></div></div>}
    </div>
  );
}
