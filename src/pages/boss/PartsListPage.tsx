import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBossParts, type Part } from "../../api/parts";
import PageHeader from "../../components/PageHeader";

export default function PartsListPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBossParts().then(setParts).catch((e: Error) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  return <div>
    <PageHeader title="Parts" subtitle="Live inventory shared with mechanics and part requests." crumbs={[{ label: "Boss", to: "/boss/mechanics" }, { label: "Parts" }]} />
    <div className="flex items-center justify-end"><Link to="/boss/parts/new" className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">+ Add part</Link></div>
    {error && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {loading ? <p className="mt-4 text-sm text-slate-500">Loading...</p> : <div className="mt-4 overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3 text-left">Part</th><th className="px-4 py-3 text-left">Price (€)</th><th className="px-4 py-3 text-left">Stock</th><th className="px-4 py-3 text-left">Status</th></tr></thead><tbody>{parts.map((part) => { const low = part.stockQty <= 3; return <tr key={part.id} className="border-t"><td className="px-4 py-3">{part.name}</td><td className="px-4 py-3">{part.price.toFixed(2)}</td><td className="px-4 py-3">{part.stockQty}</td><td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${low ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{low ? "Low stock" : "OK"}</span></td></tr>; })}</tbody></table>{parts.length === 0 && <p className="p-4 text-sm text-slate-500">No parts in inventory.</p>}</div>}
  </div>;
}
