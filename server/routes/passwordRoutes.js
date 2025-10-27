import express from "express";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   🔢 HELPER: GENERATE OTP + MAIL TRANSPORT
========================================================= */

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

/* =========================================================
   1️⃣ FORGOT PASSWORD — SEND OTP
   @route  POST /api/password/forgot
========================================================= */
router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account found" });

    const otp = generateOTP();
    const expiry = Date.now() + 5 * 60 * 1000; // 5-minute expiry

    user.resetOTP = otp;
    user.resetOTPExpiry = expiry;
    await user.save();

    await transporter.sendMail({
      from: `"MediaVerse Support" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your MediaVerse Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Reset Your Password</h2>
          <p>Here is your OTP code (valid for 5 minutes):</p>
          <h1 style="letter-spacing: 4px; color: #8b5cf6;">${otp}</h1>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP email", error: err.message });
  }
});

/* =========================================================
   2️⃣ VERIFY OTP
   @route  POST /api/password/verify-otp
========================================================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isExpired = !user.resetOTPExpiry || Date.now() > user.resetOTPExpiry;
    if (!user.resetOTP || user.resetOTP !== otp || isExpired) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error verifying OTP", error: err.message });
  }
});

/* =========================================================
   3️⃣ RESET PASSWORD (AFTER OTP VERIFIED)
   @route  POST /api/password/reset
========================================================= */
router.post("/reset", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isExpired = !user.resetOTPExpiry || Date.now() > user.resetOTPExpiry;
    if (!user.resetOTP || user.resetOTP !== otp || isExpired) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetOTP = null;
    user.resetOTPExpiry = null;
    await user.save();

    res.json({ message: "Password reset successful!" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password", error: err.message });
  }
});

/* =========================================================
   4️⃣ CHANGE PASSWORD (LOGGED-IN USER)
   @route  PUT /api/password/change
   @access Private
========================================================= */
router.put("/change", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect current password" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error changing password", error: err.message });
  }
});

export default router;
