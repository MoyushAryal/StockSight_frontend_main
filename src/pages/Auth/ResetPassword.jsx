import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api/users";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ new_password: "", confirm_password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!formData.new_password || !formData.confirm_password) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.new_password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.new_password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          new_password: formData.new_password,
          confirm_password: formData.confirm_password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || Object.values(data)[0] || "Something went wrong.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white flex">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-80 flex flex-col">
          <h1 className="text-xl font-semibold text-blue-700 mb-1">
            Stock<span className="text-yellow-500">Sight</span>
          </h1>
          <p className="text-xs text-gray-400 mb-5">Set a new password</p>

          {success ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl">✓</div>
              <p className="text-sm text-center text-gray-600">
                Password reset successful! You can now log in with your new password.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-yellow-300 to-yellow-500"
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-5">Enter your new password below.</p>

              <input
                type="password"
                placeholder="New password"
                value={formData.new_password}
                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 outline-none focus:border-blue-500"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={formData.confirm_password}
                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 outline-none focus:border-blue-500"
              />

              {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-yellow-300 to-yellow-500 disabled:opacity-60 mb-3"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                onClick={() => navigate("/login")}
                className="text-xs text-blue-600 self-center hover:underline"
              >
                Back to Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;