import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../router/CartContext';
import { Button } from "primereact/button";
import StatusShippingPage from './StatusShippingPage';
import MyAccount from './MyAccount';
import axios from "axios";
import { formatDate } from '../../utils/DateTimeFormat';
import ContactUs from '../../component/ContactUs';

function AccountPage() {
    const location = useLocation();
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const [activeTab, setActiveTab] = useState('account');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isContactUsVisible, setContactUsVisible] = useState(false);

    const [userOrders, setUserOrders] = useState(null);
    const { statusEvents } = useCart();
    const [activeOrderStatus, setActiveOrderStatus] = useState('all');

    const tabs = [
        { id: 'account', label: 'บัญชีของฉัน' },
        { id: 'orderHistory', label: 'ประวัติการสั่งซื้อ' },
        // { id: 'favorites', label: 'รายการโปรด' },
        // { id: 'privacySettings', label: 'จัดการข้อมูลส่วนบุคคล' },
        { id: 'contactUs', label: 'ติดต่อเรา' },
    ];

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(`${apiUrl}/orders`, {
                    headers: { "token": token },
                });
                setUserOrders(res.data.data);
            } catch (err) {
                console.error("Error fetching user data", err.response?.data || err.message);
            }
        };
        fetchOrders();
    }, [apiUrl]);

    const statusCounts = (userOrders ?
        userOrders.reduce((counts, order) => {
            // const statusDetails = statusEvents[order.status];
            const statusDetails = Object.values(statusEvents).find(status => status.key === order.status);
            counts[statusDetails?.key] = (counts[statusDetails?.key] || 0) + 1;
            return counts;
        }, {})
        : ("")
    )

    const filteredOrders = (activeOrderStatus === 'all'
        ? (Array.isArray(userOrders) ? userOrders : [])
        : (Array.isArray(userOrders) ? userOrders.filter(order => {
            const orderStatus = Object.values(statusEvents).find(status => status.key === order.status);
            switch (activeOrderStatus) {
                case 'ต้องชำระเงิน':
                    return orderStatus?.key === statusEvents.PendingPayment?.key;
                case 'กำลังจัดเตรียม':
                    return [statusEvents.pending.key, statusEvents.Preparing.key].includes(orderStatus?.key);
                case 'กำลังแพ็คสินค้า':
                    return orderStatus?.key === statusEvents.Packaged?.key;
                case 'กำลังจัดส่ง':
                    // if (order.shipping === 'selfPickup') {
                    //     return [statusEvents.Packaged.key, statusEvents.ThaiWarehouseArrival.key].includes(orderStatus?.key);
                    // } else {
                    //     return [
                    //         statusEvents.Packaged.key,
                    //         statusEvents.ThaiWarehouseArrival.key,
                    //         statusEvents.LaosWarehouseArrival.key,
                    //         statusEvents.InTransit.key
                    //     ].includes(orderStatus?.key);
                    // }
                    return orderStatus?.key === statusEvents.Delivering?.key;
                case 'ถึงจุดรับสินค้าแล้ว':
                    // return order.shipping === 'selfPickup'
                    //     ? orderStatus?.key === statusEvents.LaosWarehouseArrival.key
                    //     : orderStatus?.key === statusEvents.BranchArrival.key;
                    return orderStatus?.key === statusEvents.Delivering?.key;
                case 'รับสินค้าสำเร็จ':
                    return orderStatus?.key === statusEvents.Arrival.key;
                case 'ถูกยกเลิก':
                    return orderStatus?.key === statusEvents.Cancelled.key;
                default:
                    return true;
            }
        }) : [])
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    const handleRevertClick = () => setSelectedOrderId(null);

    const StatusBar = () => (
        <ul className='navmenu w-full flex gap-4 overflow-scroll white-space-nowrap justify-content-between font-semibold pl-0 text-center'>
            <li className={`list-none cursor-pointer ${activeOrderStatus === 'all' ? 'border-bottom-3 border-primary text-primary' : ''}`}
                onClick={() => setActiveOrderStatus('all')}>
                ทั้งหมด {userOrders?.length}
            </li>
            <li className={`list-none cursor-pointer ${activeOrderStatus === 'ต้องชำระเงิน' ? 'border-bottom-3 border-primary text-primary' : ''}`}
                onClick={() => setActiveOrderStatus('ต้องชำระเงิน')}>
                ต้องชำระเงิน {statusCounts[statusEvents?.PendingPayment.key] || ''}
            </li>
            <li className={`list-none cursor-pointer ${activeOrderStatus === 'กำลังจัดเตรียม' ? 'border-bottom-3 border-primary text-primary' : ''}`}
                onClick={() => setActiveOrderStatus('กำลังจัดเตรียม')}>
                กำลังจัดเตรียม {statusCounts[statusEvents.Preparing.key] || ''}
            </li>
            <li className={`list-none cursor-pointer ${activeOrderStatus === 'กำลังแพ็คสินค้า' ? 'border-bottom-3 border-primary text-primary' : ''}`}
                onClick={() => setActiveOrderStatus('กำลังแพ็คสินค้า')}>
                กำลังแพ็คสินค้า {statusCounts[statusEvents.Packaged.key] || ''}
            </li>
            <li className={`list-none cursor-pointer ${activeOrderStatus === 'กำลังจัดส่ง' ? 'border-bottom-3 border-primary text-primary' : ''}`}
                onClick={() => setActiveOrderStatus('กำลังจัดส่ง')}>
                กำลังจัดส่ง {statusCounts[statusEvents.Delivering.key] || ''}
            </li>
            <li className={`list-none cursor-pointer ${activeOrderStatus === 'ถึงจุดรับสินค้าแล้ว' ? 'border-bottom-3 border-primary text-primary' : ''}`}
                onClick={() => setActiveOrderStatus('ถึงจุดรับสินค้าแล้ว')}>
                ถึงจุดรับสินค้าแล้ว {statusCounts[statusEvents.Arrival.key] || ''}
            </li>
            <li className={`list-none cursor-pointer ${activeOrderStatus === 'รับสินค้าสำเร็จ' ? 'border-bottom-3 border-primary text-primary' : ''}`}
                onClick={() => setActiveOrderStatus('รับสินค้าสำเร็จ')}>
                รับสินค้าสำเร็จ {statusCounts[statusEvents.Received.key] || ''}
            </li>
            <li className={`list-none cursor-pointer ${activeOrderStatus === 'ถูกยกเลิก' ? 'border-bottom-3 border-primary text-primary' : ''}`}
                onClick={() => setActiveOrderStatus('ถูกยกเลิก')}>
                ถูกยกเลิก {statusCounts[statusEvents.Cancelled.key] || ''}
            </li>
        </ul>
    );

    const OrderHistory = () => (
        filteredOrders ? filteredOrders.length > 0 ? (
            selectedOrderId ? (
                <div>
                    <Button className='text-900' label="กลับไปดูประวัติการซื้อ" icon="pi pi-angle-left" onClick={handleRevertClick} text />
                    <StatusShippingPage orderId={selectedOrderId} />
                </div>
            ) : (
                <div>
                    <h1 className="m-0 mb-2 p-0 font-semibold">ประวัติการสั่งซื้อ</h1>
                    <StatusBar />
                    {filteredOrders.map((order) => (
                        <div
                            key={order._id}
                            onClick={() => setSelectedOrderId(order._id)}
                            className='cursor-pointer w-full'
                        >
                            <OrderItem order={order} />
                        </div>
                    ))}
                </div>
            )
        ) : (
            <div>
                <h1 className="m-0 mb-2 p-0 font-semibold">ประวัติการสั่งซื้อ</h1>
                <StatusBar />
                <div className='h-full text-center align-content-center'>
                    <img src="https://www.makro.pro/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FemptyOrders.b84ad154.png&w=300&q=75" alt="" />
                    <h2 className='my-0 font-semibold'>ยังไม่มีรายการสั่งซื้อขณะนี้</h2>
                    <p className='mb-5 mt-2'>คุณจะเห็นคำสั่งซื้อเมื่อมีคำสั่งซื้อที่ตรงตามเมนูสถานะที่คุณเลือก</p>
                    <Link to="/"><Button label="หาจากหมวดหมู่สินค้า" rounded className='font-semibold' /></Link>
                </div>
            </div>
        ) : ("")
    );

    const OrderItem = ({ order }) => {
        const orderStatus = Object.values(statusEvents).find(status => status.key === order.status);
        return (
            <>
                <div className='hidden md:flex w-full grid-nogutter bg-white border-1 surface-border border-round-xl py-3 px-2 mt-3 align-items-start'>
                    <div className='col-2'>
                        <p className="m-0 p-0 text-sm">#{order.code}</p>
                        <p className="m-0 p-0 font-semibold">Makro PRO</p>
                    </div>
                    <div className='col-5'>
                        <div className="w-full flex flex-column text-left gap-2">
                            {order._items.map((product, index) => (
                                <div key={index} className="cart-items flex justify-content-between align-items-center pb-1 border-bottom-1 surface-border">
                                    <div className="w-full flex align-items-center">
                                        <img
                                            src={product.product_image}
                                            alt={product.product_name}
                                            width={50}
                                            height={50}
                                        />
                                        <div className="flex flex-column ml-3">
                                            <span className="mb-1 font-semibold">{product.product_name}</span>
                                            <span>{product.quantity} หน่วย</span>
                                        </div>
                                    </div>
                                    <div className='w-4 text-right'>
                                        <span className='text-xl'>{Number(product.ppu * product.quantity).toLocaleString('en-US')} ฿</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='col-3 justify-content-center pl-3'>
                        <p className={`w-fit m-0 px-1 py-0 border-round-md surface-border ${orderStatus?.tagCSS}`}>{orderStatus?.value}</p>
                        <p className="mt-2 p-0 text-sm"><i className='pi pi-shopping-cart mr-1'></i>{formatDate(order.createdAt)} น.</p>
                    </div>
                    <div className='col-2'>
                        <p className="m-0 p-0 text-right font-semibold text-primary text-l">{order.net_price?.toLocaleString('en-US')} ฿</p>
                    </div>
                </div>
                {/* responsive */}
                <div className='block md:hidden w-full grid-nogutter bg-white border-1 surface-border border-round-xl py-3 px-2 mt-3 align-items-start'>
                    <div className='w-full pb-2 border-bottom-1 surface-border'>
                        <div className='flex justify-content-between'>
                            <p className="m-0 p-0">#{order.code}</p>
                            <p className={`w-fit m-0 px-1 py-0 border-round-md surface-border ${orderStatus?.tagCSS}`}>{orderStatus?.value}</p>
                        </div>
                        <p className="m-0 p-0 font-semibold">Makro PRO</p>
                    </div>
                    <div className='w-full'>
                        <div className="w-full py-2 flex flex-column text-left gap-2">
                            {order._items.map((product, index) => (
                                <div key={index} className="cart-items flex justify-content-between align-items-center pb-1 border-bottom-1 surface-border">
                                    <div className="w-full flex align-items-center">
                                        <img
                                            src={product.product_image}
                                            alt={product.product_name}
                                            width={50}
                                            height={50}
                                        />
                                        <div className="flex flex-column ml-3">
                                            <span className="mb-1 font-semibold">{product.product_name}</span>
                                            <span>{product.quantity} หน่วย</span>
                                        </div>
                                    </div>
                                    <div className='w-4 text-right'>
                                        <span className='text-xl'>{Number(product.ppu * product.quantity).toLocaleString('en-US')} ฿</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='w-full border-bottom-1 surface-border justify-content-right'>
                        <p className="mt-2 p-0"><i className='pi pi-shopping-cart mr-1'></i>{formatDate(order.createdAt)} น.</p>
                    </div>
                    <div className='w-full text-right'>
                        <p className="m-0 pt-3 text-right font-semibold text-primary text-l">{order.net_price?.toLocaleString('en-US')} ฿</p>
                    </div>
                </div>
            </>
        )
    }

    // const Favorites = () => (<div>รายการโปรด</div>)

    // const PrivacySettings = () => <div>จัดการข้อมูลส่วนบุคคล</div>;

    const renderActiveComponent = () => {
        switch (activeTab) {
            case 'account':
                return <MyAccount />;
            case 'orderHistory':
                return <OrderHistory />;
            // case 'favorites':
            //     return <Favorites />;
            // case 'privacySettings':
            //     return <PrivacySettings />;
            default:
                return <MyAccount />;
        }
    };

    return (
        <>
            <div className="flex my-5 mx-2 lg:mx-8 gap-4">
                <div className="hidden xl:block w-20rem h-fit bg-white border-1 surface-border border-round-xl">
                    <ul className='font-semibold'>
                        {tabs.map((tab) => (
                            <li
                                key={tab.id}
                                className={`list-none py-3 cursor-pointer ${activeTab === tab.id ? 'text-primary' : ''}`}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    if (tab.id === 'contactUs') {
                                        setContactUsVisible(true); // Show ContactUs dialog when clicking
                                    }
                                }}
                            >
                                {tab.label}

                            </li>
                        ))}
                    </ul>
                </div>
                <div className='w-full'>
                    {renderActiveComponent()}
                    <ContactUs visible={isContactUsVisible} setVisible={setContactUsVisible} />
                </div>
            </div>
        </>

    )
}


export default AccountPage