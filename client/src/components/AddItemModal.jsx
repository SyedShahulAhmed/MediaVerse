import { useState } from "react";
import API from "../api/axios.js";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function AddItemModal({ isOpen, onClose, onAdded }) {
  const [form, setForm] = useState({
    title: "",
    type: "movie",
    genre: "",
    date: "",
    status: "plan",
    rating: "",
    notes: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        // ✅ Convert date to ISO format if provided, else null
        date: form.date ? new Date(form.date).toISOString() : null,
        // ✅ Convert rating to number or null
        rating: form.rating === "" ? null : Number(form.rating),
      };

      await API.post("/media", payload);
      toast.success("Item added successfully!");
      onAdded();
      onClose();
    } catch (err) {
      console.error("Error adding item:", err);
      toast.error("Failed to add item.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1f] text-white rounded-2xl w-[90%] max-w-md relative shadow-[0_0_30px_rgba(155,92,246,0.25)] animate-fadeIn pointer-events-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-primary transition"
        >
          <X size={20} />
        </button>

        {/* 📋 Scrollable Form */}
        <div className="p-6 overflow-y-auto max-h-[85vh] custom-scroll">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Add New Entry
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 🏷️ Title */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                placeholder="Enter title..."
                value={form.title}
                onChange={handleChange}
                required
                className="w-full bg-[#111114] border border-[#2a2a2a] rounded-xl px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>

            {/* 🎬 Type */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full bg-[#111114] border border-[#2a2a2a] rounded-xl px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              >
                <option value="movie">🎬 Movie</option>
                <option value="series">📺 Series</option>
                <option value="anime">🍜 Anime</option>
                <option value="book">📚 Book</option>
                <option value="game">🎮 Game</option>
                <option value="other">🌀 Other</option>
              </select>
            </div>

            {/* 🎭 Genre */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Genre</label>
              <input
                type="text"
                name="genre"
                placeholder="Action, Drama, RPG..."
                value={form.genre}
                onChange={handleChange}
                className="w-full bg-[#111114] border border-[#2a2a2a] rounded-xl px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>

            {/* 📅 Status */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Status *</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full bg-[#111114] border border-[#2a2a2a] rounded-xl px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              >
                <option value="plan">🗓️ Plan</option>
                <option value="watching">⌛ Watching</option>
                <option value="completed">✅ Completed</option>
                <option value="on-hold">⏸️ On-hold</option>
                <option value="dropped">❌ Dropped</option>
              </select>
            </div>

            {/* 📆 Date */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                {form.status === "completed"
                  ? "Date Completed"
                  : form.status === "plan"
                  ? "Planned Date"
                  : "Date"}
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full bg-[#111114] border border-[#2a2a2a] rounded-xl px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>

            {/* ⭐ Rating */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Rating (1–10)
              </label>
              <input
                type="number"
                name="rating"
                placeholder="7"
                min="0"
                max="10"
                value={form.rating}
                onChange={handleChange}
                className="w-full bg-[#111114] border border-[#2a2a2a] rounded-xl px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>

            {/* 📝 Notes */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Notes</label>
              <textarea
                name="notes"
                placeholder="Your thoughts, favorite moments..."
                value={form.notes}
                onChange={handleChange}
                className="w-full bg-[#111114] border border-[#2a2a2a] rounded-xl px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition h-24"
              ></textarea>
            </div>

            {/* 🚀 Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-primary text-white font-semibold py-2.5 rounded-xl mt-4 hover:opacity-90 hover:shadow-[0_0_15px_rgba(155,92,246,0.5)] transition"
            >
              Add Entry
            </button>
          </form>
        </div>
      </div>

      {/* Custom scrollbar */}
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #111114;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: #5b21b6;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #7c3aed;
        }
      `}</style>
    </div>
  );
}
