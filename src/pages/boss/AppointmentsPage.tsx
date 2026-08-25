import { useEffect, useMemo, useState } from "react";
import { getBossAppointments, type BossAppointment } from "../../api/appointments";
import PageHeader from "../../components/PageHeader";

export default function AppointmentsPage() {
  const [items, setItems] = useState<BossAppointment[]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  useEffect(() => { getBossAppointments().then(setItems).catch((e) => setError(e instanceof Error ? e.message : "Could not load appointments")); }, []);
  const visible = useMemo(() => items.filter((item) => status === "ALL" || (status === "ACTIVE" ? item.status !== "CANCELLED" : item.status === status)), [items, status]);

  return <div>
    <PageHeader title="Appointments" subtitle="Garage-wide inspection schedule for all mechanics." crumbs={[{ label: "Boss" }, { label: "Appointments" }]} />
    {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
    <div className="mb-4 flex items-center gap-2"><label className="text-sm font-medium">Show<select className="ml-2 rounded-lg border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}><option value="ACTIVE">Active</option><option value="REQUESTED">Requested</option><option value="PROPOSED">Proposed</option><option value="CONFIRMED">Confirmed</option><option value="CANCELLED">Cancelled</option><option value="ALL">All</option></select></label></div>
    <div className="space-y-3">{visible.map((appointment) => <article key={appointment.problemId} className="rounded-xl border p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-lg font-semibold">{new Date(appointment.appointmentAt).toLocaleString()}</p><p className="text-sm text-slate-600">{appointment.carName} • {appointment.vin}</p></div><span className={`rounded-full px-2 py-1 text-xs font-semibold ${appointment.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-800" : appointment.status === "CANCELLED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>{appointment.status}</span></div><div className="mt-3 grid gap-2 text-sm sm:grid-cols-2"><p><span className="text-slate-500">Customer:</span> {appointment.customerName}</p><p><span className="text-slate-500">Mechanic:</span> {appointment.mechanicName}</p></div><p className="mt-2 text-sm">{appointment.description}</p></article>)}</div>
    {visible.length === 0 && <p className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-500">No appointments match this filter.</p>}
  </div>;
}
