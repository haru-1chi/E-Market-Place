import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Image } from 'primereact/image';
import { useCart } from '../../router/CartContext';
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from 'primereact/progressspinner';
import Logo from '../../assets/tossaganLogo.png';
import KBANK from '../../assets/KPULS1_0_0.png';

const EXPIRE_TIME = 60;

function QRPage() {
    const apiUrlPlatform = import.meta.env.VITE_REACT_APP_API_PLATFORM;
    const apiUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;
    const { cart, cartDetails, selectedItemsCart, clearCart, clearCartDetails, clearSelectedItemsCart } = useCart();
    const navigate = useNavigate();

    const [productSubImage1, setProductSubImage1] = useState(null);
    const [productSubImage1Preview, setProductSubImage1Preview] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [paymentCode, setPaymentCode] = useState('');
    const [expireTime, setExpireTime] = useState(EXPIRE_TIME);
    const [remainingTime, setRemainingTime] = useState(EXPIRE_TIME);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const totalPayable = cartDetails.amountPayment;
    const paymentUUID = "BCELBANK";
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.post(`${apiUrlPlatform}/me`, null, {
                    headers: { "auth-token": token }
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
    }, [apiUrlPlatform, localStorage.getItem("token")]);

    const fileUploadRef = useRef(null);

    const handleFileUpload = ({ files }) => {
        const [file] = files;
        setProductSubImage1(file);
        setProductSubImage1Preview(URL.createObjectURL(file));

        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }
    };

    const handleCreateOrder = async () => {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("User not authenticated. Please log in.");
            setLoading(false);
            return;
        }

        if (!productSubImage1 && cartDetails.payment === 'บัญชีธนาคาร') {
            setError("กรุณาอัปโหลดสลิปก่อนยืนยันการชำระเงิน");
            setLoading(false);
            return;
        }
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("User not authenticated. Please log in.");
                setLoading(false);
                return;
            }

            if (cartDetails.payment === 'บัญชีธนาคาร') {
                let formData = new FormData();
                formData.append('image_slip', productSubImage1);

                try {
                    const slipValidationResponse = await axios.post(`${apiUrlPlatform}/check-slip`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    if (slipValidationResponse.status !== 200) {
                        setError(slipValidationResponse.data.message || "Slip validation failed.");
                        setLoading(false);
                        return;
                    }

                    const slipData = slipValidationResponse.data.data;
                    const paymentAmount = slipData.จำนวนเงิน;

                    if (slipValidationResponse.data.status === false) {
                        setError(slipValidationResponse.data.message || "Invalid slip payment.");
                        setLoading(false);
                        return;
                    }

                    if (paymentAmount < totalPayable) {
                        const remainingAmount = totalPayable - paymentAmount;
                        setError(`โอนเงินไม่ครบ กรุณาอัพโหลดสลิปชำระเงินที่เหลืออีกครั้งเป็นจำนวน ${remainingAmount} บาท หรือติดต่อแอดมิน`);
                        setLoading(false);
                        return;
                    }

                    console.log("Slip validated successfully:", slipValidationResponse.data);
                } catch (error) {
                    if (error.response) {
                        setError(error.response.data.message || "Slip has already been used.");
                    } else {
                        console.error('Error validating slip payment:', error);
                        setError("Slip validation failed. Please try again.");
                    }
                    setLoading(false);
                    return;
                }
            }
            for (let partner_id in selectedItemsCart) {
                const partner = selectedItemsCart[partner_id];

                const productsToPurchase = partner.products.map(product => ({
                    product_id: product.product_id,
                    product_name: product.product_name,
                    product_image: product.product_image ? product.product_image : product.product_subimage1 ? product.product_subimage1 : product.product_subimage2 ? product.product_subimage2 : product.product_subimage3,
                    product_subimage1: product.product_subimage1 ? product.product_subimage1 : product.product_subimage2 ? product.product_subimage2 : product.product_subimage3,
                    product_subimage2: product.product_subimage2 ? product.product_subimage2 : product.product_subimage3,
                    product_subimage3: product.product_subimage3 ? product.product_subimage3 : "",
                    product_price: product.product_price,
                    product_qty: product.product_qty,
                }));

                const deliveryToPurchase = cartDetails.delivery_detail
                    .filter(delivery => delivery.partner_id === partner.partner_id)
                    .flatMap(delivery =>
                        delivery.byproducts_detail.flatMap(byproduct =>
                            byproduct.packages.map(packageDetail => ({
                                product_id: byproduct.product_id,
                                delivery_company: packageDetail.delivery_company,
                                package_qty: packageDetail.package_qty,
                                package_weight: packageDetail.package_weight,
                                package_width: packageDetail.package_width,
                                package_length: packageDetail.package_length,
                                package_height: packageDetail.package_height,
                                delivery_price: packageDetail.delivery_price,
                                delivery_totalprice: packageDetail.delivery_totalprice,
                                amount: packageDetail.amount
                            }))
                        )
                    );

                    const groupedDeliveries = deliveryToPurchase.reduce((acc, delivery) => {
                        const existingProduct = acc.find(item => item.product_id === delivery.product_id);
                    
                        const duplicatedPackages = Array.from({ length: delivery.amount }, () => ({
                            package_qty: delivery.package_qty,
                            package_weight: delivery.package_weight,
                            package_width: delivery.package_width,
                            package_length: delivery.package_length,
                            package_height: delivery.package_height,
                            delivery_company: delivery.delivery_company,
                            delivery_price: delivery.delivery_price,
                            delivery_totalprice: delivery.delivery_totalprice,
                            amount: 1,
                        }));
                    
                        if (existingProduct) {
                            existingProduct.packages.push(...duplicatedPackages);
                        } else {
                            acc.push({
                                product_id: delivery.product_id,
                                packages: duplicatedPackages
                            });
                        }
                    
                        return acc;
                    }, []);

                const totaldeliveryPrice = deliveryToPurchase.reduce((total, delivery) => total + delivery.delivery_totalprice, 0);

                const newOrder = {
                    partner_id: partner.partner_id,
                    product: productsToPurchase,
                    delivery_detail: groupedDeliveries.map(delivery => ({
                        product_id: delivery.product_id,
                        packages: delivery.packages
                    })),
                    customer_id: cartDetails.customer_id,
                    customer_name: cartDetails.customer_name,
                    customer_telephone: cartDetails.customer_telephone,
                    customer_address: cartDetails.customer_address,
                    customer_tambon: cartDetails.customer_tambon,
                    customer_amphure: cartDetails.customer_amphure,
                    customer_province: cartDetails.customer_province,
                    customer_zipcode: cartDetails.customer_zipcode,
                    totalproduct: productsToPurchase.reduce((total, item) => {
                        const product = partner.products.find(p => p.product_id === item.product_id);
                        return total + product.product_price * item.product_qty;
                    }, 0),
                    totaldeliveryPrice,

                    totaldiscount: 0,
                    alltotal: productsToPurchase.reduce((total, item) => {
                        const product = partner.products.find(p => p.product_id === item.product_id);
                        return total + (product.product_price * item.product_qty);
                    }, totaldeliveryPrice),

                    payment: cartDetails.payment,
                };
                console.log(newOrder)
                localStorage.setItem('newOrder', JSON.stringify(newOrder)); //ไว้เช็ค data structure
                // if (totalPayable > user.wallet) {
                //     setError(`จำนวนเงินไม่เพียงพอ กรุณาเติมเงินให้เพียงพอแล้วทำรายการอีกครั้ง`);
                //     return;
                // }
                const orderResponse = await axios.post(`${apiUrl}/orderproduct`, newOrder);

                if (orderResponse.data && orderResponse.data.status) {
                    console.log("Order successful for partner:", partner.partner_name, orderResponse.data);

                    // if (cartDetails.payment === 'E-wallet') { รอ api และ body จริง
                    //     const useCoupon = {
                    //         ref_code: orderResponse.data.data.orderref,
                    //         ref_type: "e-market",
                    //         amount: totalPayable,
                    //         user_id: cartDetails.customer_id,
                    //     };

                    //     console.log(useCoupon)
                    //     try {
                    //         const useCouponResponse = await axios.post(`${apiCoopUrl}/coupons/use`, useCoupon, {
                    //             headers: { "auth-token": `bearer ${token}` },
                    //         });
                    //         console.log(useCouponResponse.data);
                    //     } catch (error) {
                    //         throw new Error("Coupon use failed.");
                    //     }
                    // }

                    if (cartDetails.payment === 'บัญชีธนาคาร') {
                        try {
                            setIsLoading(true);
                            const uploadResponse = await axios.put(`${apiUrl}/orderproduct/addslippayment/${orderResponse.data.data._id}`, formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            });
                            console.log('Upload successful:', uploadResponse.data);
                        } catch (error) {
                            console.error('Error uploading file:', error);
                        } finally {
                            setIsLoading(false);
                        }
                    }
                } else {
                    setError(orderResponse.data.message || "Order failed");
                    break;
                }
            }
            clearCart(cart, selectedItemsCart);
            clearCartDetails();
            clearSelectedItemsCart();
            window.location.href = '/PaymentSuccessfully';
        } catch (error) {
            console.error("Order error:", error.response?.data || error.message);
            setError(error.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderWalletDetails = () => (
        <>
            <div className="flex justify-content-center">
                {/* {qrCodeUrl && (
                    <div>
                        <p className="m-0 p-0 text-center">Qr Code</p>
                        <img
                            src={qrCodeUrl}
                            alt="QR Code for payment"
                            width={150}
                            height={150}
                        />
                    </div>
                )} */}
            </div>
            <div className="flex">
                <div className="flex-grow-1 flex flex-column">
                    <p className="m-0 mb-3 p-0 text-2xl font-bold text-center">รวมยอดชำระ(บาท)</p>
                    {totalPayable && (
                        <p className="m-0 text-2xl font-bold text-center">
                            ฿{Number(totalPayable.toFixed(2)).toLocaleString('en-US')}
                        </p>
                    )}
                    <div className="pt-3 my-3 border-top-1 surface-border">
                        <div className="flex align-items-start justify-content-between">
                            <p className="m-0 p-0 text-xl font-semibold">ช่องทางชำระเงิน</p>
                            <p className="m-0 text-lg">E-wallet</p>
                        </div>
                        {totalPayable && (
                            <div className="flex align-items-center justify-content-between">
                                <p className="m-0 text-lg font-normal">ยอดเงินปัจจุบัน</p>
                                <p className="m-0 text-lg font-normal">
                                    ฿{Number(user?.wallet.toFixed(2)).toLocaleString('en-US')}
                                </p>
                            </div>
                        )}
                    </div>
                    {error && <p className="text-red-500 font-semibold text-center text-xl">{error}</p>}
                    {/* {qrCodeUrl && (
                        <div className="p-0 my-2 surface-200 border-round flex justify-content-center align-content-center">
                            <p className="my-3">ชำระเงินภายใน {remainingTime} seconds</p>
                        </div>
                    )} */}
                </div>
            </div>
        </>
    )

    const renderPaymentDetails = () => (
        <>
            <div className="flex justify-content-center">
                <p>ตัวอย่าง QRcode</p>
            </div>
            <div className="flex">
                <div className="flex-grow-1 flex flex-column text-center">
                    <p className="m-0 mb-3 p-0 text-2xl font-bold">จำนวนเงิน(บาท)</p>
                    {totalPayable && (
                        <p className="m-0 text-2xl font-bold">
                            ฿{Number(totalPayable.toFixed(2)).toLocaleString('en-US')}
                        </p>
                    )}
                    <div className="flex flex-column justify-content-center mb-3 mt-5">
                        {error && <p className="text-red-500 font-semibold text-center text-xl">{error}</p>}
                        {productSubImage1Preview && (

                            <div className="text-center mb-2">
                                <Image src={productSubImage1Preview} alt="Product Sub Image 1 Preview" width="350" preview />
                            </div>
                        )}
                        <FileUpload
                            ref={fileUploadRef}
                            mode="basic"
                            name="product_subimage1"
                            chooseLabel="กรุณาแนบสลิปที่นี่"
                            auto
                            customUpload
                            accept="image/png, image/jpeg,image/jpg"
                            maxFileSize={2000000}  // 2MB
                            onSelect={handleFileUpload}
                            className="align-self-center"
                            invalidFileSizeMessageDetail="ขนาดรูปภาพจะต้องไม่เกิน 2 mb"
                        />
                    </div>
                </div>
            </div>
        </>
    )

    const renderBankDetails = () => (
        <>
            <div className="block md:flex mt-3">
                <div className="w-fit flex flex-column justify-content-center align-items-center pr-2">
                    <img src={KBANK} alt="" className="w-24rem" />
                    <Button label="คัดลอกเลขที่บัญชี" size="small" className="w-fit" rounded onClick={handleCopyLink} />
                </div>
                <div className="border-none md:border-left-1 surface-border w-24rem flex flex-column justify-content-center text-center">
                    {totalPayable && (
                        <div className="pt-5 md:mt-0">
                            <p className="m-0 mb-3 p-0 text-2xl font-bold">
                                จำนวนเงิน(บาท)
                            </p>
                            <p className="m-0 p-0 text-2xl font-bold">
                                ฿{Number(totalPayable.toFixed(2)).toLocaleString('en-US')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-column justify-content-center mb-3 mt-5">
                {error && <p className="text-red-500 font-semibold text-center text-xl">{error}</p>}
                {productSubImage1Preview && (

                    <div className="text-center mb-2">
                        <Image src={productSubImage1Preview} alt="Product Sub Image 1 Preview" width="350" preview />
                    </div>
                )}
                <FileUpload
                    ref={fileUploadRef}
                    mode="basic"
                    name="product_subimage1"
                    chooseLabel="กรุณาแนบสลิปที่นี่"
                    auto
                    customUpload
                    accept="image/png, image/jpeg,image/jpg"
                    maxFileSize={2000000}  // 2MB
                    onSelect={handleFileUpload}
                    className="align-self-center"
                    invalidFileSizeMessageDetail="ขนาดรูปภาพจะต้องไม่เกิน 2 mb"
                />
            </div>
        </>
    )

    const toast = useRef(null);
    const link = "1803182937";

    const fallbackCopyTextToClipboard = (text) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            toast.current.show({ severity: 'success', summary: 'คัดลอกสำเร็จ!', life: 3000 });
        } catch (err) {
            console.error('Fallback: ไม่สามารถคัดลอกได้: ', err);
            toast.current.show({ severity: 'error', summary: 'ไม่สามารถคัดลอกได้', life: 3000 });
        }

        document.body.removeChild(textArea);
    };

    const handleCopyLink = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(link)
                .then(() => {
                    toast.current.show({ severity: 'success', summary: 'คัดลอกเลขบัญชีไปยังคลิปบอร์ดแล้ว!', life: 3000 });
                })
                .catch((err) => {
                    console.error('คัดลอกไม่สำเร็จ: ', err);
                });
        } else {
            // Use the fallback if Clipboard API is unavailable
            fallbackCopyTextToClipboard(link);
        }
    };

    return (
        <div className="flex justify-content-center">
            <Toast ref={toast} position="top-center" />
            <div className='w-fit lg:px-8 pt-5 flex flex-column'>
                <div className='flex flex-column border-1 surface-border border-round py-5 px-3 bg-white border-round-mb '>
                    <div className="align-self-center">
                        <img src={Logo} alt="" className="w-16rem" />
                    </div>

                    {/* {cartDetails.payment === 'QRCode' ? (
                        // loading ? (
                        //     <ProgressSpinner />
                        // ) : error ? (
                        //     <p className="text-red-500">{error}</p>
                        // ) : (
                        //     renderPaymentDetails()
                        // )
                        renderPaymentDetails()
                    ) : (
                        renderBankDetails()
                    )} */}

                    {cartDetails.payment === 'QRCode'
                        ? renderPaymentDetails()
                        : cartDetails.payment === 'E-wallet'
                            ? renderWalletDetails()
                            : renderBankDetails()
                    }
                    <div className="flex align-items-center justify-content-center gap-3">
                        <Button className="text-900 border-primary" icon="pi pi-angle-left" label="เปลี่ยนวิธีการชำระเงิน" size="small" outlined rounded onClick={() => navigate("/PaymentPage")} />
                        <Button label="ยืนยันการชำระเงิน" size="small" rounded onClick={handleCreateOrder} />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default QRPage