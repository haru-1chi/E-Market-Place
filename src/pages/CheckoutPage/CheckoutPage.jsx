import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from '../../router/CartContext';
import { convertTHBtoLAK, formatLaosPhone } from '../../utils/DateTimeFormat';
import { RadioButton } from 'primereact/radiobutton';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';
import LogoMakro from "../../assets/macro-laos1.png"
import img_placeholder from '../../assets/img_placeholder.png';
import axios from "axios";

function CheckoutPage() {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_PLATFORM;
    const apiProductUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { selectedItemsCart, placeCartDetail } = useCart();
    const [shipping, setShipping] = useState('selfPickup');
    const [selectedDelivery, setSelectedDelivery] = useState('');
    const [deliveries, setDeliveries] = useState([]);
    const [deliveryBranch, setDeliveryBranch] = useState('');
    const [error, setError] = useState(false);

    const [totalBeforeDiscount, setTotalBeforeDiscount] = useState(0);
    const [CODCost, setCODCost] = useState(0);
    const [totalPayable, setTotalPayable] = useState(0);
    const num_total = 0

    useEffect(() => {
        if (Object.keys(selectedItemsCart).length > 0) {
            const totalBeforeDiscount = Object.values(selectedItemsCart).reduce((total, partner) => {
                return total + partner.products.reduce((sum, product) => {
                    return sum + (product.product_price * product.product_qty);
                }, 0);
            }, 0);

            const CODCost = totalBeforeDiscount === 0 ? 0 : Math.max(totalBeforeDiscount * 0.03, 30);
            const totalPayable = totalBeforeDiscount + CODCost;

            setTotalBeforeDiscount(totalBeforeDiscount);
            setCODCost(CODCost);
            setTotalPayable(totalPayable);
        }
    }, [selectedItemsCart]);

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const res = localStorage.getItem("user");
                setUser(JSON.parse(res));
            
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

    const groupByPartner = Object.keys(selectedItemsCart).reduce((result, key) => {
        const partner = selectedItemsCart[key];
        const partner_name = partner.partner_name;

        if (!result[partner_name]) {
            result[partner_name] = [];
        }

        partner.products.forEach(product => {
            result[partner_name].push(product);
        });

        return result;
    }, {});

    const handleConfirmPayment = () => {
        if (shipping === 'courierDelivery') {
            if (!selectedDelivery || !deliveryBranch) {
                setError(true);
            } else {
                setError(false);
                const orderDetails = {
                    currency: "THB",
                    dropoff_id: "66bdd3023208ada843eb3a1c",
                    shipping,
                    delivery_id: selectedDelivery._id,
                    deliveryBranch,
                    amountPayment: totalPayable,
                };
                placeCartDetail(orderDetails);
                navigate("/PaymentPage");
            }
        } else {
            const orderDetails = {
                partner_id: selectedItemsCart.partner_id,
                customer_id: user._id,
                
                
                // customer_name: "",
                // customer_address: "",
                // customer_tambon: "",
                // customer_province: "",
                // customer_zipcode: "",
                // customer_telephone: "",



                // currency: "THB",
                // dropoff_id: "66bdd3023208ada843eb3a1c",
                // shipping,
                // delivery_id: "66bdd415203788461da41f81",
                // deliveryBranch,
                // amountPayment: totalPayable,
            };
            
            placeCartDetail(orderDetails);
            navigate("/PaymentPage");
        }
    };

    return (
        <div className="mx-2 sm:px-2 md:px-4 lg:px-6 xl:px-8">
            <h1 className='flex justify-content-center font-semibold m-0 p-0 py-2'>ทำการสั่งซื้อ</h1>
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
                                {/* <p className='m-0'>เบอร์โทร: {formatLaosPhone(user.phone)}</p> */}
                            </>
                        ) : ("")
                        }
                    </div>

                    {Object.keys(groupByPartner).map((partner_name, index) => {
                        const items = groupByPartner[partner_name];
                        const totalItems = items.reduce((acc, product) => acc + product.product_qty, 0);
                        const totalPrice = items.reduce((acc, product) => acc + product.product_price * product.product_qty, 0);

                        return (
                            <div key={index} className='flex flex-column p-3 border-1 surface-border border-round bg-white border-round-mb justify-content-center'>
                                <div className='w-full'>
                                    <div className='flex align-items-center mb-2'>
                                        <i className="pi pi-shop mr-1"></i>
                                        <h4 className='m-0 font-semibold'>ผู้ขาย {partner_name}</h4>
                                    </div>
                                    {items.map((product, idx) => (
                                        <div key={idx} className="cart-items flex align-items-center py-2">
                                            <div className="w-full flex align-items-center">
                                                <img
                                                    src={`${product.product_image ? apiProductUrl + product.product_image : product.product_subimage1 ? apiProductUrl + product.product_subimage1 : product.product_subimage2 ? apiProductUrl + product.product_subimage2 : product.product_subimage3 ? apiProductUrl + product.product_subimage3 : img_placeholder}`}
                                                    alt={product.product_name}
                                                    width={50}
                                                    height={50}
                                                    className="border-1 border-round-lg surface-border"
                                                />
                                                <div className="w-full flex flex-column ml-3">
                                                    <span className="mb-1 font-normal">{product.product_name}</span>
                                                    <div className="flex justify-content-between">
                                                        <span>฿{Number(product.product_price).toLocaleString('en-US')}</span>
                                                        <span>x{product.product_qty}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="border-top-1 surface-border pt-3 flex justify-content-between">
                                        <p className="p-0 m-0">คำสั่งซื้อทั้งหมด ({totalItems} ชิ้น):</p>
                                        <p className="p-0 m-0 font-semibold">฿{totalPrice.toLocaleString('en-US')}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className='hidden flex-column p-3 mt-2 border-1 surface-border border-round  bg-white border-round-mb justify-content-center'>
                    <p className='m-0 mb-2'>วิธีการรับสินค้า</p>
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

                <div className='mt-2 lg:mt-0 w-full lg:w-4 h-16rem flex flex-column border-1 surface-border border-round py-3 px-3 bg-white border-round-mb'>
                    <h3 className="m-0 p-0 pb-3">ข้อมูลการชำระเงิน</h3>
                    <div className="flex justify-content-between py-1">
                        <p className='m-0 text-start'>รวมการสั่งซื้อ</p>
                        <p className='m-0 text-right'>{Number(totalBeforeDiscount.toFixed(2)).toLocaleString('en-US')} ฿</p>
                    </div>
                    <div className="flex justify-content-between py-1">
                        <p className='m-0'>ค่า COD 3%</p>
                        <p className='m-0 text-right'>{Number(CODCost.toFixed(2)).toLocaleString('en-US')} ฿</p>
                    </div>
                    <div className="flex justify-content-between py-1">
                        <p className='m-0'>ยอดชำระ</p>
                        <p className='m-0 text-right'>{Number(totalPayable.toFixed(2)).toLocaleString('en-US')} ฿</p>
                    </div>
                    <Button className="w-full" label="ไปหน้าชำระสินค้า" size="small" rounded onClick={handleConfirmPayment} />
                </div>
            </div >
        </div>
    )
}

export default CheckoutPage