import React from "react";
import CustomizeLegendAndTooltipStyle from "./graph";

function Graphanalysis() {
  return (
    <section className="h-[430px] w-full rounded-lg bg-white p-5 shadow-md transition-colors duration-300 dark:bg-gray-800">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-blue-600">Sector analysis</p>
          <h2 className="mt-1 text-xl font-black text-gray-900 dark:text-white">Performance by sector</h2>
        </div>
        <p className="max-w-xs text-right text-xs leading-5 text-gray-500 dark:text-gray-400">
          Average stock movement and coverage count from the StockSight listing universe.
        </p>
      </div>
      <div className="h-[340px]">
        <CustomizeLegendAndTooltipStyle />
      </div>
    </section>
  );
}

export default Graphanalysis;
