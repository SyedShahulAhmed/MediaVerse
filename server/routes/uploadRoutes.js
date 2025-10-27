import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

/* =========================================================
   ☁️ CLOUDINARY CONFIGURATION
========================================================= */
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

/* =========================================================
   🖼️ UPLOAD THUMBNAIL TO CLOUDINARY
   @route   POST /api/upload/thumbnail
   @access  Public or Private (based on your frontend usage)
========================================================= */
router.post("/thumbnail", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder: "thumbnails",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            message: "Failed to upload image to Cloudinary",
            error: error.message,
          });
        }

        return res.json({ url: result.secure_url });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    res.status(500).json({
      message: "Server error during image upload",
      error: err.message,
    });
  }
});

export default router;
