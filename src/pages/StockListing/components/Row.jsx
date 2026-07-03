import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../context/NotificationContext";
import { getBookmarkTicker, getStockUrl, notifyBookmarkedStockHeadlines } from "../../../utils/bookmarkNews";

const API_BASE = "/api";

// Bookmark Button 
function BookmarkButton({ item, bookmarks, onBookmarksChange }) {
  const { addNotification } = useNotification();
  const token = localStorage.getItem("token");
  const pendingRef = React.useRef(false); // tracks in-flight request, not used to block clicks

  const existingBookmark = bookmarks.find(b => getBookmarkTicker(b) === item.ticker);
  const isBookmarked = Boolean(existingBookmark);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!token) { addNotification("You must be logged in to bookmark stocks.", "bookmark"); return; }

    // Always toggle optimistically, no loading gate
    if (isBookmarked) {
      onBookmarksChange(prev => prev.filter(b => b.id !== existingBookmark.id));
      try {
        const response = await fetch(`${API_BASE}/bookmarks/${existingBookmark.id}/`, {
          method: "DELETE",
          headers: { "Authorization": `Token ${token}` },
        });
        if (!response.ok) throw new Error("Could not remove bookmark.");
        addNotification(`${item.name} (${item.ticker}) removed from bookmarks.`, "bookmark");
        window.dispatchEvent(new Event("bookmarkUpdated"));
      } catch (error) {
        onBookmarksChange(prev => [existingBookmark, ...prev]); // revert on failure
        addNotification(error.message, "bookmark");
      }
    } else {
      const temp = { id: `temp-${item.ticker}`, ticker: item.ticker, _temp: true };
      onBookmarksChange(prev => [temp, ...prev]);
      try {
        const response = await fetch(`${API_BASE}/bookmarks/`, {
          method: "POST",
          headers: { "Authorization": `Token ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            title: item.name,
            url: getStockUrl(item.ticker),
            description: `${item.ticker} | ${item.close} | ${item.change} | ${item.sector}`,
          }),
        });
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.url?.[0] || error.detail || "Could not add bookmark.");
        }
        const newBookmark = await response.json();
        onBookmarksChange(prev => [newBookmark, ...prev.filter(b => b.id !== `temp-${item.ticker}`)]);
        addNotification(`${item.name} (${item.ticker}) bookmarked!`, "bookmark");
        notifyBookmarkedStockHeadlines({
          articles: JSON.parse(localStorage.getItem("newsCache") || "[]"),
          bookmarks: [newBookmark],
          addNotification,
        });
        window.dispatchEvent(new Event("bookmarkUpdated"));
      } catch (error) {
        onBookmarksChange(prev => prev.filter(b => b.id !== `temp-${item.ticker}`)); // revert on failure
        addNotification(error.message, "bookmark");
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-3 py-1 rounded-lg text-xs font-semibold transition
    ${isBookmarked
          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
          : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
    >
      {isBookmarked ? "Saved" : "Save"}
    </button>
  );
}

// Row 
function Row({ item, selectedId, onSelect, bookmarks, onBookmarksChange }) {
  const navigate = useNavigate();

  // change is a plain number from the backend (e.g. 2.34 or -1.05)
  const changeValue = Number(item.change) || 0;
  const isPositive = changeValue >= 0;
  const changeLabel = `${isPositive ? "+" : ""}${changeValue.toFixed(2)}%`;

  return (
    <div
      onClick={() => onSelect(selectedId === item.id ? null : item)}
      className="grid grid-cols-[1fr_90px_90px_90px_100px_100px_90px] gap-2 items-center
                 px-4 py-3 border-b border-gray-100 dark:border-gray-700
                 hover:bg-gray-50 dark:hover:bg-gray-700/60
                 transition-colors duration-150 cursor-pointer"
    >
      {/* Name */}
      <button
        onClick={(e) => { e.stopPropagation(); navigate(`/stocks/${item.ticker}`); }}
        className="text-left min-w-0"
      >
        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate transition">
          {item.name}
        </p>
        <p className="text-xs text-gray-400 truncate">{item.ticker}</p>
      </button>

      {/* Open */}
      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium tabular-nums">
        {item.open ?? "—"}
      </p>

      {/* High */}
      <p className="text-sm text-green-600 dark:text-green-400 font-medium tabular-nums">
        {item.high ?? "—"}
      </p>

      {/* Low */}
      <p className="text-sm text-red-500 dark:text-red-400 font-medium tabular-nums">
        {item.low ?? "—"}
      </p>

      {/* Close + change */}
      <div>
        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 tabular-nums">
          {item.close ?? "—"}
        </p>
        <p className={`text-xs font-semibold tabular-nums ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {changeLabel}
        </p>
      </div>

      {/* Volume */}
      <p className="text-sm text-gray-600 dark:text-gray-400 tabular-nums">
        {item.volume ?? "—"}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-end" onClick={e => e.stopPropagation()}>
        <BookmarkButton item={item} bookmarks={bookmarks} onBookmarksChange={onBookmarksChange} />
      </div>
    </div>
  );
}

export default Row;