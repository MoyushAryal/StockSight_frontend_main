import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaChartLine, FaCrown, FaSignal } from "react-icons/fa";
import { getBookmarkTicker } from "../../../utils/bookmarkNews";
import { isUserSubscribed } from "../../../utils/subscription";

const API_BASE = "/api";

// API returns `change` as a plain number (e.g. 2.35 or -1.12), but this stays
// defensive in case it ever comes back as a string with a trailing "%".
const parseChange = (change) => {
  const num = Number.parseFloat(String(change).replace("%", ""));
  return Number.isNaN(num) ? 0 : num;
};

const formatChange = (change) => {
  const num = parseChange(change);
  return `${num > 0 ? "+" : ""}${num.toFixed(2)}%`;
};

const formatPrice = (close) => {
  const num = Number(close);
  return Number.isNaN(num) ? "--" : `$${num.toFixed(2)}`;
};

function Timebar() {
  const [bookmarks, setBookmarks] = useState([]);
  const [stocksData, setStocksData] = useState([]);
  const [stocksLoading, setStocksLoading] = useState(true);
  const [stocksError, setStocksError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchBookmarks = async () => {
      try {
        const response = await fetch(`${API_BASE}/bookmarks/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!response.ok) return;
        setBookmarks(await response.json());
      } catch (error) {
        console.error("Dashboard bookmark summary error:", error);
      }
    };

    fetchBookmarks();
    window.addEventListener("bookmarkUpdated", fetchBookmarks);
    return () => window.removeEventListener("bookmarkUpdated", fetchBookmarks);
  }, [token]);

  useEffect(() => {
    let cancelled = false;

    const fetchStocks = async () => {
      setStocksLoading(true);
      setStocksError(null);
      try {
        const response = await fetch(`${API_BASE}/stocks/`, {
          headers: token ? { Authorization: `Token ${token}` } : undefined,
        });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const raw = await response.json();
        const list = Array.isArray(raw) ? raw : raw.results || [];

        const normalized = list.map((stock) => ({
          id: stock.id,
          ticker: stock.ticker,
          name: stock.name,
          sector: stock.sector,
          exchange: stock.exchange,
          price: formatPrice(stock.close),
          change: formatChange(stock.change),
        }));

        if (!cancelled) setStocksData(normalized);
      } catch (error) {
        console.error("Stock list fetch error:", error);
        if (!cancelled) setStocksError("Unable to load live market data.");
      } finally {
        if (!cancelled) setStocksLoading(false);
      }
    };

    fetchStocks();
    const interval = setInterval(fetchStocks, 60 * 1000); // refresh every minute
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token]);

  const dashboardInsights = useMemo(() => {
    const savedTickers = bookmarks.map(bookmark => getBookmarkTicker(bookmark)).filter(Boolean);
    const savedStocks = stocksData.filter(stock => savedTickers.includes(stock.ticker));
    const source = savedStocks.length > 0 ? savedStocks : stocksData;
    const sectorCounts = source.reduce((acc, stock) => {
      acc[stock.sector] = (acc[stock.sector] || 0) + 1;
      return acc;
    }, {});
    const topSector = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1])[0];
    const volatileStocks = source
      .filter(stock => Math.abs(parseChange(stock.change)) >= 1)
      .sort((a, b) => Math.abs(parseChange(b.change)) - Math.abs(parseChange(a.change)));
    const averageMove = source.length
      ? source.reduce((sum, stock) => sum + parseChange(stock.change), 0) / source.length
      : 0;
    const positiveCount = source.filter(stock => parseChange(stock.change) > 0).length;
    const coverage = stocksData.length
      ? Math.round((savedStocks.length / stocksData.length) * 100)
      : 0;

    return {
      savedTickers,
      source,
      topSector,
      volatileStocks,
      averageMove,
      positiveCount,
      coverage,
    };
  }, [bookmarks, stocksData]);

  const subscribed = isUserSubscribed();
  const predictionCandidates = [...dashboardInsights.source]
    .filter((stock) => parseChange(stock.change) > 0)
    .sort((a, b) => parseChange(b.change) - parseChange(a.change))
    .slice(0, 3);
  const primaryCandidate = predictionCandidates[0];
  const primaryChange = primaryCandidate ? parseChange(primaryCandidate.change) : 0;
  const trendDirection = "Bullish";

  return (
    <div className="grid flex-1 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.95fr)] 2xl:min-w-0">
      <section className="rounded-lg bg-white p-5 shadow-md transition-colors duration-300 dark:bg-gray-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-blue-600">Market pulse</p>
            <h2 className="mt-2 text-2xl font-black text-gray-900 dark:text-white">StockSight universe</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              A compact read on direction, concentration, and active movers.
            </p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20">
            <FaSignal />
          </span>
        </div>

        {stocksError && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 dark:bg-red-900/20 dark:text-red-300">
            {stocksError}
          </p>
        )}

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-xs font-bold uppercase text-blue-600 dark:text-blue-300">Avg move</p>
            <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
              {stocksLoading ? "--" : `${dashboardInsights.averageMove > 0 ? "+" : ""}${dashboardInsights.averageMove.toFixed(2)}%`}
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-xs font-bold uppercase text-green-600 dark:text-green-300">Positive</p>
            <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{dashboardInsights.positiveCount}</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
            <p className="text-xs font-bold uppercase text-amber-600 dark:text-amber-300">Tracked</p>
            <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{bookmarks.length}</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-4 dark:bg-gray-700">
            <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-300">Coverage</p>
            <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{dashboardInsights.coverage}%</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {stocksLoading && (
            <p className="col-span-2 text-sm font-semibold text-gray-400">Loading live movers...</p>
          )}
          {!stocksLoading && dashboardInsights.volatileStocks.length === 0 && (
            <p className="col-span-2 text-sm font-semibold text-gray-400">No significant moves right now.</p>
          )}
          {dashboardInsights.volatileStocks.slice(0, 4).map((stock) => {
            const changeValue = parseChange(stock.change);
            return (
              <div
                key={stock.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 dark:border-gray-700"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-gray-900 dark:text-white">{stock.name}</p>
                  <p className="mt-1 text-xs font-semibold text-gray-400">{stock.ticker} - {stock.sector}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{stock.price}</p>
                  <p className={`mt-1 text-xs font-black ${changeValue >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {stock.change}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg bg-white p-5 shadow-md transition-colors duration-300 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-blue-600">Prediction center</p>
            <h2 className="mt-2 text-xl font-black text-gray-900 dark:text-white">Forecast queue</h2>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20">
            <FaChartLine />
          </span>
        </div>

        <div className="mt-5 rounded-lg bg-gray-50 p-4 dark:bg-gray-900/60">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-black text-gray-900 dark:text-white">
                {primaryCandidate ? `${primaryCandidate.ticker} is next to analyze` : "No forecast candidate yet"}
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                {primaryCandidate
                  ? `${primaryCandidate.name} has the strongest current move in your ${bookmarks.length > 0 ? "watchlist" : "market"} view.`
                  : "Save stocks or browse the stock list to build a prediction queue."}
              </p>
            </div>
            {primaryCandidate && (
              <div className="text-right">
                <p className={`text-lg font-black ${primaryChange >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {primaryCandidate.change}
                </p>
                <p className="text-[11px] font-bold uppercase text-gray-400">{trendDirection}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {predictionCandidates.map((stock) => {
            const changeValue = parseChange(stock.change);
            return (
              <button
                key={stock.id}
                type="button"
                onClick={() => navigate("/prediction-panel")}
                className="flex w-full items-center justify-between rounded-lg border border-gray-100 px-4 py-3 text-left transition-colors hover:border-blue-200 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-900 dark:hover:bg-blue-900/20"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-gray-900 dark:text-white">{stock.ticker}</p>
                  <p className="mt-1 truncate text-xs font-semibold text-gray-400">{stock.name} - {stock.sector}</p>
                </div>
                <span className={`text-sm font-black ${changeValue >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {stock.change}
                </span>
              </button>
            );
          })}

          {predictionCandidates.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Prediction candidates will appear here.</p>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-center gap-3">
              <FaCrown className={subscribed ? "text-green-600" : "text-amber-500"} />
              <div>
                <p className="text-sm font-black text-gray-900 dark:text-white">Prediction access</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {subscribed
                    ? "Forecast tools are active for deeper analysis."
                    : "Upgrade access before generating full forecasts."}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/prediction-panel")}
            className="flex w-full items-center justify-between rounded-lg bg-gray-950 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-blue-700 dark:bg-white dark:text-gray-950 dark:hover:bg-blue-100"
          >
            Open Prediction Panel
            <FaArrowRight />
          </button>
        </div>
      </section>
    </div>
  );
}

export default Timebar;