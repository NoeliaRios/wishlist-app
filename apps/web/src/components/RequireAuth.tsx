import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

export function RequireAuth() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Navigate to="/" replace />;

  return <Outlet />;
}
