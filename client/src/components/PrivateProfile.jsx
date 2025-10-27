import { Lock } from "lucide-react";

export default function PrivateProfile() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0b0e] text-center text-gray-300 px-6 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1),transparent_70%)] blur-2xl" />

      {/* Icon */}
      <Lock size={90} className="text-purple-500 mb-6 animate-bounce relative z-10" />

      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#ec4899] mb-3 drop-shadow-[0_0_15px_rgba(155,92,246,0.4)] relative z-10">
        This Profile is Private
      </h1>

      {/* Subtitle */}
      <p className="text-gray-400 max-w-md mb-8 text-sm relative z-10 leading-relaxed">
        The user has chosen to keep their profile hidden.  
      </p>

      {/* Illustration */}
      <img
        src="/images/lock.svg"
        alt="Private Profile Illustration"
        onError={(e) => {
          e.target.src = "https://illustrations.popsy.co/violet/lock.svg";
        }}
        className="w-52 opacity-80 drop-shadow-[0_0_25px_rgba(155,92,246,0.3)] relative z-10"
      />
    </div>
  );
}
