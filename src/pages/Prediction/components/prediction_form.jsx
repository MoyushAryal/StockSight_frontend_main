import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaCrown, FaChartLine } from "react-icons/fa";
 
const PredictionForm = () => {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
 
    try {
      const token = localStorage.getItem("token");
 
      const response = await fetch("/api/prediction/predict/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ ticker }),
      });
 
      const data = await response.json();
      navigate("/predict/result", { state: { ticker, predictData: data } });
    } catch (error) {
      console.error("Prediction error:", error);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="w-full max-w-md">
      <button
        type="button"
        onClick={() => navigate("/pricing")}
        className="mb-4 flex w-full items-center justify-between rounded-lg bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 px-5 py-3 text-left text-gray-950 shadow-[0_14px_30px_rgba(245,158,11,0.25)] transition-transform hover:-translate-y-0.5"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/70">
            <FaCrown className="text-amber-700" />
          </span>
          <span>
            <span className="block text-sm font-black">Upgrade prediction access</span>
            <span className="block text-xs font-semibold text-amber-900/70">View Pro and Plus plans</span>
          </span>
        </span>
        <FaArrowRight className="text-sm" />
      </button>
 
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <FaChartLine className="text-blue-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Stock Direction</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Predicts whether a stock will trend up or down over the next 20 trading days.
        </p>
 
        <form className="space-y-4" onSubmit={handlePredict}>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-600 dark:text-gray-300">
              Ticker Symbol
            </label>
            <input
              type="text"
              placeholder="e.g. AAPL"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              required
            />
          </div>
 
          <button
            type="submit"
            disabled={loading || !ticker}
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </form>
      </div>
    </div>
  );
};
 
export default PredictionForm;