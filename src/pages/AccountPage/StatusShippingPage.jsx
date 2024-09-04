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

function StatusShippingPage({ orderId }) {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const [order, setOrder] = useState(null);
    const [user, setUser] = useState(null);

    const { statusEvents } = useCart();
    const toast = useRef(null);

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const user_id = localStorage.getItem("user_id");
                const res = await axios.get(`${apiUrl}/users/${user_id}`, {
                    headers: {
                        token: token,
                    },
                });
                setUser(res.data.data);
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
                const token = localStorage.getItem("token");
                const response = await axios.get(`${apiUrl}/orders/${orderId}`, {
                    headers: { token: token },
                });

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

    const currentStatus = order
        ? Object.values(statusEvents).find((status) => status.key === order.status)
        : null;

    return (
        <>
            <div className="w-full pt-3 flex flex-column gap-2 justify-content-center">
                <Toast ref={toast}></Toast>
                <TimelineStatus
                    order={order}
                    currentStatus={currentStatus}
                    user={user}
                />

                {order?.paymentChannel === "bankCounter" ? <SlipPayment /> : ""}

                <div className="bg-section-product flex flex-column border-1 surface-border border-round py-2 px-2 bg-white border-round-mb justify-content-center">
                    <div className="p-2 lg:flex justify-content-between">
                        <div>
                            <p className="m-0 p-0 text-xl font-semibold">
                                ผู้ขาย: Makro สาขาหนองคาย
                            </p>
                            <p className="m-0 p-0">{order?._items?.length} รายการ</p>
                        </div>
                        <Button
                            label="เพิ่มสินค้าทั้งหมดลงตะกร้า"
                            outlined
                            rounded
                            className="w-full lg:w-fit"
                        />
                    </div>
                    <div className="surface-200">
                        <p className="p-0 my-2 mx-3 font-semibold">
                            {currentStatus?.value}
                        </p>
                    </div>
                    <div className="flex flex-column mx-5">
                        {order?._items?.map((product, index) => (
                            <div
                                key={index}
                                className="cart-items flex justify-content-between align-items-center py-2 border-bottom-1 surface-border"
                            >
                                <div className="w-full flex align-items-center">
                                    <img
                                        src={product.product_image}
                                        alt={product.product_name}
                                        width={60}
                                        height={60}
                                    />
                                    <div className="flex flex-column ml-4">
                                        <span className="mb-1 font-semibold">
                                            {product.product_name}
                                        </span>
                                        <span>{product.quantity} หน่วย</span>
                                    </div>
                                </div>
                                <div className="w-4 text-right">
                                    <span className="text-xl font-medium">
                                        {product.ppu * product.quantity} ฿
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-section-product flex flex-column border-1 surface-border border-round py-3 px-3 bg-white border-round-mb justify-content-center">
                    <div className="xl:flex lg:flex">
                        <div className="w-full mb-3">
                            <h3 className="m-0 mb-2 p-0 font-semibold">ข้อมูลการชำระเงิน</h3>
                            <p className="m-0 p-0">
                                ช่องทางการชำระเงิน:{" "}
                                {order?.paymentChannel === "bankCounter"
                                    ? "ชำระเงินผ่านเคาท์เตอร์ธนาคาร"
                                    : "ชำระเงินผ่าน OnePay"}
                            </p>
                            <p className="m-0 p-0">สถานะ: {currentStatus?.value}</p>
                            <p className="m-0 p-0">
                                วันที่: {formatDate(order?.updatedAt)} น.
                            </p>
                        </div>
                        <div className="w-full flex flex-column bg-white border-round-mb justify-content-center pt-3 lg:pt-0 border-top-1 lg:border-none surface-border">
                            <h3 className="m-0 mb-2 p-0 font-semibold">สรุปคำสั่งซื้อ</h3>
                            <div className="flex align-items-center justify-content-between py-2">
                                <p className="m-0 p-0">ยอดรวม</p>
                                <p className="m-0 p-0 pr-2 font-semibold">
                                    {order?.items_price?.toFixed(2)} ฿
                                </p>
                            </div>
                            <div className="flex align-items-center justify-content-between py-2">
                                <p className="m-0 p-0">ค่า COD 3%</p>
                                <p className="m-0 p-0 pr-2 font-semibold">
                                    {order?.cod_price?.toFixed(2)} ฿
                                </p>
                            </div>
                            <div className="flex align-items-center justify-content-between border-top-1 surface-border py-2">
                                <p className="m-0 p-0">ราคารวม</p>
                                <p className="m-0 p-0 pr-2 font-semibold text-primary">
                                    {order?.net_price?.toFixed(2)} ฿
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
