import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PageHeader from "../../components/PageHeader"
import { useBossData } from "../../boss/BossDataContext"

export default function AddCarPage() {
  const navigate = useNavigate()

  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [vin, setVin] = useState("")
  const [engineType, setEngineType] = useState("")
  const [horsePower, setHorsePower] = useState<number>(0)
  const { addCar } = useBossData()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    // mocked: later POST /api/boss/cars
    addCar({ brand, model, vin, engineType, horsePower })
    navigate("/boss/cars", { replace: true })
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

      <form onSubmit={onSubmit} className="space-y-4">
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
          >
            Save
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
