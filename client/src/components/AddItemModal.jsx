import { useState } from "react";
import API from "../api/axios.js";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import imageCompression from "browser-image-compression";
import PLATFORMS from "../data/platform.js";
import MOODS from "../data/mood.js";

export default function AddItemModal({ isOpen, onClose, onAdded }) {
  const [form, setForm] = useState({
    title: "",
    type: "movie",
    genre: "",
    language: "English",
    platform: "Other",
    bookCategory: "",
    mood: "other",
    date: "",
    status: "plan",
    rating: "",
    notes: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let thumbnailUrl = "";

      // 🧠 Compress & upload
      if (thumbnail) {
        const compressed = await imageCompression(thumbnail, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        });

        const formData = new FormData();
        formData.append("file", compressed);
        const uploadRes = await API.post("/upload/thumbnail", formData);
        thumbnailUrl =
          uploadRes.data?.url ||
          uploadRes.data?.secure_url ||
          "https://res.cloudinary.com/drrrye3xd/image/upload/v1761320623/default_media_thumb_pvg8kh.png";
      } else {
        thumbnailUrl =
          "https://res.cloudinary.com/drrrye3xd/image/upload/v1761320623/default_media_thumb_pvg8kh.png";
      }

      const payload = {
        ...form,
        thumbnail: thumbnailUrl,
        date: form.date ? new Date(form.date).toISOString() : null,
        rating: form.rating === "" ? null : Number(form.rating),
      };

      if (form.type !== "book") delete payload.bookCategory;
      else payload.bookCategory = form.bookCategory || "novel";

      const { data } = await API.post("/media", payload);
      toast.success("Item added successfully!");
      onAdded(data);
      onClose();
    } catch {
      toast.error("Failed to add item.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-[#141218] text-white rounded-2xl w-[90%] max-w-md relative shadow-[0_0_30px_rgba(155,92,246,0.3)] animate-fadeIn pointer-events-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-fuchsia-400 transition"
        >
          <X size={20} />
        </button>

        <div className="p-6 overflow-y-auto max-h-[85vh] custom-scroll">
          <h2 className="text-xl font-semibold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#ec4899]">
            Add New Media Entry
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Title *"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter title..."
              maxLength={50}
            />

            {/* Thumbnail */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Thumbnail</label>
              <div className="flex flex-col items-center gap-3">
                <img
                  src={
                    preview ||
                    "https://res.cloudinary.com/drrrye3xd/image/upload/v1761320623/default_media_thumb_pvg8kh.png"
                  }
                  alt="Thumbnail preview"
                  className="w-24 h-24 rounded-lg object-cover border border-[#9b5cf6]/40"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setThumbnail(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                  className="text-sm text-gray-300"
                />
              </div>
            </div>

            <SelectField
              label="Type *"
              name="type"
              value={form.type}
              onChange={handleChange}
              options={[
                { value: "movie", label: "Movie" },
                { value: "series", label: "Series" },
                { value: "anime", label: "Anime" },
                { value: "book", label: "Book" },
                { value: "game", label: "Game" },
                { value: "other", label: "Other" },
              ]}
            />

            <InputField
              label="Genre"
              name="genre"
              value={form.genre}
              onChange={handleChange}
              placeholder="Action, Romance..."
            />

            <InputField
              label="Language"
              name="language"
              value={form.language}
              onChange={handleChange}
              placeholder="English, Japanese..."
            />

            {/* Platform */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Platform / Source
              </label>
              <div className="grid grid-cols-4 gap-3">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, platform: p.name }))
                    }
                    className={`flex flex-col items-center justify-center border rounded-xl p-2 transition-all ${
                      form.platform === p.name
                        ? "border-[#9b5cf6] bg-[#1a1721] shadow-[0_0_12px_rgba(155,92,246,0.3)]"
                        : "border-[#2d2d38]/70 hover:border-[#9b5cf6]/50 hover:bg-[#1c1a24]"
                    }`}
                  >
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="w-6 h-6 invert opacity-90"
                    />
                    <span className="text-[11px] mt-1">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {form.type === "book" && (
              <SelectField
                label="Book Category"
                name="bookCategory"
                value={form.bookCategory}
                onChange={handleChange}
                options={[
                  "novel",
                  "manga",
                  "comic",
                  "light novel",
                  "textbook",
                  "PhysicalCopy",
                  "Ebook",
                  "other",
                ].map((opt) => ({ value: opt, label: opt }))}
              />
            )}

            <SelectField
              label="Mood"
              name="mood"
              value={form.mood}
              onChange={handleChange}
              options={MOODS}
            />

            <InputField
              label={
                form.status === "completed"
                  ? "Date Completed"
                  : form.status === "plan"
                  ? "Planned Date"
                  : "Date"
              }
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />

            <SelectField
              label="Status *"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={[
                "plan",
                "watching",
                "completed",
                "on-hold",
                "dropped",
              ].map((opt) => ({ value: opt, label: opt }))}
            />

            <InputField
              label="Rating (0–10)"
              name="rating"
              type="number"
              min="0"
              max="10"
              value={form.rating}
              onChange={handleChange}
              placeholder="7"
            />

            <TextAreaField
              label="Notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Your thoughts..."
            />

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-[#9b5cf6] to-[#ec4899] text-white font-semibold py-2.5 rounded-xl mt-4 hover:opacity-90 hover:shadow-[0_0_15px_rgba(155,92,246,0.5)] transition disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Add Entry"}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: #9b5cf6;
          border-radius: 10px;
        }

        select {
          background: #111114;
          border: 1px solid rgba(45, 45, 56, 0.7);
          color: #f2f2f2;
          border-radius: 0.75rem;
          padding: 0.5rem 0.75rem;
          appearance: none;
          transition: all 0.25s ease;
          font-size: 0.95rem;
        }

        select:hover {
          border-color: rgba(155, 92, 246, 0.5);
          background-color: #17151f;
        }

        select:focus {
          outline: none;
          border-color: #9b5cf6;
          box-shadow: 0 0 8px rgba(155, 92, 246, 0.4);
        }

        option {
          background: #141218;
          color: #fff;
          padding: 0.5rem;
          font-size: 0.9rem;
        }

        option:hover {
          background-color: #9b5cf6 !important;
          color: #fff !important;
        }
      `}</style>
    </div>
  );
}

// 🧩 Reusable Inputs
const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm text-gray-400 mb-1">{label}</label>
    <input
      {...props}
      className="w-full bg-[#111114] border border-[#2d2d38]/70 rounded-xl px-3 py-2 text-gray-100 
                 focus:outline-none focus:ring-2 focus:ring-[#9b5cf6]/40 focus:border-[#9b5cf6] 
                 placeholder-gray-500 transition"
    />
  </div>
);

const TextAreaField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm text-gray-400 mb-1">{label}</label>
    <textarea
      {...props}
      className="w-full bg-[#111114] border border-[#2d2d38]/70 rounded-xl px-3 py-2 text-gray-100 h-24
                 focus:outline-none focus:ring-2 focus:ring-[#9b5cf6]/40 focus:border-[#9b5cf6] transition"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm text-gray-400 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full custom-select"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label || opt.value}
        </option>
      ))}
    </select>
  </div>
);
