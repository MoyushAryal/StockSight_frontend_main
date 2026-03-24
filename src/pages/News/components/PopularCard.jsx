import React from "react";

function PopularCard({ post }) {
  return (
    <div className="relative rounded-lg overflow-hidden shadow min-w-[200px]">
      <img src={post.image} alt={post.title} />
      <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
        <p className="text-xs">{post.date}</p>
        <h3 className="text-sm font-semibold">{post.title}</h3>
      </div>
    </div>
  );
}

export default PopularCard;