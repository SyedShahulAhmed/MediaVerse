import express from "express";
import User from "../models/User.js";
import Media from "../models/Media.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   👥 USER MANAGEMENT ROUTES
========================================================= */

/**
 * @route   GET /api/admin/users
 * @desc    Get all registered users
 * @access  Admin only
 */
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get single user details
 * @access  Admin only
 */
router.get("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
});

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Update user role
 * @access  Admin only
 */
router.put("/users/:id/role", protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({
      message: `User role updated to '${role}'`,
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update role", error: err.message });
  }
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user
 * @access  Admin only
 */
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
});

/* =========================================================
   🎬 MEDIA MANAGEMENT ROUTES
========================================================= */

/**
 * @route   GET /api/admin/media
 * @desc    Get all uploaded media
 * @access  Admin only
 */
router.get("/media", protect, adminOnly, async (req, res) => {
  try {
    const media = await Media.find()
      .populate("user", "username email role")
      .sort({ createdAt: -1 });

    res.json(media);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch media", error: err.message });
  }
});

/**
 * @route   GET /api/admin/media/:id
 * @desc    Get single media item
 * @access  Admin only
 */
router.get("/media/:id", protect, adminOnly, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id).populate("user", "username email");
    if (!media) return res.status(404).json({ message: "Media not found" });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch media item", error: err.message });
  }
});

/**
 * @route   DELETE /api/admin/media/:id
 * @desc    Delete a media item
 * @access  Admin only
 */
router.delete("/media/:id", protect, adminOnly, async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });
    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete media", error: err.message });
  }
});

/* =========================================================
   📊 DASHBOARD STATISTICS
========================================================= */

/**
 * @route   GET /api/admin/stats
 * @desc    Get admin dashboard statistics
 * @access  Admin only
 */
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalMedia = await Media.countDocuments();
    const recentUploads = await Media.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "username");

    res.json({
      totalUsers,
      totalAdmins,
      totalMedia,
      recentUploads,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
});

/* =========================================================
   🧹 BULK ACTIONS
========================================================= */

/**
 * @route   DELETE /api/admin/cleanup/:userId
 * @desc    Delete all media from a specific user
 * @access  Admin only
 */
router.delete("/cleanup/:userId", protect, adminOnly, async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Media.deleteMany({ owner: userId });

    res.json({
      message: `Deleted ${result.deletedCount} media items from user ${userId}`,
    });
  } catch (err) {
    res.status(500).json({ message: "Cleanup failed", error: err.message });
  }
});

export default router;
