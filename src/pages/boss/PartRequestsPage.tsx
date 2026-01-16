import PageHeader from "../../components/PageHeader"

type RequestStatus = "PENDING" | "APPROVED" | "REJECTED"

type PartRequestRow = {
  id: number
  mechanicName: string
  partName: string
  qty: number
  status: RequestStatus
}

const MOCK_REQUESTS: PartRequestRow[] = [
  { id: 1, mechanicName: "Marko Markovic", partName: "Brake pads (front)", qty: 1, status: "PENDING" },
  { id: 2, mechanicName: "Ivan Ilic", partName: "Oil filter", qty: 2, status: "APPROVED" },
  { id: 3, mechanicName: "Ivan Ilic", partName: "Spark plug", qty: 4, status: "REJECTED" },
]

function badge(status: RequestStatus) {
  if (status === "PENDING") return "bg-amber-100 text-amber-800"
  if (status === "APPROVED") return "bg-emerald-100 text-emerald-800"
  return "bg-rose-100 text-rose-800"
}

export default function PartRequestsPage() {
  return (
    <div>
      <PageHeader
        title="Part requests"
        subtitle="Approve or reject requests from mechanics."
        crumbs={[
          { label: "Boss", to: "/boss/mechanics" },
          { label: "Part requests" },
        ]}
      />

      <div className="mt-4 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Mechanic</th>
              <th className="px-4 py-3 text-left font-semibold">Part</th>
              <th className="px-4 py-3 text-left font-semibold">Qty</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_REQUESTS.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3">{r.mechanicName}</td>
                <td className="px-4 py-3">{r.partName}</td>
                <td className="px-4 py-3">{r.qty}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${badge(r.status)}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg border px-3 py-1 hover:bg-slate-50 disabled:opacity-50"
                      disabled={r.status !== "PENDING"}
                      onClick={() => console.log("approve", r.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="rounded-lg border px-3 py-1 hover:bg-slate-50 disabled:opacity-50"
                      disabled={r.status !== "PENDING"}
                      onClick={() => console.log("reject", r.id)}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Next step: wire Approve/Reject to state + later backend endpoints.
      </p>
    </div>
  )
}
