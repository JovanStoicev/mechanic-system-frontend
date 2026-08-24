import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { createCustomer, getCustomer, updateCustomer } from "../../api/customers";

export default function CustomerFormPage() {
  const { id } = useParams();
  const customerId = id ? Number(id) : null;
  const editing = customerId !== null;
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editing || !Number.isInteger(customerId)) return;
    getCustomer(customerId).then((customer) => {
      setFullName(customer.fullName); setPhone(customer.phone); setEmail(customer.email ?? ""); setAddress(customer.address ?? "");
    }).catch((e) => setError(e instanceof Error ? e.message : "Failed to load customer"));
  }, [customerId, editing]);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError(null);
    try {
      const input = { fullName, phone, email, address };
      const saved = editing && customerId ? await updateCustomer(customerId, input) : await createCustomer(input);
      navigate(`/boss/customers/${saved.id}`, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save customer"); setSaving(false);
    }
  }

  return <div>
    <PageHeader title={editing ? "Edit customer" : "Add customer"} subtitle="Store contact information and connect vehicles to their owner." crumbs={[{ label: "Customers", to: "/boss/customers" }, { label: editing ? "Edit" : "Add" }]} />
    {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <form onSubmit={submit} className="space-y-4">
      <div><label className="text-sm font-medium">Full name</label><input className="mt-1 w-full rounded-lg border p-2" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={200} /></div>
      <div><label className="text-sm font-medium">Phone</label><input className="mt-1 w-full rounded-lg border p-2" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={50} /></div>
      <div><label className="text-sm font-medium">Email (optional)</label><input className="mt-1 w-full rounded-lg border p-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} /></div>
      <div><label className="text-sm font-medium">Address (optional)</label><textarea className="mt-1 w-full rounded-lg border p-2" value={address} onChange={(e) => setAddress(e.target.value)} maxLength={500} rows={3} /></div>
      <div className="flex gap-2"><button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50" disabled={saving}>{saving ? "Saving..." : "Save"}</button><button type="button" className="rounded-lg border px-4 py-2 text-sm" onClick={() => navigate("/boss/customers")}>Cancel</button></div>
    </form>
  </div>;
}
