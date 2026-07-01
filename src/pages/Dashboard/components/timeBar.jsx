import React, { useEffect, useMemo, useState } from "react";
import { FaBell, FaChartPie, FaLayerGroup, FaShieldAlt, FaSignal } from "react-icons/fa";
import { stocksData } from "../../../data/appData";
import { getBookmarkTicker } from "../../../utils/bookmarkNews";
import { isUserSubscribed } from "../../../utils/subscription";

const API_BASE = "/api";
const parseChange = (change) => Number.parseFloat(String(change).replace("%", "")) || 0;

function Timebar() {
  const [bookmarks, setBookmarks] = useState([]);
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
    const averageMove = source.reduce((sum, stock) => sum + parseChange(stock.change), 0) / source.length;
    const positiveCount = source.filter(stock => parseChange(stock.change) > 0).length;
    const coverage = Math.round((savedStocks.length / stocksData.length) * 100);

    return {
      savedTickers,
      source,
      topSector,
      volatileStocks,
      averageMove,
      positiveCount,
      coverage,
    };
  }, [bookmarks]);

  const subscribed = isUserSubscribed();

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

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-xs font-bold uppercase text-blue-600 dark:text-blue-300">Avg move</p>
            <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
              {dashboardInsights.averageMove > 0 ? "+" : ""}{dashboardInsights.averageMove.toFixed(2)}%
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
            <p className="text-xs font-bold uppercase text-amber-500">Portfolio intelligence</p>
            <h2 className="mt-2 text-xl font-black text-gray-900 dark:text-white">Readiness checks</h2>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-900/20">
            <FaShieldAlt />
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/60">
            <div className="flex items-center gap-3">
              <FaLayerGroup className="text-blue-600" />
              <div>
                <p className="text-sm font-black text-gray-900 dark:text-white">Sector concentration</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {dashboardInsights.topSector
                    ? `${dashboardInsights.topSector[0]} leads with ${dashboardInsights.topSector[1]} tracked stock${dashboardInsights.topSector[1] > 1 ? "s" : ""}.`
                    : "Save stocks to calculate concentration."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/60">
            <div className="flex items-center gap-3">
              <FaChartPie className="text-green-600" />
              <div>
                <p className="text-sm font-black text-gray-900 dark:text-white">Prediction readiness</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {subscribed
                    ? "Prediction access is active for deeper stock forecasting."
                    : "Pricing access is required before forecasts can be generated."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/60">
            <div className="flex items-center gap-3">
              <FaBell className="text-amber-500" />
              <div>
                <p className="text-sm font-black text-gray-900 dark:text-white">Alert quality</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {dashboardInsights.savedTickers.length > 0
                    ? `${dashboardInsights.savedTickers.length} ticker${dashboardInsights.savedTickers.length > 1 ? "s" : ""} can be matched against business news.`
                    : "Save stocks to personalize notification relevance."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Timebar;
