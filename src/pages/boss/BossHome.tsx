import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import DashboardCard from "../../components/DashboardCard";
import { getBossDashboard, type BossDashboard } from "../../api/dashboards";

export default function BossHome() {
  const [data, setData] = useState<BossDashboard|null>(null); const [error, setError] = useState("");
  useEffect(() => { getBossDashboard().then(setData).catch((e) => setError(e instanceof Error ? e.message : "Could not load dashboard")); }, []);
  return <div><PageHeader title="Dashboard" subtitle="A live overview of the garage and this month's performance." crumbs={[{label:"Boss"},{label:"Dashboard"}]} />
    {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}{!data && !error && <p className="text-sm text-slate-500">Loading dashboard...</p>}
    {data && <><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><DashboardCard label="Active jobs" value={data.activeJobs} detail="Open garage work" to="/boss/jobs"/><DashboardCard label="Part requests" value={data.pendingPartRequests} detail="Waiting for a decision" to="/boss/part-requests"/><DashboardCard label="Upcoming appointments" value={data.upcomingAppointments} detail="Confirmed future visits" to="/boss/appointments"/><DashboardCard label="Completed this month" value={data.completedJobsThisMonth} detail="Finished repairs" to="/boss/jobs"/></div><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><DashboardCard label="Monthly revenue" value={`€${data.revenueThisMonth.toFixed(2)}`} detail="Parts and mechanic work" to="/boss/finance"/><DashboardCard label="Estimated result" value={`€${data.estimatedResultThisMonth.toFixed(2)}`} detail="Revenue minus expenses" to="/boss/finance"/><DashboardCard label="Mechanics" value={data.mechanics} detail="Garage team" to="/boss/mechanics"/><DashboardCard label="Customers" value={data.customers} detail="Registered customers" to="/boss/customers"/></div></>}
  </div>;
}
