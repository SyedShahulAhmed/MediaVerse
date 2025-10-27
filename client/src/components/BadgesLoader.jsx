// src/components/BadgesLoader.jsx
import { motion } from "framer-motion";
import { Award, Star, Crown, Trophy, Medal } from "lucide-react";

export default function BadgesLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0d0d0f] text-white z-[9999] overflow-hidden">
      {/* 🌈 Subtle Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-fuchsia-900/10 to-transparent animate-pulse" />

      {/* 🏆 Center Trophy Glow */}
      <motion.div
        className="relative flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Halo Glow */}
        <div className="absolute -z-10 w-44 h-44 rounded-full border-[2px] border-fuchsia-500/30 blur-md animate-spin-slow"></div>

        {/* Main Trophy Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600/30 to-fuchsia-600/30 border border-fuchsia-500/40 shadow-[0_0_25px_rgba(236,72,153,0.4)]"
        >
          <Trophy
            size={42}
            className="text-fuchsia-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]"
          />
        </motion.div>

        {/* ✨ Sparkling Orbiting Icons */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute w-56 h-56 flex items-center justify-center"
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
            <Star size={18} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <Award size={18} className="text-purple-400 drop-shadow-[0_0_8px_rgba(147,51,234,0.6)]" />
          </div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
            <Medal size={18} className="text-fuchsia-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <Crown size={18} className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          </div>
        </motion.div>
      </motion.div>

      {/* 💬 Loading Text */}
      <motion.p
        className="mt-10 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500 tracking-wide drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Unlocking your achievements...
      </motion.p>

      {/* 🪄 Subtext shimmer */}
      <motion.p
        className="text-sm text-gray-400 mt-2 tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        Fetching earned badges and progress ✨
      </motion.p>
    </div>
  );
}
