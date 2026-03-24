import React, { useState } from "react";
import Row from "./Row";
import { stockListData } from "../../../data/appData";

function Mainframe() {
  const [selectedStock, setSelectedStock] = useState(null);

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg transition-colors duration-300">
      {stockListData.map((item) => (
        <Row
          key={item.id}
          item={item}
          selectedId={selectedStock?.id}
          onSelect={setSelectedStock}
        />
      ))}
    </div>
  );
}

export default Mainframe;