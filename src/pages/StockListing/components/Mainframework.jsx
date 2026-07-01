import React, { useCallback, useEffect, useState } from "react";
import Row from "./Row";

const API_BASE = "/api";

function Mainframe({ stocks }) {
  const [selectedStock, setSelectedStock] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const token = localStorage.getItem("token");

  const fetchBookmarks = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/bookmarks/`, {
        headers: { "Authorization": `Token ${token}` },
      });

      if (!response.ok) {
        throw new Error("Could not load bookmarks.");
      }

      const data = await response.json();
      setBookmarks(data);
    } catch (error) {
      console.error("Bookmark load error:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg transition-colors duration-300">
      {stocks.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No stocks match your filters.</p>
          <p className="mt-1 text-xs text-gray-400">Try changing the search, sector, or sort option.</p>
        </div>
      ) : (
        stocks.map((item) => (
          <Row
            key={item.id}
            item={item}
            selectedId={selectedStock?.id}
            onSelect={setSelectedStock}
            bookmarks={bookmarks}
            onBookmarksChange={setBookmarks}
          />
        ))
      )}
    </div>
  );
}

export default Mainframe;
