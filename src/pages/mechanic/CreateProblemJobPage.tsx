import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { customerPortal, type Problem } from "../../api/customerPortal";
import { getCatalogParts, type CatalogPart } from "../../api/jobs";

type PartLine = { partId: number; qty: number };

export default function CreateProblemJobPage() {
  const problemId = Number(useParams().id);
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [parts, setParts] = useState<CatalogPart[]>([]);
  const [description, setDescription] = useState("");
  const [mileage, setMileage] = useState(0);
  const [labourCost, setLabourCost] = useState(0);
  const [estimatedDays, setEstimatedDays] = useState(0);
  const [estimatedHours, setEstimatedHours] = useState(0);
  const [lines, setLines] = useState<PartLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([customerPortal.assignedProblems(), getCatalogParts()])
      .then(([problems, loadedParts]) => {
        const assigned = problems.find((item) => item.id === problemId && item.status === "SUBMITTED");
        if (!assigned) { setError("Assigned problem not found or it was already converted."); return; }
        setProblem(assigned);
        setDescription(assigned.description);
        setParts(loadedParts);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load job data"));
  }, [problemId]);

  const partsById = useMemo(() => new Map(parts.map((part) => [part.id, part])), [parts]);
  const partsCost = lines.reduce((sum, line) => sum + (partsById.get(line.partId)?.price ?? 0) * line.qty, 0);
  const totalEstimatedMinutes = estimatedDays * 24 * 60 + estimatedHours * 60;

  function addPart() {
    const available = parts.find((part) => part.stockQty > 0);
    if (available) setLines((current) => [...current, { partId: available.id, qty: 0 }]);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await customerPortal.convertProblem(problemId, {
        description, mileage, labourCost, estimatedMinutes: totalEstimatedMinutes, parts: lines,
      });
      navigate("/mechanic/jobs", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create job");
    } finally {
      setSaving(false);
    }
  }

  return <div>
    <PageHeader title="Create job" subtitle="Create the job from the assigned customer problem." crumbs={[{ label: "Assigned problems", to: "/mechanic/problems" }, { label: "Create job" }]} />
    {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {problem && <form onSubmit={submit} className="space-y-5">
      <section className="rounded-xl border bg-slate-50 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Assigned customer problem</div>
        <div className="mt-2 font-semibold">{problem.carName} — {problem.vin}</div>
        <div className="text-sm text-slate-600">Customer: {problem.customerName}</div>
        <p className="mt-2 text-sm">{problem.description}</p>
      </section>

      <div><label className="text-sm font-medium">Work to be performed</label><textarea className="mt-1 w-full rounded-lg border p-2" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} /></div>
      <div><label className="text-sm font-medium">Mileage (km)</label><input className="mt-1 w-full rounded-lg border p-2" type="number" min="0" step="1" value={mileage} onFocus={(e) => e.currentTarget.select()} onMouseUp={(e) => e.preventDefault()} onKeyDown={(e) => { if (mileage === 0 && /^\d$/.test(e.key)) { e.preventDefault(); setMileage(Number(e.key)); } }} onChange={(e) => setMileage(Number(e.target.value))} required /><p className="mt-1 text-xs text-slate-500">Enter the current odometer reading. It cannot be lower than the car's latest recorded mileage.</p></div>
      <div><label className="text-sm font-medium">Mechanic work price (€)</label><input className="mt-1 w-full rounded-lg border p-2" type="number" min="0" step="0.01" value={labourCost} onFocus={(e) => e.currentTarget.select()} onMouseUp={(e) => e.preventDefault()} onKeyDown={(e) => { if (labourCost === 0 && /^\d$/.test(e.key)) { e.preventDefault(); setLabourCost(Number(e.key)); } }} onChange={(e) => setLabourCost(Number(e.target.value))} required /></div>

      <section className="rounded-xl border p-4">
        <h2 className="font-semibold">Estimated repair time</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium">Days<input className="mt-1 w-full rounded-lg border p-2" type="number" min="0" step="1" value={estimatedDays} onFocus={(e) => e.currentTarget.select()} onMouseUp={(e) => e.preventDefault()} onKeyDown={(e) => { if (estimatedDays === 0 && /^\d$/.test(e.key)) { e.preventDefault(); setEstimatedDays(Number(e.key)); } }} onChange={(e) => setEstimatedDays(Number(e.target.value))} /></label>
          <label className="text-sm font-medium">Hours<input className="mt-1 w-full rounded-lg border p-2" type="number" min="0" max="23" step="1" value={estimatedHours} onFocus={(e) => e.currentTarget.select()} onMouseUp={(e) => e.preventDefault()} onKeyDown={(e) => { if (estimatedHours === 0 && /^\d$/.test(e.key)) { e.preventDefault(); setEstimatedHours(Number(e.key)); } }} onChange={(e) => setEstimatedHours(Number(e.target.value))} /></label>
        </div>
      </section>

      <section className="rounded-xl border p-4">
        <div className="flex items-center justify-between"><h2 className="font-semibold">Parts required</h2><button type="button" onClick={addPart} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50">+ Add part</button></div>
        <div className="mt-3 space-y-3">{lines.map((line, index) => { const selected = partsById.get(line.partId); return <div key={index} className="grid grid-cols-12 gap-2"><select className="col-span-7 rounded-lg border p-2" value={line.partId} onChange={(e) => setLines((current) => current.map((item, i) => i === index ? { ...item, partId: Number(e.target.value), qty: 0 } : item))}>{parts.map((part) => <option key={part.id} value={part.id} disabled={part.stockQty === 0}>{part.name} — €{part.price.toFixed(2)} (stock {part.stockQty})</option>)}</select><input aria-label="Quantity" className="col-span-2 rounded-lg border p-2" type="number" min="1" max={selected?.stockQty ?? 1} value={line.qty} onFocus={(e) => e.currentTarget.select()} onMouseUp={(e) => e.preventDefault()} onKeyDown={(e) => { if (line.qty === 0 && /^[1-9]$/.test(e.key)) { e.preventDefault(); setLines((current) => current.map((item, i) => i === index ? { ...item, qty: Number(e.key) } : item)); } }} onChange={(e) => setLines((current) => current.map((item, i) => i === index ? { ...item, qty: Number(e.target.value) } : item))} /><button type="button" className="col-span-3 rounded-lg border text-sm hover:bg-slate-50" onClick={() => setLines((current) => current.filter((_, i) => i !== index))}>Remove</button></div>; })}</div>
        {lines.length === 0 && <p className="mt-3 text-sm text-slate-500">No parts selected yet.</p>}
      </section>

      <section className="rounded-xl border p-4 text-sm"><div className="flex justify-between"><span>Parts</span><span>€{partsCost.toFixed(2)}</span></div><div className="mt-2 flex justify-between"><span>Mechanic work</span><span>€{labourCost.toFixed(2)}</span></div><div className="mt-2 flex justify-between border-t pt-2 font-semibold"><span>Final price</span><span>€{(partsCost + labourCost).toFixed(2)}</span></div><div className="mt-2 flex justify-between text-slate-500"><span>Estimated time</span><span>{estimatedDays}d {estimatedHours}h</span></div><div className="mt-2 flex justify-between text-slate-500"><span>Your completion bonus (10% of work price)</span><span>€{(labourCost * 0.1).toFixed(2)}</span></div></section>
      <div className="flex gap-3"><button disabled={saving || totalEstimatedMinutes < 1 || lines.some((line) => line.qty < 1)} className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-50">{saving ? "Saving..." : "Create job"}</button><button type="button" onClick={() => navigate("/mechanic/problems")} className="rounded-lg border px-4 py-2">Cancel</button></div>
    </form>}
  </div>;
}
