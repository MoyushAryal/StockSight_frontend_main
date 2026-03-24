import React from "react";

function GlobalListItem({ post }) {
  return (
    <div className="flex gap-3 bg-white dark:bg-gray-800 p-3 rounded shadow transition-colors duration-300">
      <img src={post.image} alt={post.title} className="w-20 h-16 object-cover rounded flex-shrink-0" />
      <div>
        <span className="text-xs text-orange-500 font-semibold">{post.category}</span>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{post.title}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{post.date}</p>
      </div>
    </div>
  );
}

export default GlobalListItem;