// controllers/badgeController.js

import User from "../models/User.js";
import Media from "../models/Media.js";
import { badgeRules } from "../utils/badges.js";

/**
 * @desc Check and award new badges for the current user
 * @route GET /api/badges/check
 * @access Private
 */
export const checkAndAwardBadges = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("followers following");
    if (!user) return res.status(404).json({ message: "User not found" });

    const allMedia = await Media.find({ user: userId });
    const newlyUnlocked = [];

    // 🧮 Precompute stats
    const totalCount = allMedia.length;
    const typeCounts = {
      movie: allMedia.filter((m) => m.type === "movie").length,
      series: allMedia.filter((m) => m.type === "series").length,
      book: allMedia.filter((m) => m.type === "book").length,
      game: allMedia.filter((m) => m.type === "game").length,
    };

    const followersCount = user.followers.length;
    const followingCount = user.following.length;

    // 🌈 Unique values for diversity-related badges
    const uniqueGenres = [...new Set(allMedia.map((m) => m.genre).filter(Boolean))];
    const uniquePlatforms = [...new Set(allMedia.map((m) => m.platform).filter(Boolean))];
    const uniqueMoods = [...new Set(allMedia.map((m) => m.mood).filter(Boolean))];
    const uniqueLanguages = [...new Set(allMedia.map((m) => m.language).filter(Boolean))];

    // 🧠 Optional additional counts (extendable)
    const customStats = {
      favorites: user.favorites?.length || 0,
      search: user.searchHistory?.length || 0,
      profile: user.profileCompleted ? 1 : 0,
      custom: user.customTags?.length || 0,
      explore: user.explores?.length || 0,
      notes: allMedia.filter((m) => m.notes && m.notes.trim().length > 0).length,
    };

    // 🏅 Evaluate all badge rules
    for (const rule of badgeRules) {
      let qualifies = false;

      switch (rule.type) {
        // 🧩 Total entries
        case "all":
          qualifies = totalCount >= rule.threshold;
          break;

        // 🎬 Type-specific
        case "movie":
        case "series":
        case "book":
        case "game":
          qualifies = typeCounts[rule.type] >= rule.threshold;
          break;

        // 🤝 Social actions
        case "social":
          qualifies = followingCount >= rule.threshold;
          break;

        // 💫 Popularity
        case "followers":
          qualifies = followersCount >= rule.threshold;
          break;

        // 🌈 Diversity and category types
        case "genre":
          qualifies = uniqueGenres.length >= rule.threshold;
          break;
        case "platform":
          qualifies = uniquePlatforms.length >= rule.threshold;
          break;
        case "mood":
          qualifies = uniqueMoods.length >= rule.threshold;
          break;
        case "language":
          qualifies = uniqueLanguages.length >= rule.threshold;
          break;

        // 🧠 Extended badge types (optional new ones)
        default:
          if (customStats[rule.type] !== undefined) {
            qualifies = customStats[rule.type] >= rule.threshold;
          }
          break;
      }

      // ✅ Award new badges
      if (qualifies && !user.badges.includes(rule.id)) {
        user.badges.push(rule.id);
        newlyUnlocked.push(rule.id);
      }
    }

    // 🧹 Deduplicate badges (safety)
    user.badges = [...new Set(user.badges)];
    await user.save();

    return res.status(200).json({
      message: "Badges checked successfully",
      newBadges: newlyUnlocked,
      totalBadges: user.badges.length,
    });
  } catch (error) {
    console.error("❌ Badge check error:", error);
    return res.status(500).json({
      message: "Failed to check badges",
      error: error.message,
    });
  }
};

/**
 * @desc Get all available badge definitions
 * @route GET /api/badges
 * @access Public
 */
export const getAllBadges = async (req, res) => {
  try {
    res.status(200).json({ badges: badgeRules });
  } catch (error) {
    console.error("❌ Error fetching badges:", error);
    res.status(500).json({ message: "Failed to load badges" });
  }
};
