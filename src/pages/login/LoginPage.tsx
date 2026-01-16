import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../../api/authApi"
import { useAuth } from "../../auth/AuthContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      const user = await login(email, password)
      signIn(user)

      navigate(user.role === "BOSS" ? "/boss" : "/mechanic", { replace: true })
    } catch {
      setError("Login failed. Try again.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-white shadow p-6">
        <h1 className="text-2xl font-bold">Garage Login</h1>
        <p className="text-sm text-slate-500 mt-1">
          Boss: <span className="font-medium">boss@garage.com</span> (any password)
        </p>

        <div className="mt-6 space-y-3">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full rounded-lg border p-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              className="mt-1 w-full rounded-lg border p-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button className="w-full rounded-lg bg-slate-900 text-white py-2 font-medium hover:bg-slate-800">
            Sign in
          </button>
        </div>
      </form>
    </div>
  )
}
