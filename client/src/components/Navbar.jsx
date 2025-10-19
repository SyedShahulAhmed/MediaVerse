import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Search } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      toast.error("Please enter a username to search");
      return;
    }
    navigate(`/u/${search.trim().toLowerCase()}`);
    setSearch("");
    toast.success("Searching...");
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully 👋");
    navigate("/login", { replace: true });
  };

  return (
    <nav
      className="sticky top-0 z-50 px-8 py-4 flex flex-wrap justify-between items-center 
                 bg-[#0a0a0d]/90 backdrop-blur-xl border-b border-purple-900/40 
                 shadow-[0_0_25px_rgba(155,92,246,0.2)] transition-all duration-300"
    >
      {/* 🎬 Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 text-2xl font-semibold tracking-wide 
                   text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500 
                   hover:scale-[1.07] transition-transform duration-300 drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]"
      >
        🎬 <span className="font-bold">MediaVerse</span>
      </Link>

      {/* 🔎 Search bar — visible when logged in */}
      {user && (
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 bg-[#141418]/90 border border-purple-700/30 
                     rounded-xl px-3 py-1.5 shadow-[0_0_10px_rgba(155,92,246,0.25)] 
                     focus-within:border-fuchsia-500/70 transition-all duration-300 
                     w-full sm:w-[260px] md:w-[320px] lg:w-[360px] mt-3 sm:mt-0"
        >
          <Search size={18} className="text-purple-400" />
          <input
            type="text"
            placeholder="Search username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-white placeholder-gray-500"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-fuchsia-500 px-3 py-1.5 rounded-lg 
                       text-sm font-medium hover:from-purple-500 hover:to-fuchsia-400 
                       shadow-[0_0_12px_rgba(155,92,246,0.3)] transition-all"
          >
            Go
          </button>
        </form>
      )}

      {/* 🧭 Navigation Links */}
      <div className="flex items-center gap-6 mt-3 sm:mt-0">
        {!user ? (
          <>
            <Link
              to="/login"
              className="relative text-gray-300 hover:text-fuchsia-400 transition duration-200 after:content-[''] after:absolute 
                         after:left-0 after:-bottom-1 after:w-0 after:h-[2px] 
                         after:bg-gradient-to-r after:from-purple-500 after:to-fuchsia-500 
                         hover:after:w-full after:transition-all after:duration-300"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="relative text-gray-300 hover:text-fuchsia-400 transition duration-200 after:content-[''] after:absolute 
                         after:left-0 after:-bottom-1 after:w-0 after:h-[2px] 
                         after:bg-gradient-to-r after:from-purple-500 after:to-fuchsia-500 
                         hover:after:w-full after:transition-all after:duration-300"
            >
              Signup
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/dashboard"
              className="relative text-gray-300 hover:text-fuchsia-400 transition duration-200 after:content-[''] after:absolute 
                         after:left-0 after:-bottom-1 after:w-0 after:h-[2px] 
                         after:bg-gradient-to-r after:from-purple-500 after:to-fuchsia-500 
                         hover:after:w-full after:transition-all after:duration-300"
            >
              Dashboard
            </Link>

            <Link
              to="/profile"
              className="relative text-gray-300 hover:text-fuchsia-400 transition duration-200 after:content-[''] after:absolute 
                         after:left-0 after:-bottom-1 after:w-0 after:h-[2px] 
                         after:bg-gradient-to-r after:from-purple-500 after:to-fuchsia-500 
                         hover:after:w-full after:transition-all after:duration-300"
            >
              Profile
            </Link>

            {/* 🚪 Logout Button */}
            <button
              onClick={handleLogout}
              className="group relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-gray-200 
                         border border-red-500/40 bg-gradient-to-r from-[#151518] to-[#0f0f10] 
                         hover:border-red-500/70 hover:from-[#1e1e22] hover:to-[#161618] 
                         hover:shadow-[0_0_18px_rgba(239,68,68,0.35)] 
                         transition-all duration-300 ease-out active:scale-[0.96]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-4 h-4 text-red-400 group-hover:text-red-500 transition-colors duration-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3H6A2.25 2.25 0 003.75 5.25v13.5A2.25 2.25 0 006 21h7.5a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
              <span className="tracking-wide group-hover:text-red-400 transition-colors duration-300">
                Logout
              </span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
