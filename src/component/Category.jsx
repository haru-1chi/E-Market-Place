import React from "react";

function category({ data }) {
  return (
    <div className="w-6rem">
      <img
        src={data.icon}
        alt=""
        className="border-round-xl bg-white p-1 border-1 surface-border"
        width={40}
        height={40}
      />
      <div className="category-title">{data.name}</div>
    </div>
  );
}

export default category;
