import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "../common/Skeleton";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <PageLoader message="Verifying your session..." />;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}