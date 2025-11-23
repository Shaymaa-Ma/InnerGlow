
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { moods } from "../data/moodData";

const MoodChart = ({ entries }) => {
  const chartArray = entries
    .slice()
    .reverse()
    .map(entry => ({
      datetime: entry.datetime,
      mood: moods.findIndex(m => m.label === entry.mood),
      emoji: moods.find(m => m.label === entry.mood).emoji
    }));

  return (
    <div className="card card-trend h-100 p-3">
      <h5 className="card-title">Mood Trends</h5>
      {chartArray.length === 0 ? (
        <p className="text-white">No data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartArray} margin={{ top: 20, bottom: 50, left: 10, right: 10 }}>
            <CartesianGrid stroke="#555" />
            <XAxis
              dataKey="datetime"
              tick={{ fill: "#fff", fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              tickFormatter={(val) => {
                const entryDate = new Date(val);
                return entryDate.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
              }}
            />
            <YAxis
              tickFormatter={(val) => moods[val].label.length > 8 ? moods[val].label.slice(0, 7) + "…" : moods[val].label}
              tick={{ fill: "#fff", fontSize: 12 }}
              domain={[0, moods.length - 1]}
            />
            <Tooltip
              formatter={(val) => `${moods[val].emoji} ${moods[val].label}`}
              labelFormatter={(label) => `Logged at: ${label}`}
              contentStyle={{ backgroundColor: "#333", color: "#fff", borderRadius: 8 }}
            />
            <Line type="monotone" dataKey="mood" stroke="#8a2be2" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MoodChart;
