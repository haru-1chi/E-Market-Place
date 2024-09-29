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

    const handleFileUpload = ({ files }) => {
        const [file] = files;
        setProductSubImage1(file);
        setProductSubImage1Preview(URL.createObjectURL(file));  // Set image preview
    };

    const handleCreateOrder = async () => {
        setLoading(true);
        if (!productSubImage1) {
            console.error("Please upload an image before submitting.");
            setError("กรุณาอัปโหลดสลิปก่อนยืนยันการชำระเงิน");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("User not authenticated. Please log in.");
                return;
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
                    .flatMap(delivery => delivery.byproducts_detail.map(byproduct => ({
                        product_id: byproduct.product_id,
                        delivery_company: byproduct.delivery_company,
                        package_qty: byproduct.package_qty,
                        package_weight: byproduct.package_weight,
                        package_width: byproduct.package_width,
                        package_length: byproduct.package_length,
                        package_height: byproduct.package_height,
                        delivery_price: byproduct.delivery_price,
                    })));

                const totaldeliveryPrice = deliveryToPurchase.reduce((total, delivery) => total + delivery.delivery_price, 0);

                const newOrder = {
                    partner_id: partner.partner_id,
                    product: productsToPurchase,
                    delivery_detail: deliveryToPurchase,
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

                const orderResponse = await axios.post(`${apiUrl}/orderproduct`, newOrder);

                if (orderResponse.data && orderResponse.data.status) {
                    console.log("Order successful for partner:", partner.partner_name, orderResponse.data);

                    let formData = new FormData();
                    formData.append('image', productSubImage1);

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
                } else {
                    setError(orderResponse.data.message || "Order failed");
                    break;
                }
            }
            clearCart(cart, selectedItemsCart);
            clearCartDetails();
            clearSelectedItemsCart();
            navigate("/PaymentSuccessfully");
        } catch (error) {
            console.error("Order error:", error.response?.data || error.message);
            setError(error.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // const renderPaymentDetails = () => (
    //     <>
    //         <div className="flex justify-content-center">
    //             {qrCodeUrl && (
    //                 <div>
    //                     <p className="m-0 p-0 text-center">Qr Code</p>
    //                     <img
    //                         src={qrCodeUrl}
    //                         alt="QR Code for payment"
    //                         width={150}
    //                         height={150}
    //                     />
    //                 </div>
    //             )}
    //         </div>
    //         <div className="flex">
    //             <div className="flex-grow-1 flex flex-column text-center">
    //                 <p className="m-0">Amount (LAK)</p>
    //                 {totalPayable && (
    //                     <p className="my-3 text-2xl font-bold">
    //                         {Number(totalPayable.toFixed(2)).toLocaleString('en-US')}
    //                     </p>
    //                 )}
    //                 <p className="m-0">เลขที่รายการ {paymentCode}</p>
    //                 {qrCodeUrl && (
    //                     <div className="p-0 my-2 surface-200 border-round flex justify-content-center align-content-center">
    //                         <p className="my-3">ชำระเงินภายใน {remainingTime} seconds</p>
    //                     </div>
    //                 )}
    //             </div>
    //         </div>
    //         <p className="text-center">*กรุณาเปิดหน้านี้ไว้ จนกว่าชำระเงินนี้สำเร็จ</p>
    //     </>
    // )

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
                    mode="basic"
                    name="product_subimage1"
                    chooseLabel="กรุณาแนบสลิปที่นี่"
                    auto
                    customUpload
                    accept="image/png, image/jpeg"
                    maxFileSize={2000000}  // 2MB
                    onSelect={handleFileUpload}
                    className="align-self-center"
                    invalidFileSizeMessageDetail="The file is too large. Maximum size allowed is 2MB."
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
                <div className="w-fit mb-3">
                    <Button icon="pi pi-angle-left" label="เปลี่ยนวิธีการชำระเงิน" size="small" rounded onClick={() => navigate("/PaymentPage")}/>
                </div>
                <div className='flex flex-column border-1 surface-border border-round py-5 px-3 bg-white border-round-mb '>
                    <div className="align-self-center">
                        <img src={Logo} alt="" className="w-16rem" />
                    </div>

                    {cartDetails.payment === 'QRCode' ? (
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

                    <div className="flex flex-column align-items-center justify-content-center">
                        <Button label="ยืนยันการชำระเงิน" size="small" rounded onClick={handleCreateOrder} />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default QRPage