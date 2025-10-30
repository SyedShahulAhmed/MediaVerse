import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import protect from "../middleware/authMiddleware.js";
import { updateProfile } from "../controllers/userController.js";
import { OAuth2Client } from "google-auth-library";
import Media from "../models/Media.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* =========================================================
   📝 AUTHENTICATION ROUTES
========================================================= */

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 */
router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      token,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Please enter all fields" });

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    if (!user.password && user.googleId) {
      return res.status(400).json({
        message: "This account was created with Google. Please login using Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar || "",
      createdAt: user.createdAt,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login", error: err.message });
  }
});

/* =========================================================
   🔐 PASSWORD MANAGEMENT
========================================================= */

/**
 * @route   PUT /api/auth/set-password
 * @desc    Set a password for Google accounts
 * @access  Private
 */
router.put("/set-password", protect, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const user = await User.findById(req.user.id || req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password) {
      return res.status(400).json({ message: "Password already set. Use change-password flow." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password set successfully. You can now login with email & password." });
  } catch (err) {
    res.status(500).json({ message: "Server error while setting password", error: err.message });
  }
});

/* =========================================================
   🔑 GOOGLE AUTH
========================================================= */

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name.toLowerCase().replace(/\s+/g, "_"),
        email,
        googleId,
        password: null,
        avatar: picture,
      });
    }

    const jwtToken = generateToken(user._id);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      token: jwtToken,
    });
  } catch (err) {
    res.status(401).json({ message: "Google authentication failed", error: err.message });
  }
});

/* =========================================================
   ✏️ USERNAME & PROFILE UPDATES
========================================================= */

/**
 * @route   PUT /api/auth/update-username
 * @desc    Change username (requires password)
 * @access  Private
 */
router.put("/update-username", protect, async (req, res) => {
  try {
    const { newUsername, password } = req.body;
    const userId = req.user.id || req.user._id;

    if (!newUsername || !password) {
      return res.status(400).json({ message: "Please provide both username and password." });
    }

    const usernameRegex = /^[a-z0-9_]{3,15}$/;
    if (!usernameRegex.test(newUsername)) {
      return res.status(400).json({
        message: "Username must be 3–15 lowercase letters, numbers, or underscores.",
      });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password." });

    const existing = await User.findOne({ username: newUsername.toLowerCase() });
    if (existing && existing._id.toString() !== user._id.toString()) {
      return res.status(400).json({ message: "Username already taken." });
    }

    user.username = newUsername.toLowerCase();
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ message: "Username updated successfully!", user: safeUser });
  } catch (err) {
    res.status(500).json({ message: "Server error while updating username.", error: err.message });
  }
});

/**
 * @route   PUT /api/auth/update
 * @desc    Update user profile
 * @access  Private
 */
router.put("/update", protect, updateProfile);

/* =========================================================
   👤 USER INFO
========================================================= */

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user profile
 * @access  Private
 */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("followers", "username bio avatar createdAt")
      .populate("following", "username bio avatar createdAt");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching user", error: err.message });
  }
});

/**
 * @route   POST /api/auth/check-availability
 * @desc    Check if username or email already exists
 */
// router.post("/check-availability", async (req, res) => {
//   try {
//     const { username, email } = req.body;
//     const existing = await User.findOne({
//       $or: [{ username: username.toLowerCase() }, { email }],
//     });

//     if (existing) {
//       return res.json({ available: false, message: "Username or email taken" });
//     }

//     res.json({ available: true });
//   } catch (err) {
//     res.status(500).json({ available: false, message: "Server error", error: err.message });
//   }
// });

/* =========================================================
   🗑️ ACCOUNT DELETION
========================================================= */

/**
 * @route   DELETE /api/auth/delete-account
 * @desc    Delete user account (normal or Google)
 * @access  Private
 */
router.delete("/delete-account", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { password } = req.body;

    const user = await User.findById(userId).select("+password"); // ✅ critical fix

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });


    // 🧩 Handle Google users
    if (!user.password && user.googleId) {
      return res.status(403).json({
        success: false,
        message: "Google-linked accounts cannot delete via password route",
      });
    }

    // 🧩 Handle passwordless non-Google accounts
    if (!user.password && !user.googleId) {
      return res.status(400).json({
        success: false,
        message: "This account has no password and cannot be deleted manually",
      });
    }

    // 🔐 Require password input
    if (!password)
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });

    // ✅ Validate bcrypt password
    const isMatch = await bcrypt.compare(password, user.password);


    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });

    // ✅ Delete user + data
    await Media.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error during account deletion",
      error: err.message,
    });
  }
});




export default router;
