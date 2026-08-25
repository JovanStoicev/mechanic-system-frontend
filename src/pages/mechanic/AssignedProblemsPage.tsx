import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { customerPortal, type Problem } from "../../api/customerPortal";

function estimatedTime(minutes: number | null) {
  if (!minutes) return "";
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  return `${days}d ${hours}h`;
}

export default function AssignedProblemsPage() {
  const [items, setItems] = useState<Problem[]>([]);
  const [error, setError] = useState("");
  const [proposingId, setProposingId] = useState<number | null>(null);
  const [proposedAt, setProposedAt] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  function load() { customerPortal.assignedProblems().then(setItems).catch((e) => setError(e.message)); }
  useEffect(load, []);

  async function confirm(id: number) {
    try { setSavingId(id); setError(""); await customerPortal.confirmAppointment(id); load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not confirm appointment"); }
    finally { setSavingId(null); }
  }

  async function propose(id: number) {
    if (!proposedAt) return;
    try { setSavingId(id); setError(""); await customerPortal.proposeAppointment(id, new Date(proposedAt).toISOString()); setProposingId(null); setProposedAt(""); load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not propose appointment"); }
    finally { setSavingId(null); }
  }

  return <>
    <h2 className="text-xl font-bold">Assigned customer problems</h2>
    <p className="text-sm text-slate-600">Use a submitted problem as the starting point for a job estimate.</p>
    {error && <p className="mt-3 text-red-700">{error}</p>}
    <div className="mt-4 space-y-3">{items.map((problem) => <article className="rounded-lg border p-3" key={problem.id}>
      <div className="flex justify-between"><b>{problem.carName} • {problem.customerName}</b><span>{problem.status}</span></div>
      <p className="my-2">{problem.description}</p>
      {problem.appointmentAt && <section className="my-3 rounded-lg bg-slate-50 p-3 text-sm"><div className="flex flex-wrap items-center justify-between gap-2"><div><span className="text-slate-500">Appointment</span><p className="font-semibold">{new Date(problem.appointmentAt).toLocaleString()}</p></div><span className="rounded-full border bg-white px-2 py-1 text-xs font-medium">{problem.appointmentStatus}</span></div>
        {problem.appointmentStatus === "REQUESTED" && <div className="mt-3 flex flex-wrap gap-2"><button disabled={savingId === problem.id} onClick={() => confirm(problem.id)} className="rounded-lg bg-emerald-700 px-3 py-2 text-sm text-white">Confirm time</button><button onClick={() => { setProposingId(problem.id); setProposedAt(""); }} className="rounded-lg border px-3 py-2 text-sm">Propose another time</button></div>}
        {proposingId === problem.id && <div className="mt-3 flex flex-wrap items-end gap-2"><label className="text-sm font-medium">New time<input autoFocus type="datetime-local" min={new Date().toISOString().slice(0, 16)} value={proposedAt} onChange={(e) => setProposedAt(e.target.value)} className="mt-1 block rounded-lg border bg-white p-2" /></label><button disabled={!proposedAt || savingId === problem.id} onClick={() => propose(problem.id)} className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50">Send proposal</button><button onClick={() => setProposingId(null)} className="rounded-lg border bg-white px-3 py-2 text-sm">Cancel</button></div>}
      </section>}
      {(problem.status === "SUBMITTED" || problem.status === "REJECTED")
        ? <div>{problem.rejectionReason && <p className="mb-2 rounded-lg bg-red-50 p-2 text-sm text-red-700">Customer reason: {problem.rejectionReason}</p>}<Link className="inline-block rounded-lg bg-slate-900 px-3 py-2 text-sm text-white" to={`/mechanic/problems/${problem.id}/job`}>{problem.status === "REJECTED" ? "Revise estimate" : "Create job & estimate"}</Link></div>
        : <p className="text-sm text-slate-600">Job #{problem.jobId} • estimate {estimatedTime(problem.estimatedMinutes)} • {problem.status === "ESTIMATE_CREATED" ? "waiting for customer" : problem.status}</p>}
    </article>)}</div>
  </>;
}
