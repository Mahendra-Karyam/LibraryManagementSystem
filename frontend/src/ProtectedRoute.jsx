import { Navigate, useLocation } from "react-router-dom";

/*
ProtectedRoute is a component that wraps other components and protects routes.

Usage:
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>

Here, <Dashboard /> is passed as "children"
  children can be anything you put between the component tags:
    ✅ JSX like <div>Hi</div>
    ✅ Strings like "Hello"
    ✅ Numbers like 123
    ✅ null, undefined
    ✅ Arrays or fragments like <>...</>
*/
const ProtectedRoute = ({ children }) => {
  // 🔐 Get token and role from browser's localStorage
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  // ✅ Check if current path starts with "/admin"
  const isAdminRoute = location.pathname.startsWith("/admin");

  // ⛔ If there's no token, user is not logged in
  if (!token) {
    return <Navigate to={isAdminRoute ? "/admin/login" : "/user/login"} />;
  }

  // ⛔ If it's an admin page, but the user is not an admin
  if (isAdminRoute && role !== "admin") {
    return <Navigate to="/admin/login" />;
  }

  // ⛔ If it's a user page, but the user is not a user
  if (!isAdminRoute && role !== "user") {
    return <Navigate to="/user/login" />;
  }

  // ✅ All checks passed → render the protected page
  return children;
};

export default ProtectedRoute;
