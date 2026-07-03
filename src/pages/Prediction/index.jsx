import React, { useEffect, useState } from "react";
import PredictionForm from "./components/prediction_form";
import Pricing from "../Pricing";
import { fetchSubscriptionStatus, SUBSCRIPTION_CHANGED_EVENT } from "../../utils/subscription";

const Prediction = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    let mounted = true;

    const syncSubscription = async () => {
      setCheckingAccess(true);
      const result = await fetchSubscriptionStatus();
      if (!mounted) return;
      setSubscribed(result.subscribed);
      setCheckingAccess(false);
    };

    syncSubscription();

    window.addEventListener(SUBSCRIPTION_CHANGED_EVENT, syncSubscription);

    return () => {
      mounted = false;
      window.removeEventListener(SUBSCRIPTION_CHANGED_EVENT, syncSubscription);
    };
  }, []);

  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
        <p className="rounded-lg bg-white px-5 py-4 text-sm font-bold text-gray-500 shadow-sm dark:bg-gray-800 dark:text-gray-300">
          Checking prediction access...
        </p>
      </div>
    );
  }

  if (!subscribed) {
    return <Pricing />;
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 flex items-center justify-center bg-gray-100">
      <PredictionForm />
    </div>
  );
};

export default Prediction;
