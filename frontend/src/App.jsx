import "./output.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./Pages/welcomePage";
import UserLoginPage from "./Pages/userLoginPage";
import AvailableBooksForUser from "./Pages/availableBooksForUser.jsx";
import AdminLoginPage from "./Pages/adminLoginPage.jsx";
import DashBoradForAdmin from "./Pages/dashboardForAdmin.jsx";
import AddBook from "./Pages/addBook.jsx";
import UpdateBook from "./Pages/updateBook.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import HelpChatWidget from "./Components/HelpChatWidget.jsx";
export default function App() {
  return (
    <Router>
      <HelpChatWidget />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/user/login" element={<UserLoginPage />} />
        <Route path="/user/signup" element={<UserLoginPage />} />

        {/*
          🔐 ProtectedRoute is used to protect pages like Dashboard, AddBook, etc.
          ✅ It checks:
            - If the user is logged in (token)
            - If the user has the right role (admin or user)

          📦 Inside <ProtectedRoute> is a page like <Dashboard />
          👉 That page is called "children"

          If everything is okay → it shows the page (children)
          If not → it redirects to the login page.
        */}

        <Route
          path="/user/availablebooks"
          element={
            <ProtectedRoute>
              <AvailableBooksForUser />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <DashBoradForAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard/addbook"
          element={
            <ProtectedRoute>
              <AddBook />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard/updatebook/:id"
          element={
            <ProtectedRoute>
              <UpdateBook />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
