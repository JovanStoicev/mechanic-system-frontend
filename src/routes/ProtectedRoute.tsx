import { Navigate } from "react-router-dom";
import type { Role } from "../types/auth";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute({
  allow,
  children,
}: {
  allow: Role;
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== allow) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
