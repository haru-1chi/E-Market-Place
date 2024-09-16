import React, { useState, useRef, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Checkbox } from 'primereact/checkbox';
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Badge } from "primereact/badge";
import { Menu } from "primereact/menu";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
//
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";
import { useCart } from "../router/CartContext";
import axios from "axios";
import ContactUs from "./ContactUs";
import CategoriesIcon from "./CategoriesIcon";
import GenerateCategories from "./GenerateCategories";
import Logo from "../assets/tossaganLogo.png";
import img_placeholder from '../assets/img_placeholder.png';
//
function Appbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const op = useRef(null);
  const [isContactUsVisible, setContactUsVisible] = useState(false);
  const itemsMenu = [
    {
      label: "บัญชีของฉัน",
      command: () => {
        setVisible1(false);
        op.current.hide();
        navigate("/AccountPage", { state: { activeTab: "account" } });
      },
    },
    {
      label: "ติดต่อเรา",
      command: () => {
        setContactUsVisible(true);
      },
    },
    {
      label: "ออกจากระบบ",
      command: () => {
        handleLogout();
      },
    },
  ];

  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);

  const { cart, removeFromCart, updateQuantity, resetCart, selectedItemsCart, setSelectedItemsCart } = useCart();
  const toast = useRef(null);
  const showToast = () => {
    toast.current.show({
      severity: "info",
      summary: "สินค้าถูกนำออกจากตะกร้า",
      life: 2000,
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    if (search) {
      setSearchTerm(search);
    }
  }, [location]);

  const handleSearchKeyPress = (event) => {
    if (event.key === "Enter" && searchTerm.trim() !== "") {
      navigate(`/List-Product?search=${searchTerm}`);
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/List-Product?search=${searchTerm}`);
    }
  };
  const [selectedItems, setSelectedItems] = useState({});

  const handleSelectItem = (partner_id, product, partner_name) => {
    setSelectedItems(prevSelectedItems => {
      const selectedPartner = prevSelectedItems[partner_id] || { partner_id, partner_name, products: [] };
      const existingProduct = selectedPartner.products.find(item => item.product_id === product.product_id);

      let updatedProducts;
      if (existingProduct) {
        updatedProducts = selectedPartner.products.filter(item => item.product_id !== product.product_id);
      } else {
        updatedProducts = [...selectedPartner.products, product];
      }

      if (updatedProducts.length === 0) {
        const { [partner_id]: removedPartner, ...restSelectedItems } = prevSelectedItems;
        return restSelectedItems;
      }

      return {
        ...prevSelectedItems,
        [partner_id]: { ...selectedPartner, products: updatedProducts }
      };
    });
  };

  const selectedProducts = Object.keys(cart).flatMap(partner_id =>
    cart[partner_id]?.products?.filter(product =>
      selectedItems[partner_id]?.products?.some(item => item.product_id === product.product_id)
    ) || []
  );

  const totalPayable = selectedProducts.reduce((total, product) => total + product.product_price * product.product_qty, 0);

  const confirmToCheckout = () => {
    setSelectedItemsCart(selectedItems);
    navigate("/CheckoutPage");
  };

  const apiUrl = import.meta.env.VITE_REACT_APP_API_PLATFORM;
  const apiProductUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);


  const groupByPartner = (cart) => {
    if (typeof cart !== 'object') {
      return {};
    }

    return Object.keys(cart).reduce((acc, partner_id) => {
      const partner = cart[partner_id];
      acc[partner_id] = {
        partner_name: partner.partner_name,
        products: partner.products
      };
      return acc;
    }, {});
  };

  const totalItems = Object.values(cart).reduce((total, partner) => {
    return total + (partner.products ? partner.products.length : 0);
  }, 0);

  const groupedCart = groupByPartner(cart);

  useEffect(() => {

    const getUserProfile = async () => {
      try {
        const res = localStorage.getItem("user");
        setUser(JSON.parse(res));
      } catch (err) {
        console.error(
          "Error fetching user data",
          err.response?.data || err.message
        );
      }
    };
    getUserProfile();
  }, []);

  useEffect(() => {
    const fetchCategories = () => {

      const fetchedCategories = Object.keys(CategoriesIcon).map((categoryName, index) => ({
        key: index,
        name: categoryName,
        icon: CategoriesIcon[categoryName]
      }));

      setCategories(fetchedCategories);
    };

    fetchCategories();
  }, []);

  const customIcons = (
    <React.Fragment>
      <button className="p-sidebar-icon p-link mr-2">
        {/* <span className="pi pi-search" /> */}
      </button>
    </React.Fragment>
  );

  const customHeader = (
    <div className="flex align-items-center gap-2">
      <a href="/">
        <img src={Logo} alt="Logo" className="w-7 p-0 m-0" />
      </a>
    </div>
  );

  const customHeader2 = (
    <div className="flex align-items-center gap-2 ">
      <span className="font-bold">รถเข็น</span>
    </div>
  );

  const customHeader3 = (
    <div className="flex align-items-center gap-2">
      <a href="/">
        <img src={Logo} alt="Logo" className="w-7 p-0 m-0" />
      </a>
    </div>
  );

  const customHeader4 = (
    <div className="flex align-items-center gap-2">
      <a href="/">
        <img src={Logo} alt="Logo" className="w-7 p-0 m-0" />
      </a>
    </div>
  );

  const { t } = useTranslation();
  const { zipcode, category, makroProPoint, makromail } = t("Appbar");

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = 'https://service.tossaguns.com/';
  };

  return (
    <>
      <Toast ref={toast} position="top-center" />
      <div className="hidden lg:block section-appbar">
        <div className="pt-3 pr-3 pl-3">
          <div className="flex justify-content-start gap-3">
            <Link>Seller Center</Link>
            <Link>ช่องทางการติดต่อ</Link>
            <Link>ติดตามเรา</Link>
            {/* <LanguageSelector /> */}
          </div>
          <div className="card flex justify-content-between mb-2 border-solid align-items-center">
            <div className="flex justify-content-between align-items-center">
              <div className="block">
                <Button
                  icon="pi pi-bars"
                  onClick={() => setVisible1(true)}
                  rounded
                  text
                />
              </div>
              <Link to="/" className="bg-white border-round-3xl">
                <img src={Logo} alt="Logo" height={80} />
              </Link>
            </div>
            <div className="w-5 mx-4">
              <IconField iconPosition="left">
                <InputIcon className="pi pi-search text-900"> </InputIcon>
                <InputText
                  className="w-full border-round-3xl py-2 surface-100 border-none"
                  type="text"
                  placeholder="ค้นหาสินค้าภายในเว็บ"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                />
              </IconField>
            </div>
            <div className="flex gap-4 align-items-center">
              <Button
                icon={
                  <span
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <i
                      className="pi pi-shopping-cart"
                      style={{ fontSize: "1.4rem" }}
                    ></i>
                    <Badge
                      value={totalItems}
                      severity="danger"
                      style={{
                        position: "absolute",
                        top: "-0.4rem",
                        right: "-0.4rem",
                        fontSize: "0.7rem",
                      }}
                    />
                  </span>
                }
                text
                onClick={() => setVisible2(true)}
              />
              {user ? (
                <>
                  <div>
                    <Button
                      className="py-2 px-3 border-900"
                      icon="pi pi-user"
                      rounded
                      text
                      label={
                        <div className="flex align-items-center gap-2 white-space-nowrap text-overflow-ellipsis">
                          {user.name}
                          <i className="pi pi-angle-down"></i>
                        </div>
                      }
                      onClick={(e) => op.current.toggle(e)}
                    />
                  </div>
                  <OverlayPanel ref={op} closeOnEscape>
                    <div className="w-16rem">
                      <div className="flex p-0 pb-2 border-bottom-1 surface-border align-items-center">
                        <div className="flex flex-wrap justify-content-center">
                          <div className="border-circle w-4rem h-4rem m-2 bg-primary font-bold flex align-items-center justify-content-center">
                            U
                            {/* {user.name.charAt(0).toUpperCase()} */}
                          </div>
                        </div>
                        <h4 className="ml-3">
                          {user._id}
                          {/* {user.name} */}
                        </h4>
                      </div>
                      <div className="flex flex-column">
                        <Menu model={itemsMenu} className="p-menu" />
                        <ContactUs
                          visible={isContactUsVisible}
                          setVisible={setContactUsVisible}
                        />
                      </div>
                    </div>
                  </OverlayPanel>
                </>
              ) : (
                <Button
                  icon="pi pi-user"
                  rounded
                  text
                  onClick={() => window.location.href = 'https://service.tossaguns.com/'}
                />
              )}
            </div>
          </div>
          <div className="navmenu w-full border-solid pb-1 text-l">
            <div>
              <Button
                className="text-l text-p"
                label={category}
                icon="pi pi-chevron-down"
                iconPos="right"
                onClick={() => setVisible4(true)}
              />
            </div>
            <div className="hidden align-items-center">
              <img
                src="https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FMakro_PRO_Points_GIF_fe64aa9600.gif&w=32&q=75"
                width={20}
                height={20}
              />
              <Link to="/Pagepoint" className="ml-2">
                {makroProPoint}
              </Link>
            </div>
            <div className="flex align-items-center">
              <Button
                className="text-l ml-2 hidden"
                label={
                  <span>
                    <img
                      src="https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2Fmakromail_9348ebf95a.png&w=16&q=75"
                      width={20}
                      height={20}
                      alt="Makromail"
                      style={{ marginRight: "8px", verticalAlign: "middle" }}
                    />
                    makromail
                  </span>
                }
                onClick={() => setVisible3(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* responsive */}
      <div className="block lg:hidden section-appbar">
        {/* <Toast ref={toast} position="top-center" /> */}
        <div className="flex justify-content-start gap-3 p-2 pb-0">
            <Link>Seller Center</Link>
            <Link>ช่องทางการติดต่อ</Link>
            <Link>ติดตามเรา</Link>
            {/* <LanguageSelector /> */}
          </div>
        <div className="p-2">
          <div className="card flex justify-content-between border-solid align-items-center">
            <div className="flex align-items-center">
              <Sidebar
                header={customHeader}
                visible={visible1}
                onHide={() => setVisible1(false)}
              >
                <div>
                  <div>
                    {user ? (
                      <>
                        <div className="flex p-2 align-items-start bg-primary">
                          <div className="border-circle w-4rem h-4rem m-2 bg-cyan-500 font-bold flex align-items-center justify-content-center">
                            U
                            {/* {user.name.charAt(0).toUpperCase()} */}
                          </div>
                          <h3 className="ml-3 font-semibold text-900">
                            {user._id}
                            {/* {user.name} */}
                          </h3>
                        </div>

                        <div className="px-3">
                          <div className="flex justify-content-between align-items-center">
                            <h4 className="m-0 p-0 font-semibold">การซื้อของฉัน</h4>
                            <div className="flex align-items-center" onClick={() => {
                              setVisible1(false);
                              navigate("/AccountPage", { state: { activeTab: "orderHistory" } });
                            }}>
                              <p className="text-900 no-underline cursor-pointer">ดูประวัติการซื้อ</p>
                              <i className="pi pi-angle-right"></i>
                            </div>
                          </div>
                          <ul className="flex justify-content-center gap-7 pl-0 list-none">
                            <li className="flex flex-column text-center cursor-pointer"
                              onClick={() => {
                                setVisible1(false);
                                navigate("/AccountPage", { state: { activeTab: "orderHistory", activeOrderStatus: "กำลังเตรียมจัดส่ง" } });
                              }}>
                              <i className="pi pi-box" style={{ fontSize: '1.5rem' }}></i>
                              <p className="m-0 p-0 mt-2 text-sm">ที่ต้องจัดส่ง</p>
                            </li>
                            <li className="flex flex-column text-center cursor-pointer"
                              onClick={() => {
                                setVisible1(false);
                                navigate("/AccountPage", { state: { activeTab: "orderHistory", activeOrderStatus: "จัดส่งแล้ว" } });
                              }}>
                              <i className="pi pi-truck" style={{ fontSize: '1.5rem' }}></i>
                              <p className="m-0 p-0 mt-2 text-sm">ที่ต้องได้รับ</p>
                            </li>
                            <li className="flex flex-column text-center cursor-pointer"
                              onClick={() => {
                                setVisible1(false);
                                navigate("/AccountPage", { state: { activeTab: "orderHistory", activeOrderStatus: "รับสินค้าแล้ว" } });
                              }}>
                              <i className="pi pi-check" style={{ fontSize: '1.5rem' }}></i>
                              <p className="m-0 p-0 mt-2 text-sm">รับสินค้าแล้ว</p>
                            </li>
                          </ul>
                        </div>


                        <hr />

                        <div className="flex flex-column">
                          <Menu model={itemsMenu} className="p-menu" />
                          <ContactUs
                            visible={isContactUsVisible}
                            setVisible={setContactUsVisible}
                          />
                        </div>
                        <hr />
                        <div className="flex justify-content-between px-3">
                          <p className="p-0 m-0">ภาษา</p>
                          <LanguageSelector />
                        </div>
                        <br />
                        <div className="mt-3 hidden">
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
                      </>
                    ) : (
                      <div>
                        <div className="flex justify-content-between pt-2 pb-4">
                          <Button label="เข้าสู่ระบบ" outlined rounded onClick={() => window.location.href = 'https://service.tossaguns.com/'} />
                          <Button label="ลงทะเบียน" rounded onClick={() => window.location.href = 'https://service.tossaguns.com/'} />
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
                        {/* <hr /> */}
                        <div className="hidden">
                          <div className="flex align-items-start p-2">
                            <img
                              src="https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FMakro_PRO_Points_GIF_fe64aa9600.gif&w=32&q=75"
                              width={20}
                              height={20}
                            />
                            <div className="flex flex-column ml-2">
                              <span className="font-semibold">
                                แม็คโครลาว
                              </span>
                              <span>เรียนรู้เพิ่มเติม</span>
                            </div>
                          </div>
                        </div>
                        <hr />
                        <div className="flex justify-content-between">
                          <p className="p-0 m-0">ภาษา</p>
                          <LanguageSelector />
                        </div>
                        <br />
                        <div className="mt-3 hidden">
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
                    )}
                  </div>
                </div>
              </Sidebar>

              <Sidebar
                header={customHeader2}
                visible={visible2}
                position="right"
                onHide={() => setVisible2(false)}
              >
                <div
                  className={cart && Object.keys(cart).length > 0 ? "cart-items w-full" : "cart flex gap-1"}
                >
                  {cart && Object.keys(cart).length > 0 ? (
                    <>
                      <div className="p-2">
                        {Object.keys(groupedCart).map(partner_id => (
                          <div key={partner_id} className="border-1 border-round-xl surface-border p-2 mb-3">
                            <div className="flex justify-content-between">
                              <Link to={`/ShopPage/${partner_id}`} className="no-underline text-900">
                                <div className='flex align-items-center mb-2' onClick={() => setVisible2(false)}>
                                  <i className="pi pi-shop"></i>
                                  <p className="m-0 ml-2 p-0">ผู้ขาย {groupedCart[partner_id].partner_name}</p>
                                </div>
                              </Link>
                            </div>
                            <div className="flex flex-column gap-4">
                              {groupedCart[partner_id].products.map((product, index) => (
                                <div
                                  key={product.product_id || index}
                                  className="cart-items flex justify-content-between"
                                >
                                  <div className="w-full flex">
                                    <div className="flex align-items-center">
                                      <div className="h-full flex flex-column justify-content-between align-items-center">
                                        <Checkbox
                                          checked={selectedItems[partner_id] && selectedItems[partner_id].products.some(item => item.product_id === product.product_id)}
                                          onChange={() => handleSelectItem(partner_id, product, groupedCart[partner_id].partner_name)}
                                          className="mt-2"
                                        />
                                        <div className="flex align-items-center justify-content-between mb-2">
                                          <Button
                                            icon="pi pi-trash"
                                            onClick={() => {
                                              showToast();
                                              removeFromCart(partner_id, product.product_id);
                                            }}
                                            className="text-red-500"
                                            rounded
                                            text
                                          />
                                        </div>

                                      </div>
                                      <img
                                        src={`${product.product_image ? apiProductUrl + product.product_image : product.product_subimage1 ? apiProductUrl + product.product_subimage1 : product.product_subimage2 ? apiProductUrl + product.product_subimage2 : product.product_subimage3 ? apiProductUrl + product.product_subimage3 : img_placeholder}`}
                                        alt={product.product_name}
                                        width={100}
                                        height={100}
                                        className="border-1 border-round-lg surface-border"
                                      />
                                    </div>
                                    <div className="w-full h-full ml-3 flex flex-column justify-content-between white-space-nowrap overflow-hidden text-overflow-ellipsis">
                                      <span className="mb-3 font-normal">
                                        {product.product_name}
                                      </span>
                                      <div className="flex justify-content-between align-items-center">
                                        <span className="font-bold">
                                          ฿{Number(product.product_price).toLocaleString("en-US")}
                                        </span>
                                        <div className="flex justify-content-between align-items-center border-300 border-1 border-round-md">
                                          <Button
                                            size="small"
                                            icon={<i className="pi pi-minus" style={{ fontSize: "0.6rem" }}></i>}
                                            className="p-0 border-noround w-2rem"
                                            onClick={() => updateQuantity(partner_id, product.product_id, product.product_qty - 1)}
                                            text
                                          />
                                          <p className="px-3 m-0 p-0 border-x-1 border-300 text-sm">
                                            {product.product_qty}
                                          </p>
                                          <Button
                                            size="small"
                                            icon={<i className="pi pi-plus" style={{ fontSize: "0.6rem" }}></i>}
                                            className="p-0 border-noround w-2rem"
                                            onClick={() => updateQuantity(partner_id, product.product_id, product.product_qty + 1)}
                                            text
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        <div>
                          <div className="flex align-items-center justify-content-between py-2">
                            <p className="m-0">ยอดชำระ</p>
                            <p className="m-0">฿{totalPayable.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="filter-card-group bg-white flex justify-content-end align-items-center border-top-1 surface-border z-1 sticky">
                        <p className="m-0 mr-2 text-900 font-semibold">
                          รวม ฿{totalPayable.toFixed(2)}
                        </p>
                        {Object.keys(selectedItems).length === 0 ? (
                          <Button
                            label="เช็คเอาท์"
                            size="small"
                            className="w-fit border-noround"
                            disabled
                          />
                        ) : (
                          <Link to="/CheckoutPage">
                            <Button
                              label="เช็คเอาท์"
                              size="small"
                              className="w-fit border-noround"
                              onClick={() => {
                                setVisible2(false);
                                confirmToCheckout();
                              }}
                            />
                          </Link>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src="https://www.makro.pro/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fempty-basket.76c5ec1f.png&w=1200&q=75"
                        alt=""
                      />
                      <h2 className="m-1">ไม่มีสินค้าในตะกร้า</h2>
                      <span className="mb-3">เริ่มเลือกสินค้าเลย!</span>
                      <a href="/">
                        <Button label="หาจากหมวดหมู่สินค้า" rounded />
                      </a>
                    </>
                  )}
                </div>
              </Sidebar>
              <Button
                icon="pi pi-bars"
                onClick={() => setVisible1(true)}
                rounded
                text
              />
            </div>
            <div className="flex justify-content-between align-items-center gap-2">
              <div className="w-full flex justify-content-between align-items-center">
                <IconField className="w-10 mr-2" iconPosition="left">
                  <InputIcon className="pi pi-search text-900"></InputIcon>
                  <InputText
                    className="w-full border-round-3xl py-2 surface-100 border-none"
                    type="text"
                    placeholder="ค้นหาสินค้าภายในเว็บ"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </IconField>
                <Button
                  className="p-0 m-0 border-900 text-primary"
                  icon="pi pi-search"
                  onClick={handleSearchClick}
                  rounded
                  style={{width: '2.5rem', height: '2.5rem', backgroundColor: 'black'}}
                />
              </div>
            </div>
            <div className="flex justify-content-between align-items-center">
              <div className="flex justify-content-end">
                {/* <Button icon="pi pi-heart" rounded text /> */}
                <Button
                  icon={
                    <span
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <i
                        className="pi pi-shopping-cart"
                        style={{ fontSize: "1.3rem" }}
                      ></i>
                      <Badge
                        value={totalItems}
                        severity="danger"
                        style={{
                          position: "absolute",
                          top: "-0.5rem",
                          right: "-0.5rem",
                        }}
                      />
                    </span>
                  }
                  text
                  onClick={() => setVisible2(true)}
                />
              </div>

            </div>
          </div>

          {/* <div className="flex justify-content-between align-items-center gap-2">
            <div className="w-full flex justify-content-between align-items-center">
              <IconField className="w-10" iconPosition="left">
                <InputIcon className="pi pi-search text-900"></InputIcon>
                <InputText
                  className="w-full border-round-3xl py-2 surface-100 border-none"
                  type="text"
                  placeholder="ค้นหาสินค้า"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </IconField>
              <Button
                className="p-0 m-0 border-900"
                icon="pi pi-search"
                onClick={handleSearchClick}
                rounded
              />
            </div>
          </div> */}

          <div className="navmenu w-full overflow-scroll border-solid">
            <div>
              <Sidebar
                header={customHeader4}
                visible={visible4}
                onHide={() => setVisible4(false)}
                icons={customIcons}
              >
                <div className="px-3">
                  <div className="box-menu">
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
                  {categories.map((Item, index) => (
                    <div
                      key={Item._id || index}
                      className="box-menu py-3 hover:surface-hover"
                      onClick={() => handleCategorySelect(Item.name)}
                    >
                      <Link
                        className="flex justify-content-between align-items-center"
                        onClick={() => setVisible4(false)}
                      >
                        <div className="flex align-items-center">
                          <img
                            src={Item.icon}
                            alt={Item.name}
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
                label={category}
                icon="pi pi-chevron-down"
                iconPos="right"
                onClick={() => setVisible4(true)}
              />
            </div>
            {/* <div className="flex align-items-center">
              <img src="https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FMakro_PRO_Points_GIF_fe64aa9600.gif&w=32&q=75" width={20} height={20} />
              <Link to="/Pagepoint" className="ml-2">{makroProPoint}</Link>
            </div> */}
            <div>
              <Sidebar
                header={customHeader3}
                visible={visible3}
                onHide={() => setVisible3(false)}
                icons={customIcons}
              >
                <div>
                  <div className="box-menu mt-5">
                    <a href="#" onClick={() => setVisible3(false)}>
                      <i className="pi pi-angle-left mr-2"></i>
                      <span>ย้อนกลับ</span>
                    </a>
                  </div>
                  <div className="box-menu mt-5">
                    <a href="#">ลดแรง จัดหนัก</a>
                  </div>
                  <div className="box-menu mt-5">
                    <a href="#">โฮเรก้า</a>
                  </div>
                  <div className="box-menu mt-5">
                    <a href="#">มิตรแท้โชห่วย</a>
                  </div>
                </div>
              </Sidebar>
              <Button className="text-l ml-2 hidden" label={
                <span>
                  <img
                    src="https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2Fmakromail_9348ebf95a.png&w=16&q=75"
                    width={20}
                    height={20}
                    alt="Makromail"
                    style={{ marginRight: '8px', verticalAlign: 'middle' }}
                  />
                  makromail
                </span>}
                onClick={() => setVisible3(true)} />
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default Appbar;
