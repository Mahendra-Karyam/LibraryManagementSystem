import "../input.css";
import libraryImage from "../Images/libraryImage.png";
import { useNavigate } from "react-router-dom";
export default function WelcomePage() {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="h-screen w-screen relative bg-cover bg-center font-['Times_New_Roman']"
        style={{ backgroundImage: `url(${libraryImage})` }}
      >
        {/* ⛔️ THIS is the overlay making background blackish */}
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
        <div className="relative flex flex-col justify-center items-center h-full">
          <div className="bg-black rounded-sm flex flex-col justify-center items-center p-5 m-5 shadow-black shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <h1 className="text-amber-100 font-bold text-4xl text-center leading-tight">
              Welcome to <br /> Library Management System
            </h1>
            <div className="flex flex-col sm:flex-row sm:justify-between px-3 py-2 w-fit h-fit mt-3 text-amber-600 text-3xl gap-4 sm:gap-0">
              <button
                className="text-2xl w-50 mx-3 bg-black text-amber-100 hover:bg-neutral-800 transition rounded-lg border-2 px-1 pb-3 pt-2 cursor-pointer"
                onClick={() => navigate("/user/login")}
              >
                User Login
              </button>
              <button
                className="text-2xl w-50 mx-3 bg-black text-amber-100 hover:bg-neutral-800 transition rounded-lg border-2 px-1 pb-3 pt-2 cursor-pointer"
                onClick={() => navigate("/admin/login")}
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
