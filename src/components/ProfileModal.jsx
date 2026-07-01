// src/pages/Profile/Profile.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBookmark,
  FaEdit,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaSave,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { getBookmarkTicker } from "../utils/bookmarkNews";

const API_BASE = "/api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ full_name: "", bio: "", phone_number: "" });
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const displayName = profile?.full_name || profile?.username || "StockSight User";
  const description = profile?.bio || "Tracking markets, saving signals, and building a sharper watchlist.";

  const initials = useMemo(() => {
    return displayName
      .split(" ")
      .map(part => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [displayName]);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users/profile/`, {
        headers: { "Authorization": `Token ${token}` },
      });

      if (!response.ok) {
        throw new Error("Could not load profile.");
      }

      const data = await response.json();
      setProfile(data);
      setEditData({
        full_name: data.full_name || "",
        bio: data.bio || "",
        phone_number: data.phone_number || "",
      });
    } catch {
      setError("Could not load profile.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchBookmarks = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/bookmarks/`, {
        headers: { "Authorization": `Token ${token}` },
      });

      if (!response.ok) {
        throw new Error("Could not load bookmarks.");
      }

      const data = await response.json();
      setBookmarks(data.slice(0, 5));
    } catch (fetchError) {
      console.error("Could not load bookmarks:", fetchError);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
    fetchBookmarks();
  }, [fetchProfile, fetchBookmarks]);

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const formData = new FormData();
      formData.append("full_name", editData.full_name);
      formData.append("bio", editData.bio);
      formData.append("phone_number", editData.phone_number);

      const response = await fetch(`${API_BASE}/users/profile/`, {
        method: "PUT",
        headers: { "Authorization": `Token ${token}` },
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setProfile(data);
        setIsEditing(false);
        setError("");
      } else {
        setError("Could not save profile.");
      }
    } catch {
      setError("Could not save profile.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/users/logout/`, {
        method: "POST",
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (logoutError) {
      console.error("Logout error:", logoutError);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.dispatchEvent(new Event("auth-user-changed"));
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50 dark:bg-gray-950 p-8">
      <div className="mx-auto max-w-6xl rounded-lg bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="relative h-36 rounded-t-lg bg-[radial-gradient(circle_at_10%_20%,#facc15_0,#fb923c_22%,transparent_45%),radial-gradient(circle_at_82%_10%,#22d3ee_0,#3b82f6_30%,transparent_52%),linear-gradient(120deg,#fff7ed,#dbeafe,#ecfeff)] dark:bg-[radial-gradient(circle_at_10%_20%,#854d0e_0,#9a3412_24%,transparent_45%),radial-gradient(circle_at_82%_10%,#155e75_0,#1d4ed8_30%,transparent_52%),linear-gradient(120deg,#111827,#172554,#083344)]">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="absolute right-5 top-5 h-10 w-10 rounded-full bg-white/90 text-blue-600 shadow-sm flex items-center justify-center hover:bg-white transition-colors"
            aria-label="Edit profile"
          >
            <FaEdit />
          </button>
        </div>

        <div className="px-6 pb-8">
          <div className="-mt-14 flex flex-col items-center text-center">
            <div className="relative z-10 h-32 w-32 rounded-full border-4 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 shadow-lg overflow-hidden flex items-center justify-center">
              {profile?.profile_picture ? (
                <img src={profile.profile_picture} alt={displayName} className="h-full w-full object-cover" />
              ) : initials ? (
                <span className="text-4xl font-black text-blue-600">{initials}</span>
              ) : (
                <FaUserCircle className="h-full w-full text-gray-300" />
              )}
            </div>

            <h1 className="mt-4 text-3xl font-black text-gray-900 dark:text-white">{displayName}</h1>
            <p className="mt-1 text-sm font-medium text-blue-600">@{profile?.username || "user"}</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">{description}</p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 transition-colors dark:bg-white dark:text-gray-950 dark:hover:bg-blue-100"
              >
                <FaEdit /> Edit Profile
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2 text-sm font-bold text-gray-700 hover:border-red-300 hover:text-red-600 transition-colors dark:border-gray-700 dark:text-gray-200"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <section className="rounded-lg bg-gray-50 dark:bg-gray-800/70 p-5">
              <div className="flex items-center justify-between gap-4 mb-5">
                <h2 className="text-lg font-black text-gray-900 dark:text-white">Profile Information</h2>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 mb-1 block">Full Name</label>
                    <input
                      type="text"
                      value={editData.full_name}
                      onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 mb-1 block">Description</label>
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                      placeholder="Write a short profile description"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 mb-1 block">Phone Number</label>
                    <input
                      type="text"
                      value={editData.phone_number}
                      onChange={(e) => setEditData({ ...editData, phone_number: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                      placeholder="Phone number"
                    />
                  </div>

                  {error && <p className="text-xs text-red-500">{error}</p>}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saveLoading}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setError(""); }}
                      className="flex-1 py-2 border border-gray-200 text-gray-500 rounded-full text-sm font-bold hover:bg-white transition-colors dark:border-gray-700 dark:hover:bg-gray-900"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-white dark:bg-gray-900 p-4">
                    <div className="flex items-center gap-3 text-gray-400">
                      <FaEnvelope className="text-blue-600" />
                      <span className="text-xs font-bold uppercase">Email</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-100">{profile?.email || "Not set"}</p>
                  </div>
                  <div className="rounded-lg bg-white dark:bg-gray-900 p-4">
                    <div className="flex items-center gap-3 text-gray-400">
                      <FaPhone className="text-blue-600" />
                      <span className="text-xs font-bold uppercase">Phone</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-100">{profile?.phone_number || "Not set"}</p>
                  </div>
                  <div className="rounded-lg bg-white dark:bg-gray-900 p-4">
                    <div className="flex items-center gap-3 text-gray-400">
                      <FaMapMarkerAlt className="text-blue-600" />
                      <span className="text-xs font-bold uppercase">Location</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-100">{profile?.location || "Not set"}</p>
                  </div>
                  <div className="rounded-lg bg-white dark:bg-gray-900 p-4">
                    <div className="flex items-center gap-3 text-gray-400">
                      <FaBookmark className="text-blue-600" />
                      <span className="text-xs font-bold uppercase">Saved Stocks</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-100">{bookmarks.length} recent bookmarks</p>
                  </div>
                </div>
              )}
            </section>

            <aside className="rounded-lg bg-gray-50 dark:bg-gray-800/70 p-5">
              <div className="flex items-center justify-between gap-4 mb-5">
                <h2 className="text-lg font-black text-gray-900 dark:text-white">Recently Bookmarked</h2>
                <FaBookmark className="text-blue-600" />
              </div>

              {bookmarks.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-5 text-center">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No bookmarks yet.</p>
                  <p className="mt-1 text-xs text-gray-400">Saved stocks will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookmarks.map((bookmark) => (
                    <a
                      key={bookmark.id}
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 rounded-lg bg-white dark:bg-gray-900 px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{bookmark.title}</p>
                        <p className="mt-1 text-xs font-semibold text-blue-600">{getBookmarkTicker(bookmark)}</p>
                      </div>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 dark:bg-blue-900/30">
                        View
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
