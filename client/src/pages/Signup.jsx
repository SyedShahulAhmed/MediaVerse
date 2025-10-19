import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../api/axios.js";
import toast, { Toaster } from "react-hot-toast";
import { User, Mail, Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("Please fill out all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const { data } = await API.post("/auth/register", {
        username,
        email,
        password,
      });
      login(data);
      toast.success("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden">
      {/* 🧃 Toast Notifications */}


      {/* 🌌 Background GIF */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/bg.gif"
          alt="Animated background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* 🔮 Signup Card */}
      <div className="bg-[#0b0b0f]/80 backdrop-blur-xl p-10 rounded-3xl shadow-lg w-96 border border-purple-700/30 relative">
        {/* 🎬 Logo */}
        <div className="flex justify-center mb-4">
          <div className="bg-purple-600/20 p-4 rounded-2xl shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 
                   1 0 01-1 1H4a1 1 0 01-1-1V4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 8h8v8H8z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-center text-3xl font-bold text-purple-400 mb-2">
          MediaVerse
        </h1>
        <p className="text-center text-gray-400 mb-6">
          Create your account and join the verse 🌌
        </p>

        {/* 🧾 Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="relative">
            <User
              className="absolute left-3 top-2.5 text-purple-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#16161e] text-white px-10 py-2 rounded-xl outline-none border border-purple-700/30 focus:border-purple-500 transition-all"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail
              className="absolute left-3 top-2.5 text-purple-400"
              size={18}
            />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#16161e] text-white px-10 py-2 rounded-xl outline-none border border-purple-700/30 focus:border-purple-500 transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#16161e] text-white px-4 py-2 rounded-xl outline-none border border-purple-700/30 focus:border-purple-500 transition-all pr-10"
            />
            {showPassword ? (
              <EyeOff
                className="absolute right-3 top-2.5 text-purple-400 cursor-pointer"
                size={18}
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <Eye
                className="absolute right-3 top-2.5 text-purple-400 cursor-pointer"
                size={18}
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white py-2 rounded-xl hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-md shadow-purple-700/40"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-4 text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
