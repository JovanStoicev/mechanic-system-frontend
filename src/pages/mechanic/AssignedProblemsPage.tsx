import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { customerPortal, type Problem } from "../../api/customerPortal";

function estimatedTime(minutes: number | null) {
  if (!minutes) return "";
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  return `${days}d ${hours}h`;
}

export default function AssignedProblemsPage() {
  const [items, setItems] = useState<Problem[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { customerPortal.assignedProblems().then(setItems).catch((e) => setError(e.message)); }, []);

  return <>
    <h2 className="text-xl font-bold">Assigned customer problems</h2>
    <p className="text-sm text-slate-600">Use a submitted problem as the starting point for a job estimate.</p>
    {error && <p className="mt-3 text-red-700">{error}</p>}
    <div className="mt-4 space-y-3">{items.map((problem) => <article className="rounded-lg border p-3" key={problem.id}>
      <div className="flex justify-between"><b>{problem.carName} • {problem.customerName}</b><span>{problem.status}</span></div>
      <p className="my-2">{problem.description}</p>
      {problem.status === "SUBMITTED"
        ? <Link className="inline-block rounded-lg bg-slate-900 px-3 py-2 text-sm text-white" to={`/mechanic/problems/${problem.id}/job`}>Create job & estimate</Link>
        : <p className="text-sm text-slate-600">Job #{problem.jobId} • estimate {estimatedTime(problem.estimatedMinutes)}</p>}
    </article>)}</div>
  </>;
}
