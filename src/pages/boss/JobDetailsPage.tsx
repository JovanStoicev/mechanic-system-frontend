import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { getBossJob, type JobDetails } from "../../api/jobs";

export default function JobDetailsPage() {
  const { id } = useParams();
  const jobId = Number(id);
  const [job, setJob] = useState<JobDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!Number.isInteger(jobId)) return;
    getBossJob(jobId).then(setJob).catch((e) => setError(e instanceof Error ? e.message : "Failed to load job"));
  }, [jobId]);

  if (!Number.isInteger(jobId)) return <div><PageHeader title="Invalid job ID" crumbs={[{ label: "Jobs", to: "/boss/jobs" }]} /></div>;
  if (error) return <div><PageHeader title="Job unavailable" crumbs={[{ label: "Jobs", to: "/boss/jobs" }]} /><div className="rounded-lg bg-red-50 p-3 text-red-700">{error}</div></div>;
  if (!job) return <div className="text-sm text-slate-600">Loading...</div>;

  return <div>
    <PageHeader title={`Job #${job.id}`} subtitle="Complete job and pricing details." crumbs={[{ label: "Jobs", to: "/boss/jobs" }, { label: `#${job.id}` }]} />
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-xl border p-4"><h2 className="font-semibold">Car</h2><p className="mt-2">{job.carBrand} {job.carModel}</p><p className="font-mono text-xs text-slate-500">{job.vin}</p><h2 className="mt-4 font-semibold">Mechanic</h2><p className="mt-2">{job.mechanicName}</p></section>
      <section className="rounded-xl border p-4"><h2 className="font-semibold">Pricing and estimate</h2><dl className="mt-2 space-y-2 text-sm"><div className="flex justify-between"><dt>Parts</dt><dd>€{job.partsCost.toFixed(2)}</dd></div><div className="flex justify-between"><dt>Mechanic work</dt><dd>€{job.labourCost.toFixed(2)}</dd></div><div className="flex justify-between border-t pt-2 font-semibold"><dt>Total</dt><dd>€{job.totalCost.toFixed(2)}</dd></div><div className="flex justify-between"><dt>Estimated time</dt><dd>{job.estimatedMinutes ? `${Math.floor(job.estimatedMinutes / 1440)}d ${Math.floor((job.estimatedMinutes % 1440) / 60)}h` : "Not provided"}</dd></div><div className="flex justify-between"><dt>Mechanic bonus (10%)</dt><dd>€{(job.labourCost * 0.1).toFixed(2)}</dd></div></dl><p className="mt-4 text-sm">Status: <strong>{job.status.replaceAll("_", " ")}</strong></p>{job.completedAt && <p className="mt-1 text-xs text-slate-500">Completed {new Date(job.completedAt).toLocaleString()}</p>}</section>
    </div>
    <section className="mt-4 rounded-xl border p-4"><h2 className="font-semibold">Description</h2><p className="mt-2 text-sm">{job.description}</p></section>
    <section className="mt-4 rounded-xl border p-4"><h2 className="font-semibold">Parts used</h2><div className="mt-3 overflow-x-auto"><table className="w-full text-sm"><thead><tr><th className="py-2 text-left">Part</th><th className="py-2 text-left">Qty</th><th className="py-2 text-left">Unit</th><th className="py-2 text-left">Total</th></tr></thead><tbody>{job.parts.map((part) => <tr key={part.partId} className="border-t"><td className="py-2">{part.name}</td><td>{part.qty}</td><td>€{part.unitPrice.toFixed(2)}</td><td>€{part.lineTotal.toFixed(2)}</td></tr>)}</tbody></table></div></section>
    <Link to="/boss/jobs" className="mt-4 inline-block text-sm underline">Back to jobs</Link>
  </div>;
}
