import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { deleteCustomer, getCustomers, type CustomerRow } from "../../api/customers";

export default function CustomerListPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    getCustomers().then(setCustomers).catch((e) => setError(e instanceof Error ? e.message : "Failed to load customers"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customers;
    return customers.filter((customer) =>
      `${customer.fullName} ${customer.phone} ${customer.email ?? ""}`.toLowerCase().includes(query));
  }, [customers, search]);

  async function remove(customer: CustomerRow) {
    if (!window.confirm(`Delete ${customer.fullName}? Their cars and service history will be preserved as unassigned.`)) return;
    setDeletingId(customer.id);
    setError(null);
    try {
      await deleteCustomer(customer.id);
      setCustomers((current) => current.filter((item) => item.id !== customer.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete customer");
    } finally {
      setDeletingId(null);
    }
  }

  return <div>
    <PageHeader title="Customers" subtitle="Customer contacts, vehicles, and service history." crumbs={[{ label: "Boss", to: "/boss/mechanics" }, { label: "Customers" }]} />
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <input className="rounded-lg border px-3 py-2 text-sm sm:w-80" placeholder="Search by name, phone, or email" value={search} onChange={(e) => setSearch(e.target.value)} />
      <span className="text-sm text-slate-500">Customers register their own accounts.</span>
    </div>
    {loading && <div className="mt-4 text-sm text-slate-600">Loading...</div>}
    {error && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {!loading && <div className="mt-4 overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-slate-50 text-left text-slate-600"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Cars</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>
      {filtered.map((customer) => <tr key={customer.id} className="border-t"><td className="px-4 py-3 font-medium">{customer.fullName}</td><td className="px-4 py-3">{customer.phone}</td><td className="px-4 py-3">{customer.email ?? "—"}</td><td className="px-4 py-3">{customer.carCount}</td><td className="px-4 py-3"><div className="flex gap-2"><Link className="rounded-lg border px-3 py-1" to={`/boss/customers/${customer.id}`}>View</Link><button className="rounded-lg border border-red-200 px-3 py-1 text-red-700 disabled:opacity-50" disabled={deletingId === customer.id} onClick={() => remove(customer)}>{deletingId === customer.id ? "Deleting..." : "Delete"}</button></div></td></tr>)}
      {filtered.length === 0 && <tr className="border-t"><td colSpan={5} className="px-4 py-4 text-slate-500">No customers found.</td></tr>}
    </tbody></table></div>}
  </div>;
}
