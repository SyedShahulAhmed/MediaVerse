// src/components/Loader.jsx
export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      {/* Rotating Neon Rings */}
      <div className="relative w-16 h-16 mb-4">
        {/* Outer ring - Purple */}
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin border-[#a855f7]" />
      </div>
      {/* Gradient Text */}
      <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#ec4899] animate-pulse drop-shadow-[0_0_12px_rgba(155,92,246,0.6)]">
        Loading...
      </p>
    </div>
  );
}
