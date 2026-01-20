import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { useBossData } from "../../boss/BossDataContext";

export default function JobsListPage() {
  const { jobs, cars, mechanics } = useBossData();

  const carById = new Map(cars.map((c) => [c.id, c]));
  const mechById = new Map(mechanics.map((m) => [m.id, m]));

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle="All workshop jobs (boss view)."
        crumbs={[{ label: "Boss", to: "/boss/mechanics" }, { label: "Jobs" }]}
      />

      <div className="mt-4 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Car</th>
              <th className="px-4 py-3 text-left font-semibold">Mechanic</th>
              <th className="px-4 py-3 text-left font-semibold">Description</th>
              <th className="px-4 py-3 text-left font-semibold">Total (€)</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((j) => {
              const car = carById.get(j.carId);
              const mech = mechById.get(j.mechanicId);

              return (
                <tr key={j.id} className="border-t">
                  <td className="px-4 py-3">
                    {car ? (
                      <div>
                        <div className="font-medium">
                          {car.brand} {car.model}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          {car.vin}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500">Unknown car</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {mech?.name ?? "Unknown mechanic"}
                  </td>
                  <td className="px-4 py-3">{j.description}</td>
                  <td className="px-4 py-3">{j.totalCost}</td>

                  <td className="px-4 py-3">
                    <span
                      className={[
                        "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                        j.status === "DONE"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800",
                      ].join(" ")}
                    >
                      {j.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <Link
                      to={`/boss/jobs/${j.id}`}
                      className="rounded-lg border px-3 py-1 hover:bg-slate-50"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Next: mechanic will create jobs; boss can mark DONE + check parts used.
      </p>
    </div>
  );
}
