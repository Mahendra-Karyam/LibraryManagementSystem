import "./output.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import WelcomePage from "./Pages/welcomePage";
import UserLoginPage from "./Pages/userLoginPage";
import AvailableBooksForUser from "./Pages/availableBooksForUser.tsx";
import AdminLoginPage from "./Pages/adminLoginPage.tsx";
import DashBoradForAdmin from "./Pages/dashboardForAdmin.tsx";
import AddBook from "./Pages/addBook.tsx";
import UpdateBook from "./Pages/updateBook.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import NotFoundPage from "./Pages/NotFoundPage.tsx";
import ChatWidget from "./Components/ChatWidget.tsx";

// Pages where the help chat bubble doesn't make sense to show
// (login/signup screens and the 404 page).
const HIDE_CHAT_ON = ["/user/login", "/user/signup", "/admin/login"];

function ChatWidgetGate() {
  const location = useLocation();
  const shouldHide =
    HIDE_CHAT_ON.includes(location.pathname) || location.pathname === "*";
  return shouldHide ? null : <ChatWidget />;
}

export default function App() {
  return (
    <Router>
      <ChatWidgetGate />
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