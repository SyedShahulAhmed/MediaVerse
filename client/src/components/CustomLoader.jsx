// src/components/CustomLoader.jsx
import { Film } from "lucide-react";

export default function CustomLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#0b0b0f] to-[#0d0d12] z-[9999] animate-fadeIn">
      <div className="relative">
        {/* 🌌 Glowing aura behind loader */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>

        {/* 💫 Animated glow ring */}
        <div className="absolute inset-0 border-4 border-purple-500/40 rounded-full animate-spin-slow opacity-60 blur-[1px]"></div>

        {/* 🎬 Film Icon Core */}
        <div className="relative flex items-center justify-center w-28 h-28 rounded-full border-[3px] border-purple-600/60 bg-[#141218] shadow-[0_0_35px_rgba(155,92,246,0.5)] animate-pulse">
          <Film
            size={42}
            className="text-fuchsia-400 animate-spin-slow drop-shadow-[0_0_12px_rgba(236,72,153,0.6)]"
          />

          {/* 🌟 Small sparkle particles */}
          <div className="absolute w-2 h-2 bg-pink-400 rounded-full animate-sparkle top-2 left-6 shadow-[0_0_10px_rgba(236,72,153,0.6)]"></div>
          <div className="absolute w-2 h-2 bg-purple-400 rounded-full animate-sparkle-delayed bottom-2 right-6 shadow-[0_0_10px_rgba(147,51,234,0.6)]"></div>
        </div>
      </div>

      {/* 🌠 Loading Text */}
      <p className="mt-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500 text-xl font-semibold tracking-wider drop-shadow-[0_0_12px_rgba(236,72,153,0.4)] animate-float">
        Loading your universe...
      </p>
    </div>
  );
}
