import React, { useState } from "react";

const API_BASE = "http://127.0.0.1:8000/api/users";

function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/forgot-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 flex flex-col">
      <h1 className="text-xl font-semibold text-blue-700 mb-1">
        Stock<span className="text-yellow-500">Sight</span>
      </h1>
      <p className="text-xs text-gray-400 mb-5">Reset your password</p>

      {success ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl">
            ✓
          </div>
          <p className="text-sm text-center text-gray-600">
            Reset link sent! Check your email inbox and click the link to reset your password.
          </p>
          <button
            onClick={onBack}
            className="text-xs text-blue-600 hover:underline"
          >
            Back to Sign In
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500 mb-5">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 outline-none focus:border-blue-500"
          />

          {error && (
            <p className="text-xs text-red-500 mb-2">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-yellow-300 to-yellow-500 disabled:opacity-60 mb-3"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <button
            onClick={onBack}
            className="text-xs text-blue-600 self-center hover:underline"
          >
            Back to Sign In
          </button>
        </>
      )}
    </div>
  );
}

export default ForgotPassword;