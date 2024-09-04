import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";

function PaymentSuccessfully() {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/AccountPage", { state: { activeTab: 'orderHistory' } });
    };
    return (
        <>
            <div className='w-full px-5 pt-5 flex justify-content-center'>
                <div className='bg-section-product flex flex-column border-1 surface-border border-round py-3 px-3 bg-white border-round-mb justify-content-center'>
                    <h2 className="m-0 p-0 font-semibold">ทำการสั่งซื้อ</h2>
                    <div className="flex justify-content-center">
                        <img
                            src="https://www.makro.pro/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fempty-basket.76c5ec1f.png&w=1200&q=75"
                            alt=""
                            className="w-7"
                        />
                    </div>
                    <h2 className="text-center font-semibold my-2">การสั่งซื้อสำเร็จแล้ว!</h2>
                    <p className="text-center my-2">เราจะจัดเตรียมรายการสินค้าของคุณและจัดส่งอย่างตรงเวลา!</p>
                    <div className="flex align-items-center justify-content-center mt-5">
                        <Button
                            className="w-12rem"
                            label="ดูรายการสั่งซื้อ"
                            size="small"
                            rounded
                            onClick={handleNavigate} />
                    </div>
                    <div className="flex align-items-center justify-content-center mt-3">
                        <Link to="/"><Button className="w-12rem" label="เลือกสินค้าเพิ่มเติม" size="small" rounded outlined/></Link>
                    </div>

                </div>

            </div>
        </>

    )
}


export default PaymentSuccessfully