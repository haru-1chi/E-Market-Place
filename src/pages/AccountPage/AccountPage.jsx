import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../router/CartContext';
import { Button } from "primereact/button";
import Footer from "../../component/Footer";
import StatusShippingPage from './StatusShippingPage';
import MyAccount from './MyAccount';
import axios from "axios";
import { formatDate } from '../../utils/DateTimeFormat';
import ContactUs from '../../component/ContactUs';
import img_placeholder from '../../assets/img_placeholder.png';

function AccountPage() {
    const location = useLocation();
    const apiUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;
    const [activeTab, setActiveTab] = useState('account');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isContactUsVisible, setContactUsVisible] = useState(false);
    const apiProductUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;
    const [userOrders, setUserOrders] = useState(null);
    const { statusEvents } = useCart();
    const [activeOrderStatus, setActiveOrderStatus] = useState('all');

    const tabs = [
        { id: 'account', label: 'บัญชีของฉัน' },
        { id: 'orderHistory', label: 'การซื้อของฉัน' },
        { id: 'contactUs', label: 'ติดต่อเรา' },
    ];

    const fetchOrders = async () => {
        const user = localStorage.getItem("user");

        if (user) {
            const parsedUser = JSON.parse(user);
            const user_id = parsedUser._id;
            try {
                const res = await axios.get(`${apiUrl}/orderproduct/bycustomer/${user_id}`);
                setUserOrders(res.data.data);
            } catch (err) {
                console.error("Error fetching user data", err.response?.data || err.message);
            }
        } else {
            console.error("No user found in localStorage");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [apiUrl]);

    const getLatestStatus = (statusDetails) => {
        if (!Array.isArray(statusDetails) || statusDetails.length === 0) return null;
        return statusDetails.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    };

    const statusCounts = (userOrders ?
        userOrders.reduce((counts, order) => {
            const latestStatusDetail = getLatestStatus(order.statusdetail);
            if (!latestStatusDetail) return counts;

            const statusDetails = Object.values(statusEvents).find(status => status.value === latestStatusDetail.status);
            if (statusDetails) {
                counts[statusDetails.key] = (counts[statusDetails.key] || 0) + 1;
            }
            return counts;
        }, {})
        : ""
    );

    const filteredOrders = (activeOrderStatus === 'all'
        ? (Array.isArray(userOrders) ? userOrders : [])
        : (Array.isArray(userOrders) ? userOrders.filter(order => {
            const latestStatusDetail = getLatestStatus(order.statusdetail);
            if (!latestStatusDetail) return false;

            const orderStatus = Object.values(statusEvents).find(status => status.value === latestStatusDetail.status);
            switch (activeOrderStatus) {
                case 'รอชำระเงิน':
                    return orderStatus?.key === statusEvents.Pending?.key;
                case 'กำลังเตรียมจัดส่ง':
                    return orderStatus?.key === statusEvents.Packaged?.key;
                case 'จัดส่งแล้ว':
                    return orderStatus?.key === statusEvents.Delivering?.key;
                case 'รับสินค้าแล้ว':
                    return orderStatus?.key === statusEvents.Received?.key;
                case 'ยกเลิกออเดอร์':
                    return orderStatus?.key === statusEvents.Cancelled?.key;
                default:
                    return true;
            }
        }) : [])
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
        if (location.state?.activeOrderStatus) {
            setActiveOrderStatus(location.state.activeOrderStatus);
        }
    }, [location.state]);

    const handleRevertClick = () => setSelectedOrderId(null);

    const handleReceived = async (order_id, e) => {
        e.stopPropagation();
        try {
            if (!order_id) {
                console.error("Order ID is missing");
                return;
            }

            const response = await axios.put(`${apiUrl}/orderproduct/receive/${order_id}`);
            if (response.status === 200 && response.data && response.data.status) {
                console.log("Order received successfully:", response.data);

                // const updatedStatusDetail = [
                //     ...statusDetails,
                //     { status: statusEvents.Received.value, date: new Date().toISOString() }
                // ];
                
                // setStatusDetails(updatedStatusDetail);

                await fetchOrders();
                
            } else {
                console.log(response.data.message || "Failed to receive the order");
            }
        } catch (error) {
            console.error("Error while receiving the order:", error?.response?.data?.message || error.message);
        }
    };

    const StatusBar = () => (
        <ul className='navmenu w-full flex gap-4 overflow-scroll white-space-nowrap justify-content-between font-semibold p-0 px-4 m-0 text-center'>
            <li className={`py-2 list-none cursor-pointer ${activeOrderStatus === 'all' ? 'border-bottom-3  border-yellow-500 text-yellow-500' : ''}`}
                onClick={() => setActiveOrderStatus('all')}>
                ทั้งหมด {userOrders?.length}
            </li>
            <li className={`py-2 list-none cursor-pointer ${activeOrderStatus === 'รอชำระเงิน' ? 'border-bottom-3  border-yellow-500 text-yellow-500' : ''}`}
                onClick={() => setActiveOrderStatus('รอชำระเงิน')}>
                รอชำระเงิน {statusCounts[statusEvents?.Pending.key] || ''}
            </li>
            <li className={`py-2 list-none cursor-pointer ${activeOrderStatus === 'กำลังเตรียมจัดส่ง' ? 'border-bottom-3  border-yellow-500 text-yellow-500' : ''}`}
                onClick={() => setActiveOrderStatus('กำลังเตรียมจัดส่ง')}>
                กำลังเตรียมจัดส่ง {statusCounts[statusEvents?.Packaged.key] || ''}
            </li>
            <li className={`py-2 list-none cursor-pointer ${activeOrderStatus === 'จัดส่งแล้ว' ? 'border-bottom-3  border-yellow-500 text-yellow-500' : ''}`}
                onClick={() => setActiveOrderStatus('จัดส่งแล้ว')}>
                จัดส่งแล้ว {statusCounts[statusEvents.Delivering.key] || ''}
            </li>
            <li className={`py-2 list-none cursor-pointer ${activeOrderStatus === 'รับสินค้าแล้ว' ? 'border-bottom-3  border-yellow-500 text-yellow-500' : ''}`}
                onClick={() => setActiveOrderStatus('รับสินค้าแล้ว')}>
                รับสินค้าแล้ว {statusCounts[statusEvents.Received.key] || ''}
            </li>
            <li className={`py-2 list-none cursor-pointer ${activeOrderStatus === 'ยกเลิกออเดอร์' ? 'border-bottom-3  border-yellow-500 text-yellow-500' : ''}`}
                onClick={() => setActiveOrderStatus('ยกเลิกออเดอร์')}>
                ยกเลิกออเดอร์ {statusCounts[statusEvents.Cancelled.key] || ''}
            </li>
        </ul>
    );

    const OrderHistory = () => (
        filteredOrders ? filteredOrders.length > 0 ? (
            selectedOrderId ? (
                <div>
                    <div className='flex align-items-center bg-white px-2 py-3' onClick={handleRevertClick}>
                        <i className="pi pi-angle-left" style={{ fontSize: '1.5rem' }}></i>
                        <p className='m-0 ml-3 p-0 text-900'>ย้อนกลับ</p>
                    </div>
                    <StatusShippingPage orderId={selectedOrderId} />
                </div>
            ) : (
                <div className='mb-3'>
                    <div className='section-sortbar bg-white block pt-2'>
                        <h2 className="m-0 p-0 pl-2 font-normal">การซื้อของฉัน</h2>
                        <StatusBar />
                    </div>
                    <div className='mx-2'>
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
                </div>
            )
        ) : (
            <div className='mb-3'>
                <div className='section-sortbar bg-white block pt-2'>
                    <h2 className="m-0 p-0 pl-2 font-normal">การซื้อของฉัน</h2>
                    <StatusBar />
                </div>
                <div className='h-full text-center align-content-center'>
                    {/* <img src="https://www.makro.pro/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FemptyOrders.b84ad154.png&w=300&q=75" alt="" /> */}
                    <p className='m-0'>ยังไม่มีการสั่งซื้อ</p>
                </div>
            </div>
        ) : ("")
    );

    const OrderItem = ({ order }) => {

        const latestStatus = order.statusdetail
            .slice()
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.status || "Unknown Status";
        const latestStatusEvent = Object.values(statusEvents).find(event => event.value === latestStatus);
        const tagCSS = latestStatusEvent?.tagCSS || 'bg-gray-100 border-0 text-gray-700';
        return (
            <>
                <div className='hidden md:block w-full grid-nogutter bg-white border-1 surface-border border-round-xl p-3 mt-3 align-items-start'>
                    <div className='w-full border-bottom-1 surface-border pb-2 mb-2'>
                        <div className='flex justify-content-between'>
                            <Link to={`/ShopPage/${order.partner_id}`} className="no-underline text-900">
                                <div className='flex align-items-center'>
                                    <i className="pi pi-shop"></i>
                                    <p className="m-0 ml-2 p-0 font-semibold">ผู้ขาย: {order.partner_name}</p>
                                </div>
                            </Link>
                            <p className={`w-fit m-0 px-1 py-0 border-round-md ${tagCSS}`}>{latestStatus}</p>
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className="w-full flex flex-column text-left gap-2">
                            {order.product.map((product, index) => (
                                <div key={index} className="cart-items flex justify-content-between align-items-center border-bottom-1 surface-border pb-2">
                                    <div className="w-full flex align-items-start">
                                        <img
                                            src={`${product.product_image ? apiProductUrl + product.product_image : product.product_subimage1 ? apiProductUrl + product.product_subimage1 : product.product_subimage2 ? apiProductUrl + product.product_subimage2 : product.product_subimage3 ? apiProductUrl + product.product_subimage3 : img_placeholder}`}
                                            alt={product.product_name}
                                            width={90}
                                            height={90}
                                            className='border-1 border-round-lg surface-border'
                                            onError={(e) => { e.target.src = img_placeholder; }}
                                        />
                                        <div className="flex flex-column ml-3">
                                            <span className="mb-1 font-semibold">{product.product_name}</span>
                                            <span>x{product.product_qty}</span>
                                        </div>
                                    </div>
                                    <div className='w-4 text-right'>
                                        <span className='text-xl'>฿{Number(product.product_price * product.product_qty).toLocaleString('en-US')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='w-full flex justify-content-end'>
                        <p className="mt-2 p-0 text-sm"><i className='pi pi-shopping-cart mr-1'></i>วันที่สั่งซื้อ: {formatDate(order.createdAt)} น.</p>
                    </div>
                    <div className="flex align-items-center justify-content-end pb-2 mt-2 md:mt-0">
                        <p className="m-0 p-0 mr-2">รวมค่าสินค้าทั้งหมด:</p>
                        <p className="m-0 p-0 pr-2 font-semibold text-900">฿{order.totalproduct?.toLocaleString('en-US')}</p>
                    </div>
                    <div className="flex align-items-center justify-content-end pb-2 mt-2 md:mt-0">
                        <p className="m-0 p-0 mr-2">รวมค่าส่งทั้งหมด:</p>
                        <p className="m-0 p-0 pr-2 font-semibold text-900">฿{order.totaldeliveryPrice?.toLocaleString('en-US')}</p>
                    </div>
                    <div className="flex align-items-center justify-content-end pb-2 mt-2 md:mt-0">
                        <p className="m-0 p-0 mr-2">รวมคำสั่งซื้อ:</p>
                        <p className="m-0 p-0 pr-2 font-semibold text-900">฿{order.alltotal?.toLocaleString('en-US')}</p>
                    </div>
                    <div className='w-full flex justify-content-end'>
                        {latestStatus === 'จัดส่งแล้ว' ? <Button label='ฉันได้รับสินค้าแล้ว' onClick={(e) => handleReceived(order?._id, e)} /> : ("")}
                    </div>
                </div>
                {/* responsive */}
                <div className='block md:hidden w-full grid-nogutter bg-white border-1 surface-border border-round-xl p-3 mt-3 align-items-start'>
                    <div className='w-full pb-2'>
                        <div className='flex justify-content-between'>
                            <Link to={`/ShopPage/${order.partner_id}`} className="no-underline text-900">
                                <div className='flex align-items-center'>
                                    <i className="pi pi-shop"></i>
                                    <p className="m-0 ml-2 p-0">ผู้ขาย: {order.partner_name}</p>
                                </div>
                            </Link>
                            <p className={`w-fit m-0 px-1 py-0 border-round-md ${tagCSS}`}>{latestStatus}</p>
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className="w-full py-2 flex flex-column text-left gap-2">
                            {order.product.map((product, index) => (
                                <div key={index} className="cart-items flex justify-content-between align-items-center pb-1">
                                    <div className="w-full flex">
                                        <img
                                            src={`${product.product_image ? apiProductUrl + product.product_image : product.product_subimage1 ? apiProductUrl + product.product_subimage1 : product.product_subimage2 ? apiProductUrl + product.product_subimage2 : product.product_subimage3 ? apiProductUrl + product.product_subimage3 : img_placeholder}`}
                                            alt={product.product_name}
                                            width={90}
                                            height={90}
                                            className='border-1 border-round-lg surface-border'
                                            onError={(e) => { e.target.src = img_placeholder; }}
                                        />
                                        <div className='w-full flex flex-column justify-content-between ml-3'>
                                            <div className="flex flex-column">
                                                <span className="max-w-17rem font-semibold text-sm  white-space-nowrap overflow-hidden text-overflow-ellipsis">{product.product_name}</span>
                                                <span className='p-0 m-0 font-thin text-sm text-right text-400'>x{product.product_qty}</span>
                                            </div>
                                            <span className='text-ml text-right font-semibold'>฿{Number(product.product_price * product.product_qty).toLocaleString('en-US')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='w-full flex justify-content-end align-items-center'>
                        <p className="m-0 p-0 text-right">สินค้ารวม {order?.product?.length} รายการ: </p>
                        <p className="m-0 ml-1 p-0 text-right font-semibold">฿{order.totalproduct?.toLocaleString('en-US')}</p>
                    </div>
                    <div className='w-full flex justify-content-end align-items-center'>
                        <p className="my-1 p-0 text-right text-900 text-l">รวมค่าส่งทั้งหมด:</p>
                        <p className="m-0 ml-1 p-0 text-right font-semibold">฿{order.totaldeliveryPrice?.toLocaleString('en-US')}</p>
                    </div>
                    <div className='w-full flex justify-content-end align-items-center'>
                        <p className="my-1 p-0 text-right text-900 text-l">รวมการสั่งซื้อ:</p>
                        <p className="m-0 ml-1 p-0 text-right font-semibold">฿{order.alltotal?.toLocaleString('en-US')}</p>
                    </div>
                    <div className='w-full flex justify-content-end'>
                        {latestStatus === 'จัดส่งแล้ว' ? <Button label='ฉันได้รับสินค้าแล้ว' onClick={(e) => handleReceived(order?._id, e)}/> : ("")}
                    </div>
                    {/* <div className='w-full text-right'>
                        <p className="m-0 pt-3 text-right font-semibold text-primary text-l">{order.net_price?.toLocaleString('en-US')} ฿</p>
                    </div> */}
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
            default:
                return <MyAccount />;
        }
    };

    return (
        <div className="min-h-screen flex flex-column justify-content-between">
            <div className="flex flex-grow lg:mx-8 gap-4">
                <div className="hidden xl:block w-20rem h-fit bg-white border-1 surface-border border-round-xl mt-4">
                    <ul className='font-semibold'>
                        {tabs.map((tab) => (
                            <li
                                key={tab.id}
                                className={`list-none py-3 cursor-pointer ${activeTab === tab.id ? 'text-yellow-500' : ''}`}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    if (tab.id === 'contactUs') {
                                        setContactUsVisible(true);
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
            <Footer />
        </div>

    )
}


export default AccountPage