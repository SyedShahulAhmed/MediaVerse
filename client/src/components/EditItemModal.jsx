import { useEffect, useState } from "react";
import API from "../api/axios.js";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function EditItemModal({ isOpen, onClose, item, onUpdated }) {
  const [form, setForm] = useState({
    title: "",
    type: "movie",
    genre: "",
    date: "",
    status: "plan",
    rating: "",
    notes: "",
  });

  useEffect(() => {
    if (!item) return;
    setForm({
      title: item.title || "",
      type: item.type || "movie",
      genre: item.genre || "",
      date: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
      status: item.status || "plan",
      rating: item.rating ?? "",
      notes: item.notes || "",
    });
  }, [item]);

  if (!isOpen || !item) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        type: form.type,
        genre: form.genre,
        date: form.date || null,
        status: form.status,
        rating: form.rating === "" ? null : Number(form.rating),
        notes: form.notes,
      };
      await API.put(`/media/${item._id}`, payload);
      toast.success("Item updated successfully!");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update item");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1f] text-white rounded-2xl p-6 w-[90%] max-w-md relative 
                   shadow-[0_0_30px_rgba(155,92,246,0.25)] animate-fadeIn pointer-events-auto border border-[#2a2a2a]/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-purple-400 hover:scale-110 transition-all"
        >
          <X size={20} />
        </button>

        {/* 📝 Header */}
        <h2 className="text-2xl font-semibold text-white mb-6 text-center tracking-wide">
          ✏️ Edit Entry
        </h2>

        {/* 🧾 Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full bg-[#111114] border border-[#2a2a2a] rounded-xl px-3 py-2 text-gray-100 
                         focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all"
            />
          </div>

          {/* Type + Genre */}
          <div className="grid grid-cols-2 gap-3">
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="bg-[#111114] border border-[#2a2a2a] rounded-xl px-3 py-2 text-gray-100 
                         focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all"
            >
              <option value="movie">🎬 Movie</option>
              <option value="series">📺 Series</option>
              <option value="anime">🍜 Anime</option>
              <option value="book">📚 Book</option>
              <option value="game">🎮 Game</option>
              <option value="other">🌀 Other</option>
            </select>

            <input
              name="genre"
              value={form.genre}
              onChange={handleChange}
              placeholder="Genre"
              className="bg-[#111114] border border-[#2a2a2a] rounded-xl px-3 py-2 text-gray-100 
                         focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all"
            />
          </div>

          {/* Date + Status */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="bg-[#111114] border border-[#2a2a2a] rounded-xl px-3 py-2 text-gray-100 
                         focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all"
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="bg-[#111114] border border-[#2a2a2a] rounded-xl px-3 py-2 text-gray-100 
                         focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all"
            >
              <option value="plan">🗓️ Plan</option>
              <option value="watching">⌛ Watching</option>
              <option value="completed">✅ Completed</option>
              <option value="on-hold">⏸️ On-hold</option>
              <option value="dropped">❌ Dropped</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Rating (1–10)</label>
            <input
              type="number"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              min="0"
              max="10"
              placeholder="Rating"
              className="w-full bg-[#111114] border border-[#2a2a2a] rounded-xl px-3 py-2 text-gray-100 
                         focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Your thoughts..."
              className="w-full bg-[#111114] border border-[#2a2a2a] rounded-xl px-3 py-2 text-gray-100 h-24 
                         focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gray-700 text-gray-200 font-medium 
                         hover:bg-gray-600 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] 
                         active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r 
                         from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 
                         hover:shadow-[0_0_15px_rgba(155,92,246,0.5)] active:scale-[0.98] 
                         transition-all"
            >
              💾 Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
