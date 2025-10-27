import { useEffect, useState, useCallback } from "react";
import API from "../api/axios.js";
import {
  Calendar,
  Star,
  X,
  Film,
  Book,
  Gamepad2,
  Tv,
  RefreshCcw,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CommunityLoader from "../components/CommunityLoader.jsx";

export default function CommunityFeed() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("thisWeek"); // default: show only recent
  const [error, setError] = useState(null);

  // ✅ Fetch feed with cleanup and debounce
  const fetchFeed = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      const res = await API.get(`/community/feed?filter=${filter}`);
      setFeed(res.data || []);
    } catch (err) {
      console.error("Feed fetch error:", err);
      setError("Failed to load community feed.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  if (loading) return <CommunityLoader />;

  // ✅ Group by recency (only if applicable)
  const now = new Date();
  const startOfToday = new Date(now.setHours(0, 0, 0, 0));
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const todayFeed = [];
  const yesterdayFeed = [];
  const thisWeekFeed = [];
  const earlierFeed = [];

  feed.forEach((item) => {
    const date = new Date(item.createdAt);
    if (date >= startOfToday) todayFeed.push(item);
    else if (date >= startOfYesterday) yesterdayFeed.push(item);
    else if (date >= startOfWeek) thisWeekFeed.push(item);
    else earlierFeed.push(item);
  });

  // ✅ Hide "Earlier" section unless filter != thisWeek
  const showEarlier = filter !== "thisWeek";

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const dateStr = date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateStr} • ${timeStr}`;
  };

  const typeIcon = (type) => {
    const base = "w-4 h-4";
    switch (type) {
      case "movie":
        return <Film className={`text-purple-400 ${base}`} />;
      case "series":
      case "anime":
        return <Tv className={`text-blue-400 ${base}`} />;
      case "book":
        return <Book className={`text-pink-400 ${base}`} />;
      case "game":
        return <Gamepad2 className={`text-green-400 ${base}`} />;
      default:
        return <Film className={`text-purple-400 ${base}`} />;
    }
  };

  const SectionHeading = ({ title, icon: Icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 mt-10 mb-4 relative"
    >
      <Icon className="text-fuchsia-400 w-5 h-5 drop-shadow-[0_0_6px_rgba(236,72,153,0.4)]" />
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
        {title}
      </h2>
      <div className="flex-1 h-[1px] bg-gradient-to-r from-fuchsia-500/30 via-transparent to-transparent ml-2"></div>
    </motion.div>
  );

  const renderFeedSection = (entries) => (
    <motion.div
      layout
      className="relative pl-5 space-y-4 before:absolute before:top-0 before:bottom-0 before:left-2 before:w-[2px] before:bg-gradient-to-b before:from-purple-600/30 before:via-fuchsia-500/20 before:to-transparent"
    >
      {entries.map((a, index) => (
        <motion.div
          key={a._id}
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          onClick={() => setSelected(a)}
          className="relative bg-[#16161d] p-4 pl-6 rounded-xl border border-purple-700/20 
                     flex items-start gap-4 hover:bg-[#1d1d24] hover:border-fuchsia-500/40 
                     cursor-pointer transition-all duration-200 shadow-[0_0_8px_rgba(155,92,246,0.1)] group"
        >
          <div className="absolute -left-[10px] top-6 w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 shadow-[0_0_10px_rgba(236,72,153,0.4)]"></div>
          <img
            src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(
              a.user?.username || "guest"
            )}&backgroundType=gradientLinear&radius=50`}
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover border border-purple-600/30 group-hover:border-fuchsia-500/60 transition-all"
          />
          <div className="flex-1">
            <p className="text-gray-200 leading-snug">
              <span className="font-semibold text-white">
                {a.user?.username}
              </span>{" "}
              {a.action} a{" "}
              <span className="text-purple-400 font-medium">{a.type}</span>:{" "}
              <span className="text-fuchsia-400 hover:underline">
                {a.itemTitle}
              </span>
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-fuchsia-400/80" />
              <span>{formatDateTime(a.createdAt)}</span>
            </p>
          </div>
          <div className="opacity-70 group-hover:opacity-100 transition">
            {typeIcon(a.type)}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0b0b10] text-white p-8">
      {/* 🏷 Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500 drop-shadow-[0_0_12px_rgba(236,72,153,0.35)] flex items-center gap-3">
          ✨ <span>Community Feed</span>
        </h1>

        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#16161d] border border-purple-700/40 text-sm text-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:border-fuchsia-500 transition-all"
          >
            <option value="thisWeek">This Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="last3Months">Last 3 Months</option>
            <option value="allTime">All Time</option>
          </select>

          <button
            onClick={fetchFeed}
            disabled={refreshing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border border-purple-600/40 
                        bg-gradient-to-r from-[#16161d] to-[#1a1a22]
                        hover:from-[#1d1d25] hover:to-[#22222b]
                        hover:border-fuchsia-500/40 text-sm font-medium text-purple-300
                        shadow-[0_0_15px_rgba(155,92,246,0.15)] transition-all duration-300
                        ${
                          refreshing
                            ? "opacity-60 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
          >
            <RefreshCcw
              size={18}
              className={`${
                refreshing ? "animate-spin text-fuchsia-400" : "text-purple-400"
              }`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* 🧠 Error Handling */}
      {error && (
        <p className="text-center text-red-400 mb-4">{error}</p>
      )}

      {/* 📰 Feed Sections */}
      {feed.length === 0 ? (
        <p className="text-gray-500 text-center mt-20 italic">
          No activity found for this period.
        </p>
      ) : (
        <>
          {todayFeed.length > 0 && (
            <>
              <SectionHeading icon={Clock} title="Today" />
              {renderFeedSection(todayFeed)}
            </>
          )}
          {yesterdayFeed.length > 0 && (
            <>
              <SectionHeading icon={Clock} title="Yesterday" />
              {renderFeedSection(yesterdayFeed)}
            </>
          )}
          {thisWeekFeed.length > 0 && (
            <>
              <SectionHeading icon={Clock} title="This Week" />
              {renderFeedSection(thisWeekFeed)}
            </>
          )}
          {showEarlier && earlierFeed.length > 0 && (
            <>
              <SectionHeading icon={Clock} title="Earlier" />
              {renderFeedSection(earlierFeed)}
            </>
          )}
        </>
      )}

      {/* 🔍 Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-[#131318] text-white p-6 rounded-2xl border border-purple-700/40 shadow-[0_0_35px_rgba(236,72,153,0.2)] w-[90%] max-w-lg relative"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
              >
                <X size={22} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <img
                  src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(
                    selected.user?.username || "guest"
                  )}&backgroundType=gradientLinear&radius=50`}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover border border-purple-600/40"
                />
                <div>
                  <p className="font-semibold text-white">
                    {selected.user?.username}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formatDateTime(selected.createdAt)}
                  </p>
                </div>
              </div>

              <h2 className="text-lg font-semibold mb-1 text-fuchsia-400">
                {selected.itemTitle}
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                {selected.type?.charAt(0).toUpperCase() + selected.type?.slice(1)}{" "}
                • {selected.genre || "N/A"} • {selected.platform || "N/A"}
              </p>

              <div className="space-y-2 text-gray-300 text-sm">
                <p>
                  <span className="text-purple-400 font-medium">Mood:</span>{" "}
                  {selected.mood || "—"}
                </p>
                <p>
                  <span className="text-purple-400 font-medium">Language:</span>{" "}
                  {selected.language || "—"}
                </p>
                <p>
                  <span className="text-purple-400 font-medium">Status:</span>{" "}
                  {selected.status || "—"}
                </p>
                {selected.rating !== null && (
                  <p className="flex items-center gap-1">
                    <Star className="text-yellow-400 w-4 h-4" />{" "}
                    <span>{selected.rating}/10</span>
                  </p>
                )}
                {selected.notes && (
                  <p className="mt-2 text-gray-400 border-t border-purple-700/30 pt-2">
                    <span className="text-purple-400 font-medium">Notes:</span>{" "}
                    {selected.notes}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
