import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API, { followUser, unfollowUser } from "../api/axios.js";
import { ArrowLeft, Calendar } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader.jsx";
import ProfileNotFound from "../components/ProfileNotFound.jsx";
import PrivateProfile from "../components/PrivateProfile.jsx";
import { badgeRules } from "../utils/badges.js";

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [allBadges, setAllBadges] = useState([]);

  // Prevent double-trigger race conditions
  const isProcessing = useRef(false);

  // 🏅 Load all badges once
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const { data } = await API.get("/badges");
        setAllBadges(data.badges || []);
      } catch (err) {
        console.error("Failed to load badges", err);
      }
    };
    fetchBadges();
  }, []);

  // 👤 Fetch profile details
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/users/${username}`);
      setProfile(data);

      if (loggedInUser) {
        setIsFollowing(
          data.user.followers?.some(
            (f) => String(f?._id || f) === String(loggedInUser._id)
          )
        );
      }
      setError("");
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? "not_found"
          : err.response?.status === 403
          ? "private"
          : "error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username, loggedInUser]);


// 👥 Follow / Unfollow with stable toasts and badge animation
const handleFollowToggle = async () => {
  if (isProcessing.current) return;
  if (!loggedInUser) return toast.error("Please log in to follow users!");
  if (!profile?.user?._id) return;

  isProcessing.current = true;
  setUpdating(true);

  try {
    const action = isFollowing ? "unfollow" : "follow";

    // Perform follow/unfollow API
    const res =
      action === "unfollow"
        ? await unfollowUser(profile.user._id)
        : await followUser(profile.user._id);

    // Update local follow state instantly for responsive UI
    setIsFollowing(!isFollowing);

    // ✅ Toast for follow/unfollow
    setTimeout(() => {
      toast.dismiss();
      toast.success(
        action === "follow" ? "Followed user!" : "Unfollowed user!",
        { duration: 3000 }
      );
    }, 100);

    // 🏅 Handle new badge unlocks (beautiful gradient toast)
    const newBadges = res?.data?.newBadges || res?.newBadges || [];
    if (Array.isArray(newBadges) && newBadges.length > 0) {
      newBadges.forEach((id, i) => {
        const badge = badgeRules.find((b) => b.id === id);
        if (!badge) return;

        setTimeout(() => {
          toast.custom(
            (t) => (
              <div
                className={`flex items-center gap-4 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 text-white px-5 py-4 rounded-2xl shadow-[0_0_25px_rgba(236,72,153,0.4)] border border-fuchsia-400/50 transition-all duration-500 transform ${
                  t.visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                }`}
              >
                <div className="text-4xl drop-shadow-lg">{badge.icon}</div>
                <div className="flex flex-col items-start">
                  <p className="font-semibold text-lg leading-tight">
                    🎉 New Badge Unlocked!
                  </p>
                  <p className="text-sm text-gray-100">{badge.name}</p>
                </div>
              </div>
            ),
            { duration: 5000, position: "top-right" }
          );
        }, 2000); // stagger multiple badge popups
      });

      // 🕐 Wait for badge toasts to complete (~5.5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 5500));
    } else {
      // wait 1 second for normal toasts
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }



  } catch (err) {
    console.error("Follow toggle error:", err);
    toast.error("Something went wrong while following/unfollowing.");
  } finally {
    setUpdating(false);
    isProcessing.current = false;
  }
};

  // 🧱 Error / Loading states
  if (error === "not_found") return <ProfileNotFound />;
  if (error === "private") return <PrivateProfile />;
  if (error === "error")
    return (
      <p className="text-center mt-16 text-red-400 text-lg">
        Something went wrong. Please try again.
      </p>
    );
  if (loading) return <Loader />;

  const { user, media } = profile;
  const avatarUrl =
    user.avatar ||
    `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(
      user.username
    )}`;

  // 🎯 Random badges for showcase
  const unlockedBadges = user?.badges || [];
  const randomBadges = unlockedBadges
    .map((id) => allBadges.find((b) => b.id === id))
    .filter(Boolean)
    .sort(() => 0.5 - Math.random())
    .slice(0, 16);

  // 🎮 Favorite Type
  const getFavType = () => {
    if (!media?.length) return "—";
    const count = media.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});
    const fav = Object.entries(count).sort((a, b) => b[1] - a[1])[0];
    const icons = {
      movie: "🎬 Movie",
      series: "📺 Series",
      anime: "🍜 Anime",
      book: "📚 Book",
      game: "🎮 Game",
      other: "🌀 Other",
    };
    return icons[fav?.[0]] || "—";
  };

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white px-6 py-12 flex flex-col items-center relative">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
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
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 
             rounded-xl text-sm font-medium transition-all duration-300
             bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white 
             shadow-[0_0_12px_rgba(155,92,246,0.4)] hover:shadow-[0_0_20px_rgba(155,92,246,0.7)]
             hover:scale-[1.03] active:scale-[0.98] backdrop-blur-sm
             border border-purple-700/40"
      >
        <ArrowLeft size={18} />
        <span className="font-semibold">Back</span>
      </button>

      {/* 🧑 Profile Header */}
      <div className="relative w-full max-w-6xl bg-gradient-to-br from-[#141218]/90 to-[#1b1b21]/85 border border-[#2d2d38]/70 rounded-3xl shadow-[0_0_60px_rgba(155,92,246,0.25)] px-10 py-12 mb-16 backdrop-blur-md grid md:grid-cols-2 gap-10 mx-auto">
        {/* Left Side */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 h-full">
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-36 h-36 rounded-full border-2 border-purple-500 shadow-[0_0_35px_rgba(155,92,246,0.6)] mb-3"
          />
          <h1 className="text-4xl font-extrabold text-white">
            @{user.username}
          </h1>
          <p className="text-gray-400 text-sm">{user.email}</p>

          {user.bio ? (
            <p className="text-gray-300 text-sm italic mt-2 max-w-md leading-relaxed">
              “{user.bio}”
            </p>
          ) : (
            <p className="text-gray-500 text-sm italic mt-2">
              This user hasn’t added a bio yet.
            </p>
          )}

          <p className="text-gray-500 text-xs mt-2 flex items-center justify-center gap-1">
            <Calendar size={14} /> Joined{" "}
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </p>

          {loggedInUser && loggedInUser._id !== user._id && (
            <button
              onClick={handleFollowToggle}
              disabled={updating || isProcessing.current}
              className={`mt-4 px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isFollowing
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white hover:opacity-90"
              } ${
                updating || isProcessing.current
                  ? "opacity-60 cursor-not-allowed"
                  : ""
              }`}
            >
              {updating
                ? "Please wait..."
                : isFollowing
                ? "Unfollow"
                : "Follow"}
            </button>
          )}
        </div>

        {/* Right Side - Stats */}
        <div className="flex flex-col justify-start items-stretch gap-6">
          {[
            { title: "Total Entries", value: media.length },
            {
              title: "Average Rating",
              value: `${(
                media.reduce((acc, m) => acc + (m.rating || 0), 0) /
                (media.filter((m) => m.rating).length || 1)
              ).toFixed(1)}/10`,
            },
            { title: "Favorite Type", value: getFavType() },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#141218]/80 border border-[#2d2d38]/60 rounded-2xl p-5 flex justify-between items-center 
              shadow-[0_0_25px_rgba(155,92,246,0.15)] hover:shadow-[0_0_30px_rgba(155,92,246,0.3)] transition-all duration-300 hover:-translate-y-[2px]"
            >
              <div className="flex flex-col items-start">
                <span className="text-gray-400 text-sm">{stat.title}</span>
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#ec4899]">
                  {stat.value}
                </span>
              </div>
            </div>
          ))}

          {/* 🏅 Badge Count */}
          <div className="flex flex-col items-start mt-3">
            <div
              className="relative inline-flex items-center justify-center 
              px-6 py-2 rounded-full border border-fuchsia-600/60
              bg-gradient-to-r from-purple-800/10 to-fuchsia-800/10 
              text-[15px] font-medium tracking-wide 
              shadow-[0_0_20px_rgba(155,92,246,0.25)] 
              hover:shadow-[0_0_25px_rgba(155,92,246,0.4)] 
              transition-all duration-300 backdrop-blur-md"
            >
              <span className="text-fuchsia-400 font-semibold text-lg">
                {unlockedBadges.length}
              </span>
              <span className="text-gray-400 text-lg mx-2">/</span>
              <span className="text-gray-300 font-medium text-lg">
                {allBadges.length}
              </span>
              <span className="ml-2 text-sm text-fuchsia-300 tracking-widest uppercase">
                Badges
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🏅 Badges Showcase */}
      {randomBadges.length > 0 ? (
        <div className="mt-14 w-full max-w-6xl">
          <h2 className="text-2xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500">
            Achievements Showcase ({unlockedBadges.length})
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {randomBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#141218]/80 border border-purple-700/30 shadow-[0_0_25px_rgba(155,92,246,0.15)] hover:shadow-[0_0_30px_rgba(155,92,246,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/60"
              >
                <div className="text-4xl mb-3">{badge.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {badge.name}
                </h3>
                <p className="text-sm text-gray-400">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-10 text-center">
          <p className="text-gray-500 italic">No achievements unlocked yet.</p>
        </div>
      )}
    </div>
  );
}
