import { useEffect, useState } from "react";
import API from "../api/axios.js";
import {
  Users,
  Video,
  Trash2,
  Shield,
  RefreshCcw,
  Loader2,
  CheckSquare,
  Square,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({ users: [], media: [] });
  const [dialog, setDialog] = useState({ open: false, type: null, target: null });
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === "admin") fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchUsers(), fetchMedia()]);
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data);
    } catch {
      toast.error("❌ Failed to fetch stats");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch {
      toast.error("❌ Failed to fetch users");
    }
  };

  const fetchMedia = async () => {
    try {
      const res = await API.get("/admin/media");
      setMedia(res.data);
    } catch {
      toast.error("❌ Failed to fetch media");
    }
  };

  const confirmDelete = (type, id = null, title = null) => {
    setDialog({ open: true, type, target: { id, title } });
  };

  const closeDialog = () => setDialog({ open: false, type: null, target: null });

  const performDelete = async () => {
    const { type, target } = dialog;
    const toastId = toast.loading("Deleting...");
    try {
      if (type === "user") {
        await API.delete(`/admin/users/${target.id}`);
        toast.success(`🗑️ User "${target.title}" deleted`, { id: toastId });
        fetchUsers();
      } else if (type === "media") {
        await API.delete(`/admin/media/${target.id}`);
        toast.success(`🗑️ "${target.title}" removed`, { id: toastId });
        fetchMedia();
      } else if (type === "multi-user") {
        await Promise.all(
          selected.users.map((id) => API.delete(`/admin/users/${id}`))
        );
        toast.success(`🗑️ ${selected.users.length} users deleted`, { id: toastId });
        fetchUsers();
        setSelected((prev) => ({ ...prev, users: [] }));
      } else if (type === "multi-media") {
        await Promise.all(
          selected.media.map((id) => API.delete(`/admin/media/${id}`))
        );
        toast.success(`🗑️ ${selected.media.length} media deleted`, { id: toastId });
        fetchMedia();
        setSelected((prev) => ({ ...prev, media: [] }));
      }
    } catch {
      toast.error("❌ Deletion failed", { id: toastId });
    } finally {
      closeDialog();
    }
  };

  const toggleSelect = (type, id) => {
    setSelected((prev) => {
      const arr = prev[type];
      return {
        ...prev,
        [type]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
      };
    });
  };

  const selectAll = (type, list) => {
    setSelected((prev) => ({
      ...prev,
      [type]:
        prev[type].length === list.length ? [] : list.map((item) => item._id),
    }));
  };

  if (user?.role !== "admin")
    return (
      <div className="p-10 text-red-400 text-center text-xl font-semibold">
        🚫 Access Denied — Admins Only
      </div>
    );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-indigo-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="text-lg font-semibold">Loading dashboard...</p>
      </div>
    );

  return (
    <div className="p-8 space-y-10 text-gray-100 animate-fadeIn bg-gradient-to-br from-[#0b0f2e] to-[#141848] min-h-screen">
      <h1 className="text-4xl font-extrabold text-indigo-300 mb-10 flex items-center gap-3 tracking-wide">
        🛡️ Admin Dashboard
      </h1>

      {/* === STATS === */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: Users, label: "Total Users", value: stats.totalUsers || 0 },
          { icon: Video, label: "Total Media", value: stats.totalMedia || 0 },
          { icon: Shield, label: "Admins", value: stats.totalAdmins || 0 },
        ].map((item, i) => (
          <div
            key={i}
            className="group relative bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all p-6 rounded-2xl border border-indigo-700/30 flex items-center gap-4 shadow-lg hover:shadow-indigo-700/20"
          >
            <item.icon size={36} className="text-indigo-400 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-sm text-gray-400">{item.label}</p>
              <p className="text-3xl font-bold text-indigo-100">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <DataSection
        title="Users"
        icon={<Users size={22} />}
        data={users}
        type="users"
        selected={selected.users}
        toggleSelect={toggleSelect}
        selectAll={selectAll}
        onDelete={confirmDelete}
        fetchData={fetchUsers}
        gradient="from-indigo-900/30 to-purple-900/20"
      />

      <DataSection
        title="Media"
        icon={<Video size={22} />}
        data={media}
        type="media"
        selected={selected.media}
        toggleSelect={toggleSelect}
        selectAll={selectAll}
        onDelete={confirmDelete}
        fetchData={fetchMedia}
        gradient="from-purple-900/30 to-fuchsia-900/20"
      />

      {/* === DIALOG === */}
      {dialog.open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-[#12142b] rounded-2xl p-8 w-[90%] max-w-md border border-indigo-700/50 shadow-2xl text-gray-100">
            <h3 className="text-2xl font-semibold text-indigo-300 mb-3">
              Confirm Deletion
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {dialog.type.startsWith("multi")
                ? `Are you sure you want to delete ${
                    dialog.type === "multi-user"
                      ? selected.users.length
                      : selected.media.length
                  } ${
                    dialog.type === "multi-user" ? "users" : "media items"
                  }?`
                : `This will permanently delete “${dialog.target.title}”.`}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDialog}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 flex items-center gap-1"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={performDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center gap-1"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====== REUSABLE DATA SECTION ====== */
function DataSection({
  title,
  icon,
  data,
  type,
  selected,
  toggleSelect,
  selectAll,
  onDelete,
  fetchData,
  gradient,
}) {
  const plural = type === "users" ? "user" : "media";

  return (
    <section
      className={`bg-gradient-to-br ${gradient} rounded-2xl border border-indigo-800/50 p-6 shadow-xl backdrop-blur-lg transition-all`}
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-indigo-200 flex items-center gap-2">
          {icon} {title} ({data.length})
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => selectAll(type, data)}
            className="text-sm flex items-center gap-1 text-indigo-300 hover:text-indigo-100"
          >
            {selected.length === data.length ? (
              <CheckSquare size={16} />
            ) : (
              <Square size={16} />
            )}
            Select All
          </button>
          <button
            onClick={fetchData}
            className="text-sm flex items-center gap-1 text-indigo-300 hover:text-indigo-100"
          >
            <RefreshCcw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-700/50 pr-1">
        {data.map((item) => (
          <div
            key={item._id}
            className={`flex justify-between items-center px-5 py-3 rounded-xl transition-all cursor-pointer ${
              selected.includes(item._id)
                ? "bg-indigo-700/60"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selected.includes(item._id)}
                onChange={() => toggleSelect(type, item._id)}
                className="accent-indigo-500"
              />
              <div>
                <p className="font-semibold text-white text-base">
                  {item.username || item.title}
                </p>
                <p className="text-sm text-gray-400">
                  {item.email
                    ? item.email
                    : `by ${item.user?.username || "Unknown"}`}
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                onDelete(plural, item._id, item.username || item.title)
              }
              className="p-2 text-red-400 hover:text-red-200 transition-transform hover:scale-110"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="mt-6 flex justify-between items-center bg-white/5 rounded-lg p-3 border border-indigo-700/50 backdrop-blur-sm">
          <p className="text-sm text-gray-300">{selected.length} selected</p>
          <button
            onClick={() => onDelete(`multi-${plural}`)}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center gap-1 text-sm shadow-md"
          >
            <Trash2 size={14} /> Delete Selected
          </button>
        </div>
      )}
    </section>
  );
}
