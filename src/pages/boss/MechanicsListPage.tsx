import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../auth/AuthContext";
import { deleteMechanic, getMechanics, type MechanicDto } from "../../api/boss";

export default function MechanicsListPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<MechanicDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workingId, setWorkingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getMechanics(user.token);
        if (!cancelled) setItems(data);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load mechanics");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function remove(mechanic: MechanicDto) {
    if (!window.confirm(`Permanently delete ${mechanic.name}? This also deletes all of their jobs and part requests and cannot be undone.`)) return;
    setWorkingId(mechanic.id);
    setError(null);
    try {
      await deleteMechanic(mechanic.id);
      setItems((current) => current.filter((item) => item.id !== mechanic.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete mechanic");
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Mechanics"
        subtitle="Create mechanics or permanently remove accounts that are no longer needed."
        crumbs={[{ label: "Boss", to: "/boss" }, { label: "Mechanics" }]}
      />

      <div className="mt-4 flex justify-end">
        <Link
          to="/boss/mechanics/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add mechanic
        </Link>
      </div>

      {loading && <div className="mt-4 text-sm text-slate-600">Loading...</div>}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mt-4 space-y-3 sm:hidden">
            {items.map((m) => (
              <article key={m.id} className="rounded-xl border bg-white p-4 text-sm">
                <h2 className="font-semibold text-slate-900">{m.name}</h2>
                <p className="mt-1 break-all text-slate-600">{m.email}</p>
                <div className="mt-3 flex items-center justify-between gap-3 border-t pt-3">
                  <span>Fixed salary: <strong>{m.fixedSalary}</strong></span>
                  <button onClick={() => remove(m)} disabled={workingId === m.id} className="shrink-0 rounded-lg border border-red-200 px-3 py-1 text-red-700 disabled:opacity-50">{workingId === m.id ? "Deleting..." : "Delete"}</button>
                </div>
              </article>
            ))}
            {items.length === 0 && <p className="rounded-xl border bg-white p-4 text-sm text-slate-500">No mechanics yet.</p>}
          </div>

          <div className="mt-4 hidden overflow-x-auto rounded-xl border bg-white sm:block">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Fixed salary</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="p-3">{m.name}</td>
                  <td className="p-3">{m.email}</td>
                  <td className="p-3">{m.fixedSalary}</td>
                  <td className="p-3"><button onClick={() => remove(m)} disabled={workingId === m.id} className="rounded-lg border border-red-200 px-3 py-1 text-red-700 disabled:opacity-50">{workingId === m.id ? "Deleting..." : "Delete"}</button></td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr className="border-t">
                  <td colSpan={4} className="p-3 text-slate-500">
                    No mechanics yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </>
      )}
    </div>
  );
}
