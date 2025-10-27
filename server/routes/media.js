import express from "express";
import Media from "../models/Media.js";
import protect from "../middleware/authMiddleware.js";
import mongoose from "mongoose";
import { createMedia } from "../controllers/createMedia.js";
import { getMediaStats } from "../controllers/mediaController.js";

const router = express.Router();

/* =========================================================
   🎬 MEDIA CRUD ROUTES
========================================================= */

/**
 * @route   POST /api/media
 * @desc    Create a new media item
 * @access  Private
 */
router.post("/", protect, createMedia);

/**
 * @route   GET /api/media
 * @desc    Get all media items for logged-in user
 * @access  Private
 */
router.get("/", protect, async (req, res, next) => {
  try {
    const items = await Media.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch media", error: err.message });
  }
});

/**
 * @route   PUT /api/media/:id
 * @desc    Update a media item
 * @access  Private
 */
router.put("/:id", protect, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    if (media.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Media.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update media", error: err.message });
  }
});

/**
 * @route   DELETE /api/media/:id
 * @desc    Delete a media item
 * @access  Private
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    if (media.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await media.deleteOne();
    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete media", error: err.message });
  }
});

/* =========================================================
   📊 MEDIA STATISTICS
========================================================= */

/**
 * @route   GET /api/media/stats/overview
 * @desc    Get statistics overview (totals, ratings, by type/mood)
 * @access  Private
 */
router.get("/stats/overview", protect, getMediaStats);

export default router;
