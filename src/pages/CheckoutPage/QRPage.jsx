import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Button } from "primereact/button";
import { useCart } from '../../router/CartContext';
import { useNavigate } from "react-router-dom";
import { convertTHBtoLAK } from '../../utils/DateTimeFormat';
import { ProgressSpinner } from 'primereact/progressspinner';

const EXPIRE_TIME = 60;

function QRPage() {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;
    const { cart, cartDetails, selectedItemsCart, clearCart, clearCartDetails } = useCart();
    const navigate = useNavigate();

    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [paymentCode, setPaymentCode] = useState('');
    const [expireTime, setExpireTime] = useState(EXPIRE_TIME);
    const [remainingTime, setRemainingTime] = useState(EXPIRE_TIME);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const totalPayable = cartDetails.amountPayment;
    const paymentUUID = "BCELBANK";

    useEffect(() => {
        let pollingInterval;
        let expirationTimeout;

        async function fetchQrCode() {
            try {
                setLoading(true);
                const response = await axios.post(`${apiUrl}/payment/qrcode`, {
                    amount: totalPayable,
                    description: 'user123',
                });
                const result = response.data;
                setQrCodeUrl(result.qrCodeUrl);
                setPaymentCode(result.data.transactionid);

                const newExpireTime = result.data.expiretime || EXPIRE_TIME;
                setExpireTime(newExpireTime);
                setRemainingTime(newExpireTime);

                startPolling();

                expirationTimeout = setTimeout(() => {
                    fetchQrCode();
                }, expireTime * 1000);

            } catch (error) {
                console.error('Error generating QR code:', error);
                setError('Failed to generate QR code. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        function startPolling() {
            if (pollingInterval) clearInterval(pollingInterval);

            pollingInterval = setInterval(async () => {
                try {
                    const response = await axios.post(`${apiUrl}/payment/subscription`, {
                        uuid: paymentUUID,
                        tid: "001",
                        shopcode: "12345678"
                    });

                    const data = response.data;
                    if (response.status === 200 && data.message === 'SUCCESS') {
                        setPaymentStatus(data.message);
                        handleCreateOrder();
                        clearInterval(pollingInterval);
                        clearTimeout(expirationTimeout);
                    } else {
                        console.log(data.message);
                    }
                } catch (error) {
                    console.error('Error checking payment status:', error);
                }
            }, 5000);
        }

        fetchQrCode();

        return () => {
            clearInterval(pollingInterval);
            clearTimeout(expirationTimeout);
        };
    }, [totalPayable, apiUrl]);

    useEffect(() => {
        if (remainingTime > 0) {
            const timerId = setInterval(() => {
                setRemainingTime(prevTime => prevTime - 1);
            }, 1000);

            return () => clearInterval(timerId);
        }
    }, [remainingTime]);

    const handleCreateOrder = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("User not authenticated. Please log in.");
                return;
            }

            for (let partnerId in selectedItemsCart) {
                const partner = selectedItemsCart[partnerId]; // This is each partner's data
                const productsToPurchase = partner.products.map(product => ({
                    product_id: product.product_id,
                    product_qty: product.product_qty
                }));

                // Construct order data for each partner
                const newOrder = {
                    partner_id: partner.partner_id,
                    product: productsToPurchase,
                    customer_id: cartDetails.customer_id, // Use actual customer details from cartDetails
                    totalproduct: productsToPurchase.reduce((total, item) => {
                        const product = partner.products.find(p => p.product_id === item.product_id);
                        return total + product.product_price * item.product_qty;
                    }, 0),
                    totaldiscount: 0, // Assuming no discount for now
                    alltotal: productsToPurchase.reduce((total, item) => {
                        const product = partner.products.find(p => p.product_id === item.product_id);
                        return total + product.product_price * item.product_qty;
                    }, 0),
                    payment: cartDetails.payment, // Assuming you get this from cartDetails
                    status: cartDetails.paymentChannel === "bankCounter" ? 1 : 2, // Set status based on payment
                };

                console.log(newOrder);

                // Send POST request for each partner
                const response = await axios.post(`${apiUrl}/orderproduct`, newOrder, {
                    headers: { "token": token }
                });

                if (response.data && response.data.status) {
                    console.log("Order successful for partner:", partner.partner_name, response.data);
                } else {
                    setError(response.data.message || "Order failed");
                    break; // If one fails, you may want to stop further submissions
                }
            }

            // const newOrder = {
            //     _items: cart,
            //     line_items: cart,
            //     ...cartDetails,
            //     status: cartDetails.paymentChannel === "bankCounter" ? 1 : 2,
            // };

            // console.log(newOrder)
            // const response = await axios.post(`${apiUrl}/orders`,
            //     newOrder,
            //     {
            //         headers: { "token": token }
            //     })
            // if (response.data && response.data.status) {
            //     console.log("Order successful", response.data);
            //     clearCart();
            //     clearCartDetails();
            //     navigate("/PaymentSuccessfully");
            // } else {
            //     setError(response.data.message || "Order failed");
            // }

            clearCart();
            clearCartDetails();
            navigate("/PaymentSuccessfully");
        } catch (error) {
            console.error("Order error:", error.response?.data || error.message);
            setError(error.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderPaymentDetails = () => (
        <>
            <div className="flex justify-content-center">
                {qrCodeUrl && (
                    <div>
                        <p className="m-0 p-0 text-center">Qr Code</p>
                        <img
                            src={qrCodeUrl}
                            alt="QR Code for payment"
                            width={150}
                            height={150}
                        />
                    </div>
                )}
            </div>
            <div className="flex">
                <div className="block flex-grow-1 flex flex-column text-center">
                    <p className="m-0">Amount (LAK)</p>
                    {totalPayable && (
                        <p className="my-3 text-2xl font-bold">
                            {Number(totalPayable.toFixed(2)).toLocaleString('en-US')}
                        </p>
                    )}
                    <p className="m-0">เลขที่รายการ {paymentCode}</p>
                    {qrCodeUrl && (
                        <div className="p-0 my-2 surface-200 border-round flex justify-content-center align-content-center">
                            <p className="my-3">ชำระเงินภายใน {remainingTime} seconds</p>
                        </div>
                    )}
                </div>
            </div>
            <p className="text-center">*กรุณาเปิดหน้านี้ไว้ จนกว่าชำระเงินนี้สำเร็จ</p>
        </>
    )

    const renderBankDetails = () => (
        <>
            <div className="flex mt-3">
                <div className="w-full flex flex-column justify-content-center gap-2 border-right-1 surface-border overflow-hidden text-overflow-ellipsis">
                    <p className="m-0 text-center">ธนาคาร: ไทยพานิชย์</p>
                    <p className="m-0 text-center">ชื่อบัญชี: บริษัท</p>
                    <p className="m-0 text-center">เลขบัญชี: 000-000000-0 (หรือรหัสอ้างอิง)</p>

                </div>
                <div className="w-full block flex-grow-1 flex flex-column text-center">
                    <p className="m-0">Amount (LAK)</p>
                    {totalPayable && (
                        <p className="my-3 text-2xl font-bold">
                            {Number(totalPayable.toFixed(2)).toLocaleString('en-US')}
                        </p>
                    )}

                </div>
            </div>
            <div className="my-5">
                <p className="text-center m-0">กรุณาแจ้งการโอนเงินภายใน 2 วัน</p>
                <p className="text-center m-0">เพื่อยืนยันคำสั่งซื้อของคุณ</p>
            </div>
        </>
    )


    return (
        <>
            <div className='w-full px-2 sm:px-2 lg:px-8 pt-5 flex justify-content-center'>
                <div className='flex flex-column border-1 surface-border border-round py-5 px-3 bg-white border-round-mb '>
                    <h1 className="m-0 p-0">MakroLao</h1>

                    {cartDetails.paymentChannel === 'QRCode' ? (
                        loading ? (
                            <ProgressSpinner />
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            renderPaymentDetails()
                        )
                    ) : (
                        renderBankDetails()
                    )}

                    <div className="flex align-items-center justify-content-center">
                        <Button label="Return to Merchant" size="small" rounded onClick={handleCreateOrder} />
                    </div>
                </div>
            </div>
        </>

    )
}

export default QRPage