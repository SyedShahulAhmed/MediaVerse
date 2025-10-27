import { UserX } from "lucide-react";

export default function ProfileNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0b0e] text-center text-gray-300 px-6 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.1),transparent_70%)] blur-2xl" />

      {/* Icon */}
      <UserX size={90} className="text-fuchsia-500 mb-6 animate-pulse relative z-10" />

      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#ec4899] mb-3 drop-shadow-[0_0_15px_rgba(236,72,153,0.4)] relative z-10">
        Profile Not Found
      </h1>

      {/* Subtitle */}
      <p className="text-gray-400 max-w-md mb-8 text-sm relative z-10 leading-relaxed">
        Looks like this user doesn’t exist in our universe.  
        Check the username and try again.
      </p>

      {/* Illustration */}
      <img
        src="/images/astronaut-3.svg"
        alt="Profile Not Found Illustration"
        onError={(e) => {
          e.target.src = "https://illustrations.popsy.co/violet/astronaut-3.svg";
        }}
        className="w-56 opacity-80 drop-shadow-[0_0_25px_rgba(236,72,153,0.3)] relative z-10"
      />
    </div>
  );
}
