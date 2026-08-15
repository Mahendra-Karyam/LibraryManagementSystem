import "../output.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import libraryImage from "../Images/libraryImage.png";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/login", { email, password });
      if (res.status === 200 || res.status === 201) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", "admin");
        navigate("/admin/dashboard");
        setEmail("");
        setPassword("");
        setMessage("");
      } else {
        const responseData = res.data;
        setMessage(responseData.message);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        // ❌ Server sent back an error message
        setMessage(error.response.data.message);
      } else {
        // ❌ Unexpected error (no server message)
        setMessage("An unexpected error occurred. Please try again!");
      }
      console.error("Request failed:", error);
    }
  };

  return (
    <>
      <div
        style={{ backgroundImage: `url(${libraryImage})` }}
        className="h-screen w-screen relative bg-cover bg-center flex items-center justify-center"
      >
        {/* ⛔️ THIS is the overlay making background blackish */}
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

        <div className="relative z-10 w-full max-w-md mx-4 rounded-3xl border-2 border-amber-950 bg-white/95 p-6 shadow-[0_0_30px_rgba(0,0,0,0.35)]">
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900">Admin Login</h1>
              <p className="mt-2 text-sm text-slate-600">
                Access the admin dashboard with your email and password.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="outline-none shadow-sm px-3 py-3 border-gray-200 border-2 rounded-lg placeholder:text-slate-400"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="outline-none shadow-sm px-3 py-3 border-gray-200 border-2 rounded-lg placeholder:text-slate-400"
              />

              <button
                type="submit"
                className="w-full bg-blue-900 text-cyan-100 px-4 py-3 rounded-xl font-semibold hover:bg-blue-800 transition cursor-pointer"
              >
                Login
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="text-sm font-medium text-slate-600 hover:text-blue-900 transition cursor-pointer"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </form>

          {message && (
            <div className="mt-6 rounded-xl bg-red-100 px-4 py-3 text-center text-sm text-red-700">
              {message}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
