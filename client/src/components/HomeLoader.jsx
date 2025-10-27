// src/components/HomeLoader.jsx
import { motion } from "framer-motion";
import { Film, Gamepad2, Book, Tv, Star } from "lucide-react";

export default function HomeLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0d0d0f] z-[9999] overflow-hidden">
      {/* 💫 Glowing Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-fuchsia-900/10 to-transparent animate-pulse" />

      {/* 🎬 Animated Loader Content */}
      <motion.div
        className="relative flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Circular Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border-[2px] border-fuchsia-500/30 blur-md animate-spin-slow" />
        </div>

        {/* Central Icon Animation */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          className="relative flex items-center justify-center"
        >
          <Film size={48} className="text-fuchsia-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]" />
        </motion.div>

        {/* Orbiting Icons */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="absolute w-32 h-32 flex items-center justify-center"
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
            <Tv size={18} className="text-purple-400" />
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <Book size={18} className="text-pink-400" />
          </div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
            <Gamepad2 size={18} className="text-yellow-400" />
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <Star size={18} className="text-blue-400" />
          </div>
        </motion.div>
      </motion.div>

      {/* 🔤 Animated Text */}
      <motion.p
        className="mt-10 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500 tracking-wider drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        Loading MediaVerse...
      </motion.p>
    </div>
  );
}
