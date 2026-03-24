import React from "react";
import FeaturedPost from "./components/FeaturedPost";
import SidePost from "./components/SidePost";
import PopularCard from "./components/PopularCard";
import GlobalMain from "./components/GlobalMain";
import GlobalListItem from "./components/GlobalListItem";
import RecommendedItem from "./components/RecommendedItem";
import { useState, useEffect } from "react";
import { newsData } from "../../data/appData";

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

function GradientMesh() {
  return (
    <div className="relative w-full h-full min-h-[200px] rounded-lg overflow-hidden flex items-center justify-center"
      style={{ animation: "gradientShift 6s ease infinite", background: "linear-gradient(135deg, #667eea, #764ba2, #f093fb, #667eea)", backgroundSize: "300% 300%" }}>
      <p className="text-white font-semibold text-sm z-10 tracking-widest uppercase drop-shadow">Your Ad Here</p>
    </div>
  );
}

function PulsingRings() {
  return (
    <div className="relative w-full h-full min-h-[200px] rounded-lg bg-gray-900 flex items-center justify-center overflow-hidden">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="absolute rounded-full border-2 border-blue-400 opacity-30"
          style={{ width: `${40 + i * 40}px`, height: `${40 + i * 40}px`, animation: `pulse 2s ease-out infinite`, animationDelay: `${i * 0.5}s` }}
        />
      ))}
      <p className="text-blue-400 font-semibold text-sm z-10 tracking-widest uppercase">Your Ad Here</p>
    </div>
  );
}

function News() {
  const featured = newsData.find(n => n.category === "featured");
  const sideNews = newsData.filter(n => n.category === "side");
  const popular = newsData.filter(n => n.category === "popular");
  const global = newsData.filter(n => n.category === "global");
  const recommended = newsData.filter(n => n.category === "recommended");

  const [activeGlobalIndex, setActiveGlobalIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGlobalIndex(prev => (prev + 1) % global.length);
    }, 60000);
    return () => clearInterval(interval);
  }, [global.length]);

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 p-8 space-y-14 transition-colors duration-300">

      {/* Featured + Side */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <FeaturedPost post={featured} />
        </div>
        <div className="space-y-4 max-h-[500px] overflow-y-auto hide-scrollbar">
          {sideNews.map((post) => (
            <SidePost key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Popular + Ad */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="border-l-4 border-blue-600 pl-3 text-xl font-bold tracking-tight mb-6 text-gray-800 dark:text-gray-100">
            Popular
          </h2>
          <div className="overflow-hidden">
            <div className="flex gap-4 pb-2 animate-marquee">
              {[...popular, ...popular].map((post, index) => (
                <PopularCard key={`${post.id}-${index}`} post={post} />
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden shadow">
          <FloatingBubbles />
        </div>
      </div>

      {/* Global + Recommended */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="border-l-4 border-blue-600 pl-3 text-xl font-bold tracking-tight mb-6 text-gray-800 dark:text-gray-100">
            Global News
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <GlobalMain post={global[activeGlobalIndex]} />
            <div className="space-y-4 max-h-[300px] overflow-y-auto hide-scrollbar">
              {global.slice(1).map((post) => (
                <GlobalListItem key={post.id} post={post} />
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
              <RecommendedItem key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default News;