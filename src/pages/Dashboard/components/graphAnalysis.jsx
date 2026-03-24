import React from "react";
import CustomizeLegendAndTooltipStyle from "./graph";

function Graphanalysis() {
    return (
        <div className="bg-white dark:bg-gray-800 h-[400px] w-[700px] rounded-lg shadow-md p-4 transition-colors duration-300 hover-glow">
            <CustomizeLegendAndTooltipStyle />
        </div>
    );
}

export default Graphanalysis;