import React from "react";

function Topsection({
  search,
  onSearchChange,
  sector,
  onSectorChange,
  sortBy,
  onSortChange,
  sectors,
}) {
  return (
    <div className="flex py-4">
      <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl transition-colors duration-300">
        <div className="flex items-center gap-3 flex-wrap">

          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none"></span>
            <input
              type="text"
              placeholder="Search by name, ticker or sector…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-200
                         dark:placeholder-gray-400 rounded-lg border border-gray-200
                         dark:border-gray-600 text-sm outline-none
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-colors duration-300"
            />
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-600 hidden sm:block" />

          {/* Sector filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:block">Sector</span>
            <select
              value={sector}
              onChange={(e) => onSectorChange(e.target.value)}
              className="py-2 px-3 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 text-sm
                         rounded-lg border border-gray-200 dark:border-gray-600
                         outline-none focus:ring-2 focus:ring-blue-500
                         transition-colors duration-300"
            >
              <option value="all">All sectors</option>
              {sectors.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-600 hidden sm:block" />

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:block">Sort</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="py-2 px-3 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 text-sm
                         rounded-lg border border-gray-200 dark:border-gray-600
                         outline-none focus:ring-2 focus:ring-blue-500
                         transition-colors duration-300"
            >
              <option value="default">Default order</option>
              <option value="name">Name A → Z</option>
              <option value="price-high">Price: High → Low</option>
              <option value="price-low">Price: Low → High</option>
              <option value="change-high">Gainers first</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Topsection;
