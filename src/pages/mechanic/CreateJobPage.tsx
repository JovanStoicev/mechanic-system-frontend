import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { createJob, getCatalogCars, getCatalogParts, type CatalogCar, type CatalogPart } from "../../api/jobs";

type PartLine = { partId: number; qty: number };

export default function CreateJobPage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState<CatalogCar[]>([]);
  const [parts, setParts] = useState<CatalogPart[]>([]);
  const [carId, setCarId] = useState(0);
  const [description, setDescription] = useState("");
  const [labourCost, setLabourCost] = useState(0);
  const [lines, setLines] = useState<PartLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getCatalogCars(), getCatalogParts()])
      .then(([loadedCars, loadedParts]) => { setCars(loadedCars); setParts(loadedParts); setCarId(loadedCars[0]?.id ?? 0); })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load catalog"));
  }, []);

  const partsById = useMemo(() => new Map(parts.map((part) => [part.id, part])), [parts]);
  const partsCost = lines.reduce((sum, line) => sum + (partsById.get(line.partId)?.price ?? 0) * line.qty, 0);

  function addPart() {
    const available = parts.find((part) => part.stockQty > 0);
    if (available) setLines((current) => [...current, { partId: available.id, qty: 1 }]);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError(null); setSaving(true);
    try {
      await createJob({ carId, description, labourCost, parts: lines });
      navigate("/mechanic/jobs", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create job");
    } finally { setSaving(false); }
  }

  return <div>
    <PageHeader title="Create job" subtitle="Record parts and labour separately." crumbs={[{ label: "My jobs", to: "/mechanic/jobs" }, { label: "Create" }]} />
    {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <form onSubmit={submit} className="space-y-5">
      <div><label className="text-sm font-medium">Car</label><select className="mt-1 w-full rounded-lg border p-2" value={carId} onChange={(e) => setCarId(Number(e.target.value))} required>{cars.map((car) => <option key={car.id} value={car.id}>{car.brand} {car.model} — {car.vin}</option>)}</select></div>
      <div><label className="text-sm font-medium">Work performed</label><textarea className="mt-1 w-full rounded-lg border p-2" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} /></div>
      <div><label className="text-sm font-medium">Labour charge (€)</label><input className="mt-1 w-full rounded-lg border p-2" type="number" min="0" step="0.01" value={labourCost} onChange={(e) => setLabourCost(Number(e.target.value))} required /></div>
      <section className="rounded-xl border p-4"><div className="flex items-center justify-between"><h2 className="font-semibold">Parts used</h2><button type="button" onClick={addPart} className="rounded-lg border px-3 py-1.5 text-sm">+ Add part</button></div>
        <div className="mt-3 space-y-3">{lines.map((line, index) => { const selected = partsById.get(line.partId); return <div key={index} className="grid grid-cols-12 gap-2"><select className="col-span-8 rounded-lg border p-2" value={line.partId} onChange={(e) => setLines((current) => current.map((item, i) => i === index ? { ...item, partId: Number(e.target.value), qty: 1 } : item))}>{parts.map((part) => <option key={part.id} value={part.id} disabled={part.stockQty === 0}>{part.name} — €{part.price.toFixed(2)} (stock {part.stockQty})</option>)}</select><input className="col-span-2 rounded-lg border p-2" type="number" min="1" max={selected?.stockQty ?? 1} value={line.qty} onChange={(e) => setLines((current) => current.map((item, i) => i === index ? { ...item, qty: Number(e.target.value) } : item))} /><button type="button" className="col-span-2 rounded-lg border" onClick={() => setLines((current) => current.filter((_, i) => i !== index))}>Remove</button></div>; })}</div>
      </section>
      <section className="rounded-xl border p-4 text-sm"><div className="flex justify-between"><span>Parts</span><span>€{partsCost.toFixed(2)}</span></div><div className="mt-2 flex justify-between"><span>Labour</span><span>€{labourCost.toFixed(2)}</span></div><div className="mt-2 flex justify-between border-t pt-2 font-semibold"><span>Final price</span><span>€{(partsCost + labourCost).toFixed(2)}</span></div><div className="mt-2 flex justify-between text-slate-500"><span>Your completion bonus (10% labour)</span><span>€{(labourCost * 0.1).toFixed(2)}</span></div></section>
      <button disabled={saving || !carId || lines.length === 0} className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-50">{saving ? "Saving..." : "Create job"}</button>
    </form>
  </div>;
}
