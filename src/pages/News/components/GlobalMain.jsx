import React from "react";

function GlobalMain({ post }) {
  if (!post) return null;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow transition-colors duration-300">
      <img src={post.image} alt={post.title} className="w-full h-56 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{post.title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Read More →</p>
      </div>
    </div>
  );
}

export default GlobalMain;