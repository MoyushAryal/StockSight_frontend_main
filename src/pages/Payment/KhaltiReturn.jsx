import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { activateSubscription } from "../../utils/subscription";

function KhaltiReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("Verifying your Khalti payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      const pidx = searchParams.get("pidx");
      const callbackStatus = searchParams.get("status");

      if (!pidx) {
        setStatus("failed");
        setMessage("Khalti did not return a payment identifier.");
        return;
      }

      if (callbackStatus && callbackStatus !== "Completed" && callbackStatus !== "Pending") {
        setStatus("failed");
        setMessage(`Payment ${callbackStatus.toLowerCase()}.`);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/payments/khalti/verify/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Token ${token}` } : {}),
          },
          body: JSON.stringify({
            pidx,
            purchase_order_id: searchParams.get("purchase_order_id"),
            transaction_id: searchParams.get("transaction_id") || searchParams.get("tidx"),
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.detail || data.error || "Could not verify Khalti payment.");
        }

        if (data.status !== "Completed") {
          setStatus("pending");
          setMessage(`Payment status is ${data.status || "pending"}. Please refresh after a moment.`);
          return;
        }

        activateSubscription(data.plan || "StockSight Pro");
        setStatus("success");
        setMessage("Payment verified. Prediction access is now active.");
        navigate("/prediction-panel", { replace: true });
      } catch (error) {
        setStatus("failed");
        setMessage(error.message);
      }
    };

    verifyPayment();
  }, [navigate, searchParams]);

  const icon = {
    checking: <FaSpinner className="animate-spin text-blue-600" />,
    pending: <FaSpinner className="animate-spin text-amber-500" />,
    success: <FaCheckCircle className="text-green-600" />,
    failed: <FaTimesCircle className="text-red-500" />,
  }[status];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 transition-colors dark:bg-gray-900">
      <div className="mx-auto flex max-w-xl flex-col items-center rounded-lg bg-white p-8 text-center shadow-sm dark:bg-gray-800">
        <div className="text-5xl">{icon}</div>
        <h1 className="mt-5 text-2xl font-black text-gray-950 dark:text-white">Khalti payment</h1>
        <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-300">{message}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/prediction-panel")}
            className="rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-700"
          >
            Prediction panel
          </button>
          <button
            type="button"
            onClick={() => navigate("/pricing")}
            className="rounded-full bg-gray-100 px-5 py-3 text-sm font-black text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100"
          >
            Back to pricing
          </button>
        </div>
      </div>
    </div>
  );
}

export default KhaltiReturn;
