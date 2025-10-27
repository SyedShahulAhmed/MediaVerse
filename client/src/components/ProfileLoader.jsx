// src/components/ProfileLoader.jsx
import { motion } from "framer-motion";
import { User, Star, Film, Book, Gamepad2 } from "lucide-react";

export default function ProfileLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0d0d0f] text-white z-[9999] overflow-hidden">
      {/* 🌈 Background Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-fuchsia-900/10 to-transparent animate-pulse" />

      {/* 🧑‍💻 Profile Avatar Loader */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative flex flex-col items-center justify-center"
      >
        {/* Circular Glow Outline */}
        <div className="absolute -z-10 w-48 h-48 rounded-full border-[3px] border-fuchsia-500/30 blur-md animate-spin-slow" />

        {/* Central Avatar Placeholder */}
        <div className="w-24 h-24 rounded-full border-[2px] border-purple-600/40 bg-gradient-to-br from-[#1a1a1f] to-[#111115] flex items-center justify-center shadow-[0_0_25px_rgba(155,92,246,0.3)]">
          <User size={40} className="text-fuchsia-400 animate-pulse" />
        </div>

        {/* Name shimmer placeholder */}
        <motion.div
          className="mt-4 h-4 w-40 bg-gradient-to-r from-purple-600/20 via-fuchsia-500/20 to-purple-600/20 rounded-md animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        ></motion.div>

        {/* Secondary shimmer */}
        <motion.div
          className="mt-2 h-3 w-28 bg-gradient-to-r from-purple-700/20 via-fuchsia-500/20 to-purple-700/20 rounded-md animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        ></motion.div>
      </motion.div>

      {/* ⚡ Animated Orbiting Icons */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        className="absolute w-56 h-56 mt-2 flex items-center justify-center"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          <Film size={18} className="text-purple-400" />
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <Book size={18} className="text-pink-400" />
        </div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
          <Gamepad2 size={18} className="text-green-400" />
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <Star size={18} className="text-yellow-400" />
        </div>
      </motion.div>

      {/* 💬 Loading Text */}
      <motion.p
        className="mt-12 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500 tracking-wide drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        Loading your profile...
      </motion.p>
    </div>
  );
}
