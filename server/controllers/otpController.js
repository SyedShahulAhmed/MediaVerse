import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import OTP from "../models/otpModel.js";
import dotenv from "dotenv";
dotenv.config();

// ✅ Use secure SMTP instead of "service: gmail"
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // must be App Password
  },
});

// ✅ Optional debug check (only for testing)
transporter.verify((error, success) => {
  if (error) console.error("❌ SMTP Error:", error);
  else console.log("✅ SMTP Server Ready to Send Emails");
});

// SEND OTP
export const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);

    await OTP.findOneAndUpdate(
      { email },
      { otp: hashedOTP, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: `"MediaVerse" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your MediaVerse OTP Verification Code",
      html: `
        <div style="font-family: 'Poppins', sans-serif; padding: 20px; background: #0b0b0f; color: #fff;">
          <h2 style="color: #a855f7;">🔐 Verify Your Email</h2>
          <p>Your OTP code is:</p>
          <h1 style="letter-spacing: 5px; color: #a855f7;">${otp}</h1>
          <p>This OTP is valid for <b>5 minutes</b>.</p>
          <br/>
          <small style="color: #aaa;">- Team MediaVerse</small>
        </div>
      `,
    });

    console.log(`✅ OTP sent to ${email}`);
    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (err) {
    console.error("❌ Error sending OTP:", err);
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

    if (Date.now() - otpRecord.createdAt > 5 * 60 * 1000)
      return res.status(400).json({ success: false, message: "OTP expired" });

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    await OTP.deleteOne({ email });
    res.json({ success: true, message: "OTP verified successfully!" });
  } catch (err) {
    console.error("❌ Error verifying OTP:", err);
    res.status(500).json({ success: false, message: "Error verifying OTP" });
  }
};
