import { useState } from "react";
import API from "../api/axios.js";
import toast from "react-hot-toast";
import { Lock, Save } from "lucide-react";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword)
      return toast.error("Both fields required");
    if (newPassword.length < 8)
      return toast.error("Password must be at least 8 characters");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const { data } = await API.put(
        "/password/change",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(data.message || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-8 bg-[#131318]/70 border border-purple-800/40 rounded-3xl shadow-[0_0_40px_rgba(155,92,246,0.25)] backdrop-blur-md">
      <h2 className="text-lg font-semibold text-purple-400 mb-6">
        🔒 Change Password
      </h2>

      <form onSubmit={handleChangePassword} className="space-y-4">
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-purple-400" size={18} />
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-[#0d0d0f] text-white px-10 py-2 rounded-xl border border-purple-700/30 focus:border-purple-500 outline-none"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 text-purple-400" size={18} />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-[#0d0d0f] text-white px-10 py-2 rounded-xl border border-purple-700/30 focus:border-purple-500 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 py-2 rounded-xl font-medium hover:from-purple-500 hover:to-fuchsia-500 transition disabled:opacity-60"
        >
          <Save size={18} /> {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </section>
  );
}
