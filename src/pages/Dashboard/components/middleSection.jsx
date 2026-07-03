import React, { useEffect, useMemo, useState } from "react";
import { FaArrowDown, FaArrowUp, FaChartArea, FaFire } from "react-icons/fa";

const API_BASE = "/api";

const parseChange = (change) => {
  const num = Number.parseFloat(String(change).replace("%", ""));
  return Number.isNaN(num) ? 0 : num;
};

const formatChange = (num) => `${num > 0 ? "+" : ""}${num.toFixed(2)}%`;

const formatMoney = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return "--";
  return num >= 1000
    ? `$${num.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : `$${num.toFixed(2)}`;
};

// Lightweight inline sparkline/line chart so we don't need a charting
// dependency. Renders 30d close prices from StockDetailView's `history`.
function PriceChart({ history }) {
  const points = useMemo(() => {
    const closes = history.map((point) => point.close).filter((v) => v != null);
    if (closes.length < 2) return null;

    const width = 640;
    const height = 220;
    const padding = 12;
    const min = Math.min(...closes);
    const max = Math.max(...closes);
    const range = max - min || 1;

    const coords = closes.map((value, index) => {
      const x = padding + (index / (closes.length - 1)) * (width - padding * 2);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return [x, y];
    });

    const linePath = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
    const areaPath = `${linePath} L${coords[coords.length - 1][0]},${height - padding} L${coords[0][0]},${height - padding} Z`;
    const trendUp = closes[closes.length - 1] >= closes[0];

    return { width, height, linePath, areaPath, trendUp };
  }, [history]);

  if (!points) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm font-semibold text-gray-400">
        Not enough history to chart.
      </div>
    );
  }

  const stroke = points.trendUp ? "#16a34a" : "#ef4444";
  const fill = points.trendUp ? "rgba(22,163,74,0.12)" : "rgba(239,68,68,0.12)";

  return (
    <svg viewBox={`0 0 ${points.width} ${points.height}`} className="w-full" preserveAspectRatio="none">
      <path d={points.areaPath} fill={fill} stroke="none" />
      <path d={points.linePath} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function Middlesection() {
  const token = localStorage.getItem("token");

  const [movers, setMovers] = useState([]);
  const [moversLoading, setMoversLoading] = useState(true);
  const [moversError, setMoversError] = useState(null);

  const [featuredTicker, setFeaturedTicker] = useState(null);
  const [featuredData, setFeaturedData] = useState(null);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredError, setFeaturedError] = useState(null);

  // Load the movers list
  useEffect(() => {
    let cancelled = false;

    const fetchMovers = async () => {
      setMoversLoading(true);
      setMoversError(null);
      try {
        const response = await fetch(`${API_BASE}/stocks/`, {
          headers: token ? { Authorization: `Token ${token}` } : undefined,
        });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const raw = await response.json();
        const list = Array.isArray(raw) ? raw : raw.results || [];
        const sorted = [...list].sort(
          (a, b) => Math.abs(parseChange(b.change)) - Math.abs(parseChange(a.change))
        );
        if (!cancelled) {
          setMovers(sorted);
          if (sorted.length > 0) setFeaturedTicker((current) => current || sorted[0].ticker);
        }
      } catch (error) {
        console.error("Movers fetch error:", error);
        if (!cancelled) setMoversError("Unable to load market movers.");
      } finally {
        if (!cancelled) setMoversLoading(false);
      }
    };

    fetchMovers();
    const interval = setInterval(fetchMovers, 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token]);

  // Load detail for the featured ticker whenever it changes
  useEffect(() => {
    if (!featuredTicker) return;
    let cancelled = false;

    const fetchDetail = async () => {
      setFeaturedLoading(true);
      setFeaturedError(null);
      try {
        const response = await fetch(`${API_BASE}/stocks/${featuredTicker}/detail/`, {
          headers: token ? { Authorization: `Token ${token}` } : undefined,
        });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const data = await response.json();
        if (!cancelled) setFeaturedData(data);
      } catch (error) {
        console.error("Stock detail fetch error:", error);
        if (!cancelled) setFeaturedError("Unable to load chart for this ticker.");
      } finally {
        if (!cancelled) setFeaturedLoading(false);
      }
    };

    fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [featuredTicker, token]);

  const gainers = useMemo(
    () => movers.filter((s) => parseChange(s.change) > 0).sort((a, b) => parseChange(b.change) - parseChange(a.change)).slice(0, 5),
    [movers]
  );
  const losers = useMemo(
    () => movers.filter((s) => parseChange(s.change) < 0).sort((a, b) => parseChange(a.change) - parseChange(b.change)).slice(0, 5),
    [movers]
  );

  const stats = featuredData?.stats;
  const history = featuredData?.history || [];
  const featuredChange = stats?.currentPrice != null && stats?.previousClose
    ? ((stats.currentPrice - stats.previousClose) / stats.previousClose) * 100
    : null;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.9fr)]">
      {/* Featured chart */}
      <section className="rounded-lg bg-white p-5 shadow-md transition-colors duration-300 dark:bg-gray-800">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-blue-600">Featured stock</p>
            <h2 className="mt-2 truncate text-2xl font-black text-gray-900 dark:text-white">
              {stats ? `${stats.name} (${stats.ticker})` : featuredTicker || "Select a stock"}
            </h2>
            {stats && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {stats.exchange} - {stats.sector || "Unclassified"}
              </p>
            )}
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20">
            <FaChartArea />
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          <p className="text-3xl font-black text-gray-900 dark:text-white">
            {stats ? formatMoney(stats.currentPrice) : "--"}
          </p>
          {featuredChange != null && (
            <span className={`mb-1 text-sm font-black ${featuredChange >= 0 ? "text-green-600" : "text-red-500"}`}>
              {formatChange(featuredChange)} today
            </span>
          )}
        </div>

        <div className="mt-4">
          {featuredLoading && (
            <div className="flex h-[220px] items-center justify-center text-sm font-semibold text-gray-400">
              Loading chart...
            </div>
          )}
          {!featuredLoading && featuredError && (
            <div className="flex h-[220px] items-center justify-center text-sm font-semibold text-red-500">
              {featuredError}
            </div>
          )}
          {!featuredLoading && !featuredError && history.length > 0 && <PriceChart history={history} />}
        </div>

        {stats && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900/60">
              <p className="text-xs font-bold uppercase text-gray-400">Day range</p>
              <p className="mt-1 text-sm font-black text-gray-900 dark:text-white">
                {formatMoney(stats.dayLow)} - {formatMoney(stats.dayHigh)}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900/60">
              <p className="text-xs font-bold uppercase text-gray-400">52w range</p>
              <p className="mt-1 text-sm font-black text-gray-900 dark:text-white">
                {formatMoney(stats.fiftyTwoWeekLow)} - {formatMoney(stats.fiftyTwoWeekHigh)}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900/60">
              <p className="text-xs font-bold uppercase text-gray-400">Market cap</p>
              <p className="mt-1 text-sm font-black text-gray-900 dark:text-white">{formatMoney(stats.marketCap)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900/60">
              <p className="text-xs font-bold uppercase text-gray-400">P/E ratio</p>
              <p className="mt-1 text-sm font-black text-gray-900 dark:text-white">
                {stats.peRatio ? stats.peRatio.toFixed(2) : "--"}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Movers list */}
      <section className="rounded-lg bg-white p-5 shadow-md transition-colors duration-300 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-blue-600">Live movers</p>
            <h2 className="mt-2 text-xl font-black text-gray-900 dark:text-white">Gainers & losers</h2>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-500 dark:bg-amber-900/20">
            <FaFire />
          </span>
        </div>

        {moversLoading && <p className="mt-5 text-sm font-semibold text-gray-400">Loading movers...</p>}
        {!moversLoading && moversError && (
          <p className="mt-5 rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 dark:bg-red-900/20 dark:text-red-300">
            {moversError}
          </p>
        )}

        {!moversLoading && !moversError && (
          <>
            <div className="mt-5">
              <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-green-600">
                <FaArrowUp /> Top gainers
              </p>
              <div className="space-y-2">
                {gainers.length === 0 && (
                  <p className="text-sm font-semibold text-gray-400">No gainers right now.</p>
                )}
                {gainers.map((stock) => (
                  <button
                    key={stock.id}
                    type="button"
                    onClick={() => setFeaturedTicker(stock.ticker)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors ${
                      stock.ticker === featuredTicker
                        ? "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                        : "border-gray-100 hover:border-blue-200 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-900 dark:hover:bg-blue-900/20"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-gray-900 dark:text-white">{stock.ticker}</p>
                      <p className="truncate text-xs font-semibold text-gray-400">{stock.name}</p>
                    </div>
                    <span className="text-sm font-black text-green-600">{formatChange(parseChange(stock.change))}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-red-500">
                <FaArrowDown /> Top losers
              </p>
              <div className="space-y-2">
                {losers.length === 0 && (
                  <p className="text-sm font-semibold text-gray-400">No losers right now.</p>
                )}
                {losers.map((stock) => (
                  <button
                    key={stock.id}
                    type="button"
                    onClick={() => setFeaturedTicker(stock.ticker)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors ${
                      stock.ticker === featuredTicker
                        ? "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                        : "border-gray-100 hover:border-blue-200 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-900 dark:hover:bg-blue-900/20"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-gray-900 dark:text-white">{stock.ticker}</p>
                      <p className="truncate text-xs font-semibold text-gray-400">{stock.name}</p>
                    </div>
                    <span className="text-sm font-black text-red-500">{formatChange(parseChange(stock.change))}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Middlesection;