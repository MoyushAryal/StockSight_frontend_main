// src/components/Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  FaBell,
  FaBookmark,
  FaInfoCircle,
  FaMoon,
  FaNewspaper,
  FaSearch,
  FaSignInAlt,
  FaSun,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext";
import { newsData, stockListData } from "../data/appData";

const API_BASE = "/api";

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { notifications, markAllRead, markAsRead, removeNotification, clearAll, unreadCount } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(() => localStorage.getItem("profile_picture_url") || "");
  const [username, setUsername] = useState(() => localStorage.getItem("display_name") || localStorage.getItem("username") || "User");
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const syncProfilePicture = () => {
      setProfilePictureUrl(localStorage.getItem("profile_picture_url") || "");
      setUsername(localStorage.getItem("display_name") || localStorage.getItem("username") || "User");
    };

    const fetchProfilePicture = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.removeItem("profile_picture_url");
        syncProfilePicture();
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/users/profile/`, {
          headers: { "Authorization": `Token ${token}` },
        });

        if (!response.ok) {
          throw new Error("Could not load profile picture.");
        }

        const data = await response.json();
        const pictureUrl = data.profile_picture_url || data.profile_picture || "";
        if (pictureUrl) {
          localStorage.setItem("profile_picture_url", pictureUrl);
        } else {
          localStorage.removeItem("profile_picture_url");
        }
        if (data.username) {
          localStorage.setItem("username", data.username);
        }
        localStorage.setItem("display_name", data.full_name || data.username || "User");
      } catch (profileError) {
        console.error("Could not load profile picture:", profileError);
      } finally {
        syncProfilePicture();
      }
    };

    fetchProfilePicture();
    window.addEventListener("auth-user-changed", fetchProfilePicture);
    window.addEventListener("profile-picture-updated", syncProfilePicture);

    return () => {
      window.removeEventListener("auth-user-changed", fetchProfilePicture);
      window.removeEventListener("profile-picture-updated", syncProfilePicture);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type) => {
    if (type === "login") return <FaSignInAlt className="text-blue-500" />;
    if (type === "bookmark") return <FaBookmark className="text-yellow-500" />;
    if (type === "news") return <FaNewspaper className="text-green-500" />;
    return <FaInfoCircle className="text-gray-500 dark:text-gray-300" />;
  };

  const getNotificationPath = (notif) => {
    if (notif.path) return notif.path;
    if (notif.type === "bookmark") return "/bookmarks";
    if (notif.type === "news") return "/news";
    if (notif.type === "login") return "/dashboard";
    if (notif.type === "prediction") return "/prediction-panel";
    return "/dashboard";
  };

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    setIsOpen(false);
    navigate(getNotificationPath(notif));
  };

  const stockSuggestions = stockListData.filter((stock) => {
    const query = search.trim().toLowerCase();
    if (!query) return false;
    return (
      stock.name.toLowerCase().includes(query) ||
      stock.ticker.toLowerCase().includes(query) ||
      stock.sector.toLowerCase().includes(query)
    );
  }).slice(0, 4);

  const newsSuggestions = newsData.filter((item) => {
    const query = search.trim().toLowerCase();
    if (!query) return false;
    return item.title.toLowerCase().includes(query) || item.publisher.toLowerCase().includes(query);
  }).slice(0, 2);

  const goToStockSearch = (query = search) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    setIsSearchOpen(false);
    navigate(`/stock-listing?q=${encodeURIComponent(cleanQuery)}`);
  };

  return (
    <nav className="shadow-sm transition-colors duration-300 bg-white dark:bg-gray-900 h-20 px-6 relative z-50">
      <div className="flex justify-between h-full items-center">
        <h1 className="font-extrabold text-gray-900 dark:text-white text-3xl">
          <span className="text-blue-600">Stock</span><span className="text-[#FFE135]">Sight</span>
        </h1>

        <div className="flex space-x-6 mr-8 items-center">
          <div ref={searchRef} className="h-10 w-80 bg-gray-100 dark:bg-gray-700 rounded-lg items-center px-3 relative flex">
            <FaSearch className="absolute text-gray-400 text-sm left-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") goToStockSearch();
              }}
              className="pl-8 text-gray-600 dark:text-gray-200 bg-transparent outline-none placeholder-gray-400 w-full"
              placeholder="Search stocks, sectors, news"
            />
            {isSearchOpen && search.trim() && (
              <div className="absolute left-0 right-0 top-12 overflow-hidden rounded-lg bg-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] dark:bg-gray-800">
                {stockSuggestions.length > 0 && (
                  <div className="border-b border-gray-100 py-2 dark:border-gray-700">
                    <p className="px-3 pb-1 text-[11px] font-bold uppercase text-gray-400">Stocks</p>
                    {stockSuggestions.map((stock) => (
                      <button
                        key={stock.id}
                        type="button"
                        onClick={() => goToStockSearch(stock.ticker)}
                        className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        <span>
                          <span className="block text-sm font-bold text-gray-800 dark:text-gray-100">{stock.name}</span>
                          <span className="block text-xs text-gray-400">{stock.ticker} - {stock.sector}</span>
                        </span>
                        <span className="text-xs font-bold text-blue-600">{stock.change}</span>
                      </button>
                    ))}
                  </div>
                )}
                {newsSuggestions.length > 0 && (
                  <div className="py-2">
                    <p className="px-3 pb-1 text-[11px] font-bold uppercase text-gray-400">News</p>
                    {newsSuggestions.map((item) => (
                      <button
                        key={`${item.title}-${item.date}`}
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate("/news");
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <span className="block truncate text-sm font-semibold text-gray-700 dark:text-gray-100">{item.title}</span>
                        <span className="block text-xs text-gray-400">{item.publisher}</span>
                      </button>
                    ))}
                  </div>
                )}
                {stockSuggestions.length === 0 && newsSuggestions.length === 0 && (
                  <button
                    type="button"
                    onClick={() => goToStockSearch()}
                    className="w-full px-3 py-3 text-left text-sm font-semibold text-gray-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Search stocks for "{search.trim()}"
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isDark
              ? <FaSun className="text-yellow-500 text-xl" />
              : <FaMoon className="text-blue-400 text-xl" />
            }
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen(prev => !prev)}
              aria-label="Open notifications"
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaBell className="text-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 min-w-4 h-4 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {isOpen && (
              <div className="absolute right-0 top-12 w-[22rem] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-[0_18px_50px_rgba(15,23,42,0.18)] overflow-hidden">
                <div className="flex items-center justify-between gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-900/60">
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm">Notifications</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                      <button type="button" onClick={markAllRead} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                        Mark read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button type="button" onClick={clearAll} className="text-xs font-semibold text-gray-400 hover:text-red-500">
                        Clear all
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto hide-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                      <FaBell className="text-3xl mb-2 opacity-30" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleNotificationClick(notif)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleNotificationClick(notif);
                          }
                        }}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition ${
                          !notif.read ? "bg-blue-50/70 dark:bg-blue-900/10" : ""
                        } cursor-pointer`}
                      >
                        <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-sm">
                          {getIcon(notif.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-snug">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{notif.date} - {notif.time}</p>
                        </div>
                        {!notif.read && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-3 flex-shrink-0" />
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notif.id);
                          }}
                          aria-label="Remove notification"
                          className="p-1 rounded-full text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            onClick={() => navigate("/profile")}
            className="border-2 border-gray-200 w-10 h-10 rounded-full cursor-pointer overflow-hidden hover:border-blue-500 transition-colors"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/profile");
              }
            }}
          >
            {profilePictureUrl ? (
              <img src={profilePictureUrl} alt={`${username} profile`} className="object-cover w-full h-full" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                <FaUserCircle className="h-8 w-8" />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
