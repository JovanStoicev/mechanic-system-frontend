import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

function linkClass(isActive: boolean) {
  return [
    "block rounded-lg px-3 py-2 text-sm font-medium",
    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
  ].join(" ")
}

export default function BossLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  function logout() {
    signOut()
    navigate("/login", { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl p-4">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Garage System</h1>
            <p className="text-sm text-slate-600">
              Boss panel{user?.name ? ` • ${user.name}` : ""}
            </p>
          </div>
          <button
            onClick={logout}
            className="rounded-lg border bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-12 gap-4">
          <aside className="col-span-12 md:col-span-3">
            <nav className="rounded-2xl bg-white p-3 shadow-sm border">
              <div className="text-xs font-semibold text-slate-500 px-3 py-2">
                Management
              </div>

              <NavLink
                to="/boss/mechanics"
                end
                className={({ isActive }) => linkClass(isActive)}
              >
                Mechanics
              </NavLink>


              <NavLink
                to="/boss/mechanics/new"
                className={({ isActive }) => linkClass(isActive)}
              >
                Add Mechanic
              </NavLink>

              <div className="mt-3 text-xs font-semibold text-slate-500 px-3 py-2">
                Next (later)
              </div>
              <div className="px-3 py-2 text-sm text-slate-500">
                Jobs • Parts • Earnings
              </div>
            </nav>
          </aside>

          <main className="col-span-12 md:col-span-9">
            <div className="rounded-2xl bg-white p-4 shadow-sm border">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
