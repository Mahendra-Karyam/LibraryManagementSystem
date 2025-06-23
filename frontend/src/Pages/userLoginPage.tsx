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
          onSubmit={mode == "login" ? handleLoginSubmit : handleSignUpSubmit}
          className="relative z-10 flex items-center justify-center flex-col"
        >
          <div className="w-72 border-[3px] rounded-md border-amber-950 bg-white p-4 flex flex-col justify-between h-[400px]">
            <h1 className="text-center font-bold text-2xl">
              {mode === "login" ? "Login" : "SignUp"} Form
            </h1>

            <div className="flex border-2 border-gray-200 rounded overflow-hidden h-10 mt-5 mb-4">
              <div
                onClick={() => {
                  setMode("login");
                  setMessage("");
                  navigate("/user/login");
                }}
                className={`flex-1 flex items-center justify-center cursor-pointer select-none text-sm font-medium ${
                  mode === "login"
                    ? "bg-blue-900 text-cyan-100"
                    : "bg-white text-black"
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
                className={`flex-1 flex items-center justify-center cursor-pointer select-none text-sm font-medium ${
                  mode === "signup"
                    ? "bg-blue-900 text-cyan-100"
                    : "bg-white text-black"
                }`}
              >
                Signup
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between mt-4 mb-2">
              {mode === "login" ? (
                <>
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
                </>
              ) : (
                <>
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-col gap-4">
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Name"
                        required
                        className="outline-none shadow-sm px-2 py-1 border-gray-200 border-2 rounded placeholder:text-red-500"
                      />
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
                      Signup
                    </button>
                  </div>
                </>
              )}
            </div>

            <p className="text-sm text-center mt-2">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <span
                    onClick={() => setMode("signup")}
                    className="text-blue-900 font-semibold cursor-pointer underline"
                  >
                    SignUp
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    onClick={() => setMode("login")}
                    className="text-blue-900 font-semibold cursor-pointer underline"
                  >
                    Login
                  </span>
                </>
              )}
            </p>
          </div>
          <div className="mt-10 text-red-500 bg-white px-2 rounded-sm text-center">
            {message && <h1>{message}</h1>}
          </div>
        </form>
      </div>
    </>
  );
}
