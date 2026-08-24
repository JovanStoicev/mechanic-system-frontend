import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { customerPortal, type CarInput } from "../../api/customerPortal";

export default function CustomerCarFormPage() {
  const { id } = useParams(); const nav = useNavigate();
  const [f, setF] = useState<CarInput>({ brand: "", model: "", vin: "", engineType: "", horsePower: 0 }); const [error, setError] = useState("");
  useEffect(() => { if (id) void customerPortal.cars().then(a => { const c = a.find(x => x.id === Number(id)); if (c) setF(c); }).catch(e => setError(e.message)); }, [id]);
  async function submit(e: React.FormEvent) { e.preventDefault(); try { if (id) await customerPortal.updateCar(Number(id), f); else await customerPortal.createCar(f); nav("/customer/cars"); } catch (x) { setError(x instanceof Error ? x.message : "Could not save car"); } }
  const fields = [
    { key: "brand", label: "Brand", placeholder: "e.g. Alfa Romeo" },
    { key: "model", label: "Model", placeholder: "e.g. 159" },
    { key: "vin", label: "VIN", placeholder: "17-character vehicle identification number" },
    { key: "engineType", label: "Engine type", placeholder: "e.g. 1.9 JTDM" },
  ] as const;

  return <form className="max-w-lg space-y-4" onSubmit={submit}>
    <div><h2 className="text-xl font-bold">{id ? "Edit car" : "Add a new car"}</h2><p className="text-sm text-slate-600">Enter the vehicle information below.</p></div>
    {error && <p className="text-red-700">{error}</p>}
    {fields.map(({ key, label, placeholder }) => <label className="block text-sm font-medium" key={key}>{label}<input required minLength={key === "vin" ? 17 : undefined} maxLength={key === "vin" ? 17 : undefined} placeholder={placeholder} className="mt-1 w-full rounded-lg border p-2" value={f[key]} onChange={e => setF({ ...f, [key]: e.target.value })} /></label>)}
    <label className="block text-sm font-medium">Horsepower (HP)<input required min="0" type="number" className="mt-1 w-full rounded-lg border p-2" value={f.horsePower} onChange={e => setF({ ...f, horsePower: Number(e.target.value) })} /></label>
    <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Save car</button>
  </form>;
}
