// controllers/mediaController.js
import Media from "../models/Media.js";



/**
 * @desc Get user’s full media analytics overview
 * @route GET /api/media/stats/overview
 * @access Private
 */
export const getMediaStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // 🧮 Total Entries
    const total = await Media.countDocuments({ user: userId });

    // ⭐ Average Rating (overall)
    const avgRatingData = await Media.aggregate([
      { $match: { user: userId, rating: { $ne: null } } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);
    const avgRating =
      avgRatingData.length > 0 ? avgRatingData[0].avgRating : 0; // Keep as number!

    // 🎬 Count by Type
    const typeCount = await Media.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // 🎭 Top Genres
    const topGenres = await Media.aggregate([
      { $match: { user: userId, genre: { $ne: "" } } },
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // 🧠 Mood Count
    const moodCount = await Media.aggregate([
      { $match: { user: userId, mood: { $ne: "" } } },
      { $group: { _id: "$mood", count: { $sum: 1 } } },
    ]);

    // 📊 Status Distribution
    const statusCount = await Media.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // 🗓️ Monthly Entries (last 6 months only)
    const monthly = await Media.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: sixMonthsAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 🎯 Average Rating per Type
    const avgRatingByType = await Media.aggregate([
      { $match: { user: userId, rating: { $ne: null } } },
      { $group: { _id: "$type", average: { $avg: "$rating" } } },
      { $sort: { average: -1 } },
    ]);

    // 🌐 Languages Count
    const languages = await Media.distinct("language", { user: userId });
    const languageCount = languages.length;

    // 🎮 Platforms Count
    const platforms = await Media.distinct("platform", { user: userId });
    const platformCount = platforms.length;

    // 📅 Entries in current month
    const thisMonthKey = now.toISOString().slice(0, 7);
    const thisMonthEntry = monthly.find((m) => m._id === thisMonthKey);
    const thisMonth = thisMonthEntry ? thisMonthEntry.count : 0;

    // 📦 Respond with structured data
    res.status(200).json({
      total,
      avgRating, // ✅ now numeric, safe for frontend
      thisMonth,
      genreCount: topGenres.length,
      platformCount,
      languageCount,
      typeCount,
      topGenres,
      moodCount,
      statusCount,
      monthly,
      avgRatingByType,
    });
  } catch (err) {
    
    res
      .status(500)
      .json({ message: "Failed to load analytics", error: err.message });
  }
};
