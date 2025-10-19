import { Link } from "react-router-dom";
import { Film, Book, Gamepad2, BarChart3, User } from "lucide-react";
import hero from "../assets/hero.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col items-center justify-center overflow-hidden">
      {/* 🌌 Hero Section */}
      <section className="relative w-full text-center py-20 px-6 flex flex-col items-center justify-center">
        <div className="absolute inset-0">
          <img
            src={hero}
            alt="Media Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d0d0f]/80 to-[#0d0d0f]" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500 mb-4 drop-shadow-[0_0_10px_rgba(155,92,246,0.7)]">
            🎬 MediaVerse Keeper
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-6">
            Your personal digital vault for movies, series, anime, books, and
            games — track, analyze, and showcase your media journey beautifully.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/signup"
              className="bg-gradient-to-r from-purple-600 to-fuchsia-500 px-6 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-all shadow-[0_0_15px_rgba(155,92,246,0.5)]"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border border-purple-500/60 px-6 py-3 rounded-lg text-lg font-semibold text-purple-400 hover:bg-purple-600/20 transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* 🚀 Features Section */}
      <section className="w-full max-w-6xl px-6 py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
        {[
          {
            icon: <Film size={36} className="text-purple-400" />,
            title: "All-In-One Media Tracker",
            desc: "Add and manage your favorite movies, anime, series, books, and games effortlessly.",
          },
          {
            icon: <BarChart3 size={36} className="text-fuchsia-400" />,
            title: "Smart Analytics",
            desc: "Get insights into your watching habits, favorite genres, and completion stats.",
          },
          {
            icon: <User size={36} className="text-blue-400" />,
            title: "Public Profiles",
            desc: "Showcase your collection and stats to friends with your personalized profile.",
          },
          {
            icon: <Book size={36} className="text-pink-400" />,
            title: "Detailed Notes",
            desc: "Write notes and personal reviews to remember what you loved most.",
          },
          {
            icon: <Gamepad2 size={36} className="text-yellow-400" />,
            title: "Multi-Platform",
            desc: "Track across multiple categories seamlessly — from Netflix shows to novels.",
          },
          {
            icon: <Film size={36} className="text-green-400" />,
            title: "Sleek & Intuitive UI",
            desc: "Enjoy a smooth, aesthetic dashboard with filters, search, and analytics.",
          },
        ].map(({ icon, title, desc }, i) => (
          <div
            key={i}
            className="bg-[#141418] p-6 rounded-2xl border border-gray-800 hover:border-purple-500/40 
                       shadow-[0_0_15px_rgba(155,92,246,0.1)] hover:shadow-[0_0_25px_rgba(155,92,246,0.25)] 
                       transition-all duration-300 flex flex-col items-center justify-center text-center"
          >
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-purple-300 mb-2">
              {title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* 💜 CTA Section */}
      <section className="text-center py-16 px-6 bg-gradient-to-r from-purple-800/10 to-fuchsia-800/10 w-full border-t border-purple-900/20">
        <h2 className="text-3xl font-semibold text-purple-400 mb-4">
          Start Your Media Journey Today 🚀
        </h2>
        <p className="text-gray-400 mb-8">
          Join thousands of users organizing and tracking their entertainment
          collections in one sleek platform.
        </p>
        <Link
          to="/signup"
          className="bg-gradient-to-r from-purple-600 to-fuchsia-500 px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-all shadow-[0_0_15px_rgba(155,92,246,0.4)]"
        >
          Sign Up for Free
        </Link>
      </section>
    </div>
  );
}
