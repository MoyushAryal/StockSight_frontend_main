import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "../../../context/ThemeContext";
import { stocksData } from "../../../data/appData";

const parseChange = (change) => Number.parseFloat(String(change).replace("%", "")) || 0;

function buildSectorData() {
  const sectors = stocksData.reduce((acc, stock) => {
    if (!acc[stock.sector]) {
      acc[stock.sector] = { sector: stock.sector, totalChange: 0, stockCount: 0, positiveCount: 0 };
    }

    const change = parseChange(stock.change);
    acc[stock.sector].totalChange += change;
    acc[stock.sector].stockCount += 1;
    if (change > 0) acc[stock.sector].positiveCount += 1;

    return acc;
  }, {});

  return Object.values(sectors)
    .map((sector) => ({
      sector: sector.sector,
      averageMove: Number((sector.totalChange / sector.stockCount).toFixed(2)),
      stockCount: sector.stockCount,
      positiveCount: sector.positiveCount,
    }))
    .sort((a, b) => b.averageMove - a.averageMove);
}

function CustomizeLegendAndTooltipStyle() {
  const { isDark } = useTheme();
  const data = useMemo(buildSectorData, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 12, right: 18, left: 0, bottom: 8 }} barGap={6}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#374151" : "#E5E7EB"} />
        <XAxis
          dataKey="sector"
          interval={0}
          angle={-18}
          textAnchor="end"
          height={60}
          stroke={isDark ? "#9CA3AF" : "#6B7280"}
          tick={{ fill: isDark ? "#D1D5DB" : "#4B5563", fontSize: 11 }}
        />
        <YAxis
          yAxisId="left"
          stroke={isDark ? "#9CA3AF" : "#6B7280"}
          tick={{ fill: isDark ? "#D1D5DB" : "#4B5563", fontSize: 11 }}
          tickFormatter={(value) => `${value}%`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke={isDark ? "#9CA3AF" : "#6B7280"}
          tick={{ fill: isDark ? "#D1D5DB" : "#4B5563", fontSize: 11 }}
        />
        <Tooltip
          cursor={{ fill: isDark ? "rgba(59,130,246,0.12)" : "rgba(37,99,235,0.08)" }}
          contentStyle={{
            backgroundColor: isDark ? "#111827" : "#FFFFFF",
            border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
            borderRadius: "8px",
            color: isDark ? "#F9FAFB" : "#111827",
            boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
          }}
          formatter={(value, name) => {
            if (name === "Average move") return [`${value}%`, name];
            return [value, name];
          }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: isDark ? "#D1D5DB" : "#4B5563" }} />
        <Bar yAxisId="left" dataKey="averageMove" name="Average move" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={42} />
        <Bar yAxisId="right" dataKey="stockCount" name="Stocks covered" fill="#F59E0B" radius={[6, 6, 0, 0]} maxBarSize={42} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CustomizeLegendAndTooltipStyle;
