import { useEffect, useState } from "react";
import { customerPortal, type Problem } from "../../api/customerPortal";

function estimate(minutes: number | null) {
  const value = minutes ?? 0;
  return `${Math.floor(value / 1440)}d ${Math.floor((value % 1440) / 60)}h`;
}

function timeline(problem: Problem) {
  const estimateReady = problem.status !== "SUBMITTED" && problem.status !== "CANCELLED";
  const approved = problem.status === "APPROVED";
  const completed = problem.jobStatus === "DONE";
  const cancelled = problem.status === "CANCELLED" || problem.jobStatus === "CANCELLED";
  return [
    { label: "Problem submitted", done: true },
    { label: problem.status === "REJECTED" ? "Estimate rejected - revision requested" : "Estimate received", done: estimateReady },
    { label: approved ? "Estimate approved - repair in progress" : "Estimate approval", done: approved },
    { label: cancelled ? "Repair cancelled" : "Repair completed", done: completed || cancelled },
  ];
}

export default function CustomerProblemsPage() {
  const [items, setItems] = useState<Problem[]>([]);
  const [error, setError] = useState("");
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);

  function load() { customerPortal.problems().then(setItems).catch((e) => setError(e instanceof Error ? e.message : "Could not load problems")); }
  useEffect(load, []);

  async function cancel(id: number) {
    try { setSavingId(id); await customerPortal.cancelProblem(id); load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not cancel"); }
    finally { setSavingId(null); }
  }
  async function approve(id: number) {
    try { setSavingId(id); setError(""); await customerPortal.approveEstimate(id); load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not approve estimate"); }
    finally { setSavingId(null); }
  }
  async function reject(id: number) {
    if (!reason.trim()) return;
    try { setSavingId(id); setError(""); await customerPortal.rejectEstimate(id, reason); setRejectingId(null); setReason(""); load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not reject estimate"); }
    finally { setSavingId(null); }
  }
  async function acceptAppointment(id: number) {
    try { setSavingId(id); setError(""); await customerPortal.acceptAppointment(id); load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not accept appointment"); }
    finally { setSavingId(null); }
  }

  return <>
    <h2 className="text-xl font-bold">My reported problems</h2>
    <p className="text-sm text-slate-600">Review estimates and follow the repair status.</p>
    {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
    <div className="mt-4 space-y-4">{items.map((problem) => <article className="rounded-xl border p-4" key={problem.id}>
      <div className="flex items-start justify-between gap-3"><div><b>{problem.carName}</b><div className="text-xs text-slate-500">{problem.vin}</div></div><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium">{problem.status.replaceAll("_", " ")}</span></div>
      <p className="mt-3">{problem.description}</p>
      <p className="mt-2 text-sm text-slate-600">Mechanic: {problem.mechanicName}</p>

      {problem.appointmentAt && <section className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm"><div className="flex flex-wrap items-center justify-between gap-2"><div><span className="text-blue-700">Inspection appointment</span><p className="font-semibold text-blue-950">{new Date(problem.appointmentAt).toLocaleString()}</p></div><span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-blue-800">{problem.appointmentStatus}</span></div>{problem.appointmentStatus === "PROPOSED" && <div className="mt-3"><p className="mb-2 text-blue-800">The mechanic proposed this new time.</p><button disabled={savingId === problem.id} onClick={() => acceptAppointment(problem.id)} className="rounded-lg bg-blue-800 px-3 py-2 text-sm font-medium text-white">Accept new time</button></div>}</section>}

      <section className="mt-4"><h3 className="text-sm font-semibold">Repair progress</h3><div className="mt-2 grid gap-2 sm:grid-cols-4">{timeline(problem).map((step, index) => <div key={step.label} className={`rounded-lg border p-2 text-xs ${step.done ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "bg-slate-50 text-slate-500"}`}><div className="font-semibold">{step.done ? "✓" : index + 1}. {step.label}</div></div>)}</div></section>

      {problem.jobId && <section className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
        <h3 className="font-semibold">Mechanic estimate</h3>
        {problem.parts.length > 0 ? <div className="mt-2 space-y-1">{problem.parts.map((part) => <div className="flex justify-between" key={part.partId}><span>{part.name} × {part.qty}</span><span>€{(part.unitPrice * part.qty).toFixed(2)}</span></div>)}</div> : <p className="mt-2 text-slate-500">No parts required.</p>}
        <div className="mt-3 flex justify-between border-t pt-2"><span>Parts</span><span>€{(problem.partsCost ?? 0).toFixed(2)}</span></div>
        <div className="mt-2 flex justify-between"><span>Mechanic work</span><span>€{(problem.workPrice ?? 0).toFixed(2)}</span></div>
        <div className="mt-2 flex justify-between font-semibold"><span>Total estimate</span><span>€{(problem.totalCost ?? 0).toFixed(2)}</span></div>
        <div className="mt-2 flex justify-between"><span>Estimated repair time</span><span>{estimate(problem.estimatedMinutes)}</span></div>
      </section>}

      {problem.rejectionReason && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700"><strong>Your rejection reason:</strong> {problem.rejectionReason}</p>}
      {problem.status === "SUBMITTED" && <button disabled={savingId === problem.id} onClick={() => cancel(problem.id)} className="mt-3 rounded-lg border px-3 py-1.5 text-sm">Cancel request</button>}
      {problem.status === "ESTIMATE_CREATED" && <div className="mt-4">
        <div className="flex gap-2"><button disabled={savingId === problem.id} onClick={() => approve(problem.id)} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white">Approve estimate</button><button disabled={savingId === problem.id} onClick={() => { setRejectingId(problem.id); setReason(""); }} className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700">Reject</button></div>
        {rejectingId === problem.id && <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3"><label className="text-sm font-medium">Reason for rejection<textarea autoFocus required maxLength={1000} rows={3} value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1 w-full rounded-lg border bg-white p-2" /></label><div className="mt-2 flex gap-2"><button disabled={!reason.trim() || savingId === problem.id} onClick={() => reject(problem.id)} className="rounded-lg bg-red-700 px-3 py-2 text-sm text-white disabled:opacity-50">Send rejection</button><button onClick={() => setRejectingId(null)} className="rounded-lg border bg-white px-3 py-2 text-sm">Keep estimate</button></div></div>}
      </div>}
      {problem.status === "APPROVED" && <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Estimate approved. The job is open and required parts are reserved.</p>}
      {problem.status === "REJECTED" && <p className="mt-3 text-sm text-slate-600">Waiting for the mechanic to revise and resend the estimate.</p>}
    </article>)}</div>
  </>;
}
