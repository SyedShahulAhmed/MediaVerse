import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios.js";
import { Calendar, Star, Film, Tv, Book, Gamepad2 } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);
  const COLORS = ["#a855f7", "#ec4899", "#22d3ee", "#facc15", "#34d399"];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get(`/users/${username}`);
        setProfile(data);
      } catch (err) {
        setError(err.response?.data?.message || "Error loading profile");
      }
    };
    fetchProfile();
  }, [username]);

  if (error)
    return (
      <p className="text-center mt-16 text-red-400 text-lg font-medium">
        {error}
      </p>
    );
  if (!profile)
    return (
      <p className="text-center mt-16 text-gray-400 text-lg font-medium">
        Loading profile...
      </p>
    );

  const { user, media, stats } = profile;

  const avatarUrl =
    user.avatar ||
    `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(
      user.username || "guest"
    )}&backgroundType=gradientLinear&radius=50`;

  const statusColors = {
    plan: "bg-blue-900/40 text-blue-400 border-blue-700/40",
    watching: "bg-yellow-900/40 text-yellow-400 border-yellow-700/40",
    completed: "bg-green-900/40 text-green-400 border-green-700/40",
    "on-hold": "bg-purple-900/40 text-purple-400 border-purple-700/40",
    dropped: "bg-red-900/40 text-red-400 border-red-700/40",
  };

  // 🎨 Type styling + icons
  const typeMap = {
    movie: {
      color: "text-yellow-400 bg-yellow-900/30 border-yellow-800/60",
      icon: <Film size={14} />,
    },
    series: {
      color: "text-blue-400 bg-blue-900/30 border-blue-800/60",
      icon: <Tv size={14} />,
    },
    anime: {
      color: "text-pink-400 bg-pink-900/30 border-pink-800/60",
      icon: <Tv size={14} />,
    },
    book: {
      color: "text-green-400 bg-green-900/30 border-green-800/60",
      icon: <Book size={14} />,
    },
    game: {
      color: "text-purple-400 bg-purple-900/30 border-purple-800/60",
      icon: <Gamepad2 size={14} />,
    },
  };

  const visibleMedia = media.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white px-6 py-12 flex flex-col items-center">
      {/* 🌟 Profile Header */}
      <div className="bg-gradient-to-br from-[#141218] to-[#1a1a1f] border border-purple-900/40 rounded-2xl shadow-[0_0_50px_rgba(155,92,246,0.25)] p-8 w-full max-w-4xl relative overflow-hidden mb-12">
        <div className="absolute inset-0 rounded-2xl border border-purple-700/20 pointer-events-none"></div>

        <div className="flex flex-col items-center gap-4 mb-6 animate-[fadeInUp_0.5s_ease-out]">
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-28 h-28 rounded-full border-2 border-purple-500 shadow-[0_0_25px_rgba(155,92,246,0.4)]"
          />
          <h1 className="text-4xl font-bold mt-2">@{user.username}</h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
          <p className="text-gray-500 text-xs flex items-center justify-center gap-1 mt-1">
            <Calendar size={14} /> Joined:{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "N/A"}
          </p>
          <p className="mt-3 text-gray-300 italic max-w-2xl text-center leading-relaxed">
            {user.bio ? `“${user.bio}”` : "This user hasn’t added a bio yet."}
          </p>
        </div>

        {/* 📊 Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mt-6">
          <StatCard
            label="Total Entries"
            value={stats?.total || media.length || 0}
            color="purple"
          />
          <StatCard
            label="Average Rating"
            value={stats?.avgRating?.toFixed(1) || "—"}
            icon={<Star size={18} fill="#facc15" strokeWidth={0} />}
            color="yellow"
          />
          <StatCard
            label="Favorite Type"
            value={stats?.favType || "—"}
            icon={<Film size={18} />}
            color="pink"
          />
        </div>
      </div>

      {/* 🎬 Collection Section */}
      <div className="w-full max-w-6xl mb-20">
        <h2 className="text-3xl font-semibold text-purple-400 mb-10 text-center">
          🎬 {user.username}'s Collection
        </h2>

        {media.length === 0 ? (
          <p className="text-gray-400 text-center text-lg">
            This user hasn’t added any items yet.
          </p>
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
              {visibleMedia.map((item) => {
                const hasDate =
                  item.date && !isNaN(new Date(item.date).getTime());
                let dateLabel = "No date available";

                if (hasDate) {
                  const formatted = new Date(item.date).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "2-digit", year: "numeric" }
                  );

                  if (item.status === "completed")
                    dateLabel = `Completed: ${formatted}`;
                  else if (item.status === "watching")
                    dateLabel = `Ongoing since: ${formatted}`;
                  else dateLabel = `Added on: ${formatted}`;
                }

                return (
                  <div
                    key={item._id}
                    className="flex flex-col justify-between bg-[#16161a] border border-gray-800 rounded-2xl p-6 w-full h-full hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(155,92,246,0.25)] transition-all duration-200"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {item.title}
                        </h3>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-lg border ${
                            statusColors[item.status] ||
                            "bg-gray-800 text-gray-400"
                          }`}
                        >
                          {item.status?.toUpperCase() || "UNKNOWN"}
                        </span>
                      </div>

                      {/* 📺 Type & Genre tags */}
                      <div className="flex flex-wrap gap-2 mb-2 text-sm">
                        <span
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border capitalize 
                            ${
                              typeMap[item.type]?.color ||
                              "bg-gray-800 text-gray-300 border-gray-700"
                            }`}
                        >
                          {typeMap[item.type]?.icon || <Film size={14} />}{" "}
                          {item.type}
                        </span>

                        {item.genre && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[hsl(240_10%_12%)] text-slate-200 border border-slate-700 capitalize">
                            {item.genre}
                          </span>
                        )}
                      </div>

                      {item.rating && (
                        <p className="text-yellow-400 text-sm mt-1">
                          ⭐ {item.rating}/10
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-gray-500 text-xs italic mt-2 line-clamp-2">
                          “{item.notes}”
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
                      <Calendar size={12} />
                      {dateLabel}
                    </p>
                  </div>
                );
              })}
            </div>

            {media.length > visibleCount && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-500 px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-all shadow-[0_0_10px_rgba(155,92,246,0.4)]"
                >
                  View More →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 📊 Public Analytics Section */}
      <div className="w-full max-w-5xl bg-[#1a1a1f] rounded-2xl border border-gray-800 p-8 shadow-[0_0_20px_rgba(155,92,246,0.2)] mt-10">
        <h2 className="text-2xl font-semibold text-purple-400 mb-6 text-center flex items-center justify-center gap-2">
          📊 {user.username}'s Analytics Overview
        </h2>

        {media.length === 0 ? (
          <p className="text-center text-gray-400">No data to display yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            {/* Media by Type */}
            <div>
              <h3 className="text-white text-base font-semibold mb-4 text-center">
                Media by Type
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={Object.entries(
                      media.reduce((acc, item) => {
                        acc[item.type] = (acc[item.type] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([type, count]) => ({ _id: type, count }))}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ _id }) => _id}
                    labelLine={false}
                  >
                    {media.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(18, 16, 24, 0.95)", // dark glassy bg
                      border: "1px solid rgba(155, 92, 246, 0.4)", // soft violet border
                      borderRadius: "10px",
                      boxShadow: "0 0 15px rgba(155, 92, 246, 0.2)", // glow
                      padding: "8px 12px",
                      color: "#fff",
                      textTransform: "capitalize",
                      fontSize: "13px",
                      fontWeight: 500,
                      letterSpacing: "0.3px",
                    }}
                    labelStyle={{
                      color: "#c084fc", // light violet label text
                      fontWeight: 600,
                    }}
                    itemStyle={{
                      color: "#fff",
                      textTransform: "capitalize",
                    }}
                    cursor={{ fill: "rgba(155, 92, 246, 0.05)" }} // subtle hover overlay
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Genres */}
            <div>
              <h3 className="text-white text-base font-semibold mb-4 text-center">
                Top Genres
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  layout="vertical"
                  data={Object.entries(
                    media.reduce((acc, item) => {
                      acc[item.genre] = (acc[item.genre] || 0) + 1;
                      return acc;
                    }, {})
                  )
                    .map(([genre, count]) => ({ _id: genre, count }))
                    .slice(0, 5)}
                  margin={{ left: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" stroke="#aaa" />
                  <YAxis type="category" dataKey="_id" stroke="#aaa" />
                  <Tooltip
                    cursor={{ fill: "rgba(155, 92, 246, 0.08)" }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const color = payload[0].fill || "#ec4899";
                        return (
                          <div
                            style={{
                              background: "rgba(17, 16, 24, 0.95)",
                              border: `1px solid ${color}`,
                              borderRadius: "12px",
                              boxShadow: `0 0 15px ${color}55`,
                              color: "#fff",
                              padding: "10px 14px",
                              fontSize: "13px",
                              fontWeight: 500,
                              backdropFilter: "blur(6px)",
                              letterSpacing: "0.3px",
                            }}
                          >
                            <p
                              style={{
                                color,
                                fontWeight: 600,
                                textTransform: "capitalize",
                              }}
                            >
                              {label}
                            </p>
                            <p style={{ color: "#e5e5ff" }}>
                              Count:{" "}
                              <span style={{ color, fontWeight: 600 }}>
                                {payload[0].value}
                              </span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#a855f7" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

/* 📊 Small Card Component */
function StatCard({ label, value, icon, color }) {
  const colorMap = {
    purple: "text-purple-400",
    yellow: "text-yellow-400",
    pink: "text-pink-400",
  };
  return (
    <div className="bg-[#111114] rounded-xl p-5 border border-gray-800 text-center hover:border-purple-500/40 transition-all">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p
        className={`text-3xl font-bold flex justify-center items-center gap-1 ${colorMap[color]}`}
      >
        {icon} {value}
      </p>
    </div>
  );
}
