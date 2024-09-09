import React from "react";
import { useCart } from '../../router/CartContext';
import { useNavigate, Link } from "react-router-dom";
import { Button } from "primereact/button";

function PaymentPage() {
    const { cartDetails, placeCartDetail } = useCart();
    const navigate = useNavigate();
    const totalPayable = cartDetails.amountPayment;

    const handleConfirmPayment = (payment) => {
        const orderDetails = {
            ...cartDetails,
            payment
        };
        placeCartDetail(orderDetails);
        navigate("/QRPage");
    };

    return (
        <>
            <h2 className="flex justify-content-center px-8 font-semibold">เลือกช่องทางชำระเงิน</h2>
            <div className='w-full px-8 flex justify-content-center'>
                <div className="bg-section-product flex flex-column gap-2 border-1 surface-border border-round py-3 px-3 bg-white border-round-mb">
                    <Link to="/QRPage" className="no-underline text-900" >
                        <div className="border-1 surface-border border-round p-2 flex align-items-center justify-content-between" onClick={() => handleConfirmPayment('QRCode')}>
                            <div className="flex align-items-center">
                                <i className="pi pi-mobile text-2xl mr-3"></i>
                                <div>
                                    <p className='m-0 font-bold'>OnePay</p>
                                    <p className='m-0 text-sm'>*เติมเงินกับ OnePay ให้เพียงพอต่อการใช้จ่าย</p>
                                </div>
                            </div>
                            <i className="pi pi-angle-right text-2xl text-right"></i>
                        </div>
                    </Link>
                    <Link to="/QRPage" className="no-underline text-900" >
                        <div className="border-1 surface-border border-round p-2 flex align-items-center justify-content-between" onClick={() => handleConfirmPayment('บัญชีธนาคาร')}>
                            <div className="flex align-items-center">
                                <i className="pi pi-building-columns text-2xl mr-3"></i>
                                <div>
                                    <p className='m-0 font-bold'>โอนชำระผ่านธนาคาร</p>
                                    <p className='m-0 text-sm'>ชำระผ่านรหัสอ้างอิงที่เคาน์เตอร์ธนาคาร</p>
                                </div>
                            </div>
                            <i className="pi pi-angle-right text-2xl text-right"></i>
                        </div>
                    </Link>
                    <div className="mt-3 flex flex-column">
                        <p className='m-0'>ยอด</p>
                        {totalPayable ? (<p className='m-0 font-bold text-xl'>{Number(totalPayable.toFixed(2)).toLocaleString('en-US')} ₭</p>) : ("")}
                    </div>
                </div>
            </div>
        </>

    )
}

export default PaymentPage