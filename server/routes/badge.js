// routes/badgeRoutes.js
import express from "express";
import { checkAndAwardBadges, getAllBadges } from "../controllers/badgeController.js";
import protect from "../middleware/authMiddleware.js";


const router = express.Router();
// 🏅 Get all badge definitions (public)
router.get("/", getAllBadges);
router.get("/check", protect, checkAndAwardBadges);

export default router;
