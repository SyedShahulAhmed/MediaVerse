// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { Mail, Send, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios.js";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email.");

    try {
      setLoading(true);
      const { data } = await API.post("/password/forgot", { email });
      toast.success(data.message || "OTP sent to your email!");
      setTimeout(() => navigate(`/verify-otp?email=${email}`), 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0b0f] text-white relative">
      <div className="absolute inset-0 -z-10">
        <img src="/bg.gif" alt="bg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>

      <div className="bg-[#13131a]/80 border border-purple-700/30 p-8 rounded-3xl shadow-[0_0_35px_rgba(155,92,246,0.3)] w-96">
        <Link to="/login" className="flex items-center gap-2 text-gray-400 mb-4 hover:text-purple-400 transition">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <h1 className="text-2xl font-bold text-purple-400 mb-2 text-center">
          Forgot Password?
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Enter your email to receive a 6-digit OTP.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 text-purple-400" size={18} />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full bg-[#16161e] text-white px-10 py-2 rounded-xl border border-purple-700/30 focus:border-purple-500 outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 py-2 rounded-xl font-medium hover:from-purple-500 hover:to-fuchsia-500 transition disabled:opacity-60"
          >
            <Send size={16} />
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
