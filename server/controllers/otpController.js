import { Resend } from "resend";
import bcrypt from "bcryptjs";
import OTP from "../models/otpModel.js";


// ✅ Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Debug environment
console.log("📌 Loaded ENV:", {
  RESEND_API_KEY: process.env.RESEND_API_KEY ? "✅ OK" : "❌ MISSING",
});

// ✅ SEND OTP
export const sendOTP = async (req, res) => {
  const { email } = req.body;
  console.log("📩 Incoming OTP request for:", email);

  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });

  try {
    // Generate and hash OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);

    await OTP.findOneAndUpdate(
      { email },
      { otp: hashedOTP, createdAt: Date.now() },
      { upsert: true, new: true }
    );
    console.log("✅ OTP generated and saved for:", email);

    // Send via Resend API
    const { data, error } = await resend.emails.send({
      from: "MediaVerse <onboarding@resend.dev>", // You can change this if domain verified
      to: email,
      subject: "✅ Your MediaVerse OTP Code",
      html: `
        <div style="font-family:Arial, sans-serif; padding:20px; border-radius:10px; background:#f9f9f9;">
          <h2 style="color:#6c63ff;">MediaVerse OTP Verification</h2>
          <p>Your one-time password is:</p>
          <h1 style="letter-spacing:3px; color:#222;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
          <p style="font-size:12px; color:#666;">If you didn’t request this, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Error sending email via Resend:", error);
      throw error;
    }

    console.log("✅ OTP Email sent successfully:", data?.id || "No ID");
    return res.json({ success: true, message: "OTP sent successfully" });

  } catch (err) {
    console.error("🔥 ERROR SENDING OTP:", err);
    return res.status(500).json({
      success: false,
      message: "Error sending OTP",
      error: err.message,
    });
  }
};

// ✅ VERIFY OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  console.log("🔍 Verifying OTP for:", email);

  try {
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord)
      return res
        .status(400)
        .json({ success: false, message: "No OTP found for this email" });

    const expired = Date.now() - otpRecord.createdAt > 5 * 60 * 1000;
    if (expired)
      return res
        .status(400)
        .json({ success: false, message: "OTP expired" });

    const isValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValid)
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });

    await OTP.deleteOne({ email });
    console.log("✅ OTP verified and removed");

    return res.json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    console.error("🔥 VERIFY OTP ERROR:", err);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};
