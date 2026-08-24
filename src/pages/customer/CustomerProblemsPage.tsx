import { useEffect, useState } from "react";
import { customerPortal, type Problem } from "../../api/customerPortal";

export default function CustomerProblemsPage() {
  const [items, setItems] = useState<Problem[]>([]); const [error, setError] = useState("");
  async function load() { try { setItems(await customerPortal.problems()); } catch (e) { setError(e instanceof Error ? e.message : "Could not load problems"); } }
  useEffect(() => { customerPortal.problems().then(setItems).catch(e => setError(e instanceof Error ? e.message : "Could not load problems")); }, []);
  async function cancel(id: number) { try { await customerPortal.cancelProblem(id); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Could not cancel"); } }
  return <><h2 className="text-xl font-bold">My reported problems</h2>{error && <p className="mt-3 text-red-700">{error}</p>}<div className="mt-4 space-y-3">{items.map(p => { const days = Math.floor((p.estimatedMinutes ?? 0) / 1440); const hours = Math.floor(((p.estimatedMinutes ?? 0) % 1440) / 60); return <article className="rounded-lg border p-3" key={p.id}><div className="flex justify-between"><b>{p.carName}</b><span>{p.status}</span></div><p className="mt-2">{p.description}</p><p className="mt-2 text-sm text-slate-600">Mechanic: {p.mechanicName}{p.estimatedMinutes ? ` • Estimate: ${days}d ${hours}h` : ""}{p.jobStatus ? ` • Job: ${p.jobStatus}` : ""}</p>{p.status === "SUBMITTED" && <button onClick={() => cancel(p.id)} className="mt-2 rounded border px-3 py-1 text-sm">Cancel</button>}</article>; })}</div></>;
}
