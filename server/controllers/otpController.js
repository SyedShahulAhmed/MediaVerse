import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import OTP from "../models/otpModel.js"; // create below
import dotenv from "dotenv";

dotenv.config();

// Setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // your Gmail
    pass: process.env.GMAIL_PASS, // your App Password (not Gmail password!)
  },
});

// SEND OTP
export const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before saving
    const hashedOTP = await bcrypt.hash(otp, 10);

    await OTP.findOneAndUpdate(
      { email },
      { otp: hashedOTP, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // Send email
    await transporter.sendMail({
      from: `"MediaVerse" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your MediaVerse OTP Verification Code",
      html: `
        <div style="font-family:sans-serif;padding:20px;">
          <h2>🔐 Verify Your Email</h2>
          <p>Your OTP code is:</p>
          <h1 style="letter-spacing:5px;">${otp}</h1>
          <p>This OTP is valid for <b>5 minutes</b>.</p>
        </div>
      `,
    });

    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error sending OTP" });
  }
};

// VERIFY OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord)
      return res.status(400).json({ success: false, message: "No OTP found" });

    // Check expiry (5 min)
    const now = Date.now();
    if (now - otpRecord.createdAt > 5 * 60 * 1000)
      return res.status(400).json({ success: false, message: "OTP expired" });

    // Compare
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    await OTP.deleteOne({ email }); // clean up after success

    res.json({ success: true, message: "OTP verified successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error verifying OTP" });
  }
};
