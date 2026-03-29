// src/components/ProfileModal.jsx
import React, { useState, useEffect } from "react";
import { FaTimes, FaUserCircle, FaBookmark, FaEdit, FaSave } from "react-icons/fa";

const API_BASE = "http://127.0.0.1:8000/api";

function ProfileModal({ isOpen, onClose }) {
  const [profile, setProfile] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ full_name: "", bio: "", phone_number: "" });
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
      fetchBookmarks();
    }
  }, [isOpen]);

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
      setBookmarks(data.slice(0, 3));
    } catch (err) {
      console.error("Could not load bookmarks.");
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const formData = new FormData();
      formData.append('full_name', editData.full_name);
      formData.append('bio', editData.bio);
      formData.append('phone_number', editData.phone_number);

      const response = await fetch(`${API_BASE}/users/profile/`, {
        method: "PUT",
        headers: {
          "Authorization": `Token ${token}`,
        },
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-blue-600 h-24 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center -mt-12 mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden bg-gray-200 flex items-center justify-center">
            {profile?.profile_picture ? (
              <img src={profile.profile_picture} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <FaUserCircle className="w-full h-full text-gray-400" />
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : (
          <div className="px-6 pb-6">

            {/* Username & Email */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {profile?.username}
              </h2>
              <p className="text-sm text-gray-400">{profile?.email}</p>
            </div>

            {/* Edit / View Fields */}
            {isEditing ? (
              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={editData.full_name}
                    onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Bio</label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="Bio"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Phone Number</label>
                  <input
                    type="text"
                    value={editData.phone_number}
                    onChange={(e) => setEditData({ ...editData, phone_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="Phone number"
                  />
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saveLoading}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <FaSave /> {saveLoading ? "Saving..." : "Save"}
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
              <div className="space-y-2 mb-6">
                {profile?.full_name && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Name:</span> {profile.full_name}
                  </p>
                )}
                {profile?.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Bio:</span> {profile.bio}
                  </p>
                )}
                {profile?.phone_number && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Phone:</span> {profile.phone_number}
                  </p>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2 mt-2 border border-blue-600 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <FaEdit /> Edit Profile
                </button>
              </div>
            )}

            {/* Recent Bookmarks */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <FaBookmark className="text-blue-600" /> Recent Bookmarks
              </h3>
              {bookmarks.length === 0 ? (
                <p className="text-xs text-gray-400">No bookmarks yet.</p>
              ) : (
                <div className="space-y-2">
                  {bookmarks.map((bookmark) => (
                    <a
                      key={bookmark.id}
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <p className="text-sm font-medium text-blue-600 truncate">{bookmark.title}</p>
                      <p className="text-xs text-gray-400 truncate">{bookmark.url}</p>
                    </a>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileModal;