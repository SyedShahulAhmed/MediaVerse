import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Search,
  LayoutDashboard,
  Trophy,
  UserCircle2,
  Rss,
  LogOut,
  LogIn,
  UserPlus,
  AlertTriangle,
  X,
  Check,
  Menu,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      toast.error("Please enter a username to search");
      return;
    }
    navigate(`/u/${search.trim().toLowerCase()}`);
    setSearch("");
    setMenuOpen(false);
  };

  const confirmLogout = () => {
    logout();
    toast.success("Logged out successfully 👋");
    setShowConfirm(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* 🧭 NAVBAR */}
      <nav
        className="fixed md:sticky top-0 left-0 w-full z-[1000] flex flex-wrap items-center justify-between
                   px-4 sm:px-6 md:px-10 py-3 md:py-4
                   bg-[#0a0a0d]/90 backdrop-blur-2xl border-b border-purple-900/40 
                   shadow-[0_0_25px_rgba(155,92,246,0.25)] transition-all duration-300"
      >
        {/* 🎬 Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-semibold tracking-wide 
                       text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500 
                       hover:scale-[1.07] transition-transform duration-300 drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]"
          >
            🎬 <span className="font-bold">MediaVerse</span>
          </Link>

          {/* 🍔 Mobile Menu Toggle */}
          <button
            className="md:hidden text-purple-400 hover:text-fuchsia-400 transition-all ml-auto"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* 🔎 Search (Desktop) */}
        {user && (
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 bg-[#141418]/90 border border-purple-700/30 
                       rounded-xl px-3 py-1.5 shadow-[0_0_10px_rgba(155,92,246,0.25)] 
                       focus-within:border-fuchsia-500/70 transition-all duration-300 
                       w-full md:w-[260px] lg:w-[320px] mt-3 md:mt-0 md:ml-4"
          >
            <Search size={18} className="text-purple-400 flex-shrink-0" />
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

        {/* 🧭 Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 ml-auto">
          {!user ? (
            <>
              <Link to="/login" className="nav-item">
                <LogIn size={16} className="text-purple-400" /> Login
              </Link>
              <Link to="/signup" className="nav-item">
                <UserPlus size={16} className="text-pink-400" /> Signup
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
              >
                <LayoutDashboard size={16} className="text-purple-400" /> Dashboard
              </Link>
              <Link
                to="/community"
                className={`nav-item ${isActive("/community") ? "active" : ""}`}
              >
                <Rss size={16} className="text-orange-400" /> Community
              </Link>
              <Link
                to="/profile/badges"
                className={`nav-item ${isActive("/profile/badges", true) ? "active" : ""}`}
              >
                <Trophy size={16} className="text-yellow-400" /> Badges
              </Link>
              <Link
                to="/profile"
                className={`nav-item ${isActive("/profile", true) ? "active" : ""}`}
              >
                <UserCircle2 size={16} className="text-blue-400" /> Profile
              </Link>

              <button onClick={() => setShowConfirm(true)} className="logout-btn">
                <LogOut size={16} className="text-red-400" /> Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* 📱 Mobile Dropdown */}
      <div
        className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden bg-[#0a0a0d]/95 backdrop-blur-xl 
                    border-t border-purple-900/40 shadow-[0_4px_25px_rgba(155,92,246,0.25)] 
                    ${menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="flex flex-col items-center gap-5 py-6 animate-[fadeSlide_0.4s_ease-out]">
          {user && (
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 bg-[#141418]/90 border border-purple-700/30 
                         rounded-xl px-3 py-1.5 shadow-[0_0_10px_rgba(155,92,246,0.25)] 
                         focus-within:border-fuchsia-500/70 transition-all duration-300 
                         w-[90%]"
            >
              <Search size={18} className="text-purple-400" />
              <input
                type="text"
                placeholder="Search username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full text-white placeholder-gray-500"
              />
            </form>
          )}

          {!user ? (
            <>
              <Link to="/login" className="mobile-item" onClick={() => setMenuOpen(false)}>
                <LogIn size={16} /> Login
              </Link>
              <Link to="/signup" className="mobile-item" onClick={() => setMenuOpen(false)}>
                <UserPlus size={16} /> Signup
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="mobile-item" onClick={() => setMenuOpen(false)}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/community" className="mobile-item" onClick={() => setMenuOpen(false)}>
                <Rss size={16} /> Community
              </Link>
              <Link to="/profile/badges" className="mobile-item" onClick={() => setMenuOpen(false)}>
                <Trophy size={16} /> Badges
              </Link>
              <Link to="/profile" className="mobile-item" onClick={() => setMenuOpen(false)}>
                <UserCircle2 size={16} /> Profile
              </Link>
              <button
                onClick={() => {
                  setShowConfirm(true);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-all"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* 🔒 Logout Confirmation Modal (unchanged) */}
      {showConfirm && (
        <dialog
          open
          className="rounded-2xl backdrop:bg-black/70 backdrop:blur-sm p-0 border-0 z-[9999]"
        >
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          >
            <div
              className="bg-[#141218] text-white p-6 rounded-2xl border border-red-500/40 w-[90%] max-w-md 
                         shadow-[0_0_35px_rgba(239,68,68,0.3)] animate-[zoomIn_0.3s_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center">
                <AlertTriangle size={48} className="text-red-400 mb-3" />
                <h2 className="text-xl font-semibold text-red-400 mb-1">
                  Confirm Logout
                </h2>
                <p className="text-gray-300 text-sm mb-5">
                  Are you sure you want to log out of your MediaVerse account?
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white 
                             hover:from-red-500 hover:to-pink-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                >
                  <Check size={16} /> Logout
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 
                             hover:text-white hover:border-gray-400 transition-all"
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          </div>
        </dialog>
      )}

      {/* Styles (same as before) */}
      <style>
        {`
  @keyframes fadeSlide {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes zoomIn {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }
  .nav-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #d1d1d1;
    font-size: 0.95rem;
    font-weight: 500;
    text-decoration: none;
    padding-bottom: 4px;
    transition: color 0.25s ease;
  }
  .nav-item::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(to right, #a855f7, #ec4899);
    border-radius: 1px;
    transition: width 0.25s ease;
  }
  .nav-item:hover {
    color: #f472b6;
  }
  .nav-item:hover::after,
  .nav-item.active::after {
    width: 100%;
  }
  .logout-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0.45rem 1rem;
    font-size: 0.9rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(239,68,68,0.4);
    background: #131216;
    color: #e5e5e5;
    transition: all 0.25s ease;
  }
  .logout-btn:hover {
    border-color: rgba(239,68,68,0.8);
    background: #1a191d;
    color: #fca5a5;
  }
  .mobile-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #e0e0e0;
    font-size: 0.95rem;
    transition: color 0.25s ease;
  }
  .mobile-item:hover {
    color: #f472b6;
  }
`}
      </style>
    </>
  );
}
