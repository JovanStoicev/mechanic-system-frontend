import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import NotificationsLink from "../components/NotificationsLink";

function linkClass(isActive: boolean) {
  return [
    "block shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium",
    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
  ].join(" ");
}

export default function MechanicLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function logout() {
    signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl p-4">
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">Garage System</h1>
            <p className="text-sm text-slate-600">
              Mechanic panel{user?.name ? ` • ${user.name}` : ""}
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
            <nav className="flex gap-1 overflow-x-auto rounded-2xl border bg-white p-2 shadow-sm md:block md:p-3">
              <div className="hidden px-3 py-2 text-xs font-semibold text-slate-500 md:block">
                Work
              </div>

              <NavLink to="/mechanic" end className={({ isActive }) => linkClass(isActive)}>
                Dashboard
              </NavLink>

              <NavLink
                to="/mechanic/problems"
                end
                className={({ isActive }) => linkClass(isActive)}
              >
                Assigned problems
              </NavLink>

              <NavLink
                to="/mechanic/jobs"
                end
                className={({ isActive }) => linkClass(isActive)}
              >
                My jobs
              </NavLink>

              <NavLink
                to="/mechanic/part-requests"
                end
                className={({ isActive }) => linkClass(isActive)}
              >
                Part requests
              </NavLink>
              <NotificationsLink to="/mechanic/notifications" linkClass={linkClass} />
            </nav>
          </aside>

          <main className="col-span-12 min-w-0 md:col-span-9">
            <div className="rounded-2xl bg-white p-4 shadow-sm border">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
