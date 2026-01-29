import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../auth/AuthContext";
import { createMechanic } from "../../api/boss";

export default function AddMechanicPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fixedSalary, setFixedSalary] = useState<number>(800);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setLoading(true);

    try {
      await createMechanic(user.token, {
        name,
        email,
        fixedSalary,
        tempPassword: password,
      });

      navigate("/boss/mechanics", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create mechanic",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Add mechanic"
        subtitle="Boss creates mechanic credentials. Mechanic logs in with email + password."
        crumbs={[
          { label: "Boss", to: "/boss/mechanics" },
          { label: "Mechanics", to: "/boss/mechanics" },
          { label: "Add" },
        ]}
      />

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium">Full name</label>
          <input
            className="mt-1 w-full rounded-lg border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            className="mt-1 w-full rounded-lg border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Fixed salary (€)</label>
          <input
            className="mt-1 w-full rounded-lg border p-2"
            value={fixedSalary}
            onChange={(e) => setFixedSalary(Number(e.target.value))}
            required
            type="number"
            min={0}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Temporary password</label>
          <input
            className="mt-1 w-full rounded-lg border p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
          />
        </div>

        <div className="flex gap-2">
          <button
            disabled={loading}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            type="submit"
          >
            {loading ? "Creating..." : "Create mechanic"}
          </button>

          <button
            type="button"
            className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
            onClick={() => navigate("/boss/mechanics")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
