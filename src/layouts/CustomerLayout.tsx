import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import NotificationsLink from "../components/NotificationsLink";

export default function CustomerLayout() {
  const { user, signOut } = useAuth(); const navigate = useNavigate();
  const cls = ({isActive}:{isActive:boolean}) => `block rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-slate-900 text-white" : "hover:bg-slate-100"}`;
  return <div className="min-h-screen bg-slate-50"><div className="mx-auto max-w-6xl p-4">
    <header className="mb-4 flex justify-between"><div><h1 className="text-xl font-bold">Garage System</h1><p className="text-sm text-slate-600">Customer panel • {user?.name}</p></div><button className="rounded-lg border bg-white px-3 py-2 text-sm" onClick={()=>{signOut();navigate("/login")}}>Logout</button></header>
    <div className="grid grid-cols-12 gap-4"><aside className="col-span-12 md:col-span-3"><nav className="rounded-2xl border bg-white p-3 shadow-sm"><NavLink className={cls} to="/customer/cars">My cars</NavLink><NavLink end className={cls} to="/customer/problems/new">Report a problem</NavLink><NavLink end className={cls} to="/customer/problems">My problems</NavLink><NotificationsLink to="/customer/notifications" linkClass={(active) => cls({isActive:active})} /></nav></aside><main className="col-span-12 md:col-span-9"><div className="rounded-2xl border bg-white p-4 shadow-sm"><Outlet/></div></main></div>
  </div></div>;
}
