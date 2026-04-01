// src/pages/Auth/Register.jsx
import React, { useState } from "react";

const API_BASE = "http://127.0.0.1:8000/api/users";

function Register({ onToggle, onRegisterSuccess }) {
  const [regData, setRegData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const handleRegister = async () => {
    if (!regData.username || !regData.email || !regData.password || !regData.confirmPassword) {
      setRegError("Please fill in all fields.");
      return;
    }
    if (regData.password !== regData.confirmPassword) {
      setRegError("Passwords do not match.");
      return;
    }
    if (regData.password.length < 6) {
      setRegError("Password must be at least 6 characters.");
      return;
    }
    setRegLoading(true);
    try {
      const response = await fetch(`${API_BASE}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: regData.username,
          email: regData.email,
          password: regData.password,
          confirm_password: regData.confirmPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        onRegisterSuccess();
      } else {
        const firstError = Object.values(data)[0];
        setRegError(Array.isArray(firstError) ? firstError[0] : firstError);
      }
    } catch (err) {
      setRegError("Could not connect to server.");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="w-80 flex flex-col">
      <h1 className="text-xl font-semibold text-blue-700 mb-1">
        Create<span className="text-yellow-500"> Account</span>
      </h1>
      <p className="text-xs text-gray-400 mb-5">Join StockSight today</p>

      <input
        type="text"
        placeholder="Username"
        value={regData.username}
        onChange={(e) => setRegData({ ...regData, username: e.target.value })}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 outline-none focus:border-blue-500"
      />
      <input
        type="email"
        placeholder="Email address"
        value={regData.email}
        onChange={(e) => setRegData({ ...regData, email: e.target.value })}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 outline-none focus:border-blue-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={regData.password}
        onChange={(e) => setRegData({ ...regData, password: e.target.value })}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 outline-none focus:border-blue-500"
      />
      <input
        type="password"
        placeholder="Confirm password"
        value={regData.confirmPassword}
        onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
        onKeyDown={(e) => e.key === "Enter" && handleRegister()}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 outline-none focus:border-blue-500"
      />

      {regError && <p className="text-xs text-red-500 mb-2">{regError}</p>}

      <button
        onClick={handleRegister}
        disabled={regLoading}
        className="w-full py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-yellow-300 to-yellow-500 disabled:opacity-60"
      >
        {regLoading ? "Creating account..." : "Create Account"}
      </button>
      <p className="text-xs text-gray-400 text-center mt-3">
        Already have an account?{" "}
        <span className="text-blue-600 cursor-pointer" onClick={onToggle}>
          Sign In
        </span>
      </p>
    </div>
  );
}

export default Register;