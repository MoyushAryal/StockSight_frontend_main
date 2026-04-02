import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../../context/ThemeContext";

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`border rounded-lg px-3 py-2 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
        <p className="text-blue-500 font-bold text-xs m-0">{label}</p>
        <p className={`text-sm mt-1 ${isDark ? "text-white" : "text-gray-800"}`}>
          ${Number(payload[0].value).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const MetricCard = ({ label, value, colorClass, isDark }) => (
  <div className={`border rounded-xl p-4 flex flex-col gap-1 ${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-200"}`}>
    <span className={`text-xs uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</span>
    <span className={`text-2xl font-bold ${colorClass || (isDark ? "text-white" : "text-gray-800")}`}>{value}</span>
  </div>
);

const InfoTable = ({ info, showAll, isDark }) => {
  const rows = Object.entries(info);
  const visible = showAll ? rows : rows.slice(0, 6);
  return (
    <table className="w-full border-collapse">
      <tbody>
        {visible.map(([k, v]) => (
          <tr key={k} className={`border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
            <td className={`py-2 px-3 text-sm w-1/3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{k}</td>
            <td className={`py-2 px-3 text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>{v ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default function StockPredictionResult() {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const { ticker, days, predictData } = location.state || {};

  const [tickerInfo, setTickerInfo] = useState(null);
  const [recentPrices, setRecentPrices] = useState([]);
  const [showAllInfo, setShowAllInfo] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!predictData) {
      navigate("/prediction-panel");
      return;
    }
    fetchTickerInfo();

    if (predictData.current_value) {
      setRecentPrices(
        predictData.current_value.map((price, i) => ({
          date: `Day ${i + 1}`,
          price: parseFloat(price.toFixed(2)),
        }))
      );
    }

    setTimeout(() => setLoaded(true), 80);
  }, []);

  const fetchTickerInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/prediction/ticker-info/?ticker=${ticker}`, {
        headers: { "Authorization": `Token ${token}` },
      });
      const data = await response.json();
      setTickerInfo(data);
    } catch {
      setTickerInfo({ Symbol: ticker });
    }
  };

  if (!predictData) return null;

  const predictedChartData = (predictData.predict_value || []).map((price, i) => ({
    day: `Day +${i + 1}`,
    price: parseFloat(price.toFixed(2)),
  }));

  const r2Color =
    predictData.r2 >= 0.85 ? "text-green-500" :
    predictData.r2 >= 0.6  ? "text-yellow-500" : "text-red-500";

  const axisTick = { fill: isDark ? "#6b7280" : "#9ca3af", fontSize: 11 };
  const gridStroke = isDark ? "#374151" : "#e5e7eb";

  return (
    <div className={`min-h-screen font-sans transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${isDark ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-700"}`}>

      {/* Top bar */}
      <div className={`sticky top-0 z-50 flex items-center justify-between px-6 h-14 border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <button
          onClick={() => navigate(-1)}
          className={`text-sm border rounded-lg px-3 py-1 transition ${isDark ? "text-gray-400 border-gray-600 hover:bg-gray-700" : "text-gray-600 border-gray-300 hover:bg-gray-100"}`}
        >
          ← Back
        </button>
        <span className={`font-bold text-base ${isDark ? "text-white" : "text-gray-800"}`}>
          Prediction Result &nbsp;<span className="text-blue-500">{ticker}</span>
        </span>
        <span className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          Next {days} day{days > 1 ? "s" : ""}
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-5 space-y-4">

        {/* Ticker Info */}
        {tickerInfo && (
          <div className={`border rounded-xl p-5 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <div className="flex justify-between items-center mb-3">
              <span className={`font-semibold text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>Information</span>
              <button
                onClick={() => setShowAllInfo((v) => !v)}
                className="text-blue-500 text-sm font-semibold hover:text-blue-400 transition"
              >
                {showAllInfo ? "Show Less" : "Show More"}
              </button>
            </div>
            <InfoTable info={tickerInfo} showAll={showAllInfo} isDark={isDark} />
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="MSE"         value={predictData.mse?.toFixed(4)  ?? "—"} isDark={isDark} />
          <MetricCard label="RMSE"        value={predictData.rmse?.toFixed(4) ?? "—"} isDark={isDark} />
          <MetricCard label="R² Score"    value={predictData.r2?.toFixed(4)   ?? "—"} colorClass={r2Color} isDark={isDark} />
          <MetricCard label="Predictions" value={`${predictedChartData.length} days`}  colorClass="text-blue-500" isDark={isDark} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Actual prices */}
          <div className={`border rounded-xl p-5 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <span className={`font-semibold text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              Actual Stock Price — {ticker}
            </span>
            <p className={`text-xs mt-1 mb-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Test set ground truth ({recentPrices.length} days)
            </p>
            {recentPrices.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={recentPrices} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="date" tick={axisTick} interval={Math.floor(recentPrices.length / 6)} />
                  <YAxis tick={axisTick} domain={["auto", "auto"]} width={60} />
                  <Tooltip content={<CustomTooltip isDark={isDark} />} />
                  <Area type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={1.5}
                    fill="url(#actualGrad)" dot={false} activeDot={{ r: 4, fill: "#22c55e" }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className={`h-56 flex items-center justify-center text-sm ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                No data available
              </div>
            )}
          </div>

          {/* Predicted prices */}
          <div className={`border rounded-xl p-5 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <span className={`font-semibold text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              Predicted Price — {ticker} {`${predictedChartData.length} days`}
            </span>
            <p className={`text-xs mt-1 mb-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              LSTM model forecast
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={predictedChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0760ef" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0760ef" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="day" tick={axisTick} interval={Math.floor(predictedChartData.length / 6)} />
                <YAxis tick={axisTick} domain={["auto", "auto"]} width={60} />
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                <Area type="monotone" dataKey="price" stroke="#0760ef" strokeWidth={2}
                  fill="url(#predGrad)" dot={false} strokeDasharray="6 3"
                  activeDot={{ r: 4, fill: "#0760ef" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Predicted prices table */}
        <div className={`border rounded-xl p-5 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <span className={`font-semibold text-sm block mb-3 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            Predicted Prices Table
          </span>
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}>
            {predictedChartData.map((row, i) => (
              <div
                key={i}
                className={`border rounded-lg px-3 py-2 flex flex-col gap-1 ${isDark ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}
              >
                <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{row.day}</span>
                <span className="text-blue-500 text-sm font-semibold">${row.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
