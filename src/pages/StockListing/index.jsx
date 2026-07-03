import React, { useEffect, useMemo, useState } from "react";
import Topsection from "./components/topsection";
import FilterSection from "./components/filtercontent";
import Mainframe from "./components/Mainframework";
import { useSearchParams } from "react-router-dom";

const API_BASE = "/api";

function StockListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") || "");
  const [sector, setSector] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stock data from Django backend once on mount
  // index.jsx
useEffect(() => {
  const fetchStocks = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/stocks/`, {
        headers: token ? { "Authorization": `Token ${token}` } : {},
      });
      if (!response.ok) throw new Error("Could not load stock data.");
      const data = await response.json();
      setStocks(data);
    } catch (err) {
      console.error("Stock fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchStocks();
}, []);

  const sectors = useMemo(() => {
    return [...new Set(stocks.map((stock) => stock.sector).filter(Boolean))].sort();
  }, [stocks]);

  useEffect(() => {
    setSearch(searchParams.get("q") || "");
  }, [searchParams]);

  const filteredStocks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return stocks
      .filter((stock) => {
        const matchesSearch =
          !query ||
          stock.name.toLowerCase().includes(query) ||
          stock.ticker.toLowerCase().includes(query) ||
          (stock.sector || "").toLowerCase().includes(query) ||
          (stock.exchange || "").toLowerCase().includes(query);

        const matchesSector = sector === "all" || stock.sector === sector;

        return matchesSearch && matchesSector;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "price-high") return Number(b.close) - Number(a.close);
        if (sortBy === "price-low") return Number(a.close) - Number(b.close);
        if (sortBy === "change-high") return Number(b.change) - Number(a.change);
        return 0;
      });
  }, [search, sector, sortBy, stocks]);

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
      <FilterSection count={filteredStocks.length} total={stocks.length} />

      <div className="flex-1 py-6 h-[900px] overflow-y-scroll no-scrollbar">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
            Loading stocks…
          </div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-red-500">{error}</div>
        ) : (
          <Mainframe stocks={filteredStocks} />
        )}
      </div>
    </div>
  );
}

export default StockListing;