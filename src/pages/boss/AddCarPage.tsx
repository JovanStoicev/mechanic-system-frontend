import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import PageHeader from "../../components/PageHeader"
import { createCar } from "../../api/cars"
import { getCustomers, type CustomerRow } from "../../api/customers"

export default function AddCarPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [vin, setVin] = useState("")
  const [engineType, setEngineType] = useState("")
  const [horsePower, setHorsePower] = useState<number>(0)
  const [customerId, setCustomerId] = useState(searchParams.get("customerId") ?? "")
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCustomers().then(setCustomers).catch((e) => setError(e instanceof Error ? e.message : "Failed to load customers"))
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const car = await createCar({ brand, model, vin, engineType, horsePower, customerId: customerId ? Number(customerId) : null })
      navigate(`/boss/cars/${car.id}`, { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create car")
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Add car"
        subtitle="Add car details (brand/model/VIN/engine/HP)."
        crumbs={[
          { label: "Boss", to: "/boss/mechanics" },
          { label: "Cars", to: "/boss/cars" },
          { label: "Add" },
        ]}
      />

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Customer (optional)</label>
          <select className="mt-1 w-full rounded-lg border p-2" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Unassigned</option>
            {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.fullName} — {customer.phone}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Brand</label>
          <input
            className="mt-1 w-full rounded-lg border p-2"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            placeholder="e.g. Volkswagen"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Model</label>
          <input
            className="mt-1 w-full rounded-lg border p-2"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
            placeholder="e.g. Golf 7"
          />
        </div>

        <div>
          <label className="text-sm font-medium">VIN number</label>
          <input
            className="mt-1 w-full rounded-lg border p-2 font-mono"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            required
            placeholder="17 characters"
            minLength={17}
            maxLength={17}
          />
          <p className="mt-1 text-xs text-slate-500">VIN is typically 17 characters.</p>
        </div>

        <div>
          <label className="text-sm font-medium">Engine type</label>
          <input
            className="mt-1 w-full rounded-lg border p-2"
            value={engineType}
            onChange={(e) => setEngineType(e.target.value)}
            required
            placeholder="e.g. Diesel / Petrol / Hybrid"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Horse power</label>
          <input
            className="mt-1 w-full rounded-lg border p-2"
            type="number"
            min={0}
            value={horsePower}
            onChange={(e) => setHorsePower(Number(e.target.value))}
            required
          />
        </div>

        <div className="flex gap-2">
          <button
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
            type="button"
            onClick={() => navigate("/boss/cars")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
