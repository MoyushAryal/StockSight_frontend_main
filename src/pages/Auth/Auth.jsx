// src/pages/Auth/Auth.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";

function Auth() {
  const [isReg, setIsReg] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  const toggle = () => {
    setIsReg(!isReg);
    setIsForgot(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white flex">

      {/*  Login or Forgot Password */}
      <div className="w-1/2 h-full flex flex-col items-center justify-center">
        {isForgot ? (
          <ForgotPassword onBack={() => setIsForgot(false)} />
        ) : (
          <Login
            onForgot={() => setIsForgot(true)}
            onLoginSuccess={() => navigate("/dashboard")}
          />
        )}
      </div>

      <div
        className={`absolute right-0 top-0 w-1/2 h-full flex flex-col items-center justify-center transition-opacity duration-300 ${
          isReg ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ transitionDelay: isReg ? "400ms" : "0ms" }}
      >
        <Register
          onToggle={toggle}
          onRegisterSuccess={() => navigate("/dashboard")}
        />
      </div>

      <div
        className="absolute top-0 left-1/2 w-1/2 h-full bg-blue-700 flex flex-col items-center justify-center px-20 z-10 transition-transform duration-700"
        style={{
          transitionTimingFunction: "cubic-bezier(0.77,0,0.175,1)",  // yo animation lai ho i have no idea k ho 
          transform: isReg ? "translateX(-100%)" : "translateX(0)",  // ellea chai hamle silder banako
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