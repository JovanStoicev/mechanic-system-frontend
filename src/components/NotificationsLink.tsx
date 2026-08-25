import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getUnreadNotificationCount } from "../api/notifications";

export default function NotificationsLink({ to, linkClass }: { to:string; linkClass:(active:boolean)=>string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const load = () => getUnreadNotificationCount().then((data) => setCount(data.count)).catch(() => undefined);
    load();
    const timer = window.setInterval(load, 30000);
    window.addEventListener("notifications-updated", load);
    return () => { window.clearInterval(timer); window.removeEventListener("notifications-updated", load); };
  }, []);
  return <NavLink to={to} end className={({isActive}) => linkClass(isActive)}><span className="flex items-center justify-between"><span>Notifications</span>{count > 0 && <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">{count}</span>}</span></NavLink>;
}
