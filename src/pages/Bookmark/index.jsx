import React, { useState } from "react";
import { bookmarkedStocks, bookmarkedCompanies, bookmarkFeatures } from "../../data/appData";
import { useTheme } from "../../context/ThemeContext"; 

function BookmarkPage() {
  const [search, setSearch] = useState("");
  const { isDark } = useTheme(); 

  const filteredStocks = bookmarkedStocks.filter(
    s => s.name.toLowerCase().includes(search.toLowerCase()) ||
         s.ticker.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className=" min-h-screen p-8 transition-colors duration-300 bg-gray-50 dark:bg-gray-900 " style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      <div className="flex justify-between mb-10 items-center ">
        <div>
          <h1 className=" font-black text-blue-600 text-3xl  tracking-tight">Bookmarks</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Your saved stocks, companies & insights</p>
        </div>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search bookmarks..."
            className="border px-4 py-2.5 pl-10 w-72 text-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 rounded-xl  focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-colors duration-300"
          />
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors duration-300">
          <div className="flex items-center gap-2 mb-5">dgmlklsjtakfgjjs;togndsfg;kj
            <div className="w-1 h-5 rounded-full bg-blue-600"></div> 
            <h2 className="text-blue-600 font-extrabold text-base">Stock Bookmarks</h2>
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto">
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

        {/* Company Bookmarks */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors duration-300">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 rounded-full bg-blue-600"></div>
            <h2 className="text-blue-600 font-extrabold text-base">Company Bookmarks</h2>
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {bookmarkedCompanies.map((company) => (
              <div
                key={company.id}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition cursor-pointer group"
              >
                <div>
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 group-hover:text-blue-600 transition">{company.name}</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs">{company.sector}</p>
                </div>
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{ background: isDark ? "#3d3200" : "#FFF9C4", color: isDark ? "#FFE135" : "#B8860B" }}
                >
                  {company.sector.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div
          className="rounded-2xl shadow-sm p-5 text-white transition-colors duration-300"
          style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 rounded-full" style={{ background: "#FFE135" }}></div>
            <h2 className="font-extrabold text-base" style={{ color: "#FFE135" }}>Features</h2>
          </div>
          <div className="space-y-4">
            {bookmarkFeatures.map((f) => (
              <div key={f.id} className="flex gap-3 items-start">
                <span className="text-lg mt-0.5" style={{ color: "#FFE135" }}>{f.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-white">{f.title}</p>
                  <p className="text-blue-200 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-8 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 rounded-full bg-blue-600"></div>
          <h2 className="text-blue-600 font-extrabold text-base">Quick Actions</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm">
            + Add Stock
          </button>
          <button
            className="px-5 py-2 rounded-xl text-sm font-bold transition shadow-sm"
            style={{ background: "#FFE135", color: "#1d4ed8" }}
            onMouseOver={e => e.target.style.background = "#FFD700"}
            onMouseOut={e => e.target.style.background = "#FFE135"}
          >
            + Add Company
          </button>
          <button className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-600 transition">
            🔔 Set Alert
          </button>
          <button className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-600 transition">
            📊 View Insights
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