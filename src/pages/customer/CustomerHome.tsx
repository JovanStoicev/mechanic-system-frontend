import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import DashboardCard from "../../components/DashboardCard";
import { getCustomerDashboard, type CustomerDashboard } from "../../api/dashboards";

export default function CustomerHome() {
  const [data, setData] = useState<CustomerDashboard|null>(null); const [error, setError] = useState("");
  useEffect(() => { getCustomerDashboard().then(setData).catch((e) => setError(e instanceof Error ? e.message : "Could not load dashboard")); }, []);
  return <div><PageHeader title="Dashboard" subtitle="Your cars, repairs, appointments, and garage updates." crumbs={[{label:"Customer"},{label:"Dashboard"}]} />{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}{!data && !error && <p className="text-sm text-slate-500">Loading dashboard...</p>}{data && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><DashboardCard label="My cars" value={data.cars} detail="Vehicles on your account" to="/customer/cars"/><DashboardCard label="Active repairs" value={data.activeRepairs} detail="Problems and current work" to="/customer/problems"/><DashboardCard label="Upcoming appointments" value={data.upcomingAppointments} detail="Confirmed future visits" to="/customer/problems"/><DashboardCard label="Invoices" value={data.invoices} detail="Completed repair documents" to="/customer/invoices"/><DashboardCard label="Unread notifications" value={data.unreadNotifications} detail="Recent updates" to="/customer/notifications"/></div>}</div>;
}
