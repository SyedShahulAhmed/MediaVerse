// controllers/userController.js
import User from "../models/User.js";
import Media from "../models/Media.js";
import mongoose from "mongoose";

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // ✅ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "Invalid user id" });

    const user = await User.findById(userId)
      .select("-password -email")
      .populate("followers", "username avatar")
      .populate("following", "username avatar");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { bio, theme, links, isPublic, avatar } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { bio, theme, links, isPublic, avatar } },
      { new: true }
    ).select("-password");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const userId = req.user.id;

    if (userId === targetId)
      return res.status(400).json({ message: "Cannot follow yourself" });

    const target = await User.findById(targetId);
    const me = await User.findById(userId);

    if (!target) return res.status(404).json({ message: "Target user not found" });

    const newlyUnlocked = [];

    // ✅ Add follow relationship if not already following
    if (!target.followers.includes(userId)) {
      target.followers.push(userId);
      me.following.push(targetId);
      await target.save();
      await me.save();
    }

    // 🏅 Badge logic
    const followingCount = me.following.length;
    const followersCount = target.followers.length;

    // — Following badges for current user
    if (
      followingCount >= 1 &&
      !me.badges.includes("friendly_follower")
    ) {
      me.badges.push("friendly_follower");
      newlyUnlocked.push("friendly_follower");
    }
    if (
      followingCount >= 5 &&
      !me.badges.includes("community_member")
    ) {
      me.badges.push("community_member");
      newlyUnlocked.push("community_member");
    }
    if (
      followingCount >= 10 &&
      !me.badges.includes("social_explorer")
    ) {
      me.badges.push("social_explorer");
      newlyUnlocked.push("social_explorer");
    }

    // — Follower badges for the target user
    if (
      followersCount >= 5 &&
      !target.badges.includes("rising_star")
    ) {
      target.badges.push("rising_star");
    }
    if (
      followersCount >= 15 &&
      !target.badges.includes("trendsetter")
    ) {
      target.badges.push("trendsetter");
    }
    if (
      followersCount >= 30 &&
      !target.badges.includes("influencer")
    ) {
      target.badges.push("influencer");
    }

    await me.save();
    await target.save();

    res.json({
      message: "Followed successfully",
      followersCount: target.followers.length,
      newBadges : newlyUnlocked,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const unfollowUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const userId = req.user.id;

    await User.findByIdAndUpdate(targetId, { $pull: { followers: userId } });
    await User.findByIdAndUpdate(userId, { $pull: { following: targetId } });

    const target = await User.findById(targetId);
    res.json({ message: "Unfollowed", followersCount: target?.followers.length || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const mediaId = req.params.mediaId;

    const media = await Media.findById(mediaId);
    if (!media) return res.status(404).json({ message: "Media not found" });

    const user = await User.findById(userId);
    if (!user.favorites.includes(mediaId)) {
      user.favorites.push(mediaId);
      await user.save();
    }

    res.json({ message: "Added to favorites", favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const mediaId = req.params.mediaId;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: mediaId } },
      { new: true }
    ).populate("favorites");

    res.json({ message: "Removed from favorites", favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    // ✅ Step 1: Ensure req.user is available
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: no user context found" });
    }

    const userId = req.user.id;

    // ✅ Step 2: Fetch user and populate favorites
    const user = await User.findById(userId).populate("favorites");
    // ✅ Step 3: Handle missing user
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Step 4: Return favorites safely
    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching favorites" });
  }
};
