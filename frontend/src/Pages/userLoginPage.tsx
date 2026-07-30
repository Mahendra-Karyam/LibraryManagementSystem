import "../output.css";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import libraryImage from "../Images/libraryImage.png";
import axios from "axios";
export default function UserLoginPage() {
  /*This uses useLocation() from React Router.
  It gives the current URL path (like /user/signup or /user/login).*/
  const location = useLocation();

  /*This checks if the current URL contains the word "signup".\
  If yes → initialMode = "signup".
  Otherwise → initialMode = "login".*/
  const initialMode = location.pathname.includes("signup") ? "signup" : "login";

  /*This creates a React state variable called mode.
  It can only be "login" or "signup".
  It starts with the value from initialMode.*/
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  /*✅ Why is this useful
  If someone directly goes to http://localhost:5173/user/signup,
  this code ensures that the Signup form shows instead of the Login form.*/

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleLoginSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://librarymanagementsystem-6aca.onrender.com/user/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200 || res.status === 201) {
        const token = res.data.token;
        localStorage.setItem("token", token); // ✅ Save the new user's token
        localStorage.setItem("role", "user");
        navigate("/user/availablebooks");
        alert("Login successful!");
        setEmail("");
        setPassword("");
        setMessage("");
      } else {
        const responseData = res.data;
        setMessage(responseData.message);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred. Please try again!");
      }
      console.error("Request failed:", error);
    }
  };

  const handleSignUpSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://librarymanagementsystem-6aca.onrender.com/user/signup",
        { userName, email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const responseData = res.data;

      if (res.status === 200 || res.status === 201) {
        navigate("/user/login");
        setMode("login");
        setUserName("");
        setEmail("");
        setPassword("");
        setMessage("");
      } else {
        console.log(responseData.message || "Invalid username or password");
      }
    } catch (error: any) {
      // 💥 REQUEST FAILED (network error, server down, 500 error, timeout, etc.)
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
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

        <div className="relative z-10 w-full max-w-md mx-4 rounded-3xl border-2 border-amber-950 bg-white/95 p-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] min-h-[520px]">
          <form
            onSubmit={mode === "login" ? handleLoginSubmit : handleSignUpSubmit}
            className="flex h-full flex-col justify-between gap-6"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900">
                {mode === "login" ? "User Login" : "User Signup"}
              </h1>
              <p className="text-sm text-slate-600 mt-2">
                {mode === "login"
                  ? "Access your library account with email and password."
                  : "Create a new user account to borrow books."
                }
              </p>
            </div>

            <div className="flex border-2 border-gray-200 rounded-full overflow-hidden h-12">
              <div
                onClick={() => {
                  setMode("login");
                  setMessage("");
                  navigate("/user/login");
                }}
                className={`flex-1 flex items-center justify-center cursor-pointer select-none text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-blue-900 text-cyan-100"
                    : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                Login
              </div>
              <div
                onClick={() => {
                  setMode("signup");
                  setMessage("");
                  navigate("/user/signup");
                }}
                className={`flex-1 flex items-center justify-center cursor-pointer select-none text-sm font-semibold transition ${
                  mode === "signup"
                    ? "bg-blue-900 text-cyan-100"
                    : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                Signup
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {mode === "signup" && (
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Name"
                  required
                  className="outline-none shadow-sm px-3 py-3 border-gray-200 border-2 rounded-lg placeholder:text-slate-400"
                />
              )}

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
                className="w-full bg-blue-900 text-cyan-100 px-4 py-3 rounded-xl font-semibold hover:bg-blue-800 transition"
              >
                {mode === "login" ? "Login" : "Signup"}
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-center text-slate-600">
                {mode === "login" ? (
                  <>
                    Don&apos;t have an account?{' '}
                    <span
                      onClick={() => setMode("signup")}
                      className="text-blue-900 font-semibold cursor-pointer underline"
                    >
                      Sign up
                    </span>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <span
                      onClick={() => setMode("login")}
                      className="text-blue-900 font-semibold cursor-pointer underline"
                    >
                      Login
                    </span>
                  </>
                )}
              </p>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-sm font-medium text-slate-600 hover:text-blue-900 transition"
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

