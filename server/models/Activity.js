import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    // 👤 User performing the action
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // 🎬 Media type
    type: {
      type: String,
      default: "movie",
      trim: true,
    },

    // 📢 Action type (add/update/delete/etc.)
    action: {
      type: String,
      default: "added",
      trim: true,
    },

    // 🏷️ Media snapshot for activity feed
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Media" },
    itemTitle: { type: String, required: true, trim: true },
    genre: { type: String, default: "", trim: true },
    language: { type: String, default: "English", trim: true },

    // 💻 Platform (now flexible string)
    platform: { type: String, trim: true, default: "Other" },

    // 📚 Book Category (flexible)
    bookCategory: { type: String, trim: true, default: "novel" },

    // 😄 Mood (flexible)
    mood: { type: String, trim: true, lowercase: true, default: "other" },

    // 🕒 Interaction date
    date: { type: Date, default: null },

    // 📺 Status (no strict enum)
    status: { type: String, trim: true, default: "plan" },

    // ⭐ Rating snapshot
    rating: { type: Number, min: 0, max: 10, default: null },

    // 📝 Notes snapshot
    notes: { type: String, default: "" },

    // ⏱️ Feed timestamps
  },
  { timestamps: true }
);

export default mongoose.model("Activity", ActivitySchema);
