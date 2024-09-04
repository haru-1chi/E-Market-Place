import React from 'react'

function Brand({ data }) {
  return (
    <div className="block">
      <img
        src={data.imgURL}
        alt=""
        className=" "
        width={130}
      />
      <p>{data.title}</p>
    </div>
  )
}

export default Brand