import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { customerPortal, type CustomerCar, type MechanicOption } from "../../api/customerPortal";

function defaultAppointment() {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  date.setMinutes(0, 0, 0);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export default function CreateProblemPage() {
  const [cars, setCars] = useState<CustomerCar[]>([]);
  const [mechanics, setMechanics] = useState<MechanicOption[]>([]);
  const [carId, setCar] = useState(0);
  const [mechanicId, setMechanic] = useState(0);
  const [description, setDescription] = useState("");
  const [appointmentAt, setAppointmentAt] = useState(defaultAppointment);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([customerPortal.cars(), customerPortal.mechanics()]).then(([loadedCars, loadedMechanics]) => {
      setCars(loadedCars); setMechanics(loadedMechanics);
      if (loadedCars[0]) setCar(loadedCars[0].id);
      if (loadedMechanics[0]) setMechanic(loadedMechanics[0].id);
    }).catch((e) => setError(e.message));
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError(""); setSaving(true);
    try {
      await customerPortal.createProblem({ carId, mechanicId, description, appointmentAt: new Date(appointmentAt).toISOString() });
      navigate("/customer/problems");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not submit"); }
    finally { setSaving(false); }
  }

  return <form className="space-y-4" onSubmit={submit}>
    <h2 className="text-xl font-bold">Report a car problem</h2>
    <p className="text-sm text-slate-600">Choose your car, mechanic, and preferred inspection time.</p>
    {error && <p className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
    <label className="block text-sm font-medium">Car<select className="mt-1 w-full rounded-lg border p-2" value={carId} onChange={(e) => setCar(Number(e.target.value))}>{cars.map((car) => <option key={car.id} value={car.id}>{car.brand} {car.model} — {car.vin}</option>)}</select></label>
    <label className="block text-sm font-medium">Mechanic<select className="mt-1 w-full rounded-lg border p-2" value={mechanicId} onChange={(e) => setMechanic(Number(e.target.value))}>{mechanics.map((mechanic) => <option key={mechanic.id} value={mechanic.id}>{mechanic.name}</option>)}</select></label>
    <label className="block text-sm font-medium">Preferred appointment<input required type="datetime-local" min={new Date().toISOString().slice(0, 16)} className="mt-1 w-full rounded-lg border p-2" value={appointmentAt} onChange={(e) => setAppointmentAt(e.target.value)} /><span className="mt-1 block text-xs font-normal text-slate-500">The mechanic can confirm this time or propose another one.</span></label>
    <label className="block text-sm font-medium">What is wrong?<textarea required maxLength={4000} rows={5} className="mt-1 w-full rounded-lg border p-2" value={description} onChange={(e) => setDescription(e.target.value)} /></label>
    <button disabled={!carId || !mechanicId || !appointmentAt || saving} className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-50">{saving ? "Sending..." : "Send to mechanic"}</button>
  </form>;
}
