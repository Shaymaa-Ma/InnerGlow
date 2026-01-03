import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MoodChart = ({ entries, moods }) => {
  if (moods.length === 0) return <p className="text-white">Loading chart...</p>;

  const chartData = entries.slice().reverse().map((entry) => {
    const moodIndex = moods.findIndex((m) => m.label === entry.mood);
    return {
      datetime: entry.datetime,
      mood: moodIndex,
      emoji: moods[moodIndex]?.emoji,
      label: moods[moodIndex]?.label,
      
    };
  });

  return (
    <div className="card card-trend h-100 p-3">
      <h5 className="card-title">Mood Trends</h5>

      {chartData.length === 0 ? (
        <p className="text-white">No data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, bottom: 50 }}>
            <CartesianGrid stroke="#555" />
            <XAxis
              dataKey="datetime"
              tick={{ fill: "#fff", fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              tickFormatter={(dateValue) =>
                new Date(dateValue).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            />
            <YAxis
              domain={[0, moods.length - 1]}
              tick={{ fill: "#fff", fontSize: 12 }}
              tickFormatter={(idx) => moods[idx]?.label}
            />
            <Tooltip
              labelFormatter={(label) => `Logged at: ${label}`}
              formatter={(val) => `${moods[val]?.emoji} ${moods[val]?.label}`}
              contentStyle={{
                backgroundColor: "#333",
                color: "#fff",
                borderRadius: 8,
              }}
            />
            <Line type="monotone" dataKey="mood" stroke="#8a2be2" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MoodChart;
