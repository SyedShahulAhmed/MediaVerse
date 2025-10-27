// src/utils/chartComponents.js
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

export const COLORS = ["#a855f7", "#ec4899", "#22d3ee", "#facc15", "#34d399"];

/* 🧠 Custom Tooltip */
export const CustomTooltip = (props) => (
  <Tooltip
    {...props}
    contentStyle={{
      background: "rgba(18,16,24,0.95)",
      border: "1px solid rgba(155,92,246,0.4)",
      borderRadius: "10px",
      boxShadow: "0 0 15px rgba(155,92,246,0.25)",
      padding: "8px 12px",
      color: "#fff",
    }}
    labelStyle={{ color: "#c084fc", fontWeight: 600 }}
    itemStyle={{ color: "#fff" }}
    cursor={{ fill: "rgba(155,92,246,0.05)" }}
  />
);

/* 🪄 Chart Card Wrapper */
export const ChartCard = ({ title, children }) => (
  <div className="bg-gradient-to-br from-[#141218]/90 to-[#1b1b21]/80 border border-[#2d2d38]/60 rounded-2xl p-6 shadow-[0_0_25px_rgba(155,92,246,0.15)] hover:shadow-[0_0_35px_rgba(155,92,246,0.25)] backdrop-blur-lg transition-all duration-300 hover:-translate-y-[3px]">
    <h3 className="text-lg font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#ec4899] mb-4">
      {title}
    </h3>
    {children}
  </div>
);

/* 🟣 Pie Chart (No Donut) */
export const FullPieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        dataKey="count"
        nameKey="_id"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label={({ _id }) => _id}
        labelLine={false}
      >
        {data.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <CustomTooltip />
    </PieChart>
  </ResponsiveContainer>
);

/* 🟡 Vertical Bar Chart */
export const VerticalBarChart = ({
  data,
  dataKey = "count",
  color = "#9b5cf6",
}) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart layout="vertical" data={data} margin={{ left: 25 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
      <XAxis type="number" stroke="#bbb" />
      <YAxis type="category" dataKey="_id" stroke="#bbb" />
      <CustomTooltip />
      <Bar dataKey={dataKey} fill={color} radius={[0, 8, 8, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

/* 🟢 Line Chart (Mood or Trend) */
export const LineChartSimple = ({
  data,
  dataKey = "count",
  color = "#34d399",
}) => (
  <ResponsiveContainer width="100%" height={280}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
      <XAxis dataKey="_id" stroke="#bbb" />
      <YAxis stroke="#bbb" />
      <CustomTooltip />
      <Line
        type="monotone"
        dataKey={dataKey}
        stroke={color}
        strokeWidth={3}
        dot={{ r: 4, fill: color }}
      />
    </LineChart>
  </ResponsiveContainer>
);

/* 💠 Radar Chart */
export const StatusRadarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={280}>
    <RadarChart data={data}>
      <PolarGrid stroke="rgba(255,255,255,0.08)" />
      <PolarAngleAxis dataKey="_id" stroke="#bbb" />
      <Radar
        dataKey="count"
        stroke="#22d3ee"
        fill="#22d3ee"
        fillOpacity={0.5}
      />
      <CustomTooltip />
    </RadarChart>
  </ResponsiveContainer>
);

/* 🩷 Area Chart */
export const MoodAreaChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={280}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
      <XAxis dataKey="_id" stroke="#bbb" />
      <YAxis stroke="#bbb" />
      <CustomTooltip />
      <Area
        type="monotone"
        dataKey="count"
        stroke="#ec4899"
        fill="url(#gradient)"
        fillOpacity={1}
      />
    </AreaChart>
  </ResponsiveContainer>
);

export const ComposedStatChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // ✅ Take only the first (to prevent duplicates)
      const value = payload[0]?.value;

      return (
        <div
          style={{
            background: "rgba(18,16,24,0.95)",
            border: "1px solid rgba(155,92,246,0.4)",
            borderRadius: "10px",
            boxShadow: "0 0 15px rgba(155,92,246,0.25)",
            padding: "8px 12px",
            color: "#fff",
          }}
        >
          <p
            style={{
              color: "#c084fc",
              fontWeight: 600,
              marginBottom: 4,
              textTransform: "capitalize",
            }}
          >
            {label}
          </p>
          <p style={{ color: "#fff", margin: 0 }}>Average Rating: {value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis dataKey="_id" stroke="#bbb" />
        <YAxis stroke="#bbb" />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="average"
          barSize={20}
          fill="#facc15"
          radius={[4, 4, 0, 0]}
          name="Average Rating"
        />
        <Line
          type="monotone"
          dataKey="average"
          stroke="#22d3ee"
          strokeWidth={2}
          dot={{ r: 4, fill: "#22d3ee" }}
          name="Average Rating"
          isAnimationActive={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export const RatingJourneyChart = ({ data = [], color = "#facc15" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-gray-400 text-center mt-10 italic">
        No rating data yet 📉
      </div>
    );
  }

  // 🧠 Convert your "_id" (like 'Oct 8') into real Dates
  const parsedData = data
    .map((item) => {
      const [monthStr, day] = item._id.split(" ");
      const date = new Date(`${monthStr} ${day}, ${new Date().getFullYear()}`);
      return { ...item, date };
    })
    .filter((d) => !isNaN(d.date)); // remove invalid dates

  // 📆 Filter: Only last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const filteredData = parsedData.filter((d) => d.date >= sixMonthsAgo);

  // 🧮 Group by month & calculate average rating
  const groupedByMonth = filteredData.reduce((acc, item) => {
    const month = item.date.toLocaleString("en-US", { month: "short" });
    if (!acc[month]) acc[month] = { total: 0, count: 0 };
    acc[month].total += item.count;
    acc[month].count += 1;
    return acc;
  }, {});

  const monthlyAverages = Object.entries(groupedByMonth).map(
    ([month, { total, count }]) => ({
      month,
      rating: total / count,
    })
  );

  // Sort months in correct order
  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  monthlyAverages.sort(
    (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const rating = payload[0]?.value;
      return (
        <div
          style={{
            background: "rgba(18,16,24,0.95)",
            border: "1px solid rgba(155,92,246,0.4)",
            borderRadius: "10px",
            boxShadow: "0 0 20px rgba(155,92,246,0.25)",
            padding: "10px 14px",
            color: "#fff",
          }}
        >
          <p style={{ color: "#c084fc", fontWeight: 600, marginBottom: 4 }}>
            {label} {new Date().getFullYear()}
          </p>
          <p style={{ margin: 0, color, fontWeight: 500 }}>
            ⭐ Average Rating: {rating.toFixed(1)}/10
          </p>
          <p
            style={{
              marginTop: 4,
              color:
                rating >= 8 ? "#34d399" : rating >= 5 ? "#facc15" : "#ef4444",
              fontSize: 12,
            }}
          >
            {rating >= 8
              ? "🔥 Great month!"
              : rating >= 5
              ? "🙂 Decent month"
              : "😕 Low-rated month"}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={monthlyAverages}
        margin={{ top: 15, right: 15, left: 0, bottom: 10 }}
      >
        <defs>
          <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.9} />
            <stop offset="95%" stopColor="#6b21a8" stopOpacity={0.2} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="month"
          stroke="#bbb"
          tick={{ fontSize: 12, fill: "#bbb" }}
        />
        <YAxis
          domain={[0, 10]}
          stroke="#bbb"
          tick={{ fontSize: 12, fill: "#bbb" }}
          label={{
            value: "Average Rating",
            angle: -90,
            position: "insideLeft",
            fill: "#888",
            fontSize: 11,
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="rating"
          stroke={color}
          fill="url(#ratingGradient)"
          fillOpacity={1}
          strokeWidth={3}
          dot={{ r: 5, fill: color, stroke: "#22d3ee", strokeWidth: 1 }}
          activeDot={{
            r: 7,
            fill: color,
            stroke: "#22d3ee",
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
