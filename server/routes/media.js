import express from 'express';
import Media from '../models/Media.js';
import protect from '../middleware/authMiddleware.js';
import mongoose from 'mongoose';
import { getMediaStats } from '../controllers/mediaController.js';
import { createMedia } from '../controllers/createMedia.js';
const router = express.Router();

// Create media (protected)
router.post('/', protect, createMedia);

// Get all media for logged-in user
router.get('/', protect, async (req, res, next) => {
  try {
    const items = await Media.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// Update media (protected)
router.put('/:id', protect, async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Not found' });

    if (media.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete media (protected)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Not found' });

    if (media.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await media.deleteOne();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
});
router.get("/stats/overview", protect, getMediaStats);

export default router;
