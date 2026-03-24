import React from "react";

function FeaturedPost({ post }) {
  if (!post) return null;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow transition-colors duration-300">
      <img src={post.image} alt={post.title} className="w-full h-[380px] object-cover" />
      <div className="p-4 space-y-3">
        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
          {post.category?.toUpperCase()}
        </span>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{post.title}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{post.publisher} • {post.date}</p>
        <button className="text-orange-500 font-semibold text-sm">Read More →</button>
      </div>
    </div>
  );
}

export default FeaturedPost;