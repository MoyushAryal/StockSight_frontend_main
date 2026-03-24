import React from "react";

function FilterSection() {
  return (
    <div className="flex w-full">
      <div className="flex items-center w-[500px]">
        <button className="px-4 py-2 font-bold text-2xl text-blue-600">
          Stocks
        </button>
      </div>

      <div className="flex items-center gap-10">
        <button className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Orders</button>
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
        <button className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Watchlist</button>
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
        <button className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Analytics</button>
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
        <button className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Settings</button>
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
        <button className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Market</button>
      </div>
    </div>
  );
}

export default FilterSection;