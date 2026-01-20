import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { useBossData } from "../../boss/BossDataContext";
import { useAuth } from "../../auth/AuthContext";

export default function MyJobsPage() {
  const { user } = useAuth();
  const { jobs, cars, mechanics } = useBossData();

  // temporary: pick first mechanic as "me"
  const myMechanicId = mechanics[0]?.id ?? 1;
  const myJobs = jobs.filter((j) => j.mechanicId === myMechanicId);

  const carById = new Map(cars.map((c) => [c.id, c]));

  return (
    <div>
      <PageHeader
        title="My jobs"
        subtitle={`Logged in as: ${user?.name ?? "Mechanic"}`}
        crumbs={[
          { label: "Mechanic", to: "/mechanic/jobs" },
          { label: "My jobs" },
        ]}
      />

      <div className="flex items-center justify-end">
        <Link
          to="/mechanic/jobs/new"
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Create job
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Car</th>
              <th className="px-4 py-3 text-left font-semibold">Description</th>
              <th className="px-4 py-3 text-left font-semibold">Labor (€)</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {myJobs.map((j) => {
              const car = carById.get(j.carId);
              return (
                <tr key={j.id} className="border-t">
                  <td className="px-4 py-3">
                    {car ? `${car.brand} ${car.model}` : "Unknown car"}
                  </td>
                  <td className="px-4 py-3">{j.description}</td>
                  <td className="px-4 py-3">{j.totalCost.toFixed(2)}</td>
                  <td className="px-4 py-3">{j.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
