// src/pages/Profile/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEdit, FaSave, FaBookmark, FaPhone, FaEnvelope, FaUser } from "react-icons/fa";

const API_BASE = "http://127.0.0.1:8000/api";

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

  useEffect(() => {
    fetchProfile();
    fetchBookmarks();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users/profile/`, {
        headers: { "Authorization": `Token ${token}` },
      });
      const data = await response.json();
      setProfile(data);
      setEditData({
        full_name: data.full_name || "",
        bio: data.bio || "",
        phone_number: data.phone_number || "",
      });
    } catch (err) {
      setError("Could not load profile.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await fetch(`${API_BASE}/bookmarks/`, {
        headers: { "Authorization": `Token ${token}` },
      });
      const data = await response.json();
      setBookmarks(data.slice(0, 5));
    } catch (err) {
      console.error("Could not load bookmarks.");
    }
  };

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
    } catch (err) {
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
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50 dark:bg-gray-950 p-8">

      {/* Top Banner */}
      <div className="relative w-full h-40 bg-blue-600 rounded-2xl mb-16">
        <div className="absolute -bottom-12 left-10 flex items-end gap-6">
          <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-950 overflow-hidden bg-gray-200 flex items-center justify-center shadow-lg">
            {profile?.profile_picture ? (
              <img src={profile.profile_picture} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <FaUserCircle className="w-full h-full text-gray-400" />
            )}
          </div>
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {profile?.full_name || profile?.username}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{profile?.username}</p>
          </div>
        </div>

        {/* Logout button top right */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left — Profile Details */}
        <div className="lg:col-span-2 space-y-6">

          {/* Profile Info Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white border-l-4 border-blue-600 pl-3">
                Profile Details
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-full text-sm hover:bg-blue-50 transition-colors"
                >
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={editData.full_name}
                    onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Bio</label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="Tell us about yourself"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Phone Number</label>
                  <input
                    type="text"
                    value={editData.phone_number}
                    onChange={(e) => setEditData({ ...editData, phone_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="Phone number"
                  />
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saveLoading}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => { setIsEditing(false); setError(""); }}
                    className="flex-1 py-2 border border-gray-200 text-gray-500 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <FaUser className="text-blue-600 text-lg flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Full Name</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {profile?.full_name || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <FaEnvelope className="text-blue-600 text-lg flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {profile?.email || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <FaPhone className="text-blue-600 text-lg flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {profile?.phone_number || "Not set"}
                    </p>
                  </div>
                </div>

                {profile?.bio && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Bio</p>
                    <p className="text-sm text-gray-800 dark:text-white">{profile.bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right — Bookmarks */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white border-l-4 border-blue-600 pl-3 mb-6">
              Recent Bookmarks
            </h2>
            {bookmarks.length === 0 ? (
              <p className="text-xs text-gray-400">No bookmarks yet.</p>
            ) : (
              <div className="space-y-3">
                {bookmarks.map((bookmark) => (
                  <a
                    key={bookmark.id}
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FaBookmark className="text-blue-600 mt-1 flex-shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-blue-600 truncate">{bookmark.title}</p>
                      <p className="text-xs text-gray-400 truncate">{bookmark.url}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;