import { useEffect, useState } from "react";
import API from "../api/axios.js";
import toast from "react-hot-toast";
import Analytics from "./Analytics.jsx";
import AddItemModal from "../components/AddItemModal.jsx";
import EditItemModal from "../components/EditItemModal.jsx";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.jsx";
import { Plus, Edit3, Trash2, Star } from "lucide-react";
import hero from "../assets/hero.png";
import { Film, Tv, Book, Gamepad2 } from "lucide-react";

export default function Dashboard() {
  const [media, setMedia] = useState([]);
  const [view, setView] = useState("collection");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 🎨 Type style + icon mapping
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

  // 🧠 Fetch all media items
  const fetchMedia = async () => {
    try {
      const { data } = await API.get("/media");
      setMedia(data);
    } catch (err) {
      console.error(err);
      toast.error("Error loading media");
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // 🔍 Filter & Search
  const filtered = media.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.genre?.toLowerCase().includes(search.toLowerCase());
    const matchType = filter === "All" || item.type === filter.toLowerCase();
    return matchSearch && matchType;
  });

  // 🎨 Status colors
  const statusColors = {
    plan: "bg-blue-900/40 text-blue-400",
    watching: "bg-yellow-900/40 text-yellow-400",
    completed: "bg-green-900/40 text-green-400",
    "on-hold": "bg-purple-900/40 text-purple-400",
    dropped: "bg-red-900/40 text-red-400",
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white pb-20">
      {/* 🌌 HERO HEADER */}
      <section className="relative h-[260px] flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={hero}
            alt="Media Background"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d0d0f]/60 to-[#0d0d0f]" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <h1 className="flex items-center gap-2 text-5xl font-bold text-primary drop-shadow-[0_0_10px_rgba(155,92,246,0.8)]">
            🎬 𝐌𝐞𝐝𝐢𝐚𝐕𝐞𝐫𝐬𝐞
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            Track your movies, series, anime, books, and games all in one
            beautiful place
          </p>
        </div>
      </section>

      {/* 🧭 Top Controls */}
      <div className="flex justify-between items-start px-12 mt-6">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg font-medium
             bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6]
             text-white transition-all duration-300
             hover:from-[#8b5cf6] hover:to-[#7c3aed]
             active:scale-[0.97]
             focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/50"
          >
            <Plus size={18} className="text-white" />
            Add Entry
          </button>

          {/* 📂 Tabs */}
          {/* 📂 Tabs */}
          <div className="relative flex items-center gap-2 bg-[#1a1a1d] rounded-lg p-1 w-fit border border-[#2a2a31] mt-2 overflow-hidden">
            {/* Animated Underline Indicator */}
            <div
              className={`absolute h-[2px] bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] rounded-full bottom-0 transition-all duration-300 ease-out ${
                view === "collection"
                  ? "left-1 w-[calc(50%-4px)]"
                  : "left-[calc(50%+2px)] w-[calc(50%-4px)]"
              }`}
            ></div>

            {/* Collection Tab */}
            <button
              onClick={() => setView("collection")}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out ${
                view === "collection"
                  ? "bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white"
                  : "text-gray-400 hover:text-white hover:bg-[#2a2a31]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.6}
                stroke="currentColor"
                className={`w-4 h-4 transition-colors duration-300 ${
                  view === "collection"
                    ? "text-white"
                    : "text-gray-400 group-hover:text-white"
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5h4.5l1.5 2.25H21M4.5 7.5V18a1.5 1.5 0 001.5 1.5h12a1.5 1.5 0 001.5-1.5V9.75H9"
                />
              </svg>
              Collection
            </button>

            {/* Analytics Tab */}
            <button
              onClick={() => setView("analytics")}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out ${
                view === "analytics"
                  ? "bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white"
                  : "text-gray-400 hover:text-white hover:bg-[#2a2a31]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.6}
                stroke="currentColor"
                className={`w-4 h-4 transition-colors duration-300 ${
                  view === "analytics"
                    ? "text-white"
                    : "text-gray-400 group-hover:text-white"
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13h4v8H3v-8zm7-5h4v13h-4V8zm7-3h4v16h-4V5z"
                />
              </svg>
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* 🔍 Search + Filter */}
      {view === "collection" && (
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8 px-6 md:px-12">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by title or genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[#0b0b0e] border border-[#1f1b2e] rounded-md 
                 px-4 py-3.5 text-sm text-gray-200 placeholder-gray-500 
                 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/60 focus:border-[#7c3aed]
                 hover:border-[#8b5cf6] transition-all duration-300"
          />

          {/* Filter Dropdown (Styled) */}
          <div className="relative w-full md:w-48">
            <button
              type="button"
              role="combobox"
              aria-controls="filter-dropdown"
              aria-expanded="false"
              aria-autocomplete="none"
              dir="ltr"
              data-state="closed"
              className="flex h-10 items-center justify-between w-full
                   rounded-md border border-[#1f1b2e]
                   bg-[#0b0b0e] px-3 py-2 text-sm text-gray-200
                   ring-offset-[#0b0b0e] 
                   focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/70 focus:ring-offset-2
                   hover:border-[#8b5cf6] transition-all duration-300
                   [&>span]:line-clamp-1"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="pointer-events-none">{filter}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-[#8b5cf6] opacity-70 transition-transform duration-300"
                style={{
                  transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                className="absolute z-20 mt-2 w-full bg-[#0b0b0e] border border-[#1f1b2e]
                     rounded-md shadow-lg overflow-hidden animate-fadeIn"
              >
                {[
                  "All Types",
                  "Movies",
                  "Series",
                  "Anime",
                  "Books",
                  "Games",
                ].map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setFilter(option);
                      setDropdownOpen(false);
                    }}
                    className={`px-4 py-2 text-sm cursor-pointer transition-colors duration-200
                ${
                  filter === option
                    ? "bg-[#8b5cf6] text-white"
                    : "text-gray-200 hover:bg-[#7c3aed]/60 hover:text-white"
                }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📦 COLLECTION or 📈 ANALYTICS */}
      {view === "collection" ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 px-12 mt-10">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item._id}
                className="bg-[linear-gradient(135deg,hsl(240_10%_7%)_0%,hsl(240_10%_10%)_100%)] border border-gray-800 rounded-2xl p-5 shadow-[0_0_20px_rgba(155,92,246,0.1)] hover:shadow-[0_0_25px_rgba(155,92,246,0.25)] transition-all duration-300 hover:scale-[1.01]"
              >
                {/* TITLE + STATUS */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg text-white truncate max-w-[70%]">
                    {item.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-lg font-medium ${
                      statusColors[item.status] || "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </div>

                {/* TAGS */}
                <div className="flex flex-wrap gap-2 mb-3 text-sm">
                  <span
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border capitalize 
    ${
      typeMap[item.type]?.color || "bg-gray-800 text-gray-300 border-gray-700"
    }`}
                  >
                    {typeMap[item.type]?.icon || <Film size={14} />} {item.type}
                  </span>

                  {item.genre && (
                    <span className="px-2 py-1 bg-gray-800 rounded-full text-gray-300">
                      {item.genre}
                    </span>
                  )}
                </div>

                {/* NOTES */}
                <p className="text-gray-400 text-sm bg-[#121214] p-2 rounded-lg mb-3 min-h-[40px]">
                  {item.notes || "No notes added."}
                </p>

                {/* DATE + RATING */}
                <div className="text-xs text-gray-500 mb-4 flex justify-between items-center">
                  <span>
                    {item.status === "completed"
                      ? "Completed:"
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
                    <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                      <Star size={16} fill="#facc15" strokeWidth={0} />
                      {item.rating}/10
                    </span>
                  )}
                </div>

                {/* BUTTONS */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setShowEditModal(true);
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#0d0d12] text-gray-200 border border-gray-700 flex items-center justify-center gap-2 
                      hover:border-purple-500 hover:text-purple-400 hover:shadow-[0_0_10px_rgba(155,92,246,0.4)] transition-all"
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowDeleteModal(true);
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#0d0d12] text-gray-200 border border-gray-700 flex items-center justify-center gap-2 
                      hover:border-red-500 hover:text-red-400 hover:shadow-[0_0_10px_rgba(239,68,68,0.4)] transition-all"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
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

      {/* ➕ Modals */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdded={fetchMedia}
      />
      <EditItemModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingItem(null);
        }}
        item={editingItem}
        onUpdated={fetchMedia}
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
            toast.success("Item deleted");
            fetchMedia();
          } catch (err) {
            toast.error("Failed to delete item");
          }
        }}
      />
    </div>
  );
}
