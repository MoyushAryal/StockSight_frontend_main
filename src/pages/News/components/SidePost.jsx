import React from "react";

function SidePost({ post, onReadMore }) {
  return (
    <button
      type="button"
      onClick={() => onReadMore?.(post)}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow flex text-left transition-colors duration-300 hover:-translate-y-0.5"
    >
      <img src={post.image} alt={post.title} className="w-32 h-24 object-cover flex-shrink-0" />
      <div className="p-3 flex flex-col justify-between">
        <span className="text-xs bg-blue-600 text-white px-2 py-1 w-fit rounded uppercase">
          {post.category}
        </span>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{post.title}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{post.date}</p>
      </div>
    </button>
  );
}

export default SidePost;
