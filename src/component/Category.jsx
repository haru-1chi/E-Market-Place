import React from "react";

function category({ data }) {
  return (
    <div className="w-5rem">
      <img
        src={data.imgURL}
        alt=""
        className="border-circle "
        width={35}
        height={35}
      />
      <div className="category-title">{data.name}</div>
    </div>
  );
}

export default category;
