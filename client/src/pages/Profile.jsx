import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import API from "../api/axios.js";
import toast, { Toaster } from "react-hot-toast";
import { Calendar, Star, Film, Users, UserPlus, Settings } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import ProfileLoader from "../components/ProfileLoader.jsx";
import { badgeRules } from "../utils/badges.js";


export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bio: user?.bio || "",
    isPublic: user?.isPublic ?? true,
  });
  const [msg, setMsg] = useState("");
  const [stats, setStats] = useState({ total: 0, avgRating: 0, favType: "-" });
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prevBadges, setPrevBadges] = useState(user?.badges || []);

  const avatarUrl = `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(
    user?.username || "guest"
  )}&backgroundType=gradientLinear&radius=50`;

  // 🧩 Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const [statsRes, profileRes] = await Promise.all([
          API.get("/media/stats/overview", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const userData = profileRes.data.user;
        updateUser?.(userData);

        setStats({
          total: statsRes.data.total || 0,
          avgRating: statsRes.data.avgRating?.toFixed(1) || 0,
          favType:
            statsRes.data.typeCount?.length > 0
              ? statsRes.data.typeCount.sort((a, b) => b.count - a.count)[0]._id
              : "-",
        });
        setFollowers(userData.followers || []);
        setFollowing(userData.following || []);
        setPrevBadges(userData.badges || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile info.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔄 Sync local form with user
  useEffect(() => {
    if (user) {
      setForm({
        bio: user.bio || "",
        isPublic: user.isPublic ?? true,
      });
    }
  }, [user]);

  // 🏅 Detect and toast new badges
  useEffect(() => {
    if (!user?.badges) return;

    if (user.badges.length > prevBadges.length) {
      const newBadgeIds = user.badges.filter((b) => !prevBadges.includes(b));
      const newBadgeDetails = badgeRules.filter((b) =>
        newBadgeIds.includes(b.id)
      );

      // Slight delay for smooth UI transition
      setTimeout(() => {
        newBadgeDetails.forEach((b) => {
          toast.success(`🏅 New badge unlocked: ${b.name}!`, {
            icon: b.icon,
            style: {
              background: "rgba(31, 27, 46, 0.95)",
              color: "#fff",
              border: "1px solid rgba(216,180,254,0.5)",
              boxShadow: "0 0 25px rgba(168,85,247,0.4)",
              borderRadius: "10px",
              backdropFilter: "blur(6px)",
            },
          });
        });
      }, 3000);
    }

    setPrevBadges(user.badges);
  }, [user?.badges]);

 



  if (loading) return <ProfileLoader />;

  const unlockedBadges = badgeRules.filter((b) => user?.badges?.includes(b.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b0f] via-[#0e0e12] to-[#16161c] text-white px-6 py-12 flex flex-col items-center overflow-x-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(31, 27, 46, 0.95)",
            color: "#fff",
            border: "1px solid rgba(216,180,254,0.5)",
            boxShadow: "0 0 25px rgba(168,85,247,0.4)",
            borderRadius: "10px",
            padding: "12px 16px",
            backdropFilter: "blur(6px)",
          },
          success: {
            iconTheme: {
              primary: "#a855f7",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
        containerStyle={{
          zIndex: 2147483647,
          position: "fixed",
          top: "1rem",
          right: "1rem",
        }}
      />

      {/* PROFILE CARD */}
      <div className="relative backdrop-blur-xl border border-purple-800/40 rounded-3xl p-10 w-full max-w-3xl shadow-[0_0_45px_rgba(155,92,246,0.25)] transition-all duration-500">

        {/* SETTINGS BUTTON */}
        <button
          onClick={() => navigate("/settings")}
          className="absolute top-6 left-6 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90 transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)]"
        >
          <Settings size={16} /> Settings
        </button>

        {/* HEADER */}
        <div className="flex flex-col items-center gap-5 mb-10">
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-28 h-28 rounded-full border-2 border-purple-500 shadow-[0_0_25px_rgba(155,92,246,0.5)]"
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500 text-transparent bg-clip-text">
            {user?.username}
          </h1>
          <p className="text-gray-400 text-sm">{user?.email}</p>

          {/* BIO */}
          <div className="text-center max-w-2xl mx-auto mt-2">
            {user?.bio ? (
              <p className="text-gray-300 italic text-sm sm:text-base leading-relaxed px-4">
                “{user.bio}”
              </p>
            ) : (
              <p className="text-gray-500 text-sm italic">
                No bio added yet — tell the world something about you!
              </p>
            )}
          </div>

          <p className="text-gray-500 text-xs flex items-center justify-center gap-1 mt-1">
            <Calendar size={14} /> Joined{" "}
            {new Date(user?.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {/* FOLLOW STATS */}
        <div className="flex justify-center items-center gap-8 mt-4 mb-8">
          <button
            onClick={() => navigate("/followers")}
            className="group flex items-center gap-4 px-7 py-4 rounded-2xl bg-[#181820]/90 border border-purple-600/40 shadow-[0_4px_15px_rgba(155,92,246,0.15)] hover:shadow-[0_6px_25px_rgba(155,92,246,0.25)] hover:border-purple-400/60 transition-all duration-300"
          >
            <Users size={22} className="text-purple-300" />
            <div className="text-left">
              <p className="text-lg font-bold text-purple-300">
                {followers.length}
              </p>
              <p className="text-xs text-gray-400 tracking-wide">Followers</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/following")}
            className="group flex items-center gap-4 px-7 py-4 rounded-2xl bg-[#181820]/90 border border-fuchsia-600/40 shadow-[0_4px_15px_rgba(236,72,153,0.15)] hover:shadow-[0_6px_25px_rgba(236,72,153,0.25)] hover:border-fuchsia-400/60 transition-all duration-300"
          >
            <UserPlus size={22} className="text-fuchsia-300" />
            <div className="text-left">
              <p className="text-lg font-bold text-fuchsia-300">
                {following.length}
              </p>
              <p className="text-xs text-gray-400 tracking-wide">Following</p>
            </div>
          </button>
        </div>

        {/* QUICK STATS */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-[#131318]/80 rounded-xl p-5 border border-purple-700/30 text-center">
            <p className="text-gray-400 text-sm mb-1">Total Entries</p>
            <p className="text-3xl font-bold text-purple-400">{stats.total}</p>
          </div>
          <div className="bg-[#131318]/80 rounded-xl p-5 border border-yellow-500/20 text-center">
            <p className="text-gray-400 text-sm mb-1">Average Rating</p>
            <p className="text-3xl font-bold text-yellow-400 flex justify-center items-center gap-1">
              <Star size={18} fill="#facc15" /> {stats.avgRating}
            </p>
          </div>
          <div className="bg-[#131318]/80 rounded-xl p-5 border border-pink-600/30 text-center">
            <p className="text-gray-400 text-sm mb-1">Favorite Type</p>
            <p className="text-3xl font-bold text-pink-400 flex justify-center items-center gap-1 capitalize">
              <Film size={18} /> {stats.favType}
            </p>
          </div>
        </div>
      </div>

      {/* BADGES SECTION */}
      <div className="mt-16 w-full max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
          🏅 Your Badges
        </h2>

        {unlockedBadges.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 px-6">
              {unlockedBadges
                .sort(() => Math.random() - 0.5)
                .slice(0, 15)
                .map((b) => (
                  <div
                    key={b.id}
                    className="group bg-[#1b1b22]/70 border border-fuchsia-500/40 rounded-2xl p-5 flex flex-col items-center justify-center hover:scale-105 hover:border-fuchsia-400 transition-all "
                  >
                    <div className="text-4xl mb-3">{b.icon}</div>
                    <p className="text-sm font-medium text-purple-200">
                      {b.name}
                    </p>
                  </div>
                ))}
            </div>

            <Link
              to="/profile/badges"
              className="inline-block mt-5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-[0_0_20px_rgba(155,92,246,0.5)]"
            >
              View All →
            </Link>
          </>
        ) : (
          <p className="text-gray-500 text-sm mt-4">
            You haven’t unlocked any badges yet — start adding media!
          </p>
        )}
      </div>
    </div>
  );
}
