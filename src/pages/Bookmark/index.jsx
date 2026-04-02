import React, { useState } from "react";
import { bookmarkedStocks } from "../../data/appData";
import { useTheme } from "../../context/ThemeContext";

function BookmarkPage() {
  const [search, setSearch] = useState("");
  const { isDark } = useTheme();

  const filteredStocks = bookmarkedStocks.filter(
    s => s.name.toLowerCase().includes(search.toLowerCase()) ||
         s.ticker.toLowerCase().includes(search.toLowerCase())
  );

  // Placeholder data - replace with real API calls later
  const marketSentiment = [
    { id: 1, stock: "AAPL", sentiment: "Bullish", score: 82, change: "+2.3%", volume: "High" },
    { id: 2, stock: "NVDA", sentiment: "Bullish", score: 91, change: "+4.1%", volume: "Very High" },
    { id: 3, stock: "TSLA", sentiment: "Bearish", score: 38, change: "-1.8%", volume: "High" },
    { id: 4, stock: "MSFT", sentiment: "Bullish", score: 74, change: "+1.2%", volume: "Medium" },
  ];

  const priceAlerts = [
    { id: 1, stock: "AAPL", type: "Above", target: "$195", current: "$182", status: "Pending" },
    { id: 2, stock: "NVDA", type: "Below", target: "$700", current: "$720", status: "Pending" },
    { id: 3, stock: "TSLA", type: "Above", target: "$260", current: "$245", status: "Triggered" },
    { id: 4, stock: "MSFT", type: "Above", target: "$320", current: "$310", status: "Pending" },
  ];

  return (
    <div className="min-h-screen p-8 transition-colors duration-300 bg-gray-50 dark:bg-gray-900" style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      <div className="flex justify-between mb-10 items-center">
        <div>
          <h1 className="font-black text-blue-600 text-3xl tracking-tight">Bookmarks</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Your saved stocks, sentiment & price alerts</p>
        </div>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search bookmarks..."
            className="border px-4 py-2.5 pl-10 w-72 text-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-colors duration-300"
          />
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">

        {/* Stock Bookmarks */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors duration-300 overflow-y-auto hide-scrollbar">
          <div className="flex items-center gap-2 mb-5 overflow-y-auto hide-scrollbar">
            <div className="w-1 h-5 rounded-full bg-blue-600"></div>
            <h2 className="text-blue-600 font-extrabold text-base">Bookmarked Stocks</h2>
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto  hide-scrollbar">
            {filteredStocks.map((stock) => (
              <div
                key={stock.id}
                className="flex justify-between items-center px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition cursor-pointer group"
              >
                <div>
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 group-hover:text-blue-600 transition">{stock.name}</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs">{stock.ticker}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{stock.price}</p>
                  <p className={`text-xs font-bold ${stock.change.includes("+") ? "text-green-500" : "text-red-500"}`}>
                    {stock.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Sentiment */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors duration-300">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 rounded-full bg-blue-600"></div>
            <h2 className="text-blue-600 font-extrabold ">Market Sentiment</h2>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto hide-scrollbar">
            {marketSentiment.map((item) => (
              <div
                key={item.id}
                className="px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-gray-800 dark:text-gray-100">{item.stock}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      item.sentiment === "Bullish"
                        ? "bg-green-50 dark:bg-green-900/30 text-green-600"
                        : "bg-red-50 dark:bg-red-900/30 text-red-500"
                    }`}>
                      {item.sentiment}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${item.change.includes("+") ? "text-green-500" : "text-red-500"}`}>
                    {item.change}
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${item.sentiment === "Bullish" ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">Score: {item.score}/100</span>
                  <span className="text-xs text-gray-400">Vol: {item.volume}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors duration-300">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 rounded-full bg-blue-600"></div>
            <h2 className="text-blue-600 font-extrabold text-base">Price Alerts</h2>
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {priceAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-gray-800 dark:text-gray-100">{alert.stock}</p>
                    <span className="text-xs text-gray-400">{alert.type} {alert.target}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Current: {alert.current}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  alert.status === "Triggered"
                    ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600"
                    : "bg-blue-50 dark:bg-blue-900/30 text-blue-500"
                }`}>
                  {alert.status}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition">
            + Add Alert
          </button>
        </div>

      </div>


      {/* Recently Bookmarked Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 rounded-full bg-blue-600"></div>
          <h2 className="text-blue-600 font-extrabold text-base">Recently Bookmarked</h2>
        </div>

        <div className="grid grid-cols-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 pb-2 border-b border-gray-100 dark:border-gray-700">
          <span>Company</span>
          <span>Ticker</span>
          <span>Price</span>
          <span>Change</span>
        </div>

        <div className="max-h-64 overflow-y-auto mt-1">
          {bookmarkedStocks.map((stock) => (
            <div
              key={stock.id}
              className="grid grid-cols-4 items-center px-3 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition cursor-pointer group"
            >
              <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 group-hover:text-blue-600 transition">{stock.name}</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">{stock.ticker}</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{stock.price}</p>
              <span className={`text-xs font-bold px-2 py-1 rounded-full w-fit ${
                stock.change.includes("+")
                  ? "bg-green-50 dark:bg-green-900/30 text-green-600"
                  : "bg-red-50 dark:bg-red-900/30 text-red-500"
              }`}>
                {stock.change}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default BookmarkPage;