import React, { useState, useRef, useEffect } from "react";
import { useCart } from "../../router/CartContext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from "axios";
import {
    formatDate,
    convertTHBtoLAK,
    formatLaosPhone,
} from "../../utils/DateTimeFormat";
import TimelineStatus from "../../component/TimelineStatus";
import SlipPayment from "../../component/SlipPayment";
import img_placeholder from '../../assets/img_placeholder.png';

function StatusShippingPage({ orderId }) {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;
    const apiProductUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;
    const [order, setOrder] = useState(null);
    const [user, setUser] = useState(null);

    const { statusEvents } = useCart();
    const toast = useRef(null);

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
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`${apiUrl}/orderproduct/byid/${orderId}`);
                if (response.data.status && response.data.data) {
                    setOrder(response.data.data);
                } else {
                    console.error("Order failed:", error.response?.data || error.message);
                }
            } catch (error) {
                console.error(
                    "Order error:",
                    error.response?.data?.message || error.message
                );
            }
        };

        fetchOrder();
    }, [apiUrl, orderId]);

    const currentStatus = order?.statusdetail
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || "ไม่ทราบสถานะ";

    return (
        <>
            <div className="w-full p-2 flex flex-column gap-2 justify-content-center">
                <Toast ref={toast}></Toast>
                <TimelineStatus
                    order={order}
                    currentStatus={currentStatus}
                    user={user}
                />

                {order?.payment === "บัญชีธนาคาร" ? "" : <SlipPayment />}

                <div className="bg-section-product flex flex-column border-1 surface-border border-round p-2 bg-white border-round-mb justify-content-center">
                    <div className="p-2 flex align-items-center">
                        <p className="m-0 mr-2 p-0 text-lg font-semibold">ผู้ขาย: {order?.partner_name}</p>
                        <i className="pi pi-angle-right" style={{ fontSize: '1rem', color: "gray" }}></i>
                    </div>
                    <div className="flex flex-column mx-1 my-2 gap-2 border-bottom-1 surface-border pb-2">
                        {order?.product?.map((product, index) => (
                            <div
                                key={index}
                                className="cart-items flex justify-content-between n align-items-center pb-1"
                            >
                                <div className="w-full flex">
                                    <img
                                        src={`${product.product_image ? apiProductUrl + product.product_image : product.product_subimage1 ? apiProductUrl + product.product_subimage1 : product.product_subimage2 ? apiProductUrl + product.product_subimage2 : product.product_subimage3 ? apiProductUrl + product.product_subimage3 : img_placeholder}`}
                                        alt={product.product_name}
                                        width={90}
                                        height={90}
                                        className="border-round-lg border-1 surface-border"
                                    />
                                    <div className='w-full flex flex-column justify-content-between ml-3 white-space-nowrap overflow-hidden text-overflow-ellipsis'>
                                        <div className="flex flex-column">
                                            <span className="font-semibold text-sm">{product.product_name}</span>
                                            <span className='p-0 m-0 font-thin text-sm text-right text-400'>x{product.product_qty}</span>
                                        </div>
                                        <span className='text-ml text-right font-semibold'>฿{Number(product.product_price * product.product_qty).toLocaleString('en-US')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex align-items-center justify-content-end pt-3 pb-2">
                        <p className="m-0 p-0 mr-2">รวมคำสั่งซื้อ:</p>
                        <p className="m-0 p-0 pr-2 font-semibold text-900">
                            ฿{order?.totalproduct?.toFixed(2)}
                        </p>
                    </div>
                </div>
                <div className="bg-section-product flex flex-column border-1 surface-border border-round py-3 px-3 bg-white border-round-mb justify-content-center">
                    <div className="xl:flex lg:flex">
                        <div className="w-full mb-3">
                            <h3 className="m-0 mb-2 p-0 font-semibold">ข้อมูลการชำระเงิน</h3>
                            <p className="m-0 p-0">
                                ช่องทางการชำระเงิน:{" "}
                                {order?.payment === "บัญชีธนาคาร"
                                    ? "โอนชำระผ่านธนาคาร"
                                    : "ชำระเงินผ่าน E-wallet"}
                            </p>
                            <p className="m-0 p-0">สถานะ: {currentStatus?.status}</p>
                            <p className="m-0 p-0">
                                วันที่: {formatDate(order?.updatedAt)} น.
                            </p>
                        </div>
                        <div className="w-full flex flex-column bg-white border-round-mb justify-content-center pt-3 lg:pt-0 border-top-1 lg:border-none surface-border">
                            <h3 className="m-0 mb-2 p-0 font-semibold">สรุปคำสั่งซื้อ</h3>
                            <div className="flex align-items-center justify-content-between py-2">
                                <p className="m-0 p-0">ราคารวม</p>
                                <p className="m-0 p-0 pr-2 font-semibold text-primary">
                                    ฿{order?.totalproduct?.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="hidden">
                        <div className="border-round surface-100 flex justify-content-center align-items-center">
                            <i className="pi pi-mobile mr-2 text-primary"></i>
                            <p className="text-center">
                                หากมีคำถามหรือข้อสงสัยเกี่ยวกับคำสั่งซื้อ
                                ติดต่อฝ่ายบริการลูกค้าผ่านไลน์ @makropro หรือโทร 1432
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default StatusShippingPage;
