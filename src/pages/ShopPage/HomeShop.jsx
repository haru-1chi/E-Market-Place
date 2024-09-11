import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Products from "../../component/Products";
import axios from "axios";

function HomeShop({ partner_id }) {
  const [data, setData] = useState([]);
  const apiProductUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;
  const shuffleArray = (array) => {
    return array.sort(() => 0.5 - Math.random());
  };

  const fetchData = () => {
    axios({
      method: "get",
      url: `${apiProductUrl}/product/bypartner/${partner_id}`
    })
      .then((response) => {
        const shuffledData = shuffleArray(response.data.data);
        setData(shuffledData);
      })
      .catch((error) => {
        console.log(error);
        console.log(apiProductUrl);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div className="shop">
      <div className="bg-white m-0 p-3 lg:mx-2 my-3">
          <span>
            ยินดีต้อนรับ 
          </span>
      </div>

      <div className="bg-white m-0 pt-3 lg:mx-2">
        <div className="flex align-items-center justify-content-between px-3">
          <span>
            <>สินค้าแนะนำสำหรับคุณ</>
          </span>
          <Link to="/List-Product" className="no-underline text-900">ดูเพิ่มเติม <i className="pi pi-angle-right"></i></Link>
        </div>
        <Products data={data} startIndex={0} />
      </div>

      {/* <div className="bg-white mt-3">
        <div className="flex align-items-center justify-content-between px-3 pt-3">
          <span>
            <>โปรโมชั่นแนะนำ</>
          </span>
          <Link to="/List-Product" className="no-underline text-900">ดูเพิ่มเติม <i className="pi pi-angle-right"></i></Link>
        </div>
        <Products data={data} startIndex={5} />
      </div> */}
    </div>
  )
}

export default HomeShop
