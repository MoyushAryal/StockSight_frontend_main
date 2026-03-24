import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "../../../context/ThemeContext";

const data = [
  { name: "Jan", PV: 4000, cv: 2400 },
  { name: "Feb", PV: 3000, cv: 1398 },
  { name: "Mar", PV: 2000, cv: 9800 },
  { name: "Apr", PV: 2780, cv: 3908 },
  { name: "May", PV: 1890, cv: 4800 },
  { name: "Jun", PV: 2390, cv: 3800 },
];

const margin = { top: 20, right: 30, left: 20, bottom: 5 };

function CustomizeLegendAndTooltipStyle() {
  const { isDark } = useTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={margin}>
        <XAxis
          dataKey="name"
          stroke={isDark ? "#9CA3AF" : "#8884d8"}
          tick={{ fill: isDark ? "#9CA3AF" : "#6B7280" }}
        />
        <YAxis
          stroke={isDark ? "#9CA3AF" : "#8884d8"}
          tick={{ fill: isDark ? "#9CA3AF" : "#6B7280" }}
        />
        <Tooltip
          wrapperStyle={{
            width: 120,
            backgroundColor: isDark ? '#374151' : '#1F2937',
            color: 'white',
            border: 'none',
            padding: '8px',
            borderRadius: '6px',
          }}
          contentStyle={{
            backgroundColor: isDark ? '#374151' : '#1F2937',
            border: 'none',
            color: 'white',
          }}
        />
        <Bar dataKey="PV" fill="#2563EB" barSize={30} />
        <Bar dataKey="cv" fill="#82ca9d" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CustomizeLegendAndTooltipStyle;