import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../api/axios.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ChangeUsernameForm from "../components/ChangeUsernameForm.jsx";
import ChangePassword from "../components/ChangePassword.jsx";
import { ArrowLeft, Save, User } from "lucide-react";

export default function Settings() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bio: user?.bio || "",
    isPublic: user?.isPublic ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [password, setPassword] = useState("");
  const [showFinalConfirm, setShowFinalConfirm] = useState(false); // ✅ new state

  useEffect(() => {
    if (user) {
      setForm({
        bio: user.bio || "",
        isPublic: user.isPublic ?? true,
      });
    }
  }, [user]);

  // ✅ Update bio & privacy
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const { data } = await API.put("/auth/update", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      updateUser?.(data.user || data);
      toast.success("Settings saved successfully!");
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "❌ Update failed");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Delete account (final step)
  const handleDeleteAccount = async () => {
    setDeleting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Not authorized");
        return;
      }

      const { data } = await API.delete("/auth/delete-account", {
        headers: { Authorization: `Bearer ${token}` },
        data: { password },
      });

      if (data.success) {
        toast.success("Account deleted successfully");
        localStorage.clear();
        setTimeout(() => {
          navigate("/signup");
          window.location.reload();
        }, 1200);
      } else {
        toast.error(data.message || "Failed to delete account");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(
        err.response?.data?.message ||
          "Incorrect password or server error"
      );
    } finally {
      setDeleting(false);
      setPassword("");
      setShowFinalConfirm(false);
      document.getElementById("deleteConfirmModal").close();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0e] via-[#101018] to-[#1a1a22] text-white flex flex-col md:flex-row">

      {/* 🧭 SIDEBAR */}
      <aside className="w-full md:w-64 border-r border-[#2a2a36]/80 bg-[#111118]/60 backdrop-blur-md p-6 md:min-h-screen">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 text-transparent bg-clip-text mb-8">
          ⚙️ Settings
        </h2>

        <nav className="flex flex-col gap-3 text-gray-300">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#1f1f29]/60 transition-all"
          >
            <ArrowLeft size={16} /> Back to Profile
          </button>
          <div className="flex items-center gap-3 px-4 py-2 bg-[#1f1f29]/70 rounded-lg border border-purple-700/30">
            <User size={16} /> Account Settings
          </div>
        </nav>
      </aside>

      {/* 🧩 MAIN CONTENT */}
      <main className="flex-1 flex justify-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-10">

          {/* 🔤 Change Username */}
          <section className="p-8 bg-[#131318]/70 border border-purple-800/40 rounded-3xl shadow-[0_0_40px_rgba(155,92,246,0.25)] backdrop-blur-md transition-all hover:shadow-[0_0_50px_rgba(155,92,246,0.35)]">
            <h2 className="text-lg font-semibold text-purple-400 mb-4">
              🧑 Change Username
            </h2>
            <ChangeUsernameForm
              updateUser={(u) => {
                updateUser?.(u);
                setTimeout(() => navigate("/profile"), 1200);
              }}
            />
          </section>

          {/* 🔒 Change Password */}
          <ChangePassword />

          {/* ✏️ Bio & Privacy */}
          <section className="p-8 bg-[#131318]/70 border border-purple-800/40 rounded-3xl shadow-[0_0_40px_rgba(155,92,246,0.25)] backdrop-blur-md">
            <h2 className="text-lg font-semibold text-purple-400 mb-6">
              ✏️ Profile Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Bio */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Bio</label>
                <textarea
                  placeholder="Write something about yourself..."
                  maxLength={250}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full p-3 rounded-lg bg-[#0d0d0f] border border-gray-700 text-white h-28 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all resize-none"
                />
                <p className="text-xs text-gray-500 text-right mt-1">
                  {form.bio.length}/250
                </p>
              </div>

              {/* Privacy toggle */}
              <div className="flex items-center justify-between mt-6">
                <span className="text-gray-300 text-sm">
                  Make profile public
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPublic}
                    onChange={(e) =>
                      setForm({ ...form, isPublic: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-purple-500 to-fuchsia-500"></div>
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className={`w-full flex items-center justify-center gap-2 py-2 mt-4 rounded-lg text-white font-medium transition-all ${
                  saving
                    ? "bg-gray-700 opacity-60 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 shadow-[0_0_20px_rgba(155,92,246,0.4)]"
                }`}
              >
                <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </section>

          {/* 🚨 Danger Zone */}
          <section className="p-8 bg-[#131318]/70 border border-red-800/40 rounded-3xl shadow-[0_0_40px_rgba(239,68,68,0.25)] backdrop-blur-md">
            <h2 className="text-lg font-semibold text-red-400 mb-4">
              ⚠️ Danger Zone
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Deleting your account will permanently remove your profile, badges, and all your media data.
              This action <strong className="text-red-500">cannot</strong> be undone.
            </p>
            <button
              onClick={() =>
                document.getElementById("deleteConfirmModal").showModal()
              }
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white py-2 rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            >
              Delete My Account
            </button>
          </section>
        </div>
      </main>

      {/* 🔐 DELETE CONFIRM MODAL */}
      <dialog
        id="deleteConfirmModal"
        className="rounded-2xl backdrop:bg-black/70 backdrop:blur-sm border-0 p-0"
      >
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9999]"
          onClick={() =>
            document.getElementById("deleteConfirmModal").close()
          }
        >
          <div
            className="bg-[#131318] text-white p-6 rounded-2xl border border-red-700/40 w-[90%] max-w-sm shadow-[0_0_40px_rgba(239,68,68,0.4)] animate-[zoomIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {!showFinalConfirm ? (
              <>
                <h2 className="text-xl font-semibold text-center text-red-400 mb-4">
                  Confirm Account Deletion
                </h2>
                <p className="text-gray-400 text-sm text-center mb-6">
                  Please enter your password to confirm. This action is{" "}
                  <span className="text-red-500 font-medium">permanent</span>.
                </p>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full p-3 rounded-lg bg-[#0d0d0f] border border-gray-700 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all mb-5"
                />

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("deleteConfirmModal").close()
                    }
                    className="flex-1 bg-gray-700 py-2 rounded-lg hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!password.trim()}
                    onClick={() => setShowFinalConfirm(true)}
                    className={`flex-1 bg-gradient-to-r from-red-600 to-pink-600 py-2 rounded-lg hover:from-red-500 hover:to-pink-500 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] ${
                      !password.trim() && "opacity-60 cursor-not-allowed"
                    }`}
                  >
                    Confirm Delete
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-center text-red-400 mb-4">
                  ⚠️ Final Confirmation
                </h2>
                <p className="text-gray-300 text-sm text-center mb-6">
                  This action <span className="text-red-500 font-semibold">cannot be undone</span>. 
                  Are you sure you want to permanently delete your account?
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowFinalConfirm(false)}
                    className="flex-1 bg-gray-700 py-2 rounded-lg hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className={`flex-1 bg-gradient-to-r from-red-600 to-pink-600 py-2 rounded-lg hover:from-red-500 hover:to-pink-500 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] ${
                      deleting && "opacity-60 cursor-not-allowed"
                    }`}
                  >
                    {deleting ? "Deleting..." : "Yes, Delete Permanently"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}
