import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PageHeader from "../../components/PageHeader"

export default function AddPartPage() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [stockQty, setStockQty] = useState<number>(0)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    // mocked: later POST /api/boss/parts
    console.log({ name, price, stockQty })

    navigate("/boss/parts", { replace: true })
  }

  return (
    <div>
      <PageHeader
        title="Add part"
        subtitle="Add a new part to inventory."
        crumbs={[
          { label: "Boss", to: "/boss/mechanics" },
          { label: "Parts", to: "/boss/parts" },
          { label: "Add" },
        ]}
      />

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Part name</label>
          <input
            className="mt-1 w-full rounded-lg border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Brake pads (rear)"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Price (€)</label>
          <input
            className="mt-1 w-full rounded-lg border p-2"
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Initial stock</label>
          <input
            className="mt-1 w-full rounded-lg border p-2"
            type="number"
            min={0}
            value={stockQty}
            onChange={(e) => setStockQty(Number(e.target.value))}
            required
          />
        </div>

        <div className="flex gap-2">
          <button
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            type="submit"
          >
            Save
          </button>
          <button
            className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
            type="button"
            onClick={() => navigate("/boss/parts")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
