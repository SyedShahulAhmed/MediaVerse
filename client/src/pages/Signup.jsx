import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../api/axios.js";
import toast, { Toaster } from "react-hot-toast";
import { User, Mail, Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [welcome, setWelcome] = useState(false); // 👈 New state for welcome overlay
  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ Validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-z0-9_]{3,15}$/;
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

  // ✅ Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !email || !password)
      return toast.error("Please fill all fields");
    if (!usernameRegex.test(username))
      return toast.error(
        "Username must be 3–15 lowercase letters/numbers or underscores"
      );
    if (!emailRegex.test(email)) return toast.error("Enter a valid email");
    if (!strongPasswordRegex.test(password))
      return toast.error(
        "Password must include uppercase, lowercase, number, and symbol"
      );

    try {
      setLoading(true);
      setLoadingMessage("Creating your account...");

      const payload = {
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        password: password.trim(),
      };

      const res = await API.post("/auth/register", payload);
      login(res.data);

      // 🪄 Show welcome overlay before navigating
      setWelcome(true);
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden">
      {/* 🌌 Background */}
     

      <div className="absolute inset-0 -z-10">
        <img
          src="/bg.gif"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* 🌀 Loader Overlay */}
      {loading && !welcome && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-all">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-purple-500 mb-4" />
          <p className="text-purple-300 font-medium text-lg animate-pulse">
            {loadingMessage || "Please wait..."}
          </p>
        </div>
      )}

      {/* 🌟 Welcome Screen */}
      {welcome && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-50 transition-all">
          <h1 className="text-4xl font-bold text-purple-400 animate-pulse">
            🌌 Welcome to <span className="text-fuchsia-500">MediaVerse</span>
          </h1>
          <p className="mt-4 text-gray-300 text-lg animate-fade-in">
            Redirecting to your dashboard...
          </p>
        </div>
      )}

      {/* 🔮 Signup Card */}
      {!welcome && (
        <div
          className={`bg-[#0b0b0f]/80 backdrop-blur-xl p-10 rounded-3xl shadow-lg w-96 border border-purple-700/30 relative transition-all duration-300 ${
            loading ? "opacity-60 pointer-events-none" : ""
          }`}
        >
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
                  d="M3 4h18v16H3z"
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
          <form className="space-y-4" onSubmit={handleSignup}>
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
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                disabled={loading}
                className="w-full bg-[#16161e] text-white px-10 py-2 rounded-xl border border-purple-700/30 focus:border-purple-500 disabled:opacity-50"
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
                onChange={(e) => setEmail(e.target.value.trim())}
                disabled={loading}
                className="w-full bg-[#16161e] text-white px-10 py-2 rounded-xl border border-purple-700/30 focus:border-purple-500 disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
                disabled={loading}
                className="w-full bg-[#16161e] text-white px-4 py-2 rounded-xl border border-purple-700/30 focus:border-purple-500 pr-10 disabled:opacity-50"
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

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-md shadow-indigo-700/40 disabled:opacity-60"
            >
              Create Account
            </button>

            {/* Divider */}
            <div className="flex items-center">
              <div className="flex-grow border-t border-purple-700/30" />
              <span className="mx-3 text-gray-400 text-sm">or</span>
              <div className="flex-grow border-t border-purple-700/30" />
            </div>

            {/* 🌐 Google Login */}
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  setLoading(true);
                  setLoadingMessage("Signing up with Google...");
                  const { credential } = credentialResponse;
                  const { data } = await API.post("/auth/google", {
                    token: credential,
                  });
                  login(data);
                  setWelcome(true);
                  setTimeout(() => navigate("/dashboard"), 2500);
                } catch {
                  toast.error("Google signup failed");
                } finally {
                  setLoading(false);
                  setLoadingMessage("");
                }
              }}
              onError={() => toast.error("Google signup error")}
              width="100%"
              theme="outline"
              size="large"
              shape="rectangular"
              text="signup_with"
            />
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
      )}
    </div>
  );
}
