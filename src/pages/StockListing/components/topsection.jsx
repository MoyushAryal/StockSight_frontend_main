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
    <div className="flex py-4 h-full">
      <div className="w-full bg-blue-50 dark:bg-gray-800 p-4 rounded-lg transition-colors duration-300">
        <div className="flex items-center">
          <div className="flex gap-4 w-full flex-wrap">
            <input
              type="text"
              placeholder="Search Stock..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="p-2 bg-white dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 outline-none flex-1 min-w-[500px] rounded-lg border border-transparent dark:border-gray-600 transition-colors duration-300"
            />
            <select
              value={sector}
              onChange={(e) => onSectorChange(e.target.value)}
              className="p-2 bg-white dark:bg-gray-700 dark:text-gray-200 rounded-lg border border-transparent dark:border-gray-600 transition-colors duration-300"
            >
              <option value="all">All sectors</option>
              {sectors.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="p-2 bg-white dark:bg-gray-700 dark:text-gray-200 rounded-lg border border-transparent dark:border-gray-600 transition-colors duration-300"
            >
              <option value="default">Default order</option>
              <option value="name">Name</option>
              <option value="price-high">Price high to low</option>
              <option value="price-low">Price low to high</option>
              <option value="change-high">Growth high to low</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topsection;
