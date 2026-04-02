import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useTheme } from "../../../context/ThemeContext";

const PredictionForm = () => {
  const { isDark } = useTheme();
  const [ticker, setTicker] = useState("");
  const navigate = useNavigate();
  const [days, setDays] = useState(3);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/prediction/predict/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({ ticker, days }),
      });

      const data = await response.json();
      navigate("/predict/result", {
        state: { ticker, days, predictData: data },
      });

    } catch (error) {
      console.error("Prediction error:", error);
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4">Stock Prediction</h2>

      <form className="space-y-4" onSubmit={handlePredict}>
        
        {/* Ticker Input */}
        <div>
          <label className="block mb-1">Ticker Symbol</label>
          <input
            type="text"
            placeholder="e.g. AAPL"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* Days Selection */}
        <div >
          <label className="block mb-1">Days Ahead</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full p-2 border rounded-lg dark:bg-gray-800"
          >
            <option value={1}>1 Day</option>
            <option value={3}>3 Days</option>
            <option value={7}>7 Days</option>
            <option value={14}>14 Days</option>
          </select>
        </div>

        {/* Predict Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <div className="mt-6">
          <h3 className="font-semibold">Results:</h3>
          <p><strong>Trend:</strong> {result.trend}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
          <p><strong>Predictions:</strong></p>
          <ul>
            {result.predictions.map((p, index) => (
              <li key={index}>Day {index + 1}: {p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;