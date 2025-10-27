import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* =========================================================
   🔒 PROTECT — For all authenticated users
========================================================= */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and attach to req.user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Unauthorized access",
      error: process.env.NODE_ENV !== "production" ? err.message : undefined,
    });
  }
};

/* =========================================================
   🛡️ ADMIN-ONLY — Restrict access to admins
========================================================= */
const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Server error in admin middleware",
      error: process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
};

/* =========================================================
   ✅ EXPORTS
========================================================= */
export default protect;   // Default export for protect
export { adminOnly };     // Named export for adminOnly
