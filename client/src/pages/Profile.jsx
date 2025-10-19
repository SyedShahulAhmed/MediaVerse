import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import API from "../api/axios.js";
import toast from "react-hot-toast";
import { Calendar, Star, Film, Edit3, Plus } from "lucide-react";

export default function Profile() {
  // IMPORTANT: we need updateUser from context
  const { user, updateUser } = useAuth();

  // form is kept in local state and synced to user whenever user changes
  const [form, setForm] = useState({
    bio: user?.bio || "",
    isPublic: user?.isPublic ?? true,
  });

  const [msg, setMsg] = useState("");
  const [stats, setStats] = useState({ total: 0, avgRating: 0, favType: "-" });

  const avatarUrl = `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(
    user?.username || "guest"
  )}&backgroundType=gradientLinear&radius=50`;

  // Sync form when user changes (important for instant UI consistency)
  useEffect(() => {
    setForm({
      bio: user?.bio || "",
      isPublic: user?.isPublic ?? true,
    });
  }, [user]);

  // Load stats (unchanged)
  useEffect(() => {
    const loadStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const { data } = await API.get("/media/stats/overview", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats({
          total: data.total || 0,
          avgRating: data.avgRating?.toFixed(1) || 0,
          favType:
            data.typeCount?.length > 0
              ? data.typeCount.sort((a, b) => b.count - a.count)[0]._id
              : "-",
        });
      } catch (err) {
        console.error("Stats load error", err);
      }
    };
    loadStats();
  }, []);

  // Update Bio — robust handling of response shape
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Not authorized. Please log in again.");
        setMsg("❌ Not authorized. Please log in again.");
        return;
      }

      // Send update request
      const response = await API.put(`/auth/update`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // backend might return data.user or data (the user object)
      const returned = response.data?.user || response.data || response;

      // Basic validation — ensure we got user-like object
      if (returned && (returned._id || returned.id || returned.username)) {
        // Update AuthContext state and localStorage
        if (typeof updateUser === "function") {
          updateUser(returned);
        } else {
          // fallback: if updateUser is not present, try to write localStorage directly
          localStorage.setItem("user", JSON.stringify(returned));
        }

        // Also sync local form to returned value (keeps modal content consistent)
        setForm({
          bio: returned.bio || "",
          isPublic: returned.isPublic ?? true,
        });

        toast.success("Bio updated!");
        setMsg("✅ Bio updated successfully!");

        // close modal after a short delay so user sees confirmation
        setTimeout(() => {
          const modal = document.getElementById("bioModal");
          if (modal) modal.close();
        }, 900);
      } else {
        // If backend returned something unexpected
        toast.error("Update failed — unexpected server response.");
        setMsg("⚠️ Something went wrong. Try again.");
        console.error("Unexpected update response:", response);
      }
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      const serverMsg = err.response?.data?.message || err.response?.data?.error;
      toast.error(serverMsg || "Failed to update bio.");
      setMsg("❌ Failed to update bio.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b0f] via-[#0e0e12] to-[#16161c] text-white px-6 py-12 flex flex-col items-center overflow-x-hidden">
      {/* Toaster is assumed to live at App.jsx globally. You may keep local toast() calls. */}

      {/* Profile Container */}
      <div className="relative bg-[#111115]/70 backdrop-blur-xl border border-purple-800/40 rounded-3xl p-10 w-full max-w-3xl shadow-[0_0_45px_rgba(155,92,246,0.25)] hover:shadow-[0_0_70px_rgba(236,72,153,0.2)] transition-all duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 via-transparent to-fuchsia-800/10 pointer-events-none"></div>

        {/* Edit Bio */}
        <button
          onClick={() => document.getElementById("bioModal").showModal()}
          className="absolute top-6 right-6 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90 transition-all shadow-[0_0_15px_rgba(155,92,246,0.5)]"
        >
          {user?.bio ? <Edit3 size={16} /> : <Plus size={16} />}
          {user?.bio ? "Edit Bio" : "Add Bio"}
        </button>

        {/* Header */}
        <div className="flex flex-col items-center gap-5 mb-10 animate-[fadeInUp_0.5s_ease-out]">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 blur-md opacity-60"></div>
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="relative w-28 h-28 rounded-full border-2 border-purple-500 shadow-[0_0_25px_rgba(155,92,246,0.5)]"
            />
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500 text-transparent bg-clip-text drop-shadow-[0_0_6px_rgba(236,72,153,0.4)]">
              {user?.username || "Unnamed User"}
            </h1>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <p className="text-gray-500 text-xs flex items-center justify-center gap-1 mt-1">
              <Calendar size={14} /> Joined{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : "N/A"}
            </p>

            {/* LIVE BIO — reads from user object so it updates when updateUser runs */}
            <p className="mt-4 text-gray-300 italic max-w-md mx-auto leading-relaxed">
              {user?.bio ? `“${user.bio}”` : "No bio added yet. Tell us something about yourself!"}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#131318]/80 rounded-xl p-5 border border-purple-700/30 text-center hover:border-purple-500/60 hover:shadow-[0_0_25px_rgba(147,51,234,0.2)] transition-all duration-300">
            <p className="text-gray-400 text-sm mb-1">Total Entries</p>
            <p className="text-3xl font-bold text-purple-400">{stats.total}</p>
          </div>

          <div className="bg-[#131318]/80 rounded-xl p-5 border border-yellow-500/20 text-center hover:border-yellow-400/50 hover:shadow-[0_0_25px_rgba(250,204,21,0.2)] transition-all duration-300">
            <p className="text-gray-400 text-sm mb-1">Average Rating</p>
            <p className="text-3xl font-bold text-yellow-400 flex justify-center items-center gap-1">
              <Star size={18} fill="#facc15" strokeWidth={0} /> {stats.avgRating}
            </p>
          </div>

          <div className="bg-[#131318]/80 rounded-xl p-5 border border-pink-600/30 text-center hover:border-pink-500/60 hover:shadow-[0_0_25px_rgba(236,72,153,0.25)] transition-all duration-300">
            <p className="text-gray-400 text-sm mb-1">Favorite Type</p>
            <p className="text-3xl font-bold text-pink-400 flex justify-center items-center gap-1 capitalize">
              <Film size={18} /> {stats.favType}
            </p>
          </div>
        </div>
      </div>

      {/* Bio Modal */}
      <dialog id="bioModal" className="rounded-2xl backdrop:bg-black/70 backdrop:blur-sm p-0 border-0">
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[9999]"
          onClick={() => document.getElementById("bioModal").close()}
        >
          <div
            className="bg-[#131318] text-white p-6 rounded-2xl border border-purple-800/40 w-[90%] max-w-md shadow-[0_0_35px_rgba(155,92,246,0.3)] animate-[zoomIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-center bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent mb-4">
              {user?.bio ? "Edit Bio" : "Add Bio"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                placeholder="Write something about yourself..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full p-3 rounded-lg bg-[#0d0d0f] border border-gray-700 text-white h-28 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
              />

              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                />
                Make profile public
              </label>

              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => document.getElementById("bioModal").close()}
                  className="flex-1 bg-gray-700 py-2 rounded-lg hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 py-2 rounded-lg hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-[0_0_15px_rgba(155,92,246,0.4)]"
                >
                  Save
                </button>
              </div>
            </form>

            {msg && <p className="text-center text-green-400 mt-3">{msg}</p>}
          </div>
        </div>
      </dialog>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}
