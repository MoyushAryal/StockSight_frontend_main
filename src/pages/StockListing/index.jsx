import React, { useEffect, useMemo, useState } from "react";
import Topsection from "./components/topsection";
import FilterSection from "./components/filtercontent";
import Mainframe from "./components/Mainframework";
import { stockListData } from "../../data/appData";
import { useSearchParams } from "react-router-dom";

function StockListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") || "");
  const [sector, setSector] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const sectors = useMemo(() => {
    return [...new Set(stockListData.map(stock => stock.sector).filter(Boolean))].sort();
  }, []);

  useEffect(() => {
    setSearch(searchParams.get("q") || "");
  }, [searchParams]);

  const filteredStocks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return stockListData
      .filter((stock) => {
        const matchesSearch = !query ||
          stock.name.toLowerCase().includes(query) ||
          stock.ticker.toLowerCase().includes(query) ||
          stock.sector.toLowerCase().includes(query) ||
          stock.exchange.toLowerCase().includes(query);

        const matchesSector = sector === "all" || stock.sector === sector;

        return matchesSearch && matchesSector;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "price-high") return Number(String(b.price).replace(/[^0-9.-]/g, "")) - Number(String(a.price).replace(/[^0-9.-]/g, ""));
        if (sortBy === "price-low") return Number(String(a.price).replace(/[^0-9.-]/g, "")) - Number(String(b.price).replace(/[^0-9.-]/g, ""));
        if (sortBy === "change-high") return Number(String(b.change).replace(/[^0-9.-]/g, "")) - Number(String(a.change).replace(/[^0-9.-]/g, ""));
        return 0;
      });
  }, [search, sector, sortBy]);

  const handleSearchChange = (value) => {
    setSearch(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      nextParams.set("q", value);
    } else {
      nextParams.delete("q");
    }
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="px-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <Topsection
        search={search}
        onSearchChange={handleSearchChange}
        sector={sector}
        onSectorChange={setSector}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sectors={sectors}
      />
      <FilterSection count={filteredStocks.length} total={stockListData.length} />
      <div className="flex-1 py-6 h-[900px] overflow-y-scroll no-scrollbar">
        <Mainframe stocks={filteredStocks} />
      </div>
    </div>
  );
}

export default StockListing;
