import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api/users";

function Auth() {
  const [isReg, setIsReg] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [regData, setRegData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const toggle = () => {
    setIsReg(!isReg);
    setLoginError("");
    setRegError("");
  };

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
        navigate("/dashboard");
      } else {
        setLoginError(data.error || "Invalid credentials.");
      }
    } catch (err) {
      setLoginError("Could not connect to server.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // ************************* API CALL HUNCHA AFTER YOU CREATE A END POINT
    alert("Please contact support to reset your password.");
  };

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
        navigate("/dashboard");
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
    <div className="relative w-screen h-screen overflow-hidden bg-white flex">

      {/* Left login form -> suru ma visible */}
      <div className="w-1/2 h-full flex flex-col items-center justify-center">
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

          {loginError && (
            <p className="text-xs text-red-500 mb-2">{loginError}</p>
          )}

          <button
            onClick={handleForgotPassword}
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
      </div>

      {/* reg form - > lukeako huncha suru ma  */}
      <div
        className={`absolute right-0 top-0 w-1/2 h-full flex flex-col items-center justify-center transition-opacity duration-300 ${
          isReg ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ transitionDelay: isReg ? "400ms" : "0ms" }}
      >
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

          {regError && (
            <p className="text-xs text-red-500 mb-2">{regError}</p>
          )}

          <button
            onClick={handleRegister}
            disabled={regLoading}
            className="w-full py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-yellow-300 to-yellow-500 disabled:opacity-60"
          >
            {regLoading ? "Creating account..." : "Create Account"}
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">
            Already have an account?{" "}
            <span className="text-blue-600 cursor-pointer" onClick={toggle}>
              Sign In
            </span>
          </p>
        </div>
      </div>

      {/* Slide animation wala part .... ignore this  */}
      <div
        className="absolute top-0 left-1/2 w-1/2 h-full bg-blue-700 flex flex-col items-center justify-center px-20 z-10 transition-transform duration-700"
        style={{
          transitionTimingFunction: "cubic-bezier(0.77,0,0.175,1)",
          transform: isReg ? "translateX(-100%)" : "translateX(0)",
        }}
      >
        <h2 className="text-xl font-medium text-white text-center mb-3">
          {isReg ? "Already have an account?" : "Welcome Back!"}
        </h2>
        <p className="text-sm text-blue-200 text-center mb-8">
          {isReg
            ? "Sign in and continue your investment journey."
            : "Don't have an account? Sign up and start investing smarter."}
        </p>
        <button
          onClick={toggle}
          className="px-8 py-2 rounded-full text-sm border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-white transition-colors duration-200"
        >
          {isReg ? "Sign In" : "Sign Up"}
        </button>
      </div>

    </div>
  );
}

export default Auth;