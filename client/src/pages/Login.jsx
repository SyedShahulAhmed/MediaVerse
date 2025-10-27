import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../api/axios.js";
import toast, { Toaster } from "react-hot-toast";
import { Mail, Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useEffect } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post("/auth/login", { email, password });
      await login(data);
      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 900);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid credentials. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/bg.gif"
          alt="Animated background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-all"
        >
          <div
            aria-hidden
            className="animate-spin rounded-full h-14 w-14 border-t-4 border-purple-500 mb-4"
          />
          <p className="text-purple-300 font-medium text-lg">
            Signing you in...
          </p>
        </div>
      )}

      {/* Login Card */}
      <div
        className={`bg-[#0b0b0f]/80 backdrop-blur-xl p-10 rounded-3xl shadow-lg w-96 border border-purple-700/30 relative transition-all duration-300 ${
          loading ? "opacity-60 pointer-events-none" : ""
        }`}
        aria-hidden={loading}
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
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
          Welcome back! Sign in to your account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div className="relative">
            <Mail
              className="absolute left-3 top-2.5 text-purple-400"
              size={18}
            />
            <input
              aria-label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full bg-[#16161e] text-white px-10 py-2 rounded-xl outline-none border border-purple-700/30 focus:border-purple-500 transition-all disabled:opacity-50"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              aria-label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full bg-[#16161e] text-white px-4 py-2 rounded-xl outline-none border border-purple-700/30 focus:border-purple-500 transition-all pr-10 disabled:opacity-50"
              required
            />
            {showPassword ? (
              <EyeOff
                aria-label="Hide password"
                className="absolute right-3 top-2.5 text-purple-400 cursor-pointer"
                size={18}
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <Eye
                aria-label="Show password"
                className="absolute right-3 top-2.5 text-purple-400 cursor-pointer"
                size={18}
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          {/* 🔗 Forgot Password Link */}
          <div className="flex justify-end mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-purple-400 hover:underline hover:text-purple-300 transition"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            aria-disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white py-2 rounded-xl hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-md shadow-purple-700/40 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-grow border-t border-purple-700/30" />
            <span className="mx-3 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-purple-700/30" />
          </div>

          {/* Google Login */}
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                setLoading(true);
                const credential = credentialResponse?.credential;
                if (!credential) {
                  toast.error("Google sign-in returned no credential.");
                  return;
                }
                const { data } = await API.post("/auth/google", {
                  token: credential,
                });
                await login(data);
                toast.success("Signed in with Google!");
                setTimeout(() => navigate("/dashboard"), 900);
              } catch (err) {
                toast.error(
                  err?.response?.data?.message || "Google sign-in failed."
                );
              } finally {
                setLoading(false);
              }
            }}
            onError={() => toast.error("Google login error")}
            width="100%"
            theme="outline"
            size="large"
            shape="rectangular"
            text="signin_with"
          />
        </form>

        {/* Footer */}
        <p className="text-center mt-4 text-gray-400 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-400 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
