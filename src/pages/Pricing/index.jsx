import React, { useState } from "react";
import { FaBolt, FaCheck, FaCrown, FaGem, FaHardHat, FaSpinner } from "react-icons/fa";

const plans = [
  {
    name: "Free",
    price: "Rs 0",
    label: "Freemium",
    icon: FaBolt,
    description: "Start with basic forecasting for a single account.",
    features: [
      "2 predictions per account",
      "Standard prediction model",
      "Basic stock result view",
      "Saved bookmark support",
    ],
    button: "Current plan",
    featured: false,
    underConstruction: false,
    paid: false,
  },
  {
    name: "StockSight Pro",
    price: "Rs 3000",
    label: "Most popular",
    icon: FaCrown,
    description: "For active users who need more daily prediction access.",
    features: [
      "50+ predictions per day",
      "No daily restriction for normal use",
      "Faster stock prediction workflow",
      "Priority access to upcoming tools",
    ],
    button: "Upgrade to Pro",
    featured: true,
    underConstruction: false,
    paid: true,
    amountPaisa: 300000,
  },
  {
    name: "StockSight Plus",
    price: "Rs 5000",
    label: "Under development",
    icon: FaGem,
    description: "Advanced AI models and unlimited prediction access are being built.",
    features: [
      "Unlimited predictions",
      "Advanced AI prediction model",
      "Deeper trend analysis",
      "Best access for power users",
    ],
    button: "Coming soon",
    featured: false,
    underConstruction: true,
    paid: true,
    amountPaisa: 500000,
  },
];

function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const handlePlanClick = async (plan) => {
    if (plan.underConstruction) return;

    if (!plan.paid) return;

    setPaymentError("");
    setLoadingPlan(plan.name);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/payments/khalti/initiate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
        body: JSON.stringify({
          plan: plan.name,
          amount: plan.amountPaisa,
          return_url: `${window.location.origin}/payment/khalti/return`,
          website_url: window.location.origin,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.detail || data.error || "Could not start Khalti payment.");
      }

      const paymentUrl = data.payment_url || data.paymentUrl;
      if (!paymentUrl) {
        throw new Error("Payment URL was not returned by the backend.");
      }

      window.location.href = paymentUrl;
    } catch (error) {
      setPaymentError(error.message);
      setLoadingPlan("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10 transition-colors duration-300">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase text-amber-500">Prediction access</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-gray-950 dark:text-white">
            Simple, transparent pricing
          </h1>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Choose the StockSight plan that fits how often you forecast.
          </p>
          {paymentError && (
            <p className="mx-auto mt-4 max-w-xl rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:bg-red-900/20 dark:text-red-300">
              {paymentError}
            </p>
          )}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <div
                key={plan.name}
                className={`relative rounded-lg p-6 shadow-sm transition-transform hover:-translate-y-1 ${
                  plan.underConstruction
                    ? "overflow-hidden border-2 border-dashed border-amber-400 bg-amber-50 text-gray-900 dark:bg-gray-800 dark:text-white"
                    : plan.featured
                    ? "bg-blue-600 text-white shadow-[0_24px_60px_rgba(37,99,235,0.28)]"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                }`}
              >
                {plan.underConstruction && (
                  <div className="absolute inset-x-0 top-0 bg-amber-400 px-4 py-2 text-center text-xs font-black uppercase tracking-wide text-gray-950">
                    Under Construction
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${
                    plan.underConstruction
                      ? "mt-8 bg-white text-amber-600 dark:bg-gray-700"
                      : plan.featured ? "bg-white/15 text-amber-200" : "bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                  }`}>
                    {plan.underConstruction ? <FaHardHat /> : <Icon />}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    plan.underConstruction
                      ? "mt-8 bg-amber-200 text-amber-900"
                      : plan.featured ? "bg-white/15 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300"
                  }`}>
                    {plan.label}
                  </span>
                </div>

                <div className="mt-6">
                  <h2 className="text-2xl font-black">{plan.name}</h2>
                  <p className={`mt-2 text-sm ${plan.featured ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mt-6 flex items-end gap-2">
                  <p className="text-4xl font-black">{plan.price}</p>
                  <p className={`pb-1 text-sm ${plan.featured ? "text-blue-100" : "text-gray-400"}`}>/ month</p>
                </div>

                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                        plan.featured ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600 dark:bg-blue-900/30"
                      }`}>
                        <FaCheck />
                      </span>
                      <span className={`text-sm font-medium ${plan.featured ? "text-white" : "text-gray-600 dark:text-gray-300"}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handlePlanClick(plan)}
                  disabled={plan.underConstruction || loadingPlan === plan.name}
                  className={`mt-8 w-full rounded-full py-3 text-sm font-black transition-colors ${
                    plan.underConstruction
                      ? "cursor-not-allowed bg-amber-200 text-amber-900"
                      : plan.featured
                      ? "bg-white text-blue-600 hover:bg-amber-100"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white dark:bg-gray-700 dark:text-gray-100"
                  }`}
                >
                  {loadingPlan === plan.name ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" /> Opening Khalti
                    </span>
                  ) : plan.button}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Pricing;
