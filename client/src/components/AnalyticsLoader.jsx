// src/components/AnalyticsLoader.jsx
import { motion } from "framer-motion";

export default function AnalyticsLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0d0d12]/90 backdrop-blur-xl z-[9999]">
      <div className="relative w-28 h-28">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        />
        <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-purple-600/20 to-indigo-600/10 blur-md" />
      </div>

      <motion.p
        className="mt-6 text-lg font-medium text-white/90 tracking-wide"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        Analyzing your data...
      </motion.p>
    </div>
  );
}
