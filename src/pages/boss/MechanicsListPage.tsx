import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../auth/AuthContext";
import { getMechanics, type MechanicDto } from "../../api/boss";

export default function MechanicsListPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<MechanicDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div>
      <PageHeader
        title="Mechanics"
        subtitle="Boss can view and create mechanics."
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
        <div className="mt-4 overflow-hidden rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Fixed salary</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="p-3">{m.name}</td>
                  <td className="p-3">{m.email}</td>
                  <td className="p-3">{m.fixedSalary}</td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr className="border-t">
                  <td colSpan={3} className="p-3 text-slate-500">
                    No mechanics yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
