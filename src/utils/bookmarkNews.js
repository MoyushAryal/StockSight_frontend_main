export const getStockUrl = (ticker) => `https://finance.yahoo.com/quote/${encodeURIComponent(ticker)}`;

export const getBookmarkTicker = (bookmark) => {
  const [tickerFromDescription] = bookmark.description?.split(" | ") || [];
  if (tickerFromDescription) return tickerFromDescription;

  try {
    const url = new URL(bookmark.url);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[1] || parts[0] || bookmark.url;
  } catch {
    return bookmark.url;
  }
};

const getCompanyTerms = (title = "") => {
  const normalizedTitle = title
    .replace(/\b(inc|ltd|limited|corp|corporation|company|co|plc|group|holdings)\b\.?/gi, "")
    .trim();

  return normalizedTitle
    .split(/\s+/)
    .filter(term => term.length >= 4);
};

const articleMatchesBookmark = (article, bookmark) => {
  const ticker = getBookmarkTicker(bookmark);
  const terms = [ticker, bookmark.title, ...getCompanyTerms(bookmark.title)]
    .filter(Boolean)
    .map(term => term.toLowerCase());

  const haystack = [
    article.title,
    article.description,
    article.content,
  ].filter(Boolean).join(" ").toLowerCase();

  return terms.some(term => haystack.includes(term));
};

export const notifyBookmarkedStockHeadlines = ({ articles = [], bookmarks = [], addNotification }) => {
  if (!articles.length || !bookmarks.length || !addNotification) return;

  const username = localStorage.getItem("username") || "guest";
  const storageKey = `notified_bookmark_headlines_${username}`;
  const notified = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));

  const nextNotified = new Set(notified);

  bookmarks.forEach((bookmark) => {
    const matchedArticle = articles.find(article => articleMatchesBookmark(article, bookmark));
    if (!matchedArticle) return;

    const ticker = getBookmarkTicker(bookmark);
    const headline = matchedArticle.title || "A bookmarked stock has a new headline";
    const uniqueKey = `${ticker}-${matchedArticle.link || headline}`;

    if (notified.has(uniqueKey)) return;

    addNotification(`${ticker}: ${headline}`, "news");
    nextNotified.add(uniqueKey);
  });

  localStorage.setItem(storageKey, JSON.stringify([...nextNotified].slice(-100)));
};
