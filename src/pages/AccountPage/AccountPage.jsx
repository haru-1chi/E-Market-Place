import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../router/CartContext';
import { Button } from "primereact/button";
import StatusShippingPage from './StatusShippingPage';
import MyAccount from './MyAccount';
import axios from "axios";
import { formatDate } from '../../utils/DateTimeFormat';
import ContactUs from '../../component/ContactUs';
import img_placeholder from '../../assets/img_placeholder.png';

function AccountPage() {
    const location = useLocation();
    const apiUrl = import.meta.env.VITE_REACT_APP_API_PLATFORM;
    const [activeTab, setActiveTab] = useState('account');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isContactUsVisible, setContactUsVisible] = useState(false);
    const apiProductUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;
    const [userOrders, setUserOrders] = useState(null);
    const { statusEvents } = useCart();
    const [activeOrderStatus, setActiveOrderStatus] = useState('all');

    const tabs = [
        { id: 'account', label: 'บัญชีของฉัน' },
        { id: 'orderHistory', label: 'ประวัติการสั่งซื้อ' },
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
                    return orderStatus?.key === statusEvents.Delivering?.key;
                case 'ถึงจุดรับสินค้าแล้ว':
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
        <ul className='navmenu w-full flex gap-4 overflow-scroll white-space-nowrap justify-content-between font-semibold p-0 pl-4 m-0 text-center'>
            <li className={`py-2 list-none cursor-pointer ${activeOrderStatus === 'all' ? 'border-bottom-3  border-yellow-500 text-yellow-500' : ''}`}
                onClick={() => setActiveOrderStatus('all')}>
                ทั้งหมด {userOrders?.length}
            </li>
            <li className={`py-2 list-none cursor-pointer ${activeOrderStatus === 'ต้องชำระเงิน' ? 'border-bottom-3  border-yellow-500 text-yellow-500' : ''}`}
                onClick={() => setActiveOrderStatus('ต้องชำระเงิน')}>
                ต้องชำระเงิน {statusCounts[statusEvents?.PendingPayment.key] || ''}
            </li>
            <li className={`py-2 list-none cursor-pointer ${activeOrderStatus === 'กำลังจัดเตรียม' ? 'border-bottom-3  border-yellow-500 text-yellow-500' : ''}`}
                onClick={() => setActiveOrderStatus('กำลังจัดเตรียม')}>
                กำลังจัดเตรียม {statusCounts[statusEvents.Preparing.key] || ''}
            </li>
            <li className={`py-2 list-none cursor-pointer ${activeOrderStatus === 'กำลังแพ็คสินค้า' ? 'border-bottom-3  border-yellow-500 text-yellow-500' : ''}`}
                onClick={() => setActiveOrderStatus('กำลังแพ็คสินค้า')}>
                กำลังแพ็คสินค้า {statusCounts[statusEvents.Packaged.key] || ''}
            </li>
            <li className={`py-2 list-none cursor-pointer ${activeOrderStatus === 'กำลังจัดส่ง' ? 'border-bottom-3  border-yellow-500 text-yellow-500' : ''}`}
                onClick={() => setActiveOrderStatus('กำลังจัดส่ง')}>
                กำลังจัดส่ง {statusCounts[statusEvents.Delivering.key] || ''}
            </li>
            <li className={`py-2 list-none cursor-pointer ${activeOrderStatus === 'ถึงจุดรับสินค้าแล้ว' ? 'border-bottom-3  border-yellow-500 text-yellow-500' : ''}`}
                onClick={() => setActiveOrderStatus('ถึงจุดรับสินค้าแล้ว')}>
                ถึงจุดรับสินค้าแล้ว {statusCounts[statusEvents.Arrival.key] || ''}
            </li>
            <li className={`py-2 list-none cursor-pointer ${activeOrderStatus === 'รับสินค้าสำเร็จ' ? 'border-bottom-3  border-yellow-500 text-yellow-500' : ''}`}
                onClick={() => setActiveOrderStatus('รับสินค้าสำเร็จ')}>
                รับสินค้าสำเร็จ {statusCounts[statusEvents.Received.key] || ''}
            </li>
            <li className={`py-2 list-none cursor-pointer ${activeOrderStatus === 'ถูกยกเลิก' ? 'border-bottom-3  border-yellow-500 text-yellow-500' : ''}`}
                onClick={() => setActiveOrderStatus('ถูกยกเลิก')}>
                ถูกยกเลิก {statusCounts[statusEvents.Cancelled.key] || ''}
            </li>
        </ul>
    );

    const OrderHistory = () => (
        filteredOrders ? filteredOrders.length > 0 ? (
            selectedOrderId ? (
                <div>
                    <div className='flex align-items-center bg-white px-2 py-3' onClick={handleRevertClick}>
                        <i className="pi pi-angle-left" style={{ fontSize: '1.5rem' }}></i>
                        <p className='m-0 ml-3 p-0 text-900'>รายละเอียดคำสั่งซื้อ</p>
                    </div>
                    <StatusShippingPage orderId={selectedOrderId} />
                </div>
            ) : (
                <div>
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
            <div>
                <div className='section-sortbar bg-white block pt-2'>
                    <h2 className="m-0 p-0 pl-2 font-normal">การซื้อของฉัน</h2>
                    <StatusBar />
                </div>
                <div className='h-full text-center align-content-center'>
                    <img src="https://www.makro.pro/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FemptyOrders.b84ad154.png&w=300&q=75" alt="" />
                    <p className='m-0'>ยังไม่มีการสั่งซื้อ</p>
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
                                            src={`${product.product_image ? apiProductUrl + product.product_image : product.product_subimage1 ? apiProductUrl + product.product_subimage1 : product.product_subimage2 ? apiProductUrl + product.product_subimage2 : product.product_subimage3 ? apiProductUrl + product.product_subimage3 : img_placeholder}`}
                                            alt={product.product_name}
                                            width={50}
                                            height={50}
                                        />
                                        <div className="flex flex-column ml-3">
                                            <span className="mb-1 font-semibold">{product.product_name}</span>
                                            <span>{product.product_qty} หน่วย</span>
                                        </div>
                                    </div>
                                    <div className='w-4 text-right'>
                                        <span className='text-xl'>{Number(product.ppu * product.product_qty).toLocaleString('en-US')} ฿</span>
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
                <div className='block md:hidden w-full grid-nogutter bg-white border-1 surface-border border-round-xl p-3 mt-3 align-items-start'>
                    <div className='w-full pb-2'>
                        <div className='flex justify-content-between'>
                            <div className='flex align-items-center'>
                                <i className="pi pi-shop"></i>
                                <p className="m-0 ml-2 p-0">ชื่อร้านค้า</p>
                            </div>
                            <p className={`w-fit m-0 px-1 py-0 border-round-md surface-border ${orderStatus?.tagCSS}`}>{orderStatus?.value}</p>
                        </div>

                    </div>
                    <div className='w-full'>
                        <div className="w-full py-2 flex flex-column text-left gap-2">
                            {order._items.map((product, index) => (
                                <div key={index} className="cart-items flex justify-content-between align-items-center pb-1">
                                    <div className="w-full flex">
                                        <img
                                            src={`${product.product_image ? apiProductUrl + product.product_image : product.product_subimage1 ? apiProductUrl + product.product_subimage1 : product.product_subimage2 ? apiProductUrl + product.product_subimage2 : product.product_subimage3 ? apiProductUrl + product.product_subimage3 : img_placeholder}`}
                                            alt={product.product_name}
                                            width={90}
                                            height={90}
                                            className='border-1 border-round-lg surface-border'
                                        />
                                        <div className='w-full flex flex-column justify-content-between ml-3'>
                                            <div className="flex flex-column">
                                                <span className="max-w-17rem font-semibold text-sm  white-space-nowrap overflow-hidden text-overflow-ellipsis">{product.product_name}</span>
                                                <span className='p-0 m-0 font-thin text-sm text-right text-400'>x{product.product_qty}</span>
                                            </div>
                                            <span className='text-ml text-right font-semibold'>฿{Number(product.ppu * product.product_qty).toLocaleString('en-US')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='w-full flex justify-content-end'>
                        <p className="m-0 p-0 text-right">สินค้ารวม {order?._items?.length} รายการ: </p>
                        <p className="m-0 ml-1 p-0 text-right font-semibold">฿{order.net_price?.toLocaleString('en-US')}</p>
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
            <div className="flex lg:mx-8 gap-4">
                <div className="hidden xl:block w-20rem h-fit bg-white border-1 surface-border border-round-xl">
                    <ul className='font-semibold'>
                        {tabs.map((tab) => (
                            <li
                                key={tab.id}
                                className={`list-none py-3 cursor-pointer ${activeTab === tab.id ? 'text-primary' : ''}`}
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
        </>

    )
}


export default AccountPage