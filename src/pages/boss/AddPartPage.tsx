import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PageHeader from "../../components/PageHeader"
import { createBossPart } from "../../api/parts"

export default function AddPartPage() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [stockQty, setStockQty] = useState<number>(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await createBossPart({ name, price, stockQty })
      navigate("/boss/parts", { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create part.")
      setSaving(false)
    }
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

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
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
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
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
