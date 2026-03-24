import React from "react";

function Topsection() {
  return (
    <div className="flex py-4 h-full">
      <div className="w-full bg-blue-50 dark:bg-gray-800 p-4 rounded-lg transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search Stock..."
              className="p-2 bg-white dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 outline-none flex-1 min-w-[500px] rounded-lg border border-transparent dark:border-gray-600 transition-colors duration-300"
            />
            <select className="p-2 bg-white dark:bg-gray-700 dark:text-gray-200 rounded-lg border border-transparent dark:border-gray-600 transition-colors duration-300">
              <option>Filter by section</option>
              <option>Technology</option>
              <option>Finance</option>
              <option>Health</option>
            </select>
            <select className="p-2 bg-white dark:bg-gray-700 dark:text-gray-200 rounded-lg border border-transparent dark:border-gray-600 transition-colors duration-300">
              <option>Sort by</option>
              <option>Price</option>
              <option>Volume</option>
              <option>Growth</option>
            </select>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300">
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default Topsection;