// src/pages/StockListing/components/Row.jsx
import React, { useState } from "react";
import { stocksData } from "../../../data/appData";
import { useNotification } from "../../../context/NotificationContext";
import { getBookmarkTicker, getStockUrl, notifyBookmarkedStockHeadlines } from "../../../utils/bookmarkNews";

const API_BASE = "/api";

function StockPopup({ stock, onClose, onBookmark, isBookmarked, bookmarkLoading }) {
  const fullStock = stocksData.find(s => s.id === stock.id);
  if (!fullStock) return null;

  return (
    <div className="absolute left-48 top-1/2 -translate-y-1/2 z-50 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-black text-base text-gray-800 dark:text-gray-100">{fullStock.name}</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">{fullStock.ticker} · {fullStock.exchange}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold text-sm"
        >
          ✕
        </button>
      </div>

      <div className="border-b border-gray-100 dark:border-gray-700 mb-3" />

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Price</p>
          <p className="font-bold text-sm text-gray-800 dark:text-gray-100">{fullStock.price}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Change</p>
          <p className={`font-bold text-sm ${fullStock.change.includes("+") ? "text-green-500" : "text-red-500"}`}>
            {fullStock.change}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Sector</p>
          <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">{fullStock.sector}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Status</p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">{fullStock.status}</p>
          </div>
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onBookmark(); }}
        disabled={bookmarkLoading}
        className={`w-full mt-4 py-2 rounded-xl text-sm font-bold transition ${
          isBookmarked
            ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 hover:bg-yellow-100"
            : "bg-blue-600 text-white hover:bg-blue-700"
        } disabled:opacity-60`}
      >
        {bookmarkLoading ? "..." : isBookmarked ? "⭐ Bookmarked" : "☆ Bookmark"}
      </button>
    </div>
  );
}

function Row({ item, selectedId, onSelect, bookmarks, onBookmarksChange }) {
  const isSelected = selectedId === item.id;
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const { addNotification } = useNotification();
  const token = localStorage.getItem("token");
  const existingBookmark = bookmarks.find(bookmark => getBookmarkTicker(bookmark) === item.ticker);
  const isBookmarked = Boolean(existingBookmark);

  const handleBookmark = async () => {
    setBookmarkLoading(true);
    try {
      if (!token) {
        throw new Error("You must be logged in to bookmark stocks.");
      }

      if (isBookmarked) {
        const response = await fetch(`${API_BASE}/bookmarks/${existingBookmark.id}/`, {
          method: "DELETE",
          headers: { "Authorization": `Token ${token}` },
        });

        if (!response.ok) {
          throw new Error("Could not remove bookmark.");
        }

        onBookmarksChange(prev => prev.filter(bookmark => bookmark.id !== existingBookmark.id));
        addNotification(`${item.name} (${item.ticker}) removed from bookmarks.`, "bookmark");
        window.dispatchEvent(new Event("bookmarkUpdated"));
      } else {
        const response = await fetch(`${API_BASE}/bookmarks/`, {
          method: "POST",
          headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: item.name,
            url: getStockUrl(item.ticker),
            description: `${item.ticker} | ${item.price} | ${item.change} | ${item.sector}`,
          }),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.url?.[0] || error.detail || "Could not add bookmark.");
        }

        const newBookmark = await response.json();
        onBookmarksChange(prev => [newBookmark, ...prev]);
        addNotification(`${item.name} (${item.ticker}) has been bookmarked! ⭐`, "bookmark");
        notifyBookmarkedStockHeadlines({
          articles: JSON.parse(localStorage.getItem("newsCache") || "[]"),
          bookmarks: [newBookmark],
          addNotification,
        });
        window.dispatchEvent(new Event("bookmarkUpdated"));
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      addNotification(error.message, "bookmark");
    } finally {
      setBookmarkLoading(false);
    }
  };

  return (
    <div
      onClick={() => onSelect(isSelected ? null : item)}
      className="relative grid grid-cols-[500px_350px_200px_250px] items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 cursor-pointer"
    >
      <div className="flex items-center justify-between pr-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-md flex-shrink-0"></div>
          <p className="font-bold text-base text-gray-800 dark:text-gray-100">{item.name}</p>
        </div>
        <p className="text-gray-400 dark:text-gray-500 text-sm">{item.id}</p>
      </div>

      <p className="text-base font-semibold text-gray-700 dark:text-gray-300">{item.sector}</p>
      <p className="text-base font-semibold text-gray-700 dark:text-gray-300">{item.exchange}</p>

      <div className="flex items-center gap-6">
        <p className="text-base font-semibold text-gray-800 dark:text-gray-100">{item.price}</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <p className="text-gray-400 dark:text-gray-500 text-sm">({item.status})</p>
        </div>
      </div>

      {isSelected && (
        <StockPopup
          stock={item}
          onClose={() => onSelect(null)}
          onBookmark={handleBookmark}
          isBookmarked={isBookmarked}
          bookmarkLoading={bookmarkLoading}
        />
      )}
    </div>
  );
}

export default Row;
