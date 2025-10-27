import express from "express";
import { getCommunityFeed } from "../controllers/communityController.js";
import protect from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/feed", protect , getCommunityFeed);

export default router;
