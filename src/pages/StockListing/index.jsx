import React from "react";
import Topsection from "./components/topsection";
import FilterSection from "./components/filtercontent";
import Mainframe from "./components/Mainframework";

function StockListing() {
  return (
    <div className="px-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <Topsection />
      <FilterSection />
      <div className="flex-1 py-6 h-[900px] overflow-y-scroll no-scrollbar">
        <Mainframe />
      </div>
    </div>
  );
}

export default StockListing;