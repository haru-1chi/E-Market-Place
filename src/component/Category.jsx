import React from "react";

function category({ data }) {
  return (
    <div>
      <img
        src="https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FL1_Makro_House_Brand_4a70c6e25a.png&w=32&q=75"
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
