import { useEffect, useState, useRef, useCallback } from "react";
import API from "../api/axios.js";
import toast from "react-hot-toast";

import {
  ChartCard,
  FullPieChart,
  VerticalBarChart,
  LineChartSimple,
  StatusRadarChart,
  MoodAreaChart,
  ComposedStatChart,
} from "../utils/ChartComponent.jsx";
import { handleExportPDFUsingSVG } from "../utils/handleExportPDFUsingSVG.jsx";
import AnalyticsLoader from "../components/AnalyticsLoader.jsx";

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const pdfRef = useRef(null);

  const groupBy = useCallback((arr, key) => {
    if (!Array.isArray(arr)) return [];
    return Object.entries(
      arr.reduce((acc, item) => {
        const value = item[key];
        if (value) acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, count]) => ({ _id: name, count }));
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [statsRes, mediaRes] = await Promise.all([
        API.get("/media/stats/overview"),
        API.get("/media"),
      ]);

      const data = statsRes.data || {};
      data.avgRating = Number(data.avgRating) || 0;

      setStats(data);
      setMedia(mediaRes.data || []);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExport = async () => {
    setExporting(true);
    toast.loading("Preparing your analytics report...", { id: "export" });

    try {
      // Ensure charts fully render
      await new Promise((r) => setTimeout(r, 800));

      await handleExportPDFUsingSVG(stats, {
        title: "MediaVerse Analytics",
        fileName: "MediaVerse_Analytics.pdf",
        chartTitles: [
          "Media by Type",
          "Top Genres",
          "Mood Distribution",
          "Average Rating by Type",
          "Status Spread",
          "Book Category Split",
          "Platform Popularity",
          "Top Languages",
        ],
      });

      toast.success("PDF exported successfully!", { id: "export" });
    } catch (err) {
      console.error("PDF export failed:", err);
      toast.error("Failed to export PDF.", { id: "export" });
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <AnalyticsLoader />;
  if (error)
    return <p className="text-center mt-10 text-red-400">{error}</p>;

  const typeCount = stats?.typeCount || [];
  const topGenres = stats?.topGenres || [];
  const moodCount = stats?.moodCount || [];
  const statusCount = stats?.statusCount || [];
  const avgRatingByType =
    stats?.avgRatingByType?.map((t) => ({
      _id: t._id,
      average: Number(t.average?.toFixed(2)) || 0,
    })) || [];

  const langData = groupBy(media, "language");
  const platformData = groupBy(media, "platform");
  const bookData = groupBy(
    media.filter((m) => m.type === "book"),
    "bookCategory"
  );

  return (
    <div
      ref={pdfRef}
      className="px-8 pb-24 pt-10 text-white bg-[#0b0b0d] min-h-screen relative"
    >
      {/* 🌀 Overlay Loader during export */}
      {exporting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b0b0dea] backdrop-blur-sm z-50">
          <div className="w-12 h-12 border-4 border-t-transparent border-[#9b5cf6] rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-gray-300">Exporting PDF...</p>
        </div>
      )}

      <h1 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-[#facc15] drop-shadow-[0_0_20px_rgba(155,92,246,0.5)]">
        📊 MediaVerse Analytics
      </h1>

      {/* === Summary Cards === */}
      <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-6 mb-12">
        {[
          { title: "Total Entries", icon: "🎬", value: stats.total || 0 },
          {
            title: "Average Rating",
            icon: "⭐",
            value:
              typeof stats.avgRating === "number"
                ? stats.avgRating.toFixed(1) + "/10"
                : "—",
          },
          { title: "This Month", icon: "📅", value: stats.thisMonth || 0 },
          { title: "Genres", icon: "🎭", value: stats.genreCount || 0 },
          { title: "Languages", icon: "🌐", value: stats.languageCount || 0 },
          { title: "Platforms", icon: "🎮", value: stats.platformCount || 0 },
        ].map((c, i) => (
          <div
            key={i}
            className="bg-[#141218]/90 border border-[#2d2d38]/60 rounded-2xl p-5 backdrop-blur-md shadow-[0_0_25px_rgba(155,92,246,0.15)] hover:shadow-[0_0_35px_rgba(155,92,246,0.25)] transition-all duration-300"
          >
            <div className="flex justify-between text-gray-400 text-sm mb-2">
              <span>{c.title}</span> <span>{c.icon}</span>
            </div>
            <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#ec4899]">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* === Charts === */}
      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-10 mb-10">
        <ChartCard title="Media by Type">
          <FullPieChart data={typeCount} />
        </ChartCard>
        <ChartCard title="Top Genres">
          <VerticalBarChart data={topGenres.slice(0, 6)} />
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-1 gap-10 mb-10">
        <ChartCard title="Mood Distribution">
          <LineChartSimple data={moodCount} />
        </ChartCard>
        <ChartCard title="Average Rating by Type">
          <ComposedStatChart data={avgRatingByType} />
        </ChartCard>
        <ChartCard title="Status Spread">
          <StatusRadarChart data={statusCount} />
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-1 gap-10 mb-16">
        <ChartCard title="Book Category Split">
          <FullPieChart data={bookData} />
        </ChartCard>
        <ChartCard title="Platform Popularity">
          <VerticalBarChart data={platformData} color="#22d3ee" />
        </ChartCard>
        <ChartCard title="Top Languages">
          <MoodAreaChart data={langData} />
        </ChartCard>
      </div>

      {/* === 📄 Export Section === */}
      <section
        className="mt-16 flex flex-col items-center text-center space-y-5 bg-[#0b0b0e] 
                   border border-[#1f1b2e] rounded-2xl p-10 mx-auto max-w-2xl
                   shadow-[0_0_25px_rgba(124,58,237,0.15)] hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]
                   transition-all duration-500"
      >
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-white tracking-wide">
          <span className="text-[#a78bfa]">📄</span> Export & Share Report
        </h2>

        <p className="text-gray-400 text-sm leading-relaxed max-w-md">
          Generate a clean, stylized PDF of your{" "}
          <span className="text-[#a78bfa]">MediaVerse analytics</span> and
          collection insights. Perfect for sharing progress, tracking goals, or
          archiving your journey.
        </p>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="mt-3 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#ec4899]
               text-white font-semibold tracking-wide shadow-[0_0_15px_rgba(155,92,246,0.4)]
               hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:scale-105
               transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {exporting ? "Generating..." : "Export PDF"}
        </button>

        <p className="text-xs text-gray-500 mt-2">
          *Your data stays private — PDF is generated securely in your browser.
        </p>
      </section>
    </div>
  );
}
