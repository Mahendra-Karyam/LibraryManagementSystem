import "../output.css";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import libraryImage from "../Images/libraryImage.png";
import api from "../api/axios.js";
export default function UserLoginPage() {
  /*This uses useLocation() from React Router.
  It gives the current URL path (like /user/signup or /user/login).*/
  const location = useLocation();

  /*This checks if the current URL contains the word "signup".
  If yes → initialMode = "signup".
  Otherwise → initialMode = "login".*/
  const initialMode = location.pathname.includes("signup")
    ? "signup"
    : location.pathname.includes("forgot-password")
    ? "forgot"
    : "login";

  /*This creates a React state variable called mode.
  It can only be "login" or "signup".
  It starts with the value from initialMode.*/
  const [mode, setMode] = useState(initialMode);
  /*✅ Why is this useful
  If someone directly goes to http://localhost:5173/user/signup,
  this code ensures that the Signup form shows instead of the Login form.*/

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/login", { email, password });

      if (res.status === 200 || res.status === 201) {
        const token = res.data.token;
        localStorage.setItem("token", token); // ✅ Save the new user's token
        localStorage.setItem("role", "user");
        setMessage("");
        setSuccessMessage("Login successful!");
        setEmail("");
        setPassword("");
        setTimeout(() => {
          navigate("/user/availablebooks");
        }, 800);
      } else {
        const responseData = res.data;
        setMessage(responseData.message);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred. Please try again!");
      }
      console.error("Request failed:", error);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const res = await api.post("/user/forgot-password", {
        email,
        newPassword,
        confirmPassword,
      });

      if (res.status === 200 || res.status === 201) {
        setMessage("");
        setSuccessMessage(res.data.message || "Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          navigate("/user/login");
          setMode("login");
          setEmail("");
          setSuccessMessage("");
        }, 1500);
      } else {
        setMessage(res.data.message);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred. Please try again!");
      }
      console.error("Request failed:", error);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/signup", { userName, email, password });

      const responseData = res.data;

      if (res.status === 200 || res.status === 201) {
        setMessage("");
        setSuccessMessage("Account created successfully! Please log in.");
        setUserName("");
        setPassword("");
        setTimeout(() => {
          navigate("/user/login");
          setMode("login");
          setEmail("");
          setSuccessMessage("");
        }, 1200);
      } else {
        console.log(responseData.message || "Invalid username or password");
      }
    } catch (error) {
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

        <div className="relative z-10 w-full max-w-md mx-4 rounded-3xl border-2 border-amber-950 bg-white/95 p-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] min-h-[600px] flex flex-col">
          <form
            onSubmit={
              mode === "login"
                ? handleLoginSubmit
                : mode === "forgot"
                ? handleForgotPasswordSubmit
                : handleSignUpSubmit
            }
            className="flex flex-1 flex-col gap-6"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900">
                {mode === "login" ? "User Login" : mode === "forgot" ? "Reset Password" : "User Signup"}
              </h1>
              <p className="text-sm text-slate-600 mt-2">
                {mode === "login"
                  ? "Access your library account with email and password."
                  : mode === "forgot"
                  ? "Enter your email and choose a new password."
                  : "Create a new user account to borrow books."
                }
              </p>
            </div>

            {mode !== "forgot" && (
              <div className="flex border-2 border-gray-200 rounded-full overflow-hidden h-12">
                <div
                  onClick={() => {
                    setMode("login");
                    setMessage("");
                    setSuccessMessage("");
                    navigate("/user/login");
                  }}
                  className={`flex-1 flex items-center justify-center cursor-pointer select-none text-sm font-semibold transition ${
                    mode === "login"
                      ? "bg-blue-900 text-cyan-100"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                  role="button"
                  tabIndex={0}
                >
                  Login
                </div>
                <div
                  onClick={() => {
                    setMode("signup");
                    setMessage("");
                    setSuccessMessage("");
                    navigate("/user/signup");
                  }}
                  className={`flex-1 flex items-center justify-center cursor-pointer select-none text-sm font-semibold transition ${
                    mode === "signup"
                      ? "bg-blue-900 text-cyan-100"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                  role="button"
                  tabIndex={0}
                >
                  Signup
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="overflow-hidden h-14">
                {mode === "signup" && (
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Name"
                    required
                    className="outline-none shadow-sm px-3 py-3 border-gray-200 border-2 rounded-lg placeholder:text-slate-400 h-full w-full"
                  />
                )}
              </div>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="outline-none shadow-sm px-3 py-3 border-gray-200 border-2 rounded-lg placeholder:text-slate-400"
              />

              {mode === "forgot" ? (
                <>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    required
                    minLength={6}
                    className="outline-none shadow-sm px-3 py-3 border-gray-200 border-2 rounded-lg placeholder:text-slate-400"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    required
                    minLength={6}
                    className="outline-none shadow-sm px-3 py-3 border-gray-200 border-2 rounded-lg placeholder:text-slate-400"
                  />
                </>
              ) : (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="outline-none shadow-sm px-3 py-3 border-gray-200 border-2 rounded-lg placeholder:text-slate-400"
                />
              )}

              {mode === "login" && (
                <div className="text-right -mt-2">
                  <span
                    onClick={() => {
                      setMode("forgot");
                      setMessage("");
                      setSuccessMessage("");
                      navigate("/user/forgot-password");
                    }}
                    className="text-xs font-medium text-blue-900 hover:underline cursor-pointer"
                    role="button"
                    tabIndex={0}
                  >
                    Forgot password?
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-900 text-cyan-100 px-4 py-3 rounded-xl font-semibold hover:bg-blue-800 transition cursor-pointer"
              >
                {mode === "login" ? "Login" : mode === "forgot" ? "Reset Password" : "Signup"}
              </button>
            </div>

            <div className="flex flex-col flex-1 justify-end gap-3">
              <p className="text-sm text-center text-slate-600">
                {mode === "login" ? (
                  <>
                    Don&apos;t have an account?{' '}
                    <span
                      onClick={() => {
                        setMode("signup");
                        setMessage("");
                        setSuccessMessage("");
                        navigate("/user/signup");
                      }}
                      className="text-blue-900 font-semibold cursor-pointer underline"
                      role="button"
                      tabIndex={0}
                    >
                      Sign up
                    </span>
                  </>
                ) : mode === "forgot" ? (
                  <>
                    Remembered your password?{' '}
                    <span
                      onClick={() => {
                        setMode("login");
                        setMessage("");
                        setSuccessMessage("");
                        navigate("/user/login");
                      }}
                      className="text-blue-900 font-semibold cursor-pointer underline"
                      role="button"
                      tabIndex={0}
                    >
                      Login
                    </span>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <span
                      onClick={() => {
                        setMode("login");
                        setMessage("");
                        setSuccessMessage("");
                        navigate("/user/login");
                      }}
                      className="text-blue-900 font-semibold cursor-pointer underline"
                      role="button"
                      tabIndex={0}
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
                  className="text-sm font-medium text-slate-600 hover:text-blue-900 transition cursor-pointer"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </form>

          {successMessage && (
            <div className="mt-4 rounded-xl bg-green-100 px-4 py-3 text-center text-sm text-green-700 break-words">
              {successMessage}
            </div>
          )}

          {message && (
            <div className="mt-4 rounded-xl bg-red-100 px-4 py-3 text-center text-sm text-red-700 break-words">
              {message}
            </div>
          )}
        </div>
      </div>
    </>
  );
}