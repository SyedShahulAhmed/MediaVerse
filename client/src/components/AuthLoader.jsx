// src/components/AuthLoader.jsx
import { motion } from "framer-motion";

export default function AuthLoader({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl z-[9999]">
      {/* Rotating glowing ring */}
      <div className="relative w-20 h-20 mb-4">
        <motion.div
          className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        />
        <div className="absolute inset-[5px] rounded-full bg-gradient-to-br from-purple-600/20 to-fuchsia-600/10 blur-md" />
      </div>

      {/* Text animation */}
      <motion.p
        className="text-purple-300 text-lg font-medium tracking-wide"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        {message}
      </motion.p>
    </div>
  );
}
