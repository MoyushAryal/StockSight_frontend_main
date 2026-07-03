import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const API_BASE = "/api";

function StockDetail() {
  const { ticker } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/stocks/${ticker}/detail/`, {
          headers: token ? { "Authorization": `Token ${token}` } : {},
        });
        if (!response.ok) throw new Error("Could not load stock detail.");
        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error("Stock detail fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [ticker]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading stock detail…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-sm text-red-500">{error || "No data found."}</p>
      </div>
    );
  }

  const { stats, history, news } = data;
  const change = (stats.currentPrice ?? 0) - (stats.previousClose ?? 0);
  const changePct = stats.previousClose ? (change / stats.previousClose) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <div className="px-6 py-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 mb-4 flex items-center gap-1 transition"
      >
        <span>←</span> Back
      </button>

      {/* Header card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-gray-900 p-6 mb-6 shadow-lg">
        <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">{stats.name}</h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white tracking-wide">
                {stats.ticker}
              </span>
            </div>
            <p className="text-sm text-blue-100">{stats.sector} · {stats.exchange}</p>
          </div>

          <div className="text-right">
            <p className="text-4xl font-extrabold text-white tabular-nums">
              {stats.currentPrice ?? "—"}
            </p>
            <p
              className={`text-sm font-bold mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg
                ${isPositive ? "bg-green-400/20 text-green-200" : "bg-red-400/20 text-red-200"}`}
            >
              {isPositive ? "▲" : "▼"} {Math.abs(change).toFixed(2)} ({isPositive ? "+" : ""}{changePct.toFixed(2)}%)
            </p>
            <p className="text-xs text-blue-100 mt-1">Prev close: {stats.previousClose ?? "—"}</p>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/5 blur-2xl" />
      </div>

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Past 30 Days
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  minTickGap={30}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke={isPositive ? "#16a34a" : "#dc2626"}
                  strokeWidth={2.5}
                  fill="url(#priceGradient)"
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Key stats grid */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Key Stats
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Stat label="Open" value={stats.open} />
              <Stat label="Day High" value={stats.dayHigh} accent="text-green-600 dark:text-green-400" />
              <Stat label="Day Low" value={stats.dayLow} accent="text-red-500 dark:text-red-400" />
              <Stat label="Volume" value={stats.volume?.toLocaleString()} />
              <Stat label="Market Cap" value={formatBig(stats.marketCap)} />
              <Stat label="P/E Ratio" value={stats.peRatio?.toFixed?.(2) ?? stats.peRatio} />
              <Stat label="52W High" value={stats.fiftyTwoWeekHigh} accent="text-green-600 dark:text-green-400" />
              <Stat label="52W Low" value={stats.fiftyTwoWeekLow} accent="text-red-500 dark:text-red-400" />
              <Stat
                label="Dividend Yield"
                value={stats.dividendYield ? `${(stats.dividendYield * 100).toFixed(2)}%` : "—"}
              />
              <Stat label="Beta" value={stats.beta} />
              <Stat label="EPS" value={stats.eps} />
            </div>
          </div>

          {/* About */}
          {stats.longBusinessSummary && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                About
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {stats.longBusinessSummary}
              </p>
              {stats.website && (
                <a
                  href={stats.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-xs font-semibold text-blue-600 hover:underline"
                >
                  Visit website →
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right: news sidebar */}
        <div className="lg:col-span-1 lg:sticky lg:top-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Related News
            </h2>
            {news.length === 0 ? (
              <p className="text-sm text-gray-400">No recent news found.</p>
            ) : (
              <div className="space-y-3">
                {news.slice(0, 6).map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700
                               hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-gray-700/40 transition-colors duration-150"
                  >
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-gray-100 dark:bg-gray-700"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg flex-shrink-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-300 text-lg">
                        📰
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 leading-snug line-clamp-3">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">{item.publisher}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="rounded-xl bg-gray-50 dark:bg-gray-700/40 p-3">
      <p className="text-[11px] text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`text-sm font-bold mt-0.5 tabular-nums ${accent || "text-gray-800 dark:text-gray-100"}`}>
        {value ?? "—"}
      </p>
    </div>
  );
}

function formatBig(num) {
  if (!num) return "—";
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  return num;
}

export default StockDetail;