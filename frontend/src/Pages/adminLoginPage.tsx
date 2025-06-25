import "../output.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import libraryImage from "../Images/libraryImage.png";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://librarymanagementsystem-6aca.onrender.com/admin/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
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
    } catch (error: any) {
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
        className="h-screen w-screen relative bg-cover bg-center flex flex-col items-center justify-center"
      >
        {/* ⛔️ THIS is the overlay making background blackish */}
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

        <button
          className="mb-4 bg-white border-black border-2 rounded-lg px-3 py-1 cursor-pointer relative"
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </button>
        <form
          onSubmit={handleLoginSubmit}
          className="relative z-10 flex items-center justify-center flex-col"
        >
          <div className="w-72 border-[3px] rounded-md border-amber-950 bg-white p-4 flex flex-col justify-between h-60">
            <h1 className="text-center font-bold text-2xl">Login Form</h1>
            <div className="flex-1 flex flex-col justify-between mt-4 mb-2">
              <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="outline-none shadow-sm px-2 py-1 border-gray-200 border-2 rounded placeholder:text-red-500"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="outline-none shadow-sm px-2 py-1 border-gray-200 border-2 rounded placeholder:text-red-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 bg-blue-900 text-cyan-100 px-3 py-1 rounded cursor-pointer"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="mt-10 text-red-500 bg-white px-2 rounded-sm text-center relative">
          {message && <h1>{message}</h1>}
        </div>
      </div>
    </>
  );
}
