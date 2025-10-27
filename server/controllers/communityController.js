import Activity from "../models/Activity.js";
import User from "../models/User.js";

export const getCommunityFeed = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all users followed by the logged-in user
    const user = await User.findById(userId).populate("following");
    const followingIds = user.following.map(u => u._id);

    // Fetch recent activities of followed users
    const feed = await Activity.find({ user: { $in: followingIds } })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(feed);
  } catch (err) {
    res.status(500).json({ error: "Failed to load feed" });
  }
};
