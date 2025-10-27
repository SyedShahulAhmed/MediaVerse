import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: function() { return !this.googleId; }, select: false },
    avatar: { type: String, default: "" },
    googleId: { type: String, default: null },
    bio: { type: String, default: "" },
    theme: { type: String, default: "dark" },
    links: [{ platform: String, url: String }],
    badgeProgress: {
      movies: { type: Number, default: 0 },
      series: { type: Number, default: 0 },
      books: { type: Number, default: 0 },
      games: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    badges: [String],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Media" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isPublic: { type: Boolean, default: true },

    // 🆕 OTP fields
    resetOTP: { type: String, default: null },
    resetOTPExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);
const User = mongoose.model("User", UserSchema);
export default User;
