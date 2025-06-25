import "./output.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./Pages/welcomePage";
import UserLoginPage from "./Pages/userLoginPage";
import AvailableBooksForUser from "./Pages/availableBooksForUser.tsx";
import AdminLoginPage from "./Pages/adminLoginPage.tsx";
import DashBoradForAdmin from "./Pages/dashboardForAdmin.tsx";
import AddBook from "./Pages/addBook.tsx";
import UpdateBook from "./Pages/updateBook.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import NotFoundPage from "./Pages/NotFoundPage.tsx";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/user/login" element={<UserLoginPage />} />
        <Route path="/user/signup" element={<UserLoginPage />} />
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
