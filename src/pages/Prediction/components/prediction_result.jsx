import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowUp, FaArrowDown, FaChevronDown, FaChevronUp, FaInfoCircle } from "react-icons/fa";
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { useTheme } from "../../../context/ThemeContext";

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload || !payload.length) return null;
  const point = payload.find((p) => p.value != null);
  if (!point) return null;
  return (
    <div className={`border rounded-lg px-3 py-2 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
      <p className="text-blue-500 font-bold text-xs m-0">{label}</p>
      <p className={`text-sm mt-1 ${isDark ? "text-white" : "text-gray-800"}`}>
        ${Number(point.value).toFixed(2)}
      </p>
    </div>
  );
};

// --- Compact signal ring -------------------------------------------------
// A small donut, not a wide gauge — sized to sit quietly in a sidebar
// rather than dominate the page. Direction lives in the arrow badge
// overlapping its edge, confidence lives in the ring fill + center number.
const SignalRing = ({ confidence, direction, isDark }) => {
  const [fill, setFill] = useState(0);
  const size = 108;
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const isUp = direction === "UP";
  const color = isUp ? "#22c55e" : "#ef4444";
  const trackColor = isDark ? "#374151" : "#e5e7eb";

  useEffect(() => {
    const t = setTimeout(() => setFill(confidence), 150);
    return () => clearTimeout(t);
  }, [confidence]);

  const offset = circumference * (1 - fill / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth="9" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 900ms ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>
          {confidence.toFixed(0)}%
        </span>
        <span className={`text-[10px] uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          confidence
        </span>
      </div>
      <div
        className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full shadow-sm"
        style={{ backgroundColor: color }}
      >
        {isUp ? <FaArrowUp className="text-white text-xs" /> : <FaArrowDown className="text-white text-xs" />}
      </div>
    </div>
  );
};

const signalStrength = (confidence) => {
  if (confidence >= 65) return { label: "Strong signal", tone: "text-blue-500", bg: "bg-blue-500/10" };
  if (confidence >= 55) return { label: "Moderate signal", tone: "text-amber-500", bg: "bg-amber-500/10" };
  return { label: "Weak signal", tone: "text-gray-400", bg: "bg-gray-400/10" };
};

// --- Price trend chart -------------------------------------------------
// Solid line: real closing-price history. Dashed line: NOT a price
// forecast — the model only predicts direction, never magnitude — it's a
// visual cue that starts exactly where the real data ends, sized loosely
// by confidence so a stronger signal reads as a steeper line.
const PriceTrendChart = ({ priceHistory, direction, confidence, horizonDays, isDark }) => {
  const chartData = useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) return [];

    const historyPoints = priceHistory.map((p) => ({
      label: p.date.slice(5),
      actual: p.close,
      projected: null,
    }));

    const lastPrice = priceHistory[priceHistory.length - 1].close;
    const sign = direction === "UP" ? 1 : -1;
    const illustrativeMove = sign * (confidence / 100) * 0.08;
    const targetPrice = lastPrice * (1 + illustrativeMove);

    const projectedPoints = Array.from({ length: horizonDays + 1 }, (_, i) => {
      const t = i / horizonDays;
      return {
        label: i === 0 ? "Today" : `+${i}d`,
        actual: null,
        projected: lastPrice + (targetPrice - lastPrice) * t,
      };
    });
    historyPoints[historyPoints.length - 1].projected = lastPrice;

    return [...historyPoints, ...projectedPoints.slice(1)];
  }, [priceHistory, direction, confidence, horizonDays]);

  const axisTick = { fill: isDark ? "#6b7280" : "#9ca3af", fontSize: 11 };
  const gridStroke = isDark ? "#374151" : "#e5e7eb";
  const projColor = direction === "UP" ? "#22c55e" : "#ef4444";

  if (chartData.length === 0) return null;

  return (
    <div>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
          <XAxis dataKey="label" tick={axisTick} interval={Math.floor(chartData.length / 8)} />
          <YAxis tick={axisTick} domain={["auto", "auto"]} width={60} />
          <Tooltip content={<CustomTooltip isDark={isDark} />} />
          <ReferenceLine x="Today" stroke={isDark ? "#4b5563" : "#d1d5db"} strokeDasharray="2 2" />
          <Line type="monotone" dataKey="actual" stroke="#0760ef" strokeWidth={2.5} dot={false} connectNulls={false} />
          <Line
            type="monotone" dataKey="projected" stroke={projColor} strokeWidth={2.5}
            strokeDasharray="6 4" dot={false} connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p className={`text-xs mt-2 flex items-start gap-1.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        <FaInfoCircle className="mt-0.5 shrink-0" />
        Solid: real closing prices. Dashed: illustrates the predicted{" "}
        <span style={{ color: projColor, fontWeight: 600 }}>{direction === "UP" ? "upward" : "downward"}</span>{" "}
        direction only — not a price target.
      </p>
    </div>
  );
};

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

  const { ticker, predictData } = location.state || {};

  const [tickerInfo, setTickerInfo] = useState(null);
  const [showAllInfo, setShowAllInfo] = useState(false);

  useEffect(() => {
    if (!predictData) {
      navigate("/prediction-panel");
      return;
    }
    if (predictData.error || predictData.errors) return;

    const token = localStorage.getItem("token");
    fetch(`/api/prediction/ticker-info/?ticker=${ticker}`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setTickerInfo(data))
      .catch(() => setTickerInfo({ Symbol: ticker }));
  }, [navigate, predictData, ticker]);

  if (!predictData) return null;

  const cardClass = `border rounded-xl ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`;

  const errorMessage =
    predictData.error || (predictData.errors && "That ticker couldn't be processed.");

  if (errorMessage) {
    return (
      <div className={`min-h-screen font-sans flex items-center justify-center px-6 ${isDark ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-700"}`}>
        <div className={`${cardClass} p-8 max-w-sm text-center`}>
          <span className="text-4xl block mb-3">⚠️</span>
          <p className={`font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
            Couldn't predict {ticker}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{errorMessage}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Try another ticker
          </button>
        </div>
      </div>
    );
  }

  const confidencePct = predictData.confidence * 100;
  const strength = signalStrength(confidencePct);
  const directionColor = predictData.direction === "UP" ? "#22c55e" : "#ef4444";

  return (
    <div className={`min-h-screen font-sans ${isDark ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-700"}`}>
      <div className={`sticky top-0 z-50 flex items-center justify-between px-6 h-14 border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <button
          onClick={() => navigate(-1)}
          className={`text-sm border rounded-lg px-3 py-1 transition ${isDark ? "text-gray-400 border-gray-600 hover:bg-gray-700" : "text-gray-600 border-gray-300 hover:bg-gray-100"}`}
        >
          ← Back
        </button>
        <span className={`font-bold text-base ${isDark ? "text-white" : "text-gray-800"}`}>
          Prediction &nbsp;<span className="text-blue-500">{ticker}</span>
        </span>
        <span className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          Next {predictData.horizon_days} days
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-start">

        {/* ---------------- Left: chart + company info ---------------- */}
        <div className="space-y-4 order-2 lg:order-1">
          {predictData.price_history && predictData.price_history.length > 0 && (
            <div className={`${cardClass} p-5`}>
              <span className={`font-semibold text-sm block mb-3 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Price Trend — {ticker}
              </span>
              <PriceTrendChart
                priceHistory={predictData.price_history}
                direction={predictData.direction}
                confidence={confidencePct}
                horizonDays={predictData.horizon_days}
                isDark={isDark}
              />
            </div>
          )}

          {tickerInfo && (
            <div className={`${cardClass} p-5`}>
              <div className="flex justify-between items-center mb-3">
                <span className={`font-semibold text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Company Information
                </span>
                <button
                  onClick={() => setShowAllInfo((v) => !v)}
                  className="flex items-center gap-1 text-blue-500 text-sm font-semibold hover:text-blue-400 transition"
                >
                  {showAllInfo ? "Show Less" : "Show More"}
                  {showAllInfo ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                </button>
              </div>
              <InfoTable info={tickerInfo} showAll={showAllInfo} isDark={isDark} />
            </div>
          )}
        </div>

        {/* ---------------- Right: compact signal sidebar ---------------- */}
        <div className="space-y-4 lg:sticky lg:top-20 order-1 lg:order-2">
          <div
            className={`${cardClass} p-5 flex flex-col items-center border-t-4`}
            style={{ borderTopColor: directionColor }}
          >
            <span className={`text-xs font-semibold uppercase tracking-widest mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {ticker}
            </span>

            <SignalRing confidence={confidencePct} direction={predictData.direction} isDark={isDark} />

            <span className={`text-lg font-black mt-3`} style={{ color: directionColor }}>
              {predictData.direction}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${strength.tone} ${strength.bg}`}>
              {strength.label}
            </span>

            <div className="w-full mt-5 space-y-2">
              <div className={`flex justify-between text-sm border-t pt-2 ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                <span className={isDark ? "text-gray-500" : "text-gray-400"}>Probability up</span>
                <span className={`font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  {(predictData.probability_up * 100).toFixed(1)}%
                </span>
              </div>
              <div className={`flex justify-between text-sm border-t pt-2 ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                <span className={isDark ? "text-gray-500" : "text-gray-400"}>Horizon</span>
                <span className={`font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  {predictData.horizon_days} trading days
                </span>
              </div>
            </div>
          </div>

          {predictData.used_known_ticker_embedding === false && (
            <div className="border border-amber-400/40 bg-amber-400/10 rounded-xl p-3.5 text-xs text-amber-500">
              {ticker} wasn't in this model's training set — this prediction uses a generic fallback, so
              confidence is less reliable than shown.
            </div>
          )}

          {predictData.note && (
            <div className={`border rounded-xl p-3.5 text-xs ${isDark ? "border-gray-700 bg-gray-800 text-gray-400" : "border-gray-200 bg-white text-gray-500"}`}>
              {predictData.note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}