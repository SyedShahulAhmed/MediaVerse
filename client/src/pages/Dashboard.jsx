import { useEffect, useState, useCallback } from "react";
import API from "../api/axios.js";
import toast, { Toaster } from "react-hot-toast";
import Analytics from "./Analytics.jsx";
import AddItemModal from "../components/AddItemModal.jsx";
import EditItemModal from "../components/EditItemModal.jsx";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.jsx";
import {
  Plus,
  Edit3,
  Trash2,
  Star,
  Globe2,
  Gamepad2,
  Book,
  Film,
  Tv,
  MoreVertical,
} from "lucide-react";
import hero from "../assets/hero.png";
import CustomLoader from "../components/CustomLoader.jsx";
import default_media_thumb from "../assets/default_media_thumb.png";
import { PLATFORM_LOGOS } from "../data/platform.js";
import { moodMap } from "../data/mood.js";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState([]);
  const [view, setView] = useState("collection");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Types");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [activeNote, setActiveNote] = useState("");
  const [activeTitle, setActiveTitle] = useState("");
  const [badgesCache, setBadgesCache] = useState({});

  // 🧠 Fetch media
  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/media");
      setMedia(data);
    } catch {
      toast.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  }, []);

  const checkForBadges = useCallback(async () => {
    try {
      // quick guard
      if (!API) return;

      // call the endpoint that returns newly unlocked badge ids
      const resp = await API.get("/badges/check");
      const newBadgeIds = resp?.data?.newBadges || [];

      if (!Array.isArray(newBadgeIds) || newBadgeIds.length === 0) {
        // nothing new
        return;
      }

      // fetch badge metadata (names, icons, etc.)
      const badgeResp = await API.get("/badges");
      const allBadges = badgeResp?.data?.badges || [];

      // build map safely
      const badgeMap = (Array.isArray(allBadges) ? allBadges : []).reduce(
        (acc, b) => {
          if (b && b.id) acc[b.id] = b;
          return acc;
        },
        {}
      );

      // dedupe using badgesCache state
      const toShow = newBadgeIds.filter((id) => !badgesCache[id]);

      if (toShow.length === 0) return;

      // mark them as shown in cache (optimistic)
      setBadgesCache((prev) => {
        const copy = { ...prev };
        toShow.forEach((id) => (copy[id] = true));
        return copy;
      });

      // show toasts in sequence
      toShow.forEach((badgeId, i) => {
        const badge = badgeMap[badgeId] || {
          name: badgeId.replace(/_/g, " "),
          icon: "🏅",
        };

        setTimeout(() => {
          toast.custom(
            (t) => (
              <div
                className={`bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white px-5 py-4 rounded-2xl shadow-lg flex items-center gap-3 transition-all ${
                  t.visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                }`}
              >
                <div className="text-3xl">{badge.icon}</div>
                <div>
                  <p className="font-semibold text-lg">New Badge Unlocked!</p>
                  <p className="text-sm text-gray-100">{badge.name}</p>
                </div>
              </div>
            ),
            { duration: 5000 }
          );
        }, i * 600);
      });
    } catch (err) {
      // log so you can inspect why it fails in dev
      // (don't surface internal errors to users here)
      // eslint-disable-next-line no-console
      console.warn("checkForBadges failed:", err?.response || err);
    }
  }, [badgesCache]);

  // 🧩 Fixed filter logic
  const filtered = media.filter((item) => {
    const s = search.toLowerCase();
    const matchSearch =
      item.title?.toLowerCase().includes(s) ||
      item.genre?.toLowerCase().includes(s) ||
      item.language?.toLowerCase().includes(s) ||
      item.platform?.toLowerCase().includes(s);

    const filterMap = {
      "all types": "all",
      movies: "movie",
      series: "series",
      anime: "anime",
      books: "book",
      games: "game",
    };
    const selectedType = filterMap[filter.toLowerCase()] || "all";
    const typeMatch = selectedType === "all" || item.type === selectedType;

    return matchSearch && typeMatch;
  });

  // 🎛 Close menus on outside click
  useEffect(() => {
    const closeAll = (e) => {
      if (
        !e.target.closest(".menu-button") &&
        !e.target.closest(".menu-dropdown") &&
        !e.target.closest(".dropdown-container")
      ) {
        setMenuOpen(null);
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", closeAll);
    return () => document.removeEventListener("click", closeAll);
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

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

  const statusColors = {
    plan: "bg-blue-900/40 text-blue-400",
    watching: "bg-yellow-900/40 text-yellow-400",
    completed: "bg-green-900/40 text-green-400",
    "on-hold": "bg-purple-900/40 text-purple-400",
    dropped: "bg-red-900/40 text-red-400",
  };

  if (loading) return <CustomLoader message="Loading your MediaVerse..." />;

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white pb-20">
        <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
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
      {/* 🌌 HERO */}
      <section className="relative h-[260px] flex flex-col justify-center items-center text-center overflow-hidden">
        <img
          src={hero}
          alt="Media Background"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d0d0f]/60 to-[#0d0d0f]" />
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="flex items-center gap-2 text-5xl font-bold text-primary drop-shadow-[0_0_10px_rgba(155,92,246,0.8)]">
            🎬 𝐌𝐞𝐝𝐢𝐚𝐕𝐞𝐫𝐬𝐞
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            Track your movies, series, anime, books, and games — all in one
            place.
          </p>
        </div>
      </section>

      {/* 🧭 CONTROLS */}
      <div className="flex justify-between items-start px-12 mt-6">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg font-medium bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] hover:opacity-90 transition-all"
          >
            <Plus size={18} /> Add Entry
          </button>

          <div className="relative flex items-center gap-2 bg-[#1a1a1d] rounded-lg p-1 border border-[#2a2a31] mt-2">
            {["collection", "analytics"].map((tab) => (
              <button
                key={tab}
                onClick={() => setView(tab)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  view === tab
                    ? "bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white"
                    : "text-gray-400 hover:text-white hover:bg-[#2a2a31]"
                }`}
              >
                {tab === "collection" ? "Collection" : "Analytics"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🔍 SEARCH + FILTER */}
      {view === "collection" && (
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8 px-6 md:px-12 relative">
          <input
            type="text"
            placeholder="Search by title, genre, or platform..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[#0b0b0e] border border-[#1f1b2e] rounded-md px-4 py-3.5 
                       text-sm text-gray-200 placeholder-gray-500 focus:ring-2 
                       focus:ring-[#7c3aed]/60 transition-all"
          />

          <div className="relative w-full md:w-48 z-[100] dropdown-container">
            <button
              type="button"
              className="flex h-10 items-center justify-between w-full rounded-md border 
                         border-[#1f1b2e] bg-[#0b0b0e] px-3 py-2 text-sm text-gray-200 
                         focus:ring-2 focus:ring-[#7c3aed]/70 hover:border-[#8b5cf6] 
                         transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen((prev) => !prev);
              }}
            >
              <span>{filter}</span>
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                className="absolute top-12 w-full bg-[#0b0b0e] border border-[#1f1b2e] 
                           rounded-md shadow-[0_0_25px_rgba(155,92,246,0.2)] 
                           overflow-hidden animate-fadeIn z-[200]"
              >
                {[
                  "All Types",
                  "Movies",
                  "Series",
                  "Anime",
                  "Books",
                  "Games",
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setFilter(option);
                      setDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm transition-all ${
                      filter === option
                        ? "bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white"
                        : "text-gray-200 hover:bg-[#7c3aed]/60"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📦 COLLECTION */}
      {view === "collection" ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 px-12 mt-10">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item._id}
                className="relative group bg-gradient-to-br from-[#111014] to-[#1a1a1d] border border-gray-800 rounded-2xl p-4 shadow-[0_0_15px_rgba(155,92,246,0.1)] hover:shadow-[0_0_25px_rgba(155,92,246,0.25)] hover:scale-[1.015] transition-all duration-300 flex gap-4 items-start overflow-hidden"
              >
                <div className="flex-shrink-0">
                  <div className="w-45 h-70 rounded-xl border border-[#2a2a31] overflow-hidden bg-[#0d0d0f]">
                    <img
                      src={item.thumbnail || item.image || default_media_thumb}
                      alt={item.title || "Media Thumbnail"}
                      onError={(e) => (e.target.src = default_media_thumb)}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between pr-3">
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === item._id ? null : item._id);
                      }}
                      className="menu-button p-2 rounded-full hover:bg-[#2a2a31]/80 text-gray-300 hover:text-white transition"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {menuOpen === item._id && (
                      <div
                        className="absolute right-0 mt-2 z-50 w-36 bg-[#1a1a1d] border border-[#2d2d38]/70 rounded-xl shadow-lg overflow-hidden animate-fadeIn menu-dropdown"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setShowEditModal(true);
                            setMenuOpen(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-[#2a2a31] flex items-center gap-2"
                        >
                          <Edit3 size={15} /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowDeleteModal(true);
                            setMenuOpen(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-[#2a2a31] flex items-center gap-2"
                        >
                          <Trash2 size={15} /> Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div className="flex flex-wrap justify-between items-start mb-2 mt-7 gap-x-2">
                    <h3 className="font-semibold text-lg text-white break-words max-w-full flex-1 leading-tight">
                      {item.title}
                    </h3>
                    <span
                      className={`mt-1 md:mt-0 px-2 py-[3px] text-[11px] rounded-md font-medium uppercase tracking-wide ${
                        statusColors[item.status] || "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-2 mb-4 text-xs">
                    <span
                      className={`flex items-center gap-1 px-2 py-1.5 rounded-full border capitalize ${
                        typeMap[item.type]?.color ||
                        "bg-gray-800 text-gray-300 border-gray-700"
                      }`}
                    >
                      {typeMap[item.type]?.icon || <Film size={12} />}{" "}
                      {item.type}
                    </span>
                    {item.genre && (
                      <span className="px-2 py-1.5 bg-gray-800 rounded-full text-gray-300 border border-gray-700/50">
                        {item.genre}
                      </span>
                    )}
                    {item.language && (
                      <span className="flex items-center gap-1 px-2 py-1.5 bg-gray-800 rounded-full text-gray-300 border border-gray-700/50">
                        <Globe2 size={12} /> {item.language}
                      </span>
                    )}
                    {item.platform && (
                      <span className="flex items-center gap-1 px-2 py-1.5 bg-gray-800 rounded-full text-gray-300 border border-gray-700/50">
                        {PLATFORM_LOGOS[item.platform] ? (
                          <img
                            src={PLATFORM_LOGOS[item.platform]}
                            alt={item.platform}
                            className="w-3.5 h-3.5 invert opacity-80"
                          />
                        ) : (
                          <Gamepad2 size={12} />
                        )}
                        {item.platform}
                      </span>
                    )}
                    {item.mood && (
                      <span className="px-2 py-1.5 bg-purple-800/40 text-purple-300 rounded-full border border-purple-700/40">
                        {moodMap[item.mood] || "🔮"}{" "}
                        {item.mood.charAt(0).toUpperCase() + item.mood.slice(1)}
                      </span>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="relative mb-3">
                    {item.notes ? (
                      <div className="group bg-[#121214] border border-[#2d2d38]/50 hover:border-[#7c3aed]/40 transition rounded-lg px-3 py-2 text-sm text-gray-300 leading-relaxed relative overflow-hidden">
                        <p className="break-all whitespace-pre-wrap line-clamp-2">
                          {item.notes}
                        </p>
                        {item.notes.length > 80 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveNote(item.notes);
                              setActiveTitle(item.title);
                              setShowNoteModal(true);
                            }}
                            className="mt-1 text-purple-400 hover:text-purple-300 transition text-[11px] font-medium"
                          >
                            Read More
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-xs italic bg-[#121214] rounded-lg px-3 py-2">
                        No notes added.
                      </div>
                    )}
                  </div>

                  {/* Date + Rating */}
                  <div className="text-xs text-gray-400 flex justify-between items-center mt-1">
                    <span>
                      {item.status === "completed"
                        ? "Completed:"
                        : item.status === "watching"
                        ? "Watching since:"
                        : item.status === "plan"
                        ? "Planned:"
                        : "Date:"}{" "}
                      <span className="text-gray-300 font-medium">
                        {item.date
                          ? new Date(item.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </span>

                    {item.rating !== null && (
                      <span className="flex items-center gap-1 text-yellow-400 font-semibold drop-shadow-[0_0_4px_rgba(250,204,21,0.4)]">
                        <Star size={14} fill="#facc15" strokeWidth={0} />
                        {item.rating}/10
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full mt-10">
              No entries yet. Click{" "}
              <span className="text-primary">“Add Entry”</span> to begin!
            </p>
          )}
        </div>
      ) : (
        <Analytics />
      )}

      {/* 🧩 Modals */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdded={async () => {
          await fetchMedia();
          // give server a tiny moment if necessary (200ms) — reduce race conditions
          setTimeout(() => checkForBadges(), 200);
        }}
      />

      <EditItemModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingItem(null);
        }}
        item={editingItem}
        onUpdated={async () => {
          await fetchMedia();
          setTimeout(checkForBadges, 700);
        }}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedItem(null);
        }}
        onConfirm={async () => {
          try {
            await API.delete(`/media/${selectedItem._id}`);
            toast.success("Item deleted successfully");
            await fetchMedia();
            setTimeout(checkForBadges, 700);
          } catch {
            toast.error("Failed to delete item");
          }
        }}
      />

      {/* 🗒️ Note Modal */}
      {showNoteModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]"
          onClick={() => setShowNoteModal(false)}
        >
          <div
            className="bg-[#141218] text-white rounded-2xl w-[90%] max-w-md p-6 relative border border-[#2a2a2a]/70 shadow-[0_0_25px_rgba(155,92,246,0.3)] animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowNoteModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-purple-400 transition"
            >
              ✖
            </button>

            <h3 className="text-lg font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#9b5cf6] to-[#ec4899]">
              📝 {activeTitle}
            </h3>

            <div className="max-h-[300px] overflow-y-auto custom-scroll bg-[#111114] border border-[#2d2d38]/70 rounded-xl p-3 text-sm text-gray-300 leading-relaxed">
              {activeNote}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #9b5cf6; border-radius: 10px; }
        @keyframes fadeIn { from {opacity: 0; transform: translateY(10px);} to {opacity: 1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
      `}</style>
    </div>
  );
}
