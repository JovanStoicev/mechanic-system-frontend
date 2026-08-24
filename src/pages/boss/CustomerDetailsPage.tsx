import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { getCustomer, type CustomerDetails } from "../../api/customers";

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const customerId = Number(id);
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!Number.isInteger(customerId)) return;
    getCustomer(customerId).then(setCustomer).catch((e) => setError(e instanceof Error ? e.message : "Failed to load customer"));
  }, [customerId]);
  if (!Number.isInteger(customerId)) return <PageHeader title="Invalid customer" crumbs={[{ label: "Customers", to: "/boss/customers" }]} />;
  if (error) return <div><PageHeader title="Customer unavailable" crumbs={[{ label: "Customers", to: "/boss/customers" }]} /><div className="rounded-lg bg-red-50 p-3 text-red-700">{error}</div></div>;
  if (!customer) return <div className="text-sm text-slate-600">Loading...</div>;
  return <div>
    <PageHeader title={customer.fullName} subtitle="Customer profile and vehicle service records." crumbs={[{ label: "Customers", to: "/boss/customers" }, { label: customer.fullName }]} />
    <section className="mt-4 rounded-xl border p-4 text-sm"><div className="grid gap-4 sm:grid-cols-3"><div><span className="text-slate-500">Phone</span><p className="font-medium">{customer.phone}</p></div><div><span className="text-slate-500">Email</span><p className="font-medium">{customer.email ?? "Not provided"}</p></div><div><span className="text-slate-500">Address</span><p className="font-medium">{customer.address ?? "Not provided"}</p></div></div></section>
    <div className="mt-6 flex items-center justify-between"><h3 className="text-lg font-semibold">Vehicles</h3><Link className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white" to={`/boss/cars/new?customerId=${customer.id}`}>+ Add vehicle</Link></div>
    <div className="mt-3 overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-slate-50 text-left text-slate-600"><tr><th className="px-4 py-3">Vehicle</th><th className="px-4 py-3">VIN</th><th className="px-4 py-3">Service records</th><th className="px-4 py-3">Action</th></tr></thead><tbody>{customer.cars.map((car) => <tr key={car.id} className="border-t"><td className="px-4 py-3 font-medium">{car.brand} {car.model}</td><td className="px-4 py-3 font-mono text-xs">{car.vin}</td><td className="px-4 py-3">{car.jobCount}</td><td className="px-4 py-3"><Link className="rounded-lg border px-3 py-1" to={`/boss/cars/${car.id}`}>Service history</Link></td></tr>)}{customer.cars.length === 0 && <tr className="border-t"><td colSpan={4} className="px-4 py-4 text-slate-500">No vehicles assigned to this customer.</td></tr>}</tbody></table></div>
  </div>;
}
