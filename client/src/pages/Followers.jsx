import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios.js";
import { ArrowLeft, Calendar, Star, Film, Search, Users } from "lucide-react";
import Loader from "../components/Loader.jsx";
import toast from "react-hot-toast";

export default function Followers() {
  const [followers, setFollowers] = useState([]);
  const [filteredFollowers, setFilteredFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch followers
  useEffect(() => {
    const loadFollowers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const { data } = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const followersList = data.user.followers || [];
        setFollowers(followersList);
        setFilteredFollowers(followersList);
      } catch (err) {
        console.error("Followers load error:", err);
        toast.error("Failed to load followers.");
      } finally {
        setLoading(false);
      }
    };
    loadFollowers();
  }, []);

  // Filter followers on search
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = followers.filter(
      (f) =>
        f.username.toLowerCase().includes(term) ||
        f.bio?.toLowerCase().includes(term)
    );
    setFilteredFollowers(filtered);
  }, [searchTerm, followers]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0f]">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0e] via-[#0d0d12] to-[#16161c] text-white px-6 py-12 relative overflow-x-hidden">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_0_12px_rgba(155,92,246,0.4)] hover:shadow-[0_0_22px_rgba(155,92,246,0.7)] hover:scale-[1.05] active:scale-[0.97] backdrop-blur-sm border border-purple-700/40"
      >
        <ArrowLeft size={18} strokeWidth={2.2} />
        <span className="font-semibold tracking-wide">Back</span>
      </button>

      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center mb-12 mt-4 text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent tracking-wide drop-shadow-[0_0_15px_rgba(236,72,153,0.4)]">
          👥 Followers
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          {followers.length} follower{followers.length !== 1 && "s"} found
        </p>

        {/* Search Bar */}
        <div className="relative mt-6 w-full max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search followers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111118]/70 border border-purple-800/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 focus:ring-2 focus:ring-purple-600/40 focus:border-purple-500 outline-none transition-all placeholder-gray-500"
          />
        </div>
      </div>

      {/* FOLLOWERS GRID */}
      <div className="max-w-6xl mx-auto bg-[#111115]/60 backdrop-blur-xl border border-purple-800/30 rounded-3xl p-10 shadow-[0_0_70px_rgba(155,92,246,0.15)] transition-all duration-500">
        {filteredFollowers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Users size={40} className="text-gray-500 mb-4" />
            <p className="text-center text-gray-400 italic text-lg">
              {followers.length === 0
                ? "You don’t have any followers yet."
                : "No followers match your search."}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-[fadeIn_0.8s_ease-out]">
            {filteredFollowers.map((f, i) => {
              const avatarUrl = f.avatar
                ? f.avatar
                : `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(
                    f.username
                  )}&backgroundType=gradientLinear&radius=50`;

              return (
                <div
                  key={f._id || i}
                  onClick={() => navigate(`/u/${f.username}`)}
                  className="group relative bg-gradient-to-br from-[#181820]/80 to-[#1f1f29]/80 border border-purple-700/40 rounded-2xl p-6 flex flex-col items-center text-center
                    hover:shadow-[0_0_45px_rgba(155,92,246,0.25)] hover:border-purple-400/50 hover:scale-[1.04]
                    transition-all duration-500 ease-out cursor-pointer overflow-hidden backdrop-blur-md"
                >
                  {/* Glow layer */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-purple-500/10 via-fuchsia-400/10 to-pink-400/10 blur-xl transition-all duration-500"></div>

                  {/* Avatar */}
                  <div className="relative z-10">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-pink-500 blur-md opacity-30 group-hover:opacity-70 transition-all duration-700"></div>
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="relative w-20 h-20 rounded-full border-2 border-purple-500/40 shadow-[0_0_25px_rgba(155,92,246,0.3)] mb-4"
                    />
                  </div>

                  {/* Username */}
                  <h3 className="text-lg font-semibold text-purple-300 mb-1 z-10">
                    @{f.username}
                  </h3>

                  {/* Bio */}
                  <p className="text-xs text-gray-400 italic mb-3 px-3 z-10 line-clamp-2">
                    {f.bio || "No bio available"}
                  </p>

                  {/* Join Date */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4 z-10">
                    <Calendar size={12} />
                    {f.createdAt
                      ? new Date(f.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </div>

                  {/* Optional Stats */}
                  {f.stats && (
                    <div className="flex items-center justify-center gap-5 text-sm text-gray-300 z-10">
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Star size={14} fill="#facc15" strokeWidth={0} />{" "}
                        {f.stats.avgRating || "-"}
                      </span>
                      <span className="flex items-center gap-1 text-pink-400">
                        <Film size={14} /> {f.stats.total || 0}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Custom styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}
      </style>
    </div>
  );
}
