import { Link } from "react-router-dom"
import PageHeader from "../../components/PageHeader"

type MechanicRow = {
  id: number
  name: string
  email: string
  fixedSalary: number
}

const MOCK_MECHANICS: MechanicRow[] = [
  { id: 1, name: "Marko Markovic", email: "marko@garage.com", fixedSalary: 800 },
  { id: 2, name: "Ivan Ilic", email: "ivan@garage.com", fixedSalary: 900 },
]

export default function MechanicsListPage() {
  return (
    <div>
      <PageHeader
        title="Mechanics"
        subtitle="Manage mechanics created by the boss."
        crumbs={[
          { label: "Boss", to: "/boss/mechanics" },
          { label: "Mechanics" },
        ]}
      />

      <div className="flex items-center justify-end">
        <Link
          to="/boss/mechanics/new"
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Add mechanic
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Fixed salary</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_MECHANICS.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="px-4 py-3">{m.name}</td>
                <td className="px-4 py-3">{m.email}</td>
                <td className="px-4 py-3">{m.fixedSalary} €</td>
                <td className="px-4 py-3">
                  <button className="rounded-lg border px-3 py-1 hover:bg-slate-50">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
