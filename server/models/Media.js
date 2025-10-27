import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      default: "movie",
      trim: true,
    },
    genre: { type: String, default: "", trim: true },
    language: { type: String, default: "English", trim: true },

    // 💻 Platform (String instead of enum)
    platform: {
      type: String,
      trim: true,
      default: "Other",
    },

    // 🖼️ Thumbnail
    thumbnail: {
      type: String,
      default:
        "https://res.cloudinary.com/drrrye3xd/image/upload/v1761320623/default_media_thumb_pvg8kh.png",
    },

    // 📚 Book Category (String instead of enum)
    bookCategory: {
      type: String,
      trim: true,
      default: "novel",
    },

    // 😄 Mood (String instead of enum)
    mood: {
      type: String,
      trim: true,
      lowercase: true,
      default: "other",
    },

    date: { type: Date, default: null },

    status: {
      type: String,
      default: "plan",
      trim: true,
    },

    rating: { type: Number, min: 0, max: 10, default: null },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const Media = mongoose.model("Media", MediaSchema);
export default Media;
