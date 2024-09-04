import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from '../../router/CartContext';
import { convertTHBtoLAK, formatLaosPhone } from '../../utils/DateTimeFormat';
import { RadioButton } from 'primereact/radiobutton';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';
import LogoMakro from "../../assets/macro-laos1.png"

import axios from "axios";

function CheckoutPage() {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { cart, placeCartDetail } = useCart();

    const [taxId, setTaxId] = useState('');
    const [branchCode, setBranchCode] = useState('');
    const [shipping, setShipping] = useState('selfPickup');
    const [selectedDelivery, setSelectedDelivery] = useState('');
    const [deliveries, setDeliveries] = useState([]);
    const [deliveryBranch, setDeliveryBranch] = useState('');
    const [error, setError] = useState(false);

    const calculateTotalBeforeDiscount = () => {
        return cart.reduce((total, product) => total + product.product_price * product.quantity, 0);
    };

    const calculateCODCost = (total) => {
        const codCost = total * 0.03;
        return Math.max(codCost, 30);
    };
    const num_total = cart.length
    const totalBeforeDiscount = calculateTotalBeforeDiscount();
    const LaostotalBeforeDiscount = convertTHBtoLAK(calculateTotalBeforeDiscount());

    const CODCost = calculateCODCost(totalBeforeDiscount);
    const LaosCODCost = convertTHBtoLAK(calculateCODCost(totalBeforeDiscount));

    const totalPayable = totalBeforeDiscount + CODCost;
    const LaostotalPayable = convertTHBtoLAK(totalPayable)

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const user_id = localStorage.getItem("user_id");
                const res = await axios.get(`${apiUrl}/users/${user_id}`, {
                    headers: {
                        "token": token,
                    },
                });
                setUser(res.data.data);
            } catch (err) {
                console.error("Error fetching user data", err.response?.data || err.message);
            }
        };
        getUserProfile();
    }, []);

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const response = await axios.get(`${apiUrl}/deliveries`);
                setDeliveries(response.data.data);
            } catch (error) {
                console.error('Error fetching deliveries:', error);
            }
        };

        fetchDeliveries();
    }, []);

    const handleConfirmPayment = () => {
        if (shipping === 'courierDelivery') {
            if (!selectedDelivery || !deliveryBranch) {
                setError(true);
            } else {
                setError(false);
                const orderDetails = {
                    currency: "THB",
                    dropoff_id: "66bdd3023208ada843eb3a1c",
                    // taxId,
                    // branchCode,
                    shipping,
                    delivery_id: selectedDelivery._id,
                    // selectedDelivery,
                    deliveryBranch,
                    amountPayment: LaostotalPayable,
                };
                placeCartDetail(orderDetails);
                navigate("/PaymentPage");
            }
        } else {
            const orderDetails = {
                currency: "THB",
                dropoff_id: "66bdd3023208ada843eb3a1c",
                // taxId,
                // branchCode,
                shipping,
                delivery_id: "66bdd415203788461da41f81",
                // selectedDelivery,
                deliveryBranch,
                amountPayment: LaostotalPayable,

            };
            placeCartDetail(orderDetails);
            navigate("/PaymentPage");
        }
    };

    return (
        <div className="mx-2 sm:px-2 md:px-4 lg:px-6 xl:px-8">
            <h1 className='flex justify-content-start'>ทำการสั่งซื้อ</h1>
            <div className='w-full gap-4 lg:flex justify-content-between'>
                <div className='w-full lg:w-9 flex flex-column gap-2'>
                    <div className='address p-3 border-1 surface-border border-round bg-white border-round-mb flex flex-column justify-content-center'>
                        <div className='flex align-items-center mb-2'>
                            <i className="m-0 mr-2 pi pi-map-marker"></i>
                            <h2 className='m-0'>ข้อมูลผู้สั่งสินค้า</h2>
                        </div>
                        {user ? (
                            <>
                                <p className='m-0'>ชื่อ: {user.name}</p>
                                <p className='m-0'>เบอร์โทร: {formatLaosPhone(user.phone)}</p>
                            </>
                        ) : ("")
                        }
                        {/* <p className="w-fit p-1 border-1 border-cyan-500 text-cyan-500 border-round">ที่อยู่เริ่มต้น</p> */}
                    </div>
                    {/* <div className='tax flex flex-column p-3 border-1 surface-border border-round  bg-white border-round-mb justify-content-center'>
                        <div>
                            <h3 className='m-0  p-1'>ข้อมูลใบกำกับภาษี</h3>
                        </div>
                        <div className='flex gap-2'>
                            <InputText className="w-full border-round p-3" value={taxId} onChange={(e) => setTaxId(e.target.value)} placeholder='เลขประจำตัวผู้เสียภาษี (ถ้ามี)' />
                            <InputText className="w-full border-round p-3" value={branchCode} onChange={(e) => setBranchCode(e.target.value)} placeholder='รหัสสาขา (ถ้ามี)' />
                        </div>
                    </div> */}
                    <div className='tax flex flex-column p-3 border-1 surface-border border-round  bg-white border-round-mb justify-content-center'>
                        <div className='flex align-items-center mb-2'>
                            <i className="m-0 mr-2 pi pi-truck"></i>
                            <h2 className='m-0'>สรุปสินค้าและการจัดส่ง</h2>
                        </div>
                        <div className='flex align-items-center justify-content-between border-1 surface-border border-round p-2 mb-2'>
                            {/* <h4 className='m-0'>Makro Pro</h4> */}
                            <div className="flex align-items-center">
                                <i className="pi pi-shop mr-1"></i>
                                <img
                                    src={LogoMakro}
                                    alt="Logo"
                                    height={25}
                                />
                            </div>
                            <p className='m-0'>{num_total} รายการ</p>
                        </div>
                        <div className="flex flex-column">
                            {cart.map((product, index) => (
                                <div key={index} className="cart-items flex justify-content-between align-items-center py-2 border-bottom-1 surface-border">
                                    <div className="flex align-items-center">
                                        <img
                                            src={product.product_image}
                                            alt={product.product_name}
                                            width={50}
                                            height={50}
                                        />
                                        <div className="flex flex-column ml-3">
                                            <span className="mb-1 font-bold">{product.product_name}</span>
                                            <span>{product.quantity} หน่วย</span>
                                        </div>
                                    </div>
                                    <div className='w-4 text-right'>
                                        <span className='text-xl'>{Number(product.product_price * product.quantity).toLocaleString('en-US')} ฿</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className='m-0 mt-3 mb-2'>วิธีการรับสินค้า</p>

                        <div className="flex gap-2 mb-2">
                            <div className="w-full flex align-items-center border-1 surface-border border-round p-2">
                                <RadioButton inputId="shipping2" name="shipping" value="selfPickup" onChange={(e) => setShipping(e.value)} checked={shipping === 'selfPickup'} />
                                <label htmlFor="shipping2" className="ml-2">รับเองที่บริษัท</label>
                            </div>
                            <div className="w-full flex align-items-center border-1 surface-border border-round p-2">
                                <RadioButton inputId="shipping1" name="shipping" value="courierDelivery" onChange={(e) => setShipping(e.value)} checked={shipping === 'courierDelivery'} />
                                <label htmlFor="shipping1" className="ml-2">จัดส่งโดยขนส่ง</label>
                            </div>
                        </div>
                        <div className='flex flex-column border-1 surface-border border-round justify-content-center p-2'>
                            {shipping === 'courierDelivery' ? (
                                <div className=''>
                                    <div className="flex gap-2">
                                        <p className='m-0 m-0 w-full'>เลือกขนส่ง</p>
                                        <p className='m-0 m-b-2 w-full'>รับที่สาขา</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Dropdown
                                            value={selectedDelivery}
                                            onChange={(e) => setSelectedDelivery(e.value)}
                                            options={deliveries}
                                            optionLabel="name"
                                            placeholder="เลือกขนส่ง"
                                            className="w-full"
                                        />
                                        <InputText
                                            className="w-full border-round p-3"
                                            value={deliveryBranch}
                                            onChange={(e) => setDeliveryBranch(e.target.value)}
                                            placeholder='ระบุสาขาที่ต้องการรับ'
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        {error && !selectedDelivery && <small className="p-error w-full">กรุณาระบุชื่อขนส่ง</small>}
                                        {error && !deliveryBranch && <small className="p-error w-full">กรุณาระบุสาขาที่ต้องการรับ</small>}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className='m-0'>รับสินค้าที่: โกดังลาว</p>
                                    {/* <p className='m-0'>ที่อยู่โกดัง</p> */}
                                </div>
                            )}

                        </div>
                        <div className='flex justify-content-end'>
                            <p className='m-0 mt-3'>ยอดสั่งซื้อ {num_total} รายการ: {Number(totalBeforeDiscount.toFixed(2)).toLocaleString('en-US')} ฿</p>
                        </div>
                        <div className='flex justify-content-end'>
                            <p className='m-0'>ค่า COD 3%: {Number(CODCost.toFixed(2)).toLocaleString('en-US')} ฿</p>
                        </div>
                    </div>
                </div>
                <div className='mt-2 lg:mt-0 w-full lg:w-4 h-20rem gap-1 flex flex-column border-1 surface-border border-round py-3 px-3 bg-white border-round-mb justify-content-between'>
                    <div className="flex justify-content-between pb-2 border-bottom-1 surface-border">
                        <p className='m-0 text-start'>ยอดสั่งซื้อ</p>
                        <div className="flex flex-column gap-1">
                            <p className='m-0 text-right'>{Number(totalBeforeDiscount.toFixed(2)).toLocaleString('en-US')} ฿</p>
                            <p className='m-0 text-right font-bold'>{Number(LaostotalBeforeDiscount.toFixed(2)).toLocaleString('en-US')} ₭</p>
                        </div>

                    </div>
                    <div className="flex justify-content-between pb-2 border-bottom-1 surface-border">
                        <p className='m-0'>ค่า COD 3%</p>
                        <div className="flex flex-column gap-1">
                            <p className='m-0 text-right'>{Number(CODCost.toFixed(2)).toLocaleString('en-US')} ฿</p>
                            <p className='m-0 text-right font-bold'>{Number(LaosCODCost.toFixed(2)).toLocaleString('en-US')} ₭</p>
                        </div>
                    </div>
                    <div className="flex justify-content-between pb-2 border-bottom-1 surface-border">
                        <p className='m-0'>ยอดชำระ</p>
                        <div className="flex flex-column gap-1">
                            <p className='m-0 text-right'>{Number(totalPayable.toFixed(2)).toLocaleString('en-US')} ฿</p>
                            <p className='m-0 text-right text-primary font-bold'>{Number(LaostotalPayable.toFixed(2)).toLocaleString('en-US')} ₭</p>
                        </div>
                    </div>
                    <Button className="w-full" label="ไปหน้าชำระสินค้า" size="small" rounded onClick={handleConfirmPayment} />
                </div>
            </div >
        </div>
    )
}

export default CheckoutPage