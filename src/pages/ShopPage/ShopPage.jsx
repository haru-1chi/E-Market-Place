import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Footer from "../../component/Footer";
import { Button } from "primereact/button";
import HomeShop from './HomeShop';
import ShopListProduct from './ShopListProduct';
import ShopCategries from './ShopCategries';
import axios from "axios";

function ShopPage() {
  const apiProductUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;
  const [data, setData] = useState([]);
  const location = useLocation();
  const { partner_id: paramPartnerId } = useParams();
  const { product } = location.state || {};
  const partner_id = product?.product_partner_id?._id || paramPartnerId;

  const [activeTab, setActiveTab] = useState('HomeShop');
  const tabs = [
    { id: 'HomeShop', label: 'ร้านค้า' },
    { id: 'ShopListProduct', label: 'รายการสินค้า' },
    { id: 'ShopCategries', label: 'หมวดหมู่' },
  ];

  const fetchData = () => {
    axios({
      method: "get",
      url: `${apiProductUrl}/product/bypartner/${partner_id}`,
    })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        console.log(apiProductUrl);
      })
  };

  useEffect(() => {
    if (partner_id) {
      fetchData();
    }
  }, [partner_id]);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'HomeShop':
        return <HomeShop partner_id={partner_id} setActiveTab={setActiveTab} />;
      case 'ShopListProduct':
        return <ShopListProduct partner_id={partner_id} />;
      case 'ShopCategries':
        return <ShopCategries partner_id={partner_id} />;
      default:
        return <HomeShop setActiveTab={setActiveTab} partner_id={partner_id} />;
    }
  };

  useEffect(() => {
    if (!partner_id) {
      return (
        <div>ไม่พบ ผู้ขาย</div>
      )
    }
  }, [partner_id]);

  return (
    <div className="h-screen flex flex-column justify-content-between">
      <div>
        <div className="shop-header flex align-items-start w-full p-3 bg-white border-bottom-1 surface-border">
          <div>
            <img src="" alt='' width={80} height={80} className="border-circle" />
          </div>
          <div className="ml-3 w-full flex justify-content-between align-items-start">
            <div>
              ผู้ขาย: {data.length > 0 ? data[0].product_partner_id.partner_name || "ไม่ระบุชื่อ" : ""}
              <p className="hidden m-0">จังหวัด</p>
              <p className="hidden m-0">จำนวนผู้ติดตาม</p>
            </div>
            <div className="hidden flex-column gap-2">
              <Button label="ติดตาม" className="p-0 px-3" />
              <Button label="พูดคุย" className="p-0 px-3" />
            </div>
          </div>
        </div>

        <ul className="section-sortbar bg-white flex list-none m-0 px-3 py-0 gap-5 border-bottom-1 surface-border">
          {tabs.map((tab) => (
            <li
              key={tab.id}
              className={`list-none py-2 cursor-pointer ${activeTab === tab.id ? 'border-bottom-3 border-yellow-500 text-yellow-500' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
              }}
            >
              {tab.label}

            </li>
          ))}
        </ul>
        <div className='w-full'>
          {renderActiveComponent()}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ShopPage