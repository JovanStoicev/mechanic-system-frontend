import { Link } from "react-router-dom"
import PageHeader from "../../components/PageHeader"

type PartRow = {
  id: number
  name: string
  price: number
  stockQty: number
}

const MOCK_PARTS: PartRow[] = [
  { id: 1, name: "Oil filter", price: 12, stockQty: 8 },
  { id: 2, name: "Brake pads (front)", price: 55, stockQty: 2 },
  { id: 3, name: "Spark plug", price: 9, stockQty: 20 },
]

export default function PartsListPage() {
  return (
    <div>
      <PageHeader
        title="Parts"
        subtitle="Inventory overview. Later we’ll connect this to ordering and stock movements."
        crumbs={[
          { label: "Boss", to: "/boss/mechanics" },
          { label: "Parts" },
        ]}
      />

      <div className="flex items-center justify-end">
        <Link
          to="/boss/parts/new"
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Add part
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Part</th>
              <th className="px-4 py-3 text-left font-semibold">Price (€)</th>
              <th className="px-4 py-3 text-left font-semibold">Stock</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PARTS.map((p) => {
              const low = p.stockQty <= 3
              return (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.price}</td>
                  <td className="px-4 py-3">{p.stockQty}</td>
                  <td className="px-4 py-3">
                    {low ? (
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                        Low stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
