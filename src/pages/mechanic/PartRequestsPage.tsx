import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createPartRequest, getMyPartRequests, type PartRequest } from "../../api/partRequests";
import { getCatalogParts, type CatalogPart } from "../../api/jobs";
import PageHeader from "../../components/PageHeader";

const badge = (status: PartRequest["status"]) => status === "PENDING" ? "bg-amber-100 text-amber-800" : status === "APPROVED" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800";

export default function PartRequestsPage() {
  const [parts, setParts] = useState<CatalogPart[]>([]); const [requests, setRequests] = useState<PartRequest[]>([]);
  const [partId, setPartId] = useState(0); const [quantity, setQuantity] = useState(1); const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null); const [saving, setSaving] = useState(false);
  useEffect(() => { Promise.all([getCatalogParts(), getMyPartRequests()]).then(([catalog, rows]) => { setParts(catalog); setPartId(catalog[0]?.id ?? 0); setRequests(rows); }).catch((e: Error) => setError(e.message)); }, []);
  async function submit(e: FormEvent) { e.preventDefault(); setSaving(true); setError(null); try { const created = await createPartRequest({ partId, quantity, note }); setRequests((current) => [created, ...current]); setQuantity(1); setNote(""); } catch (e) { setError(e instanceof Error ? e.message : "Could not create request."); } finally { setSaving(false); } }
  return <div><PageHeader title="Part requests" subtitle="Ask the boss to order additional stock." crumbs={[{ label: "Mechanic" }, { label: "Part requests" }]} />
    {error && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <form onSubmit={submit} className="mt-4 grid gap-3 rounded-xl border p-4 sm:grid-cols-6"><label className="text-sm font-medium sm:col-span-3">Part<select value={partId} onChange={(e) => setPartId(Number(e.target.value))} className="mt-1 w-full rounded-lg border p-2" required>{parts.map((part) => <option key={part.id} value={part.id}>{part.name} (stock {part.stockQty})</option>)}</select></label><label className="text-sm font-medium sm:col-span-1">Quantity<input type="number" min="1" max="10000" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="mt-1 w-full rounded-lg border p-2" required /></label><label className="text-sm font-medium sm:col-span-2">Note (optional)<input maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} className="mt-1 w-full rounded-lg border p-2" /></label><button disabled={saving || parts.length === 0} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 sm:col-span-2">{saving ? "Sending..." : "Send request"}</button></form>
    <div className="mt-4 overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3 text-left">Part</th><th className="px-4 py-3 text-left">Qty</th><th className="px-4 py-3 text-left">Note</th><th className="px-4 py-3 text-left">Created</th><th className="px-4 py-3 text-left">Status</th></tr></thead><tbody>{requests.map((request) => <tr key={request.id} className="border-t"><td className="px-4 py-3">{request.partName}</td><td className="px-4 py-3">{request.quantity}</td><td className="px-4 py-3">{request.note || "—"}</td><td className="px-4 py-3">{new Date(request.createdAt).toLocaleString()}</td><td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${badge(request.status)}`}>{request.status}</span></td></tr>)}</tbody></table>{requests.length === 0 && <p className="p-4 text-sm text-slate-500">No requests yet.</p>}</div></div>;
}
