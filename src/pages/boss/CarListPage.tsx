import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { getCars, type CarRow } from "../../api/cars";

export default function CarsListPage() {
  const [cars, setCars] = useState<CarRow[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCars().then(setCars).catch((e) => setError(e instanceof Error ? e.message : "Failed to load cars"));
  }, []);

  const filteredCars = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return cars;
    return cars.filter((car) => `${car.brand} ${car.model} ${car.vin} ${car.customerName ?? ""}`.toLowerCase().includes(query));
  }, [cars, search]);

  return <div>
    <PageHeader title="Cars" subtitle="Cars and their service history." crumbs={[{ label: "Boss", to: "/boss/mechanics" }, { label: "Cars" }]} />
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><input className="rounded-lg border px-3 py-2 text-sm sm:w-80" placeholder="Search by vehicle, VIN, or customer" value={search} onChange={(e) => setSearch(e.target.value)} /><Link to="/boss/cars/new" className="rounded-lg bg-slate-900 px-3 py-2 text-center text-sm font-medium text-white">+ Add car</Link></div>
    {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <div className="mt-4 overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3 text-left">Brand</th><th className="px-4 py-3 text-left">Model</th><th className="px-4 py-3 text-left">VIN</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Engine</th><th className="px-4 py-3 text-left">HP</th><th className="px-4 py-3 text-left">Action</th></tr></thead><tbody>{filteredCars.map((car) => <tr key={car.id} className="border-t"><td className="px-4 py-3">{car.brand}</td><td className="px-4 py-3">{car.model}</td><td className="px-4 py-3 font-mono text-xs">{car.vin}</td><td className="px-4 py-3">{car.customerId ? <Link className="underline" to={`/boss/customers/${car.customerId}`}>{car.customerName}</Link> : <span className="text-slate-500">Unassigned</span>}</td><td className="px-4 py-3">{car.engineType}</td><td className="px-4 py-3">{car.horsePower}</td><td className="px-4 py-3"><Link to={`/boss/cars/${car.id}`} className="rounded-lg border px-3 py-1">History</Link></td></tr>)}</tbody></table></div>
  </div>;
}
