import express from "express";
import User from "../models/User.js";
import Media from "../models/Media.js";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  followUser,
  unfollowUser,
  updateProfile,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   ⭐ FAVORITES ROUTES
========================================================= */

/**
 * @route   POST /api/users/favorite/:mediaId
 * @desc    Add a media item to favorites
 * @access  Private
 */
router.post("/favorite/:mediaId", protect, addFavorite);

/**
 * @route   DELETE /api/users/favorite/:mediaId
 * @desc    Remove a media item from favorites
 * @access  Private
 */
router.delete("/favorite/:mediaId", protect, removeFavorite);

/**
 * @route   GET /api/users/favorites
 * @desc    Get all favorite media items for the user
 * @access  Private
 */
router.get("/favorites", protect, getFavorites);

/* =========================================================
   🤝 FOLLOW / UNFOLLOW ROUTES
========================================================= */

/**
 * @route   POST /api/users/follow/:id
 * @desc    Follow another user
 * @access  Private
 */
router.post("/follow/:id", protect, followUser);

/**
 * @route   POST /api/users/unfollow/:id
 * @desc    Unfollow another user
 * @access  Private
 */
router.post("/unfollow/:id", protect, unfollowUser);

/* =========================================================
   🧑‍💼 PROFILE MANAGEMENT
========================================================= */

/**
 * @route   PUT /api/users/update
 * @desc    Update user profile
 * @access  Private
 */
router.put("/update", protect, updateProfile);

/* =========================================================
   🌐 PUBLIC PROFILE (KEEP LAST)
========================================================= */

/**
 * @route   GET /api/users/:username
 * @desc    Get public user profile with media stats
 * @access  Public
 */
router.get("/:username", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isPublic) {
      return res.status(403).json({ message: "This profile is private" });
    }

    const media = await Media.find({ user: user._id });

    const total = media.length;
    const avgRating =
      total > 0
        ? media.reduce((sum, item) => sum + (item.rating || 0), 0) / total
        : 0;

    const typeCount = {};
    media.forEach((m) => {
      if (m.type) {
        typeCount[m.type] = (typeCount[m.type] || 0) + 1;
      }
    });

    const favType =
      Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

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
    res.status(500).json({
      message: "Error fetching public profile",
      error: err.message,
    });
  }
});

export default router;
