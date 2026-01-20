import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { useBossData } from "../../boss/BossDataContext";

export default function JobDetailsPage() {
  const { id } = useParams();
  const jobId = Number(id);

  const { jobs, cars, mechanics, parts, jobParts, setJobStatus } =
    useBossData();

  const job = jobs.find((j) => j.id === jobId);
  const car = job ? cars.find((c) => c.id === job.carId) : undefined;
  const mech = job ? mechanics.find((m) => m.id === job.mechanicId) : undefined;

  const partsById = new Map(parts.map((p) => [p.id, p]));
  const used = jobParts.filter((jp) => jp.jobId === jobId);

  if (!job) {
    return (
      <div>
        <PageHeader
          title="Job not found"
          crumbs={[
            { label: "Boss", to: "/boss/jobs" },
            { label: "Jobs", to: "/boss/jobs" },
          ]}
        />
        <Link className="underline" to="/boss/jobs">
          Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Job #${job.id}`}
        subtitle="Job details (boss view)."
        crumbs={[
          { label: "Boss", to: "/boss/jobs" },
          { label: "Jobs", to: "/boss/jobs" },
          { label: `#${job.id}` },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4">
          <div className="text-sm font-semibold">Car</div>
          {car ? (
            <div className="mt-2">
              <div className="font-medium">
                {car.brand} {car.model}
              </div>
              <div className="text-xs text-slate-500 font-mono mt-1">
                {car.vin}
              </div>
              <div className="text-sm text-slate-600 mt-2">
                {car.engineType} • {car.horsePower} HP
              </div>
            </div>
          ) : (
            <div className="text-slate-500 mt-2">Unknown car</div>
          )}
        </div>

        <div className="rounded-xl border p-4">
          <div className="text-sm font-semibold">Mechanic</div>
          <div className="mt-2">{mech?.name ?? "Unknown mechanic"}</div>

          <div className="mt-4 text-sm font-semibold">Total</div>
          <div className="mt-2">{job.totalCost} €</div>

          <div className="mt-4 text-sm font-semibold">Status</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm">{job.status}</span>

            {job.status === "OPEN" ? (
              <button
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
                onClick={() => setJobStatus(job.id, "DONE")}
              >
                Mark DONE
              </button>
            ) : (
              <button
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
                onClick={() => setJobStatus(job.id, "OPEN")}
              >
                Re-open
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Parts used</div>
            <div className="text-xs text-slate-500 mt-1">
              (Mechanic will add these in the next step.)
            </div>
          </div>
        </div>

        {used.length === 0 ? (
          <div className="mt-3 text-sm text-slate-600">
            No parts recorded yet.
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Part</th>
                  <th className="px-4 py-3 text-left font-semibold">Qty</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Unit price (€)
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Total (€)
                  </th>
                </tr>
              </thead>
              <tbody>
                {used.map((u) => {
                  const part = partsById.get(u.partId);
                  const unit = part?.price ?? 0;
                  return (
                    <tr key={u.id} className="border-t">
                      <td className="px-4 py-3">
                        {part?.name ?? "Unknown part"}
                      </td>
                      <td className="px-4 py-3">{u.qty}</td>
                      <td className="px-4 py-3">{unit}</td>
                      <td className="px-4 py-3">{unit * u.qty}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4">
        <Link to="/boss/jobs" className="text-sm underline text-slate-700">
          Back to jobs
        </Link>
      </div>
    </div>
  );
}
