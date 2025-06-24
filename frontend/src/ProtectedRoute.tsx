import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  // ✅ If no token → redirect
  if (!token) {
    return <Navigate to={isAdminRoute ? "/admin/login" : "/user/login"} />;
  }

  // ❌ If trying to access admin but not an admin
  if (isAdminRoute && role !== "admin") {
    return <Navigate to="/admin/login" />;
  }

  // ❌ If trying to access user route but not a user
  if (!isAdminRoute && role !== "user") {
    return <Navigate to="/user/login" />;
  }

  // ✅ Valid token and role → allow access
  return children;
};

export default ProtectedRoute;
