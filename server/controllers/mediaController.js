import Media from "../models/Media.js";

export const getMediaStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const result = await Media.aggregate([
      { $match: { user: userId } },
      {
        $facet: {
          total: [{ $count: "count" }],
          avgRating: [{ $group: { _id: null, avg: { $avg: "$rating" } } }],
          thisMonth: [
            { $match: { date: { $gte: startOfMonth } } },
            { $count: "count" },
          ],
          typeCount: [
            { $group: { _id: "$type", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          genreCount: [
            { $match: { genre: { $ne: "" } } },
            { $group: { _id: "$genre" } },
            { $count: "count" },
          ],
          topGenres: [
            { $match: { genre: { $ne: "" } } },
            { $group: { _id: "$genre", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
          ],
          monthly: [
            {
              $group: {
                _id: { $month: "$date" },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: -1 } },
            { $limit: 6 },
          ],
        },
      },
    ]);
    const statusCount = await Media.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const stats = result[0];
    res.json({
      total: stats.total[0]?.count || 0,
      avgRating: stats.avgRating[0]?.avg || 0,
      thisMonth: stats.thisMonth[0]?.count || 0,
      typeCount: stats.typeCount || [],
      genreCount: stats.genreCount[0]?.count || 0,
      topGenres: stats.topGenres || [],
      monthly: stats.monthly || [],
      statusCount: statusCount || [],
    });
  } catch (err) {
    console.error("Error generating stats:", err);
    res.status(500).json({ message: "Error generating analytics" });
  }
};
