import { useState } from "react";
import API from "../api/axios.js";
import toast from "react-hot-toast";

export default function ChangeUsernameForm({ updateUser }) {
  const [form, setForm] = useState({
    newUsername: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = async (e) => {
    e.preventDefault();

    if (!form.newUsername || !form.password) {
      toast.error("Please fill in both fields.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You're not logged in!");
        return;
      }

      const { data } = await API.put("/auth/update-username", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Update user context
      if (updateUser) updateUser(data.user);

      // ✅ Save new token if backend provides it
      if (data.token) localStorage.setItem("token", data.token);

      toast.success("Username updated successfully!", {
        style: {
          background: "#111",
          color: "#fff",
          border: "1px solid #9333ea",
        },
      });

      setForm({ newUsername: "", password: "" });

      // ✅ Close modal smoothly after a short delay
      setTimeout(() => {
        document.getElementById("settingsModal")?.close();
      }, 1000);
    } catch (err) {
      console.error("Update username error:", err);
      const message =
        err.response?.data?.message || "Failed to update username.";

      // 🎯 Handle specific backend messages
      if (message.toLowerCase().includes("incorrect password")) {
        toast.error("Incorrect password. Please try again.");
      } else if (message.toLowerCase().includes("already taken")) {
        toast.error("Username already exists. Please choose another one.");
      } else if (message.toLowerCase().includes("username must")) {
        toast.error(
          "Username must be 3–15 lowercase letters, numbers, or underscores."
        );
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUsernameChange} className="space-y-5">
      {/* Username */}
      <div>
        <label className="text-sm text-gray-300 block mb-2">New Username</label>
        <input
          type="text"
          placeholder="Enter new username"
          value={form.newUsername}
          onChange={(e) =>
            setForm({ ...form, newUsername: e.target.value.toLowerCase() })
          }
          className="w-full p-3 rounded-lg bg-[#0d0d0f] border border-gray-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
        />
      </div>

      {/* Password */}
      <div>
        <label className="text-sm text-gray-300 block mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-3 rounded-lg bg-[#0d0d0f] border border-gray-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2.5 rounded-lg text-white font-medium transition-all ${
          loading
            ? "bg-gray-700 opacity-60 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
        }`}
      >
        {loading ? "Updating..." : "Update Username"}
      </button>
    </form>
  );
}
