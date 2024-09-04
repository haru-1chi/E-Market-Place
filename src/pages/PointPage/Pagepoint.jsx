import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../../component/Footer";

function Pagepoint() {
  const categories = [
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/1723180592403556.jpeg",
      name: "สินค้าเบ็ดเตล็ด (Miscellaneous)",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-A62.jpg",
      name: "เครื่องดื่ม (Drinks & Beverages)",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-B158.jpg",
      name: "ผลิตภัณฑ์ซักผ้า และดูแลผ้า (Laundry Products)",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-83 (1).jpg",
      name: "เครื่องปรุงรส-น้ำมัน (Seasoning-Oil)",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-A412.jpg",
      name: "เครื่องสำอางค์และผลิตภัณฑ์ดูแล (Cosmetics and Care Products)",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-B222.jpg",
      name: "ขนม (Appetizer)",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-C72.jpg",
      name: "อาหารกระป๋อง-อาหารแห้ง (Canned Food,Dry Food)",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-137 (2).jpg",
      name: "ผลิตภัณฑ์ดูแลเส้นผม (Hair Care Products)",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-D54-Photoroom.jpg",
      name: "ผ้าอนามัย ผ้าอ้อม กระดาษทิชชู่ (Sanitary Pad,Diapers)",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-188 (2).jpg",
      name: "นม",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-88 (2).jpg",
      name: "ผลิตภัณฑ์ทำความสะอาดและดูแลผิวกาย (Cleaning Products And Take Care Of The Body)",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/1723177617835523.jpeg",
      name: "ของใช้ในบ้าน",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-367 (1).jpg",
      name: "ผลิตภัณฑ์สำหรับผู้หญิง",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-249 (1).jpg",
      name: "เครื่องเขียนและอุปกรณ์สำนักงาน",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-A153.jpg",
      name: "กาแฟ เครื่องชง ครีมเทียม",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-B182.jpg",
      name: "ผลิตภัณฑ์ดูแลช่องปาก",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-A164.jpg",
      name: "ผลิตภัณฑ์สำหรับเด็ก",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-360 (1).jpg",
      name: "ผลิตภัณฑ์สำหรับผู้ชาย",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-A119.jpg",
      name: "เครื่องดื่มแอลกอล์ฮอล์",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/1723189039170586.jpeg",
      name: "ผลิตภัณฑ์ทำความสะอาด (Cleaning Products)",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-C18-1à¸à¸§à¸.jpg",
      name: "อาหารเสริม (Supplementary)",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/product-152.jpeg",
      name: "อาหารแช่แข็ง",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/172266156015699.jpeg",
      name: "อุปกรณ์อ๊อฟฟิต (OFFICE)",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/17228724026029eb1a6f9f96c49a0b72b5bc0d345c680.jpeg",
      name: "เครื่องใช้ไฟฟ้า (electrical appliance)",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/1723093441957482.jpeg",
      name: "ยาสามัญประจำบ้าน (Household Remedy)",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/1723863651966613.jpeg",
      name: "สังฆภัณฑ์และสังฆทาน",
    },
    {
      imgURL:
        "https://api.tossaguns.com/tossagun-shop/api/api_product/image/1723881388512699.jpeg",
      name: "อาหารสัตว์",
    }
  ];

  const navigate = useNavigate();
  // const [categories, setCategories] = useState([]);
  // const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await axios.post(`${apiUrl}/categories`);
  //       setCategories(response.data);
  //     } catch (error) {
  //       console.error('Error fetching categories:', error);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  const handleCategorySelect = (categoryName) => {
    navigate('/List-Product', { state: { categoryName } });
  };

  return (
    <>
      <div className="p-3 mb-4">
        <h1 className="font-semibold">จัดเต็มความคุ้ม แม็คโครลาว</h1>
        <div className="section-point-product w-full text-center gap-2">
          {categories.map((Item) => (
            <div className="flex flex-column bg-white border-round-xl p-2 justify-content-between h-full cursor-pointer" onClick={() => handleCategorySelect(Item.name)}>
                <div>
                  <img
                    src={Item.imgURL}
                    alt=""
                    className=""
                    width={80}
                    height={80}
                  />
                </div>
                <div className="h-full align-content-center text-sm mx-1 my-2">
                  {Item.name}
                </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Pagepoint;
