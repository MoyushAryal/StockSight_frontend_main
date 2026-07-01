import React, { useEffect, useState } from "react";
import PredictionForm from "./components/prediction_form";
import Pricing from "../Pricing";
import { isUserSubscribed, SUBSCRIPTION_CHANGED_EVENT } from "../../utils/subscription";

const Prediction = () => {
  const [subscribed, setSubscribed] = useState(() => isUserSubscribed());

  useEffect(() => {
    const syncSubscription = () => setSubscribed(isUserSubscribed());

    window.addEventListener(SUBSCRIPTION_CHANGED_EVENT, syncSubscription);
    window.addEventListener("storage", syncSubscription);

    return () => {
      window.removeEventListener(SUBSCRIPTION_CHANGED_EVENT, syncSubscription);
      window.removeEventListener("storage", syncSubscription);
    };
  }, []);

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
