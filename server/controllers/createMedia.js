import Media from "../models/Media.js";
import User from "../models/User.js";
import Activity from "../models/Activity.js"; // 🆕 Import the new Activity model
import { badgeRules } from "../utils/badges.js"; // 🏅 Badge definitions

/**
 * @desc Create new media item + handle badge progress + log community activity
 * @route POST /api/media
 * @access Private
 */
export const createMedia = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.user;
    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const {
      title,
      type,
      genre,
      language,
      platform,
      bookCategory,
      mood,
      date,
      status,
      rating,
      notes,
      thumbnail, // ✅ added
    } = req.body;

    // 🗓️ Parse date safely
    const parsedDate =
      date && !isNaN(new Date(date).getTime()) ? new Date(date) : null;

    // 🆕 Create and save media item
    const media = new Media({
      user: userId,
      title: title?.trim(),
      type: type || "movie",
      genre: genre?.trim() || "",
      language: language?.trim() || "English",
      platform: platform || "Other",
      bookCategory: bookCategory || "novel",
      mood: mood || "other",
      date: parsedDate,
      status: status || "plan",
      rating: rating === "" || rating === null ? null : Number(rating),
      notes: notes?.trim() || "",
      thumbnail:
        thumbnail?.trim() ||
        "https://res.cloudinary.com/drrrye3xd/image/upload/v1761320623/default_media_thumb_pvg8kh.png", // ✅ added
    });

    const saved = await media.save();

    // 🟣 1️⃣ Log activity to community feed
    await Activity.create({
      user: userId,
      type: saved.type,
      action: "added",
      itemId: saved._id,
      itemTitle: saved.title,
      genre: saved.genre || "",
      language: saved.language || "English",
      platform: saved.platform || "Other",
      bookCategory: saved.bookCategory || "novel",
      mood: saved.mood || "other",
      date: saved.date || null,
      status: saved.status || "plan",
      rating: saved.rating ?? null,
      notes: saved.notes || "",
    });

    console.log(`📢 Activity logged for ${saved.type}: "${saved.title}"`);

    // 🧩 2️⃣ Fetch user & all their media
    const user = await User.findById(userId);
    const allMedia = await Media.find({ user: userId });

    const newlyUnlocked = [];

    // 🧮 3️⃣ Update user progress
    user.badgeProgress.total += 1;
    if (type === "movie") user.badgeProgress.movies += 1;
    if (type === "series") user.badgeProgress.series += 1;
    if (type === "book") user.badgeProgress.books += 1;
    if (type === "game") user.badgeProgress.games += 1;

    // 🏆 4️⃣ Award type-based and total-based badges
    for (const rule of badgeRules) {
      if (!rule.threshold || typeof rule.threshold !== "number") continue;

      let progress = 0;
      if (rule.type === "all") {
        progress = user.badgeProgress.total;
      } else if (["movie", "series", "book", "game"].includes(rule.type)) {
        progress = user.badgeProgress[`${rule.type}s`] || 0;
      } else continue;

      if (progress >= rule.threshold && !user.badges.includes(rule.id)) {
        user.badges.push(rule.id);
        newlyUnlocked.push(rule.id);
        console.log(`🏅 Awarded: ${rule.name}`);
      }
    }

    // 🌈 5️⃣ Diversity badges
    const uniqueGenres = [...new Set(allMedia.map((m) => m.genre))];
    const uniqueMoods = [...new Set(allMedia.map((m) => m.mood))];
    const uniquePlatforms = [...new Set(allMedia.map((m) => m.platform))];

    if (uniqueGenres.length >= 8 && !user.badges.includes("genre_guru")) {
      user.badges.push("genre_guru");
      newlyUnlocked.push("genre_guru");
    }

    if (uniqueMoods.length >= 5 && !user.badges.includes("mood_explorer")) {
      user.badges.push("mood_explorer");
      newlyUnlocked.push("mood_explorer");
    }

    if (
      uniquePlatforms.length >= 5 &&
      !user.badges.includes("platform_hopper")
    ) {
      user.badges.push("platform_hopper");
      newlyUnlocked.push("platform_hopper");
    }

    // 🌙 6️⃣ Time-based fun badges
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5 && !user.badges.includes("night_owl")) {
      user.badges.push("night_owl");
      newlyUnlocked.push("night_owl");
    }
    if (hour >= 5 && hour < 8 && !user.badges.includes("early_bird")) {
      user.badges.push("early_bird");
      newlyUnlocked.push("early_bird");
    }

    // 💎 7️⃣ Perfect 10 rating badge
    if (rating === 10 && !user.badges.includes("perfect_ten")) {
      user.badges.push("perfect_ten");
      newlyUnlocked.push("perfect_ten");
    }

    // 📼 8️⃣ Nostalgia Trip badge
    if (parsedDate) {
      const yearsOld = new Date().getFullYear() - parsedDate.getFullYear();
      if (yearsOld >= 20 && !user.badges.includes("nostalgia_trip")) {
        user.badges.push("nostalgia_trip");
        newlyUnlocked.push("nostalgia_trip");
      }
    }

    // 🌍 9️⃣ International Explorer badge
    const uniqueLanguages = [...new Set(allMedia.map((m) => m.language))];
    if (
      uniqueLanguages.length >= 5 &&
      !user.badges.includes("international_explorer")
    ) {
      user.badges.push("international_explorer");
      newlyUnlocked.push("international_explorer");
    }

    // 🔁 10️⃣ Save user changes
    user.badges = [...new Set(user.badges)];
    await user.save();

    console.log(
      `🎉 New Badges Unlocked: ${newlyUnlocked.join(", ") || "None"}`
    );

    // ✅ 11️⃣ Respond to client
    res.status(201).json({
      message: "Media item created successfully",
      media: saved,
      badges: newlyUnlocked,
    });
  } catch (error) {
    console.error("❌ Error creating media:", error.message);
    res.status(500).json({
      message: "Failed to create media item",
      error: error.message,
    });
  }
};
export const updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Media.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Media not found or unauthorized" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Update Media Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
