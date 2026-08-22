import { useEffect, useState } from "react";
import { getFinanceReport, type FinanceReport } from "../../api/finance";
import PageHeader from "../../components/PageHeader";

const currentMonth = () => new Date().toISOString().slice(0, 7);
const money = (value: number) => `€${value.toFixed(2)}`;

export default function FinanceDashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [report, setReport] = useState<FinanceReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const [year, month] = selectedMonth.split("-").map(Number); getFinanceReport(year, month).then(setReport).catch((e: Error) => setError(e.message)).finally(() => setLoading(false)); }, [selectedMonth]);
  const cards = report ? [
    ["Job revenue", report.revenue, `${report.completedJobs} completed jobs`],
    ["Salary expenses", report.salaryExpenses, "Fixed salaries + bonuses"],
    ["Inventory expenses", report.inventoryExpenses, "Parts received this month"],
    ["Estimated result", report.estimatedResult, "Revenue − recorded expenses"],
  ] as const : [];
  return <div><PageHeader title="Financial dashboard" subtitle="Monthly revenue, recorded expenses, and estimated operating result." crumbs={[{ label: "Boss", to: "/boss/mechanics" }, { label: "Finance" }]} />
    <label className="mt-4 block text-sm font-medium">Report month<input type="month" min="2000-01" max="2100-12" value={selectedMonth} onChange={(e) => { setSelectedMonth(e.target.value); setLoading(true); setError(null); }} className="mt-1 block rounded-lg border px-3 py-2" /></label>
    {error && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {loading ? <p className="mt-4 text-sm text-slate-500">Loading...</p> : report && <><div className="mt-4 grid gap-3 sm:grid-cols-2">{cards.map(([label, value, detail]) => <section key={label} className="rounded-xl border p-4"><p className="text-sm text-slate-500">{label}</p><p className={`mt-1 text-2xl font-bold ${label === "Estimated result" && value < 0 ? "text-red-700" : ""}`}>{money(value)}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></section>)}</div>
      <section className="mt-4 rounded-xl border p-4"><h2 className="font-semibold">Revenue breakdown</h2><div className="mt-3 space-y-2 text-sm"><div className="flex justify-between"><span>Parts charged on completed jobs</span><strong>{money(report.partsRevenue)}</strong></div><div className="flex justify-between"><span>Labour charged on completed jobs</span><strong>{money(report.labourRevenue)}</strong></div><div className="flex justify-between border-t pt-2"><span>Total revenue</span><strong>{money(report.revenue)}</strong></div></div></section>
      <section className="mt-4 rounded-xl border p-4"><h2 className="font-semibold">Received inventory</h2>{report.receivedOrders.length === 0 ? <p className="mt-2 text-sm text-slate-500">No received part orders in this month.</p> : <div className="mt-3 overflow-x-auto"><table className="w-full text-sm"><thead><tr><th className="py-2 text-left">Part</th><th className="py-2 text-left">Received</th><th className="py-2 text-right">Qty</th><th className="py-2 text-right">Catalog price</th><th className="py-2 text-right">Estimated cost</th></tr></thead><tbody>{report.receivedOrders.map((order) => <tr key={order.requestId} className="border-t"><td className="py-2">{order.partName}</td><td>{new Date(order.receivedAt).toLocaleDateString()}</td><td className="text-right">{order.quantity}</td><td className="text-right">{money(order.unitPrice)}</td><td className="text-right">{money(order.total)}</td></tr>)}</tbody></table></div>}</section>
      <p className="mt-3 text-xs text-slate-500">Inventory spending is estimated using the part's current catalog price because supplier cost history is not stored yet.</p></>}
  </div>;
}
