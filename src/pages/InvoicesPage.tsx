import { useEffect, useState } from "react";
import { downloadInvoicePdf, getInvoices, type Invoice } from "../api/invoices";
import PageHeader from "../components/PageHeader";

export default function InvoicesPage({ role }: { role: "boss" | "customer" }) {
  const [items, setItems] = useState<Invoice[]>([]);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState<number|null>(null);
  useEffect(() => { getInvoices(role).then(setItems).catch((e) => setError(e instanceof Error ? e.message : "Could not load invoices")); }, [role]);

  async function download(invoice: Invoice) {
    try { setDownloadingId(invoice.id); setError(""); await downloadInvoicePdf(role, invoice); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not download invoice"); }
    finally { setDownloadingId(null); }
  }

  return <div>
    <PageHeader title="Invoices" subtitle={role === "boss" ? "Permanent invoices for completed garage jobs." : "Invoices for your completed repairs."} crumbs={[{ label: role === "boss" ? "Boss" : "Customer" }, { label: "Invoices" }]} />
    {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
    <div className="space-y-4">{items.map((invoice) => <article key={invoice.id} className="rounded-xl border p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold">{invoice.invoiceNumber}</h2><p className="text-sm text-slate-600">{invoice.carBrand} {invoice.carModel} • {invoice.vin}</p><p className="text-xs text-slate-500">Issued {new Date(invoice.issuedAt).toLocaleString()}</p></div><button disabled={downloadingId === invoice.id} onClick={() => download(invoice)} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50">{downloadingId === invoice.id ? "Preparing..." : "Download PDF"}</button></div>
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3"><p><span className="text-slate-500">Customer:</span> {invoice.customerName}</p><p><span className="text-slate-500">Mechanic:</span> {invoice.mechanicName}</p><p><span className="text-slate-500">Mileage:</span> {invoice.mileage.toLocaleString()} km</p></div><p className="mt-3 text-sm">{invoice.description}</p>
      <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">{invoice.parts.map((part) => <div key={`${invoice.id}-${part.name}`} className="flex justify-between"><span>{part.name} × {part.quantity}</span><span>€{part.lineTotal.toFixed(2)}</span></div>)}<div className="mt-2 flex justify-between border-t pt-2"><span>Parts</span><span>€{invoice.partsCost.toFixed(2)}</span></div><div className="mt-1 flex justify-between"><span>Mechanic work</span><span>€{invoice.labourCost.toFixed(2)}</span></div><div className="mt-1 flex justify-between font-semibold"><span>Total</span><span>€{invoice.totalCost.toFixed(2)}</span></div></div>
    </article>)}</div>
    {items.length === 0 && <p className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-500">No invoices yet. An invoice is created automatically when a job is completed.</p>}
  </div>;
}
