// src/pages/News/News.jsx
import React, { useCallback, useEffect, useState } from "react";
import FeaturedPost from "./components/FeaturedPost";
import SidePost from "./components/SidePost";
import PopularCard from "./components/PopularCard";
import GlobalMain from "./components/GlobalMain";
import GlobalListItem from "./components/GlobalListItem";
import RecommendedItem from "./components/RecommendedItem";
import { useNotification } from "../../context/NotificationContext";
import { notifyBookmarkedStockHeadlines } from "../../utils/bookmarkNews";
import { useNavigate } from "react-router-dom";

const NEWSDATA_API_KEY = "pub_290a3dca696d4880814511b2d68b4ed8";
const CACHE_DURATION = 3600000;
const API_BASE = "/api";

function FloatingBubbles() {
  return (
    <div className="relative w-full h-full min-h-[200px] overflow-hidden rounded-lg bg-blue-50 dark:bg-gray-800 flex items-center justify-center">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-blue-400 opacity-20"
          style={{
            width: `${20 + i * 10}px`,
            height: `${20 + i * 10}px`,
            left: `${10 + i * 11}%`,
            animation: `floatUp ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
            bottom: "-20px",
          }}
        />
      ))}
    </div>
  );
}

function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeGlobalIndex, setActiveGlobalIndex] = useState(0);
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const notifyRelevantHeadlines = useCallback(async (newsArticles) => {
    if (!token || !newsArticles.length) return;

    try {
      const response = await fetch(`${API_BASE}/bookmarks/`, {
        headers: { "Authorization": `Token ${token}` },
      });

      if (!response.ok) {
        throw new Error("Could not load bookmarked stocks for news notifications.");
      }

      const bookmarks = await response.json();
      notifyBookmarkedStockHeadlines({
        articles: newsArticles,
        bookmarks,
        addNotification,
      });
    } catch (error) {
      console.error("Bookmarked headline notification error:", error);
    }
  }, [addNotification, token]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const cached = localStorage.getItem("newsCache");
        const cacheTime = localStorage.getItem("newsCacheTime");

        if (cached && cacheTime && Date.now() - Number(cacheTime) < CACHE_DURATION) {
          const cachedArticles = JSON.parse(cached);
          setArticles(cachedArticles);
          notifyRelevantHeadlines(cachedArticles);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&category=business&language=en`
        );
        const data = await response.json();

        if (data.status === "success" && data.results) {
          setArticles(data.results);
          localStorage.setItem("newsCache", JSON.stringify(data.results));
          localStorage.setItem("newsCacheTime", Date.now().toString());
          addNotification("Latest business news has been updated!", "news");
          notifyRelevantHeadlines(data.results);
        } else {
          setError("Could not load news.");
        }
      } catch {
        setError("Could not connect to news service.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [addNotification, notifyRelevantHeadlines]);

  useEffect(() => {
    if (articles.length === 0) return;
    const globalNewsLength = Math.min(Math.max(articles.length - 4, 0), 5);
    const interval = setInterval(() => {
      setActiveGlobalIndex(prev => (prev + 1) % Math.max(globalNewsLength, 1));
    }, 60000);
    return () => clearInterval(interval);
  }, [articles.length]);

  const mapArticle = (article, index, category) => ({
    id: String(index + 1),
    title: article.title || "No title",
    publisher: article.source_id || "Unknown",
    image: article.image_url || `https://picsum.photos/600/${400 + index}`,
    date: article.pubDate?.split(" ")[0] || "",
    category,
    link: article.link || "#",
    description: article.description || "",
  });

  const openArticle = (post) => {
    navigate(`/news/${post.id}`, { state: { post } });
  };

  const featured = articles[0] ? mapArticle(articles[0], 0, "featured") : null;
  const sideNews = articles.slice(1, 4).map((a, i) => mapArticle(a, i + 1, "side"));
  const popular = articles.slice(4, 7).map((a, i) => mapArticle(a, i + 4, "popular"));
  const global = articles.slice(4, 9).map((a, i) => mapArticle(a, i + 4, "global"));
  const recommended = articles.slice(0, 5).map((a, i) => mapArticle(a, i, "recommended"));

  if (loading) {
    return (
      <div className="w-full bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-sm animate-pulse">Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center min-h-screen">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 p-8 space-y-14 transition-colors duration-300">

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {featured && <FeaturedPost post={featured} onReadMore={openArticle} />}
        </div>
        <div className="space-y-4 max-h-[500px] overflow-y-auto hide-scrollbar">
          {sideNews.map((post) => (
            <SidePost key={post.id} post={post} onReadMore={openArticle} />
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="border-l-4 border-blue-600 pl-3 text-xl font-bold tracking-tight mb-6 text-gray-800 dark:text-gray-100">
            Popular
          </h2>
          <div className="overflow-hidden">
            <div className="flex gap-4 pb-2 animate-marquee">
              {[...popular, ...popular].map((post, index) => (
                <PopularCard key={`${post.id}-${index}`} post={post} onReadMore={openArticle} />
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden shadow">
          <FloatingBubbles />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="border-l-4 border-blue-600 pl-3 text-xl font-bold tracking-tight mb-6 text-gray-800 dark:text-gray-100">
            Global News
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {global[activeGlobalIndex] && (
              <GlobalMain post={global[activeGlobalIndex]} onReadMore={openArticle} />
            )}
            <div className="space-y-4 max-h-[300px] overflow-y-auto hide-scrollbar">
              {global.slice(1).map((post) => (
                <GlobalListItem key={post.id} post={post} onReadMore={openArticle} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="border-l-4 border-blue-600 pl-3 text-xl font-bold tracking-tight mb-6 text-gray-800 dark:text-gray-100">
            Recommended
          </h2>
          <div className="space-y-4 max-h-[300px] overflow-y-auto hide-scrollbar">
            {recommended.map((post) => (
              <RecommendedItem key={post.id} post={post} onReadMore={openArticle} />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default News;
