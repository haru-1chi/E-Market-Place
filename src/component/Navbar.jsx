import React, { useState, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Outlet, Link, useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import LogoMakro from "../assets/macro-laos1.png";
import CategoriesIcon from "./CategoriesIcon";
import axios from "axios";

function Navbar() {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_PLATFORM;
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [visible4, setVisible4] = useState(false);

  const customIcons = (
    <React.Fragment>
      <button className="p-sidebar-icon p-link mr-2">
        {/* <span className="pi pi-search" /> */}
      </button>
    </React.Fragment>
  );

  const customHeader = (
    <div className="flex align-items-center gap-2">
      <a href="/" className="font-bold">
        <img src={LogoMakro} alt="Logo" height={35} />
      </a>
    </div>
  );

  const customHeader4 = (
    <div className="flex align-items-center gap-2">
      <a href="/">
        <img src={LogoMakro} alt="Logo" className="w-7 p-0 m-0" />
      </a>
    </div>
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.post(`${apiUrl}/categories`);
        const dataWithImages = response.data.map((category) => ({
          ...category,
          imgURL: CategoriesIcon[category.name] || "default-image-url.png",
        }));

        setCategories(dataWithImages);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryName) => {
    navigate("/List-Product", { state: { categoryName } });
  };
  return (
    <>
     <div>
              <Sidebar
                header={customHeader4}
                visible={visible4}
                onHide={() => setVisible4(false)}
                icons={customIcons}
              >
                <div>
                  <div className="box-menu mt-5">
                    <a href="#" onClick={() => setVisible4(false)}>
                      <i className="pi pi-angle-left mr-2"></i>
                      <span>
                        <b>ย้อนกลับ</b>
                      </span>
                    </a>
                  </div>
                  <div className="box-menu mt-2 py-3 hover:surface-hover">
                    <Link
                      to="List-Product"
                      className="flex justify-content-between"
                      onClick={() => setVisible4(false)}
                    >
                      <div className="flex align-items-center">
                        <img
                          src="https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FL1_Makro_House_Brand_4a70c6e25a.png&w=32&q=75"
                          alt="สินค้าทุกหมวดหมู่"
                          width={30}
                          height={30}
                        />
                        <span className="ml-3">สินค้าทุกหมวดหมู่</span>
                      </div>
                      <i className="pi pi-angle-right mr-2"></i>
                    </Link>
                  </div>
                  {categories.map((Item) => (
                    <div
                      className="box-menu py-3 hover:surface-hover"
                      onClick={() => handleCategorySelect(Item.name)}
                    >
                      <Link
                        className="flex justify-content-between align-items-center"
                        onClick={() => setVisible4(false)}
                      >
                        <div className="flex align-items-center">
                          <img
                            src={Item.imgURL}
                            alt="Item.name"
                            width={30}
                            height={30}
                          />
                          <span className="ml-3">{Item.name}</span>
                        </div>
                        <i className="pi pi-angle-right mr-2"></i>
                      </Link>
                    </div>
                  ))}
                </div>
              </Sidebar>
              <Button
                className="p-2 hidden"
                label="หมวดหมู่สินค้า"
                icon="pi pi-chevron-down"
                iconPos="right"
                onClick={() => setVisible4(true)}
              />
            </div>

      <div className="section-appbar card flex justify-content-start p-4 w-full bg-white ">
        <Sidebar
          header={customHeader}
          visible={visible}
          onHide={() => setVisible(false)}
        >
          <div>
            <div className="flex justify-content-between pt-2 pb-4">
              <Link to="/LoginPage">
                <Button label="เข้าสู่ระบบ" outlined rounded />
              </Link>
              <Link to="/RegisterPage">
                <Button label="ลงทะเบียน" rounded />
              </Link>
            </div>
            <div>
              <Button
                className="w-full flex justify-content-between"
                onClick={() => setVisible4(true)}
              >
                <span>ทั้งหมด</span>
                <i className="pi pi-angle-right"></i>
              </Button>
            </div>
            <hr />
            <div className="hidden">
              <div className="flex flex-column p-2">
                แม็คโครลาว<span>เรียนรู้เพิ่มเติม</span>
              </div>
              <hr />
              <div className="flex justify-content-between">
                <p className="p-0 m-0">ภาษา</p>
                <LanguageSelector />
              </div>
              <br />
              <div className="mt-3">
                <div>
                  <i className="pi pi-mobile mr-2"></i>
                  <span>ติดตั้งแอปพลิเคชั่น</span>
                </div>
                <br />
                <div>
                  <i className="pi pi-mobile mr-2"></i>
                  <span>เพิ่มเพื่อนทางไลน์ @abcdef</span>
                </div>
                <hr />
                <div>
                  <i className="pi pi-phone mr-2"></i>
                  <span>โทรคุยกับเรา 1234 กด 5</span>
                </div>
                <hr />
              </div>
            </div>
          </div>
        </Sidebar>
        <Button
          icon="pi pi-bars"
          onClick={() => setVisible(true)}
          rounded
          text
        />
      </div>
      <Outlet />
    </>
  );
}

export default Navbar;
