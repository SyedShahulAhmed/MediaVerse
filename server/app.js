import express from "express";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

/* =========================================================
   ☁️ CLOUDINARY CONFIGURATION
========================================================= */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* =========================================================
   🧩 IMPORT ROUTES
========================================================= */
import authRoutes from "./routes/auth.js";
import mediaRoutes from "./routes/media.js";
import userRoutes from "./routes/user.js";
import badgeRoutes from "./routes/badge.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
// import otpRoutes from "./routes/otpRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";

/* =========================================================
   🌐 MIDDLEWARE SETUP
========================================================= */

// CORS (must come before routes)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local frontend
      "https://mediaverse-seven.vercel.app", // Production frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// JSON parser
app.use(express.json());

/* =========================================================
   🩺 HEALTH CHECK
========================================================= */
app.get("/", (req, res) => {
  res.json({ ok: true, message: "MediaVerse Keeper API running" });
});

/* =========================================================
   🚏 ROUTES
========================================================= */
app.use("/api/admin", adminRoutes);
// app.use("/api/otp", otpRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/users", userRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/password", passwordRoutes);

/* =========================================================
   🧱 GLOBAL ERROR HANDLER
========================================================= */
app.use((err, req, res, next) => {
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
});

export default app;
