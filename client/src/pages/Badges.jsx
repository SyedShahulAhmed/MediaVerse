import { useEffect, useState, useCallback } from "react";
import API from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import BadgesLoader from "../components/BadgesLoader.jsx";

export default function BadgesPage() {
  const { user, setUser } = useAuth();
  const [allBadges, setAllBadges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🏅 Fetch all badges
  const fetchBadges = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/badges");
      setAllBadges(data.badges || []);
    } catch (err) {
      console.error("Error fetching badges:", err);
      toast.error("Failed to load badges");
    } finally {
      setTimeout(() => setLoading(false), 400); // smoother transition
    }
  }, []);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges, user?.badges]);

  const unlocked = allBadges.filter((b) => user?.badges?.includes(b.id));
  const locked = allBadges.filter((b) => !user?.badges?.includes(b.id));

  // 🧠 Check for new badges every 20s
  const checkForNewBadges = useCallback(async () => {
    if (!user?._id) return;
    try {
      const { data } = await API.get(`/badges/check/${user._id}`);

      if (data.newBadges?.length > 0) {
        setUser((prev) => ({
          ...prev,
          badges: [...new Set([...prev.badges, ...data.newBadges])],
        }));

        data.newBadgesData?.forEach((badge) => {
          toast.custom(
            (t) => (
              <div
                className={`bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white px-5 py-4 rounded-2xl shadow-lg 
                            flex items-center gap-3 transition-all duration-500 transform ${
                              t.visible
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-90"
                            }`}
              >
                <div className="text-3xl">{badge.icon}</div>
                <div>
                  <p className="font-semibold text-lg">🏅 {badge.name}</p>
                  <p className="text-sm text-gray-100">{badge.description}</p>
                </div>
              </div>
            ),
            { duration: 5000 }
          );
        });
      }
    } catch (err) {
      console.error("Error checking new badges:", err);
    }
  }, [user?._id, setUser]);

  // 🔁 Auto-check setup with cleanup
  useEffect(() => {
    const interval = setInterval(checkForNewBadges, 20000);
    return () => clearInterval(interval);
  }, [checkForNewBadges]);

  // 🔄 Manual Refresh (Full Page)
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchBadges();
      setTimeout(() => setRefreshing(false), 600);
    } catch (err) {
      console.error("Error refreshing badges:", err);
      setRefreshing(false);
    }
  };

  // 🌀 Loader
  if (loading) return <BadgesLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b0f] via-[#0f0f15] to-[#18181f] text-white p-10 flex flex-col transition-opacity duration-700 ease-in-out opacity-100">
      {/* 🏅 Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(236,72,153,0.4)]">
            🏅 Your Achievements
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-700/20 via-fuchsia-700/10 to-pink-600/10 border border-fuchsia-500/30 shadow-[0_0_12px_rgba(236,72,153,0.15)] backdrop-blur-sm text-sm">
            <span className="text-fuchsia-300 font-semibold">
              {unlocked.length}
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-300">{allBadges.length}</span>
            <span className="ml-1 text-[10px] text-fuchsia-400 uppercase tracking-wider">
              Badges
            </span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-300
            ${
              refreshing
                ? "text-gray-400 border-gray-700 cursor-not-allowed"
                : "text-fuchsia-300 border-fuchsia-700/40 hover:border-fuchsia-500 hover:text-fuchsia-200 hover:shadow-[0_0_10px_rgba(236,72,153,0.25)]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 ${
                refreshing
                  ? "animate-spin text-fuchsia-400"
                  : "text-fuchsia-300"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* 🌟 Unlocked Badges */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold mb-4 text-green-400">
          🌟 Unlocked Badges
        </h2>
        {unlocked.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {unlocked.map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  setSelectedBadge(b);
                  setShowModal(true);
                }}
                className="group relative bg-gradient-to-br from-[#1b1b22] to-[#251a2e] rounded-xl p-5 border border-purple-700/40 text-center 
                hover:scale-[1.05] hover:border-fuchsia-400/60 transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(155,92,246,0.15)] overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-500/10 via-fuchsia-400/10 to-pink-500/10 blur-xl transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-2">{b.icon}</div>
                  <p className="font-semibold text-purple-300">{b.name}</p>
                  <p className="text-xs text-gray-400 mt-1 leading-snug">
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm">
            No badges unlocked yet.
          </p>
        )}
      </section>

      {/* 🔒 Locked Badges */}
      <section className="flex-1">
        <h2 className="text-xl font-semibold mb-4 text-gray-400">
          🔒 Locked Badges
        </h2>
        {locked.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {locked.map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  setSelectedBadge(b);
                  setShowModal(true);
                }}
                className="relative bg-[#0d0d11]/80 rounded-xl p-5 border border-gray-700 text-center 
                opacity-60 hover:opacity-90 hover:scale-[1.04] hover:border-purple-500/40 transition-all cursor-pointer"
              >
                <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-md transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="text-4xl mb-2 grayscale">{b.icon}</div>
                  <p className="font-semibold text-gray-400">{b.name}</p>
                  <p className="text-xs text-gray-500 italic mt-1">
                    Tap to see how to unlock
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm">
            You’ve unlocked all badges! 🏆
          </p>
        )}
      </section>

      {/* 🏆 Badge Modal */}
      {showModal && selectedBadge && (
        <dialog
          open
          className="rounded-2xl backdrop:bg-black/70 backdrop:blur-sm p-0 border-0 z-[9999]"
          onClick={() => setShowModal(false)}
        >
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-[#141218] text-white p-6 rounded-2xl border border-purple-800/40 w-[90%] max-w-md shadow-[0_0_35px_rgba(155,92,246,0.3)] animate-[zoomIn_0.3s_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-3 text-6xl animate-pulse">
                {selectedBadge.icon}
              </div>
              <h2 className="text-xl font-semibold text-center bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent mb-2">
                {selectedBadge.name}
              </h2>
              <p className="text-center text-gray-300 text-sm mb-3 leading-relaxed">
                {selectedBadge.description}
              </p>
              <p className="text-center text-gray-400 text-xs italic">
                🔓 Unlock by reaching{" "}
                <span className="text-fuchsia-400 font-medium">
                  {selectedBadge.threshold}{" "}
                  {selectedBadge.type === "all"
                    ? "total entries"
                    : selectedBadge.type + "s"}
                </span>
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-6 w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 py-2 rounded-lg hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-[0_0_20px_rgba(155,92,246,0.5)]"
              >
                Got it
              </button>
            </div>
          </div>
        </dialog>
      )}

      <footer className="mt-10 text-center text-xs text-gray-500 italic">
        💡 Tip: New badges appear automatically when unlocked — click refresh if
        not visible 🔄
      </footer>

      <style>
        {`
          @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }

          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
            100% { transform: translateY(0px); }
          }

          .group:hover .text-5xl {
            animation: float 1.2s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
