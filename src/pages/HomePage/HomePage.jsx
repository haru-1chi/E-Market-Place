import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import BannerSlider from "../../component/BannerSlider";
import Category from "../../component/Category";
import topBanner from "../../assets/banner.png";
import Footer from "../../component/Footer";
import Brand from "../../component/Brand";
import AllBrand from "../../component/AllBrand";
import Products from "../../component/Products";
import CategoriesIcon from "../../component/CategoriesIcon";
import GenerateCategories from "../../component/GenerateCategories";
import axios from "axios";

function HomePage() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    async function fetchCategories() {
      const fetchedCategories = await GenerateCategories();
      setCategories(fetchedCategories);
    }

    fetchCategories();
  }, []);

  const navigate = useNavigate();

  const newBrabd = [
    {
      id: "1",
      imgURL:
        "https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2F3_P_Grid_Banner_3_P_Landing_Page_Mid_Year_Sale_Existing_exciting_offer_TH_cfca948e1e.png&w=1200&q=90",
    },
    {
      id: "2",
      imgURL:
        "https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2F3_P_Grid_Banner_Ba_NANA_Online_Official_Store_TH_ebc408c204.png&w=1200&q=90",
    },
    {
      id: "3",
      imgURL:
        "https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FKenvue_TH_e35d2bb018.jpg&w=1200&q=90",
    },
    {
      id: "4",
      imgURL:
        "https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2F3_P_Grid_Banner_Samsung_Official_Store_TH_2258e689c1.png&w=1200&q=90",
    },
    {
      id: "5",
      imgURL:
        "https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2F3_P_Grid_Banner_3_P_Landing_Page_Mid_Year_Sale_Existing_exciting_offer_TH_cfca948e1e.png&w=1200&q=90",
    },
    {
      id: "6",
      imgURL:
        "https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2F3_P_Grid_Banner_Ba_NANA_Online_Official_Store_TH_ebc408c204.png&w=1200&q=90",
    },
    {
      id: "7",
      imgURL:
        "https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FKenvue_TH_e35d2bb018.jpg&w=1200&q=90",
    },
    {
      id: "8",
      imgURL:
        "https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2F3_P_Grid_Banner_Samsung_Official_Store_TH_2258e689c1.png&w=1200&q=90",
    },
  ];

  const [data, setData] = useState([]);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_PLATFORM;
  const apiProductUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;
  const shuffleArray = (array) => {
    return array.sort(() => 0.5 - Math.random());
  };

  const fetchData = () => {
    axios({
      method: "get",
      url: `${apiProductUrl}/product`
    })
      .then((response) => {
        const shuffledData = shuffleArray(response.data.data);
        setData(shuffledData);
      })
      .catch((error) => {
        console.log(error);
        console.log(apiUrl);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);



  const handleCategorySelect = (categoryName) => {
    navigate('/List-Product', { state: { categoryName } });
  };
  
  return (
    <>
      <div>
        <BannerSlider />
        <div className="block lg:hidden">
          <div className="section-all-brand px-2 py-3 text-center gap-2 bg-yellow-100">
            <Link
              to="List-Product"
              className="no-underline text-900"
            >
              <div>
                <img
                  src="https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FL1_Makro_House_Brand_4a70c6e25a.png&w=32&q=75"
                  alt="สินค้าทุกหมวดหมู่"
                  className="border-round-xl bg-white p-1 border-1 surface-border"
                  width={40}
                  height={40}
                />
                <div className="category-title">สินค้าทุกหมวดหมู่</div>
              </div>
            </Link>
            {categories.map((item) => (
              <div onClick={() => handleCategorySelect(item.name)}>
                <Category data={item} />
              </div>
            ))}
          </div>

        </div>
        <div className="mx-0 lg:mx-2">
          <div className="bg-section-product lg:border-round-2xl flex justify-content-center">
            <img
              className="w-full lg:w-8"
              src="https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FFlash_Sale_Middle_Banner_TH_Electro_0e168c_d08d74be82.png&w=1200&q=90"
              alt=""
            />
          </div>
          <Products data={data} startIndex={0} />
        </div>

        <div className="hidden mt-5">
          <div className="flex align-items-center justify-content-between pl-3 pr-3">
            <span>
              <>ไอเท็มฮิต</>
            </span>
            <Link to="/List-Product" className="no-underline text-900">ดูเพิ่มเติม <i className="pi pi-angle-right"></i></Link>
          </div>
          <Products data={data} startIndex={5} />
        </div>

        <div className="m-0 lg:m-2">
          <div className="bg-section-new-product lg:border-round-2xl flex justify-content-center">
            <img
              className="w-full lg:w-8"
              src="https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FFlash_Sale_Fresh_Middle_TH_016100_8a83bd308a.png&w=1200&q=90"
              alt=""
            />
          </div>
          <Products data={data} startIndex={5} />
        </div>
        <div className="hidden mt-4 pl-3 pr-3">
          <span>
            <b>เปิดตัวแบรนด์ใหม่</b>
          </span>
          <div class="flex category-scrllo w-full mt-4 justify-items-center">
            <div className="flex justify-content-between sm:col-12 gap-3 section-all-brand">
              {newBrabd.map((item) => (
                <Brand data={item} />
              ))}
            </div>
          </div>
        </div>
        <div className="hidden">
          <div className="flex align-items-center justify-content-between pl-3 pr-3">
            <span>
              <b>ไอเท็มฮิต</b>
            </span>
            <Link to="/List-Product" className="no-underline text-900">ดูเพิ่มเติม <i className="pi pi-angle-right"></i></Link>
          </div>
          <Products data={data} startIndex={0} />
        </div>
        <div className="hidden pl-3 pr-3">
          <span>
            <b>รวมแบรนด์เด็ด</b>
          </span>
          <div className="mt-4 section-all-brand">
            <AllBrand />
          </div>
        </div>
        <div className="hidden">
          <div className="flex align-items-center justify-content-between pl-3 pr-3">
            <span>
              <b>ไอเท็มฮิต</b>
            </span>
            <Link to="/List-Product" className="no-underline text-900">ดูเพิ่มเติม <i className="pi pi-angle-right"></i></Link>
          </div>
          <Products data={data} startIndex={0} />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default HomePage