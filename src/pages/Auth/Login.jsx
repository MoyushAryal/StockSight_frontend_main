// src/pages/Auth/Login.jsx
import React, { useState } from "react";

const API_BASE = "http://127.0.0.1:8000/api/users";

function Login({ onForgot, onLoginSuccess }) {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async () => {
    if (!loginData.username || !loginData.password) {
      setLoginError("Please fill in all fields.");
      return;
    }
    setLoginLoading(true);
    try {
      const response = await fetch(`${API_BASE}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        onLoginSuccess();
      } else {
        setLoginError(data.error || "Invalid credentials.");
      }
    } catch (err) {
      setLoginError("Could not connect to server.");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="w-80 flex flex-col">
      <h1 className="text-xl font-semibold text-blue-700 mb-1">
        Stock<span className="text-yellow-500">Sight</span>
      </h1>
      <p className="text-xs text-gray-400 mb-5">Sign in to your account</p>

      <input
        type="text"
        placeholder="Username"
        value={loginData.username}
        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 outline-none focus:border-blue-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={loginData.password}
        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2 outline-none focus:border-blue-500"
      />

      {loginError && <p className="text-xs text-red-500 mb-2">{loginError}</p>}

      <button
        onClick={onForgot}
        className="text-xs text-blue-600 self-start mb-4 hover:underline"
      >
        Forgot password?
      </button>

      <button
        onClick={handleLogin}
        disabled={loginLoading}
        className="w-full py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-yellow-300 to-yellow-500 disabled:opacity-60"
      >
        {loginLoading ? "Signing in..." : "Sign In"}
      </button>
    </div>
  );
}

export default Login;