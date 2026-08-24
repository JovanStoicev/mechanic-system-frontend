import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { customerPortal, type CustomerCar } from "../../api/customerPortal";

export default function MyCarsPage() {
  const [cars, setCars] = useState<CustomerCar[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    customerPortal.cars().then(setCars).catch((e) => setError(e.message));
  }, []);

  return <>
    <div className="flex items-start justify-between gap-4 border-b pb-4">
      <div>
        <h2 className="text-xl font-bold">My cars</h2>
        <p className="text-sm text-slate-600">Cars registered to your account.</p>
      </div>
      <Link className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800" to="/customer/cars/new">
        <span className="text-lg leading-none">+</span> Add car
      </Link>
    </div>
    {error && <p className="mt-4 text-red-700">{error}</p>}
    <div className="mt-4 space-y-2">
      {cars.map((car) => <div key={car.id} className="flex items-center justify-between rounded-lg border p-3">
        <div><b>{car.brand} {car.model}</b><div className="text-sm text-slate-600">{car.vin} • {car.engineType} • {car.horsePower} HP</div></div>
        <Link className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-slate-50" to={`/customer/cars/${car.id}/edit`}>Edit</Link>
      </div>)}
      {!cars.length && !error && <p className="text-sm text-slate-500">No cars yet.</p>}
    </div>
  </>;
}
