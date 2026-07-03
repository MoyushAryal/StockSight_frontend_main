export const SUBSCRIPTION_CHANGED_EVENT = "subscription-changed";

export function isUserSubscribed() {
  const isSubscribed = localStorage.getItem("isSubscribed");
  const status = localStorage.getItem("subscriptionStatus");
  const plan = localStorage.getItem("subscriptionPlan");

  return isSubscribed === "true" || status === "active" || Boolean(plan);
}

export function activateSubscription(planName = "StockSight Pro") {
  const alreadyActive = localStorage.getItem("subscriptionStatus") === "active" &&
    localStorage.getItem("subscriptionPlan") === planName;

  localStorage.setItem("isSubscribed", "true");
  localStorage.setItem("subscriptionStatus", "active");
  localStorage.setItem("subscriptionPlan", planName);

  if (!alreadyActive) {
    window.dispatchEvent(new Event(SUBSCRIPTION_CHANGED_EVENT));
  }
}

export function clearSubscriptionCache() {
  const hadSubscriptionCache = localStorage.getItem("isSubscribed") ||
    localStorage.getItem("subscriptionStatus") ||
    localStorage.getItem("subscriptionPlan");

  localStorage.removeItem("isSubscribed");
  localStorage.removeItem("subscriptionStatus");
  localStorage.removeItem("subscriptionPlan");

  if (hadSubscriptionCache) {
    window.dispatchEvent(new Event(SUBSCRIPTION_CHANGED_EVENT));
  }
}

export async function fetchSubscriptionStatus() {
  const token = localStorage.getItem("token");
  if (!token) {
    clearSubscriptionCache();
    return { subscribed: false };
  }

  let response;
  try {
    response = await fetch("/api/payments/subscription/status/", {
      headers: { Authorization: `Token ${token}` },
    });
  } catch {
    clearSubscriptionCache();
    return { subscribed: false };
  }

  if (!response.ok) {
    clearSubscriptionCache();
    return { subscribed: false };
  }

  const data = await response.json();
  const subscribed = Boolean(data.subscribed || data.is_subscribed || data.subscription_status === "active");

  if (subscribed) {
    activateSubscription(data.plan || data.subscription_plan || "StockSight Pro");
  } else {
    clearSubscriptionCache();
  }

  return { ...data, subscribed };
}
