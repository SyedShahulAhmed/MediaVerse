import dotenv from "dotenv";
dotenv.config(); // Load environment variables first

import express from "express";
import connectDB from "./config/db.js";
import app from "./app.js";

// Environment setup
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

/* =========================================================
   🚀 START EXPRESS SERVER
========================================================= */
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Server running at http://localhost:${PORT}`);
  }
});
