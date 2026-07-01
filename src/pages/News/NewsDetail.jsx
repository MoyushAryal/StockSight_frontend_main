import React from "react";
import { FaArrowLeft, FaExternalLinkAlt } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const fallbackParagraphs = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed erat sed neque volutpat facilisis. Donec placerat, risus vitae suscipit posuere, neque augue pulvinar arcu, vitae luctus magna est a erat.",
  "Praesent at ligula vitae nibh feugiat porttitor. Mauris in augue non tortor luctus finibus. Sed vulputate purus vitae diam feugiat, sed pulvinar justo sagittis. Suspendisse potenti.",
  "Aliquam erat volutpat. Duis consequat, augue in varius aliquam, massa erat fermentum sem, vitae vulputate arcu lorem non nibh. Curabitur commodo mauris ut lectus faucibus, sed convallis mi luctus.",
  "Vivamus ut dolor sit amet risus gravida aliquet. Aenean facilisis lorem et lectus dignissim, non semper sem gravida. Nam tincidunt posuere ipsum, vel luctus elit lacinia nec.",
];

function mapCachedArticle(article, index) {
  return {
    id: String(index + 1),
    title: article.title || "Untitled news story",
    publisher: article.source_id || "Unknown",
    image: article.image_url || `https://picsum.photos/900/${520 + index}`,
    date: article.pubDate?.split(" ")[0] || "",
    category: article.category?.[0] || "business",
    link: article.link || "#",
    description: article.description || "",
  };
}

function getCachedArticle(newsId) {
  try {
    const cached = JSON.parse(localStorage.getItem("newsCache") || "[]");
    return cached.map(mapCachedArticle).find((article) => article.id === newsId);
  } catch {
    return null;
  }
}

function NewsDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { newsId } = useParams();
  const article = location.state?.post || getCachedArticle(newsId);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10 dark:bg-gray-900">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-sm dark:bg-gray-800">
          <button
            type="button"
            onClick={() => navigate("/news")}
            className="mb-6 flex items-center gap-2 text-sm font-bold text-blue-600"
          >
            <FaArrowLeft /> Back to news
          </button>
          <h1 className="text-2xl font-black text-gray-950 dark:text-white">News article not found</h1>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            This story is not available in the current news cache.
          </p>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gray-50 px-6 py-10 transition-colors dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate("/news")}
          className="mb-6 flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
        >
          <FaArrowLeft /> Back to news
        </button>

        <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
          <img src={article.image} alt={article.title} className="h-[360px] w-full object-cover" />

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase">
              <span className="rounded bg-orange-500 px-2 py-1 text-white">{article.category}</span>
              <span className="text-gray-400">{article.publisher}</span>
              <span className="text-gray-400">{article.date}</span>
            </div>

            <h1 className="mt-4 text-3xl font-black leading-tight text-gray-950 dark:text-white">
              {article.title}
            </h1>

            {article.description && (
              <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
                {article.description}
              </p>
            )}

            <div className="mt-8 space-y-5 text-sm leading-7 text-gray-600 dark:text-gray-300">
              {fallbackParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {article.link && article.link !== "#" && (
              <a
                href={article.link}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-700"
              >
                Original source <FaExternalLinkAlt className="text-xs" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default NewsDetail;
