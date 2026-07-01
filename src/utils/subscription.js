export const SUBSCRIPTION_CHANGED_EVENT = "subscription-changed";

export function isUserSubscribed() {
  const isSubscribed = localStorage.getItem("isSubscribed");
  const status = localStorage.getItem("subscriptionStatus");
  const plan = localStorage.getItem("subscriptionPlan");

  return isSubscribed === "true" || status === "active" || Boolean(plan);
}

export function activateSubscription(planName = "StockSight Pro") {
  localStorage.setItem("isSubscribed", "true");
  localStorage.setItem("subscriptionStatus", "active");
  localStorage.setItem("subscriptionPlan", planName);
  window.dispatchEvent(new Event(SUBSCRIPTION_CHANGED_EVENT));
}
