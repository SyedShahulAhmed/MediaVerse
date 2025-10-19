// Analytics.jsx
import { useEffect, useState } from "react";
import API from "../api/axios.js";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLoader, setShowLoader] = useState(true);

  const COLORS = ["#a855f7", "#ec4899", "#22d3ee", "#facc15", "#34d399"];

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await API.get("/media/stats/overview");
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch data and keep loader visible for 3s minimum
    loadStats();
    const timer = setTimeout(() => setShowLoader(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 🌀 3-Second Violet Loader
  if (showLoader) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-4 border-transparent border-t-[#7c3aed] rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-[#8b5cf6] rounded-full animate-spin-slow"></div>
        </div>
        <p className="text-gray-400 text-sm tracking-wide animate-pulse">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-400">Loading stats...</p>
    );
  if (error)
    return <p className="text-center mt-10 text-red-400">{error}</p>;
  if (!stats)
    return (
      <p className="text-center mt-10 text-gray-400">
        No data available yet.
      </p>
    );

  // --- Helper to normalize month entries ---
  const parseMonthEntry = (entry) => {
    const raw = entry._id;
    let year, monthZeroBased;
    if (raw == null) {
      const d = new Date();
      year = d.getFullYear();
      monthZeroBased = d.getMonth();
    } else if (typeof raw === "number") {
      if (raw > 12) {
        const s = String(raw);
        year = parseInt(s.slice(0, 4), 10);
        monthZeroBased = parseInt(s.slice(4), 10) - 1;
      } else {
        year = new Date().getFullYear();
        monthZeroBased = Math.max(0, Math.min(11, raw - 1));
      }
    } else if (typeof raw === "string") {
      if (/^\d{4}-\d{2}$/.test(raw)) {
        const [y, m] = raw.split("-");
        year = parseInt(y, 10);
        monthZeroBased = parseInt(m, 10) - 1;
      } else if (/^\d{6}$/.test(raw)) {
        year = parseInt(raw.slice(0, 4), 10);
        monthZeroBased = parseInt(raw.slice(4), 10) - 1;
      } else {
        const n = parseInt(raw, 10);
        year = new Date().getFullYear();
        monthZeroBased = isNaN(n)
          ? new Date().getMonth()
          : Math.max(0, Math.min(11, n - 1));
      }
    } else if (typeof raw === "object") {
      monthZeroBased = raw.month ? raw.month - 1 : new Date().getMonth();
      year = raw.year || new Date().getFullYear();
    } else {
      const d = new Date();
      year = d.getFullYear();
      monthZeroBased = d.getMonth();
    }
    if (monthZeroBased < 0) monthZeroBased = 0;
    if (monthZeroBased > 11) monthZeroBased = monthZeroBased % 12;
    return { year, month: monthZeroBased, count: entry.count || 0 };
  };

  const monthlyParsed = (stats.monthly || []).map(parseMonthEntry);
  monthlyParsed.sort((a, b) => a.year - b.year || a.month - b.month);

  const monthlyData = monthlyParsed.map((m) => ({
    month: new Date(m.year, m.month).toLocaleString("default", {
      month: "short",
      year: "numeric",
    }),
    count: m.count,
  }));

  const typeCount = stats.typeCount || [];
  const topGenres = stats.topGenres || [];

  return (
    <div className="px-8 pb-20 pt-10 text-white transition-opacity duration-500 ease-out">
      {/* 🔢 Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Entries", icon: "📘", value: stats.total || 0 },
          {
            title: "Average Rating",
            icon: "⭐",
            value: stats.avgRating ? stats.avgRating.toFixed(1) + "/10" : "0/10",
          },
          { title: "This Month", icon: "📅", value: stats.thisMonth || 0 },
          { title: "Genres Tracked", icon: "📈", value: stats.genreCount || 0 },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-[#1a1a1f] rounded-xl p-5 border border-gray-800
                       shadow-[0_0_15px_rgba(155,92,246,0.15)]
                       hover:shadow-[0_0_20px_rgba(155,92,246,0.25)]
                       transition"
          >
            <h3 className="text-gray-400 text-sm flex items-center justify-between">
              {card.title} <span>{card.icon}</span>
            </h3>
            <p className="text-4xl font-bold text-purple-400 mt-2">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* 📊 Analytics Charts */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* 🥧 Media by Type */}
        <div className="bg-[#1a1a1f] p-6 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(155,92,246,0.15)]">
          <h3 className="text-white text-base font-semibold mb-4">
            Media by Type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeCount}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={({ cx, cy, midAngle, outerRadius, percent, name, index }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 25;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  const color = COLORS[index % COLORS.length];
                  return (
                    <text
                      x={x}
                      y={y}
                      fill={color}
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      fontSize={13}
                      fontWeight={500}
                    >
                      {`${name} ${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {typeCount.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(18,16,24,0.95)",
                  border: "1px solid rgba(155,92,246,0.4)",
                  borderRadius: "10px",
                  boxShadow: "0 0 15px rgba(155,92,246,0.2)",
                  padding: "8px 12px",
                  color: "#fff",
                  fontSize: "13px",
                }}
                labelStyle={{ color: "#c084fc", fontWeight: 600 }}
                itemStyle={{ color: "#fff" }}
                cursor={{ fill: "rgba(155,92,246,0.05)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 📆 Activity (Last 6 Months) */}
        <div className="bg-[#1a1a1f] p-6 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(155,92,246,0.15)]">
          <h3 className="text-white text-base font-semibold mb-4">
            Activity (Last 6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{
                  background: "rgba(18,16,24,0.95)",
                  border: "1px solid rgba(155,92,246,0.4)",
                  borderRadius: "10px",
                  boxShadow: "0 0 15px rgba(155,92,246,0.2)",
                  padding: "8px 12px",
                  color: "#fff",
                }}
                labelStyle={{ color: "#c084fc", fontWeight: 600 }}
                itemStyle={{ color: "#fff" }}
                cursor={{ fill: "rgba(155,92,246,0.05)" }}
              />
              <Bar dataKey="count" fill="#9b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🎭 Top Genres */}
        <div className="bg-[#1a1a1f] p-6 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(155,92,246,0.15)]">
          <h3 className="text-white text-base font-semibold mb-4">
            Top 5 Genres
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              layout="vertical"
              data={topGenres.slice(0, 5)}
              margin={{ left: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#aaa" />
              <YAxis type="category" dataKey="_id" stroke="#aaa" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(18,16,24,0.95)",
                  border: "1px solid rgba(155,92,246,0.4)",
                  borderRadius: "10px",
                  boxShadow: "0 0 15px rgba(155,92,246,0.2)",
                  padding: "8px 12px",
                  color: "#fff",
                }}
                labelStyle={{ color: "#c084fc", fontWeight: 600 }}
                itemStyle={{ color: "#fff" }}
                cursor={{ fill: "rgba(155,92,246,0.05)" }}
              />
              <Bar dataKey="count" fill="#a855f7" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 📈 Status Distribution */}
        <div className="bg-[#1a1a1f] p-6 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(155,92,246,0.15)]">
          <h3 className="text-white text-base font-semibold mb-4">
            Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.statusCount || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="_id" stroke="#aaa" tick={{ fontSize: 12, fill: "#ccc" }} />
              <YAxis stroke="#aaa" />
              <Tooltip
                cursor={{ fill: "rgba(155,92,246,0.08)" }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const color = payload[0].fill || "#ec4899";
                    return (
                      <div
                        style={{
                          background: "rgba(17,16,24,0.95)",
                          border: `1px solid ${color}`,
                          borderRadius: "12px",
                          boxShadow: `0 0 15px ${color}55`,
                          color: "#fff",
                          padding: "10px 14px",
                          fontSize: "13px",
                          fontWeight: 500,
                          backdropFilter: "blur(6px)",
                        }}
                      >
                        <p style={{ color, fontWeight: 600 }}>{label}</p>
                        <p style={{ color: "#e5e5ff" }}>
                          Count:{" "}
                          <span style={{ color, fontWeight: 600 }}>
                            {payload[0].value}
                          </span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {(stats.statusCount || []).map((_, index) => (
                  <Cell
                    key={`status-bar-${index}`}
                    fill={
                      ["#ec4899", "#a855f7", "#facc15", "#34d399", "#22d3ee"][
                        index % 5
                      ]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
