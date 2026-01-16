import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PageHeader from "../../components/PageHeader"

export default function AddMechanicPage() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [fixedSalary, setFixedSalary] = useState<number>(800)
  const [password, setPassword] = useState("")

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    // mocked: later POST /api/boss/mechanics
    console.log({ name, email, fixedSalary, password })

    navigate("/boss/mechanics", { replace: true })
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

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium">Full name</label>
          <input
            className="mt-1 w-full rounded-lg border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Marko Markovic"
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
            placeholder="e.g. marko@garage.com"
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
          <p className="mt-1 text-xs text-slate-500">
            Bonus is +10% of job labor earnings (we’ll calculate later).
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">Temporary password</label>
          <input
            className="mt-1 w-full rounded-lg border p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder="Set initial password"
          />
        </div>

        <div className="flex gap-2">
          <button
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            type="submit"
          >
            Create mechanic
          </button>
          <button
            className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
            type="button"
            onClick={() => navigate("/boss/mechanics")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
