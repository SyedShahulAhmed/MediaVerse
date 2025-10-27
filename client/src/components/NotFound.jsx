import { Telescope } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0b0e] text-center text-gray-300 px-6">
      {/* Icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-[#a855f7]/40 to-[#ec4899]/40 rounded-full w-32 h-32 animate-pulse" />
        <Telescope size={90} className="text-purple-400 relative z-10 animate-float" />
      </div>

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#ec4899] mb-4 drop-shadow-[0_0_20px_rgba(155,92,246,0.5)]">
        404 — Lost in Space
      </h1>

      {/* Subtitle */}
      <p className="text-gray-400 text-lg max-w-lg mb-10 leading-relaxed">
        Looks like the page you’re trying to reach drifted off into another galaxy.  
        Let’s help you find your way back to the MediaVerse.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#ec4899] 
        text-white font-medium shadow-[0_0_20px_rgba(155,92,246,0.4)]
        hover:scale-105 hover:shadow-[0_0_30px_rgba(155,92,246,0.6)]
        transition-all duration-300"
      >
        🚀 Return Home
      </Link>

      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(155,92,246,0.15),transparent_60%)]" />
    </div>
  );
}

/* 💫 Optional float animation (add this in your global.css or index.css)
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
*/
