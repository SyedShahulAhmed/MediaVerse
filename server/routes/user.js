import express from "express";
import User from "../models/User.js";
import Media from "../models/Media.js";

const router = express.Router();

/**
 * @route   GET /api/users/:username
 * @desc    Get public profile, media collection & stats
 */
router.get("/:username", async (req, res, next) => {
  try {
    // 🧩 Find user (exclude password)
    const user = await User.findOne({ username: req.params.username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔒 Respect privacy setting
    if (!user.isPublic) {
      return res.status(403).json({ message: "This profile is private" });
    }

    // 🎬 Fetch all media for that user
    const media = await Media.find({ user: user._id });

    // 📊 Generate quick stats
    const total = media.length;
    const avgRating =
      total > 0
        ? media.reduce((sum, item) => sum + (item.rating || 0), 0) / total
        : 0;

    // Find most frequent media type
    const typeCount = {};
    media.forEach((m) => {
      if (!m.type) return;
      typeCount[m.type] = (typeCount[m.type] || 0) + 1;
    });
    const favType =
      Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    // ✅ Response structure matches PublicProfile.jsx
    res.json({
      user,
      media,
      stats: {
        total,
        avgRating,
        favType,
      },
    });
  } catch (err) {
    console.error("Public profile error:", err);
    next(err);
  }
});

export default router;
