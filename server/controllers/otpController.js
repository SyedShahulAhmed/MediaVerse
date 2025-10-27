import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import OTP from "../models/otpModel.js";
import dotenv from "dotenv";
dotenv.config();

// DEBUG ✅
console.log("📌 Loaded ENV:", {
  GMAIL_USER: process.env.GMAIL_USER ? "✅ OK" : "❌ MISSING",
  GMAIL_PASS: process.env.GMAIL_PASS ? "✅ OK" : "❌ MISSING",
});

// ✅ SMTP Transporter with Debug Logs
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  debug: true, // ✅ Print SMTP logs
  logger: true, // ✅ More logging
});

// ✅ Test SMTP Connection Logging
transporter.verify((err, success) => {
  if (err) console.error("❌ SMTP VERIFY ERROR:", err);
  else console.log("✅ SMTP SERVER READY:", success);
});

// ✅ SEND OTP (with Debug Logs)
export const sendOTP = async (req, res) => {
  const { email } = req.body;

  console.log("📩 Incoming OTP request!");
  console.log("📧 Email received:", email);

  if (!email) {
    console.log("❌ No email provided!");
    return res.status(400).json({ success: false, message: "Email required" });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("🔐 Generated OTP:", otp);

    const hashedOTP = await bcrypt.hash(otp, 10);
    console.log("✅ OTP hashed and stored");

    await OTP.findOneAndUpdate(
      { email },
      { otp: hashedOTP, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    console.log("📦 OTP saved in DB for:", email);

    const mailOptions = {
      from: `"MediaVerse" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "✅ MediaVerse OTP Code",
      html: `<h1>Your OTP is ${otp}</h1>`,
    };

    console.log("🚀 Sending email...");
    console.log("📨 Mail Options:", mailOptions);

    await transporter.sendMail(mailOptions);

    console.log("✅ OTP Email sent successfully →", email);
    return res.json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    console.error("🔥 ERROR SENDING OTP:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      response: error.response,
    });

    return res.status(500).json({
      success: false,
      message: "Error sending OTP",
      error: error.message,
    });
  }
};

// ✅ VERIFY OTP (Extra Debug)
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  console.log("🔍 Verifying OTP:", { email, otp });

  try {
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      console.log("❌ No OTP entry found!");
      return res.status(400).json({ success: false, message: "No OTP found" });
    }

    const expired = Date.now() - otpRecord.createdAt > 5 * 60 * 1000;
    if (expired) {
      console.log("⏳ OTP expired!");
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValid) {
      console.log("❌ OTP mismatch!");
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    await OTP.deleteOne({ email });
    console.log("✅ OTP verified and deleted!");

    return res.json({ success: true, message: "OTP verified successfully" });

  } catch (error) {
    console.error("🔥 VERIFY OTP ERROR:", error);
    return res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};
