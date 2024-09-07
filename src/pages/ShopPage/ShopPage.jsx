import { useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../../component/Footer";
import { Button } from "primereact/button";
import HomeShop from './HomeShop';
import ShopListProduct from './ShopListProduct';
import ShopCategries from './ShopCategries';

function ShopPage() {
  const location = useLocation();
  const { product } = location.state || {};
  const partnerId = product?.product_partner_id?._id;

  const [activeTab, setActiveTab] = useState('HomeShop');
  const tabs = [
    { id: 'HomeShop', label: 'ร้านค้า' },
    { id: 'ShopListProduct', label: 'รายการสินค้า' },
    { id: 'ShopCategries', label: 'หมวดหมู่' },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'HomeShop':
        return <HomeShop />;
      case 'ShopListProduct':
        return <ShopListProduct partnerId={partnerId} />;
      case 'ShopCategries':
        return <ShopCategries />;
      default:
        return <HomeShop />;
    }
  };



  return (
    <>
      <div className="shop-header flex align-items-center w-full p-3 bg-white border-bottom-1 surface-border">
        <div>
          <img src="" alt='' width={80} height={80} className="border-circle" />
        </div>
        <div className="ml-3 w-full flex justify-content-between align-items-center">
          <div>
            <p className="m-0">ผู้ขาย: {product?.product_partner_id?.partner_name || "ไม่ระบุชื่อ"}</p>
            <p className="m-0">จังหวัด</p>
            <p className="m-0">จำนวนผู้ติดตาม</p>
          </div>
          <div className="flex flex-column gap-2">
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

      <Footer />
    </>
  )
}

export default ShopPage