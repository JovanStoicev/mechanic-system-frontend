import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../auth/AuthContext";
import { useBossData } from "../../boss/BossDataContext";

type PartLine = { partId: number; qty: number };

const money = (n: number) => n.toFixed(2);

export default function CreateJobPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { cars, parts, mechanics, addJob, addJobPart } = useBossData();

  // TEMP mapping: pick first mechanic. Later: map by user.email -> mechanicId from backend.
  const mechanicId = useMemo(() => mechanics[0]?.id ?? 1, [mechanics]);

  const [carId, setCarId] = useState<number>(cars[0]?.id ?? 0);
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState<PartLine[]>([]);

  const partsById = useMemo(
    () => new Map(parts.map((p) => [p.id, p])),
    [parts],
  );

  const selectedQtyByPartId = useMemo(() => {
    const m = new Map<number, number>();
    for (const l of lines) {
      m.set(l.partId, (m.get(l.partId) ?? 0) + (l.qty || 0));
    }
    return m;
  }, [lines]);

  function allowedQtyForLine(partId: number, lineIndex: number) {
    const stock = partsById.get(partId)?.stockQty ?? 0;
    const currentLineQty = lines[lineIndex]?.qty ?? 0;
    const totalSelected = selectedQtyByPartId.get(partId) ?? 0;
    const usedWithoutThisLine = totalSelected - currentLineQty;
    return Math.max(0, stock - usedWithoutThisLine);
  }

  function updateLine(idx: number, patch: Partial<PartLine>) {
    setLines((prev) =>
      prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)),
    );
  }

  function removeLine(idx: number) {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  }

  function addLine() {
    const available = parts.find((p) => {
      const used = selectedQtyByPartId.get(p.id) ?? 0;
      return used < p.stockQty;
    });

    if (!available) {
      alert("No parts available in stock.");
      return;
    }

    // New line index will be current length
    const idx = lines.length;
    const max = allowedQtyForLine(available.id, idx);
    if (max <= 0) {
      alert("No parts available in stock.");
      return;
    }

    setLines((prev) => [...prev, { partId: available.id, qty: 1 }]);
  }

  const partsTotal = useMemo(() => {
    return lines.reduce((sum, l) => {
      const part = partsById.get(l.partId);
      return sum + (part?.price ?? 0) * l.qty;
    }, 0);
  }, [lines, partsById]);

  const workCost = useMemo(() => {
    return Math.round(partsTotal * 0.2 * 100) / 100;
  }, [partsTotal]);

  const totalCost = useMemo(() => {
    return Math.round((partsTotal + workCost) * 100) / 100;
  }, [partsTotal, workCost]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!carId) return;

    // Final validation: no line may exceed remaining stock (accounting for duplicates)
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      const max = allowedQtyForLine(l.partId, i);
      if (l.qty > max) {
        alert("One of the selected quantities exceeds available stock.");
        return;
      }
      if (max <= 0) {
        alert("One of the selected parts is out of stock.");
        return;
      }
    }

    const jobId = addJob({
      carId,
      mechanicId,
      description,
      totalCost,
      status: "OPEN",
    });

    for (const l of lines) {
      addJobPart({ jobId, partId: l.partId, qty: l.qty });
    }

    navigate("/mechanic/jobs", { replace: true });
  }

  return (
    <div>
      <PageHeader
        title="Create job"
        subtitle={`Logged in as: ${user?.name ?? "Mechanic"}`}
        crumbs={[
          { label: "Mechanic", to: "/mechanic/jobs" },
          { label: "Create job" },
        ]}
      />

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-medium">Car</label>
          <select
            className="mt-1 w-full rounded-lg border p-2 bg-white"
            value={carId}
            onChange={(e) => setCarId(Number(e.target.value))}
            required
          >
            {cars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.brand} {c.model} — {c.vin}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            className="mt-1 w-full rounded-lg border p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="e.g. Changed oil + filter, checked brakes..."
            rows={3}
          />
        </div>

        <div className="rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Parts used</div>
              <div className="text-xs text-slate-500 mt-1">
                Add parts that you changed on this job. Quantity cannot exceed
                stock.
              </div>
            </div>

            <button
              type="button"
              onClick={addLine}
              className="rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              + Add part
            </button>
          </div>

          {lines.length === 0 ? (
            <div className="mt-3 text-sm text-slate-600">
              No parts added yet.
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {lines.map((l, idx) => {
                const maxQty = allowedQtyForLine(l.partId, idx);
                const part = partsById.get(l.partId);
                const lineTotal = (part?.price ?? 0) * l.qty;

                return (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-12 md:col-span-7">
                      <label className="text-xs font-medium text-slate-600">
                        Part
                      </label>
                      <select
                        className="mt-1 w-full rounded-lg border p-2 bg-white"
                        value={l.partId}
                        onChange={(e) => {
                          const newPartId = Number(e.target.value);
                          const newMax = allowedQtyForLine(newPartId, idx);
                          const newQty = Math.min(l.qty, Math.max(1, newMax));
                          updateLine(idx, { partId: newPartId, qty: newQty });
                        }}
                      >
                        {parts.map((p) => {
                          const used = selectedQtyByPartId.get(p.id) ?? 0;
                          const remaining = Math.max(
                            0,
                            p.stockQty - used + (p.id === l.partId ? l.qty : 0),
                          );
                          return (
                            <option
                              key={p.id}
                              value={p.id}
                              disabled={remaining <= 0 && p.id !== l.partId}
                            >
                              {p.name} (€{money(p.price)}) — stock: {p.stockQty}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="col-span-6 md:col-span-2">
                      <label className="text-xs font-medium text-slate-600">
                        Quantity
                      </label>

                      <input
                        className="mt-1 w-full rounded-lg border p-2"
                        type="number"
                        min={1}
                        max={maxQty}
                        value={l.qty}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          const clamped = Math.min(
                            Math.max(1, v),
                            Math.max(1, maxQty),
                          );
                          updateLine(idx, { qty: clamped });
                        }}
                      />
                    </div>

                    <div className="col-span-6 md:col-span-2">
                      <label className="text-xs font-medium text-slate-600">
                        Line total
                      </label>
                      <div className="mt-1 w-full rounded-lg border bg-slate-50 p-2 text-sm">
                        {money(lineTotal)} €
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-1">
                      <button
                        type="button"
                        onClick={() => removeLine(idx)}
                        className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border p-4">
          <div className="text-sm font-semibold">Cost summary</div>

          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Parts total</span>
              <span>{money(partsTotal)} €</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Work (20%)</span>
              <span>{money(workCost)} €</span>
            </div>

            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span>{money(totalCost)} €</span>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Total cost = parts + 20% work
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            type="submit"
            disabled={lines.length === 0}
            title={lines.length === 0 ? "Add at least one part" : "Save job"}
          >
            Save job
          </button>

          <button
            className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
            type="button"
            onClick={() => navigate("/mechanic/jobs")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
