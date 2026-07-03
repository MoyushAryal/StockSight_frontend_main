import React from "react";

function FilterSection({ count, total }) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-1">
      {/* Title row — separated from column headers so it doesn't offset them */}
      <div className="flex items-center gap-3 px-4 mb-2">
        <span className="font-bold text-2xl text-blue-600">Stocks</span>
        <span className="text-sm font-semibold text-gray-400">{count} of {total}</span>
      </div>

      {/* Column headers — must match Row's grid exactly */}
      <div className="grid grid-cols-[1fr_90px_90px_90px_100px_100px_90px] gap-2 px-4">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Name</span>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Open</span>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">High</span>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Low</span>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Close</span>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Volume</span>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide text-right">Actions</span>
      </div>
    </div>
  );
}

export default FilterSection;