// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Check } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axios.js";

export default function ResetPassword() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const email = query.get("email");
  const otp = query.get("otp");

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirm) return toast.error("Fill all fields.");
    if (newPassword !== confirm) return toast.error("Passwords do not match.");
    if (newPassword.length < 8)
      return toast.error("Password must be at least 8 characters.");

    try {
      setLoading(true);
      const { data } = await API.post("/password/reset", {
        email,
        otp,
        newPassword,
      });
      toast.success(data.message || "Password reset successful!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resetting password.");
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
        <h1 className="text-2xl font-bold text-purple-400 mb-2 text-center">
          Reset Password
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-purple-400" size={18} />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#16161e] text-white px-10 py-2 rounded-xl border border-purple-700/30 focus:border-purple-500 outline-none transition"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-purple-400" size={18} />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full bg-[#16161e] text-white px-10 py-2 rounded-xl border border-purple-700/30 focus:border-purple-500 outline-none transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 py-2 rounded-xl font-medium hover:from-purple-500 hover:to-fuchsia-500 transition disabled:opacity-60"
          >
            <Check size={18} />
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
