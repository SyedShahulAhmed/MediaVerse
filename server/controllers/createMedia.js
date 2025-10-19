// controllers/mediaController.js
import Media from "../models/Media.js";

export const createMedia = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.user;

    const {
      title,
      type,
      genre,
      date,
      status,
      rating,
      notes,
    } = req.body;

    // ✅ FIX: parse the incoming date correctly
    let parsedDate = null;
    if (date) {
      const d = new Date(date);
      if (!isNaN(d.getTime())) parsedDate = d;
    }

    const media = new Media({
      user: userId,
      title: title?.trim(),
      type: type || "movie",
      genre: genre?.trim() || "",
      date: parsedDate, // ✅ This ensures MongoDB stores it as an actual Date
      status: status || "plan",
      rating: rating === "" || rating === null ? null : Number(rating),
      notes: notes?.trim() || "",
    });

    const saved = await media.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Error creating media:", error);
    res.status(500).json({ message: "Failed to create media item" });
  }
};
