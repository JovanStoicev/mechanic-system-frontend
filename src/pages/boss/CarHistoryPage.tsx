import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { getCarHistory, type CarHistory } from "../../api/cars";

export default function CarHistoryPage() {
  const { id } = useParams();
  const carId = Number(id);
  const [car, setCar] = useState<CarHistory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isInteger(carId)) return;
    getCarHistory(carId).then(setCar).catch((e) => setError(e instanceof Error ? e.message : "Failed to load history"));
  }, [carId]);

  if (!Number.isInteger(carId)) return <PageHeader title="Invalid car ID" crumbs={[{ label: "Cars", to: "/boss/cars" }]} />;
  if (error) return <div><PageHeader title="Car unavailable" crumbs={[{ label: "Cars", to: "/boss/cars" }]} /><div className="rounded-lg bg-red-50 p-3 text-red-700">{error}</div></div>;
  if (!car) return <div className="text-sm text-slate-600">Loading...</div>;

  return <div>
    <PageHeader title={`${car.brand} ${car.model}`} subtitle={`VIN: ${car.vin}`} crumbs={[{ label: "Cars", to: "/boss/cars" }, { label: "Service history" }]} />
    <section className="rounded-xl border p-4 text-sm"><div className="grid gap-2 sm:grid-cols-4"><div><span className="text-slate-500">Customer</span><p className="font-medium">{car.customerId ? <Link className="underline" to={`/boss/customers/${car.customerId}`}>{car.customerName}</Link> : "Unassigned"}</p></div><div><span className="text-slate-500">Engine</span><p className="font-medium">{car.engineType}</p></div><div><span className="text-slate-500">Power</span><p className="font-medium">{car.horsePower} HP</p></div><div><span className="text-slate-500">Latest mileage</span><p className="font-medium">{car.jobs.length ? `${Math.max(...car.jobs.map((job) => job.mileage)).toLocaleString()} km` : "No records"}</p></div></div></section>
    <h2 className="mt-6 text-lg font-semibold">Service history</h2>
    <div className="mt-3 space-y-3">{car.jobs.length === 0 ? <div className="rounded-xl border p-4 text-sm text-slate-500">No jobs recorded for this car.</div> : car.jobs.map((job) => <article key={job.id} className="rounded-xl border p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><Link to={`/boss/jobs/${job.id}`} className="font-semibold underline">Job #{job.id}</Link><p className="mt-1 text-sm">{job.description}</p></div><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium">{job.status}</span></div><div className="mt-3 grid gap-2 text-sm sm:grid-cols-4"><div><span className="text-slate-500">Date</span><p>{new Date(job.createdAt).toLocaleDateString()}</p></div><div><span className="text-slate-500">Mileage</span><p>{job.mileage.toLocaleString()} km</p></div><div><span className="text-slate-500">Mechanic</span><p>{job.mechanicName}</p></div><div><span className="text-slate-500">Total</span><p>€{job.totalCost.toFixed(2)}</p></div></div><p className="mt-3 text-xs text-slate-500">Parts: {job.parts.length ? job.parts.map((part) => `${part.name} × ${part.qty}`).join(", ") : "None"}</p></article>)}</div>
  </div>;
}
