import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import DashboardCard from "../../components/DashboardCard";
import { getMechanicDashboard, type MechanicDashboard } from "../../api/dashboards";

export default function MechanicHome() {
  const [data, setData] = useState<MechanicDashboard|null>(null); const [error, setError] = useState("");
  useEffect(() => { getMechanicDashboard().then(setData).catch((e) => setError(e instanceof Error ? e.message : "Could not load dashboard")); }, []);
  return <div><PageHeader title="Dashboard" subtitle="Your assigned work and items requiring attention." crumbs={[{label:"Mechanic"},{label:"Dashboard"}]} />{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}{!data && !error && <p className="text-sm text-slate-500">Loading dashboard...</p>}{data && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><DashboardCard label="Assigned problems" value={data.assignedProblems} detail="New or returned estimates" to="/mechanic/problems"/><DashboardCard label="Active jobs" value={data.activeJobs} detail="Repairs currently open" to="/mechanic/jobs"/><DashboardCard label="Upcoming appointments" value={data.upcomingAppointments} detail="Confirmed customer visits" to="/mechanic/problems"/><DashboardCard label="Pending part requests" value={data.pendingPartRequests} detail="Waiting for the boss" to="/mechanic/part-requests"/><DashboardCard label="Unread notifications" value={data.unreadNotifications} detail="Recent updates" to="/mechanic/notifications"/></div>}</div>;
}
