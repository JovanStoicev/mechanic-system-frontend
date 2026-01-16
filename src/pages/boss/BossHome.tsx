import { useAuth } from "../../auth/AuthContext"

export default function BossHome() {
  const { user, signOut } = useAuth()

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Boss</h1>
        <button onClick={signOut} className="rounded-lg border px-3 py-1 hover:bg-slate-50">
          Logout
        </button>
      </div>
      <p className="mt-2 text-slate-600">Welcome, {user?.name}</p>
    </div>
  )
}
