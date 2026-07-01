// src/pages/Bookmark/BookmarkPage.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaBookmark,
  FaChartLine,
  FaExternalLinkAlt,
  FaSearch,
  FaTrash,
  FaWallet,
} from "react-icons/fa";
import { getBookmarkTicker } from "../../utils/bookmarkNews";

const API_BASE = "/api";

function BookmarkPage() {
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchBookmarks = useCallback(async () => {
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
      console.error("Could not load bookmarks:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBookmarks();

    window.addEventListener("bookmarkUpdated", fetchBookmarks);
    return () => window.removeEventListener("bookmarkUpdated", fetchBookmarks);
  }, [fetchBookmarks]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/bookmarks/${id}/`, {
        method: "DELETE",
        headers: { "Authorization": `Token ${token}` },
      });

      if (!response.ok) {
        throw new Error("Could not delete bookmark.");
      }

      setBookmarks(prev => prev.filter(b => b.id !== id));
      window.dispatchEvent(new Event("bookmarkUpdated"));
    } catch (error) {
      console.error("Could not delete bookmark:", error);
    }
  };

  const parseBookmark = (bookmark) => {
    const parts = bookmark.description?.split(" | ") || [];
    const hasTicker = parts.length >= 4;

    return {
      ticker: getBookmarkTicker(bookmark),
      price: parts[hasTicker ? 1 : 0] || "-",
      change: parts[hasTicker ? 2 : 1] || "-",
      sector: parts[hasTicker ? 3 : 2] || "General",
    };
  };

  const enrichedBookmarks = useMemo(() => {
    return bookmarks.map(bookmark => ({
      ...bookmark,
      meta: parseBookmark(bookmark),
    }));
  }, [bookmarks]);

  const filteredBookmarks = enrichedBookmarks.filter((bookmark) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;

    return (
      bookmark.title.toLowerCase().includes(query) ||
      bookmark.meta.ticker.toLowerCase().includes(query) ||
      bookmark.meta.sector.toLowerCase().includes(query)
    );
  });

  const risingCount = enrichedBookmarks.filter(bookmark => bookmark.meta.change.includes("+")).length;
  const sectorCount = new Set(enrichedBookmarks.map(bookmark => bookmark.meta.sector).filter(Boolean)).size;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-6 transition-colors duration-300">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">Saved watchlist</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-900 dark:text-white">Bookmarks</h1>
        </div>

        <div className="relative w-full lg:w-80">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search company, ticker, sector"
            className="h-11 w-full rounded-lg bg-white dark:bg-gray-800 pl-10 pr-4 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white dark:bg-gray-800 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">Total saved</p>
              <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{bookmarks.length}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30">
              <FaBookmark />
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-white dark:bg-gray-800 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">Positive movers</p>
              <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{risingCount}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-900/30">
              <FaChartLine />
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-white dark:bg-gray-800 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">Sectors</p>
              <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{sectorCount}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-gray-700 dark:text-gray-200">
              <FaWallet />
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <h2 className="text-base font-black text-gray-900 dark:text-white">Bookmarked Stocks</h2>
            <p className="mt-1 text-xs text-gray-400">Stocks saved from your listing page</p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 dark:bg-blue-900/30">
            {filteredBookmarks.length} shown
          </span>
        </div>

        <div className="grid grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr_0.9fr_120px] px-5 py-3 text-xs font-bold uppercase text-gray-400 dark:text-gray-500">
          <span>Company</span>
          <span>Ticker</span>
          <span>Sector</span>
          <span>Price</span>
          <span>Change</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="max-h-[560px] overflow-y-auto px-2 pb-2 hide-scrollbar">
          {loading ? (
            <div className="px-3 py-10 text-center text-sm text-gray-400">Loading bookmarks...</div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="px-3 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-400 dark:bg-gray-700">
                <FaBookmark />
              </div>
              <p className="mt-3 text-sm font-bold text-gray-600 dark:text-gray-300">No bookmarks found</p>
              <p className="mt-1 text-xs text-gray-400">Save stocks from the Stocks page and they will appear here.</p>
            </div>
          ) : (
            filteredBookmarks.map((bookmark) => {
              const { ticker, price, change, sector } = bookmark.meta;
              const isPositive = change.includes("+");

              return (
                <div
                  key={bookmark.id}
                  className="grid grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr_0.9fr_120px] items-center rounded-lg px-3 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="truncate font-bold text-gray-900 dark:text-white">{bookmark.title}</p>
                    <p className="mt-1 truncate text-xs text-gray-400">{bookmark.url}</p>
                  </div>
                  <p className="font-bold text-blue-600">{ticker}</p>
                  <p className="truncate text-gray-500 dark:text-gray-400">{sector}</p>
                  <p className="font-semibold text-gray-700 dark:text-gray-200">{price}</p>
                  <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${
                    isPositive
                      ? "bg-green-50 text-green-600 dark:bg-green-900/30"
                      : "bg-red-50 text-red-500 dark:bg-red-900/30"
                  }`}>
                    {change}
                  </span>
                  <div className="flex justify-end gap-2">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30"
                      aria-label={`Open ${bookmark.title}`}
                    >
                      <FaExternalLinkAlt className="text-xs" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(bookmark.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30"
                      aria-label={`Remove ${bookmark.title}`}
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default BookmarkPage;
