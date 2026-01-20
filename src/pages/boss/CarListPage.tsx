import { Link } from "react-router-dom"
import PageHeader from "../../components/PageHeader"
import { useBossData } from "../../boss/BossDataContext"

// type CarRow = {
//   id: number
//   brand: string
//   model: string
//   vin: string
//   engineType: string
//   horsePower: number
// }

// const MOCK_CARS: CarRow[] = [
//   {
//     id: 1,
//     brand: "Volkswagen",
//     model: "Golf 7",
//     vin: "WVWZZZ1KZFW000001",
//     engineType: "Diesel",
//     horsePower: 110,
//   },
//   {
//     id: 2,
//     brand: "BMW",
//     model: "320d",
//     vin: "WBA8E9G5XGNT00002",
//     engineType: "Diesel",
//     horsePower: 190,
//   },
// ]

export default function CarsListPage() {
const { cars } = useBossData()

  return (
    <div>
      <PageHeader
        title="Cars"
        subtitle="Cars in the workshop database."
        crumbs={[
          { label: "Boss", to: "/boss/mechanics" },
          { label: "Cars" },
        ]}
      />

      <div className="flex items-center justify-end">
        <Link
          to="/boss/cars/new"
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Add car
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Brand</th>
              <th className="px-4 py-3 text-left font-semibold">Model</th>
              <th className="px-4 py-3 text-left font-semibold">VIN</th>
              <th className="px-4 py-3 text-left font-semibold">Engine</th>
              <th className="px-4 py-3 text-left font-semibold">HP</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-3">{c.brand}</td>
                <td className="px-4 py-3">{c.model}</td>
                <td className="px-4 py-3 font-mono text-xs">{c.vin}</td>
                <td className="px-4 py-3">{c.engineType}</td>
                <td className="px-4 py-3">{c.horsePower}</td>
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
