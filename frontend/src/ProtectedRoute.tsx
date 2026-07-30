<<<<<<< HEAD
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
=======
import {
  Navigate, // Lets you redirect the user to another route
  useLocation, // Gives the current URL path
} from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  /*
    children: ReactNode means anything you put between the component tags:
      ✅ JSX like <div>Hi</div>
      ✅ Strings like "Hello"
      ✅ Numbers like 123
      ✅ null, undefined
      ✅ Arrays or fragments like <>...</>
      ❌ NOT functions or plain objects
  */
  children: ReactNode;
}

/*
ProtectedRoute is a component that wraps other components and protects routes.

Usage:
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>

Here, <Dashboard /> is passed as "children"
*/
const ProtectedRoute = ({ children }: Props) => {
  // 🔐 Get token and role from browser's localStorage
  // localStorage is used to store data even after page refresh
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); //e.g., "user" or "admin"
  const location = useLocation(); //It gives you the current URL info

  /*
  location is an object like this:
    {
      pathname: "/admin/dashboard",  // current path
      search: "?q=books",            // query string if any
      hash: "#section",              // URL fragment
      state: null                    // optional data passed via navigation
      key: "randomKey"               // unique ID for the location
    }
  */

  // ✅ Check if current path starts with "/admin"
  const isAdminRoute = location.pathname.startsWith("/admin");

  // ⛔ If there's no token, user is not logged in → send them to the login page.
>>>>>>> b7165c1 (Updated)
  if (!token) {
    return <Navigate to={isAdminRoute ? "/admin/login" : "/user/login"} />;
  }

<<<<<<< HEAD
  // ❌ If trying to access admin but not an admin
=======
  // ⛔ If it's an admin page, but the user is not an admin, redirect to admin login.
>>>>>>> b7165c1 (Updated)
  if (isAdminRoute && role !== "admin") {
    return <Navigate to="/admin/login" />;
  }

<<<<<<< HEAD
  // ❌ If trying to access user route but not a user
=======
  // ⛔ If it's a user page, but the user is not a user, redirect to user login.
>>>>>>> b7165c1 (Updated)
  if (!isAdminRoute && role !== "user") {
    return <Navigate to="/user/login" />;
  }

<<<<<<< HEAD
  // ✅ Valid token and role → allow access
=======
  // ✅ All checks passed → now show the actual page/component
  // children contains whatever was wrapped inside <ProtectedRoute> (like <DashboardForAdmin />)
  // So return children will display that protected component
>>>>>>> b7165c1 (Updated)
  return children;
};

export default ProtectedRoute;
