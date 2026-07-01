// src/context/NotificationContext.jsx
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const NotificationContext = createContext();

const getCurrentUsername = () => localStorage.getItem("username") || "guest";
const getStorageKey = (username) => `notifications_${username || "guest"}`;

const loadNotifications = (username) => {
  try {
    const saved = localStorage.getItem(getStorageKey(username));
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Could not load notifications:", error);
    return [];
  }
};

export function NotificationProvider({ children }) {
  const [currentUsername, setCurrentUsername] = useState(getCurrentUsername);
  const [notifications, setNotifications] = useState(() => loadNotifications(getCurrentUsername()));
  const storageKey = useMemo(() => getStorageKey(currentUsername), [currentUsername]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(notifications));
  }, [notifications, storageKey]);

  useEffect(() => {
    const syncNotifications = () => {
      const username = getCurrentUsername();
      setCurrentUsername(username);
      setNotifications(loadNotifications(username));
    };

    window.addEventListener("auth-user-changed", syncNotifications);
    window.addEventListener("storage", syncNotifications);

    return () => {
      window.removeEventListener("auth-user-changed", syncNotifications);
      window.removeEventListener("storage", syncNotifications);
    };
  }, []);

  const addNotification = useCallback((message, type = "info") => {
    const username = getCurrentUsername();
    const newNotif = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      message,
      type,
      read: false,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toLocaleDateString(),
    };

    setCurrentUsername(username);
    setNotifications(prev => {
      const baseNotifications = username === currentUsername ? prev : loadNotifications(username);
      return [newNotif, ...baseNotifications].slice(0, 20);
    });
  }, [currentUsername]);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const value = useMemo(() => ({
    notifications,
    addNotification,
    markAllRead,
    markAsRead,
    removeNotification,
    clearAll,
    unreadCount,
  }), [notifications, addNotification, markAllRead, markAsRead, removeNotification, clearAll, unreadCount]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
