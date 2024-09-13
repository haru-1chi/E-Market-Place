import React, { useState, useEffect } from "react";
import Footer from "../../component/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from '../../router/CartContext';
import { formatLaosPhone } from '../../utils/DateTimeFormat';
import { RadioButton } from 'primereact/radiobutton';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from "primereact/floatlabel";
import img_placeholder from '../../assets/img_placeholder.png';
import axios from "axios";
import { Dialog } from "primereact/dialog";
import ProvinceSelection from "../../component/ProvinceSelection";
import { Checkbox } from 'primereact/checkbox';

function CheckoutPage() {
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
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

    const [totalPayable, setTotalPayable] = useState(0);
    const num_total = 0

    const [addressFormData, setAddressFormData] = useState({
        label: '',
        fullName: '',
        phoneNumber: '',
        addressLine: '',
        province: null,
        amphure: null,
        tambon: null,
        isDefault: false
    });
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const handleSubmit = () => {
        console.log(addressFormData)
        setVisible1(false);
        resetForm();
        // if (selectedAddressId) {
        //     // Update the existing address logic
        //     axios.put(`/api/addresses/${selectedAddressId}`, addressFormData)
        //         .then(response => {
        //             const updatedAddresses = addresses.map(address =>
        //                 address.id === selectedAddressId ? response.data : address
        //             );
        //             setAddresses(updatedAddresses);
        //             setVisible1(false);
        //         })
        //         .catch(error => console.error(error));
        // } else {
        //     // Create new address logic
        //     axios.post('/api/addresses', addressFormData)
        //         .then(response => {
        //             setAddresses([...addresses, response.data]);
        //             setVisible1(false);
        //         })
        //         .catch(error => console.error(error));
        // }
    };

    const handleAddressInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        setAddressFormData({
            ...addressFormData,
            [id]: type === 'checkbox' ? checked : value
        });
    };

    useEffect(() => {
        if (Object.keys(selectedItemsCart).length > 0) {
            const totalPayable = Object.values(selectedItemsCart).reduce((total, partner) => {
                return total + partner.products.reduce((sum, product) => {
                    return sum + (product.product_price * product.product_qty);
                }, 0);
            }, 0);

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
                amountPayment: totalPayable,

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

        <div className="w-full">
            <div className="mx-2 sm:px-2 md:px-4 lg:px-6 xl:px-8 mb-3">
                <h1 className='flex font-semibold m-0 p-0 py-2'>ทำการสั่งซื้อ</h1>
                <div className='w-full gap-4 lg:flex justify-content-between'>
                    <div className='w-full lg:w-9 flex flex-column gap-2'>
                        <div className='address p-3 border-1 surface-border border-round bg-white border-round-mb flex flex-column justify-content-center'>
                            <div className='flex align-items-center mb-2'>
                                <i className="m-0 mr-2 pi pi-map-marker"></i>
                                <h2 className='m-0 font-semibold'>ที่อยู่ในการจัดส่ง</h2>
                            </div>
                            {user ? (
                                <div className="flex justify-content-between">
                                    <div>
                                        <p className='m-0'>ชื่อ: {user.name}</p>
                                        <p className='m-0'>เบอร์โทร: {formatLaosPhone(user.phone)}</p>
                                        <p className='m-0'>ที่อยู่:</p>
                                        <p className='w-fit px-1 border-1 border-round border-primary'>ค่าเริ่มต้น</p>
                                    </div>
                                    <div>
                                        <p className="m-0 text-blue-500 cursor-pointer" onClick={() => setVisible2(true)}>เปลี่ยนที่อยู่</p>
                                    </div>
                                </div>
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
                                        <Link to={`/ShopPage/${selectedItemsCart.partner_id}`} className="no-underline text-900">
                                            <div className='flex align-items-center mb-2'>
                                                <i className="pi pi-shop mr-1"></i>
                                                <h4 className='m-0 font-semibold'>ผู้ขาย {partner_name}</h4>
                                            </div>
                                        </Link>
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

                    <div className='mt-2 lg:mt-0 w-full lg:w-4 h-fit flex flex-column border-1 surface-border border-round py-3 px-3 bg-white border-round-mb mb-2'>
                        <h3 className="m-0 p-0 pb-2 font-semibold">ข้อมูลการชำระเงิน</h3>
                        <div className="flex justify-content-between py-1">
                            <p className='m-0'>ยอดชำระ</p>
                            <p className='m-0 text-right'>฿{Number(totalPayable.toFixed(2)).toLocaleString('en-US')}</p>
                        </div>
                        <Button className="w-full mt-2" label="ไปหน้าชำระสินค้า" size="small" rounded onClick={handleConfirmPayment} />
                    </div>
                </div >
            </div>
            <Footer />

            <Dialog
                header={<h3 className="font-semibold m-0">ที่อยู่จัดส่ง</h3>}
                visible={visible1}
                style={{ width: "500px" }}
                onHide={() => setVisible1(false)}
                closable={false}
            >
                <div className='flex justify-content-start align-items-center pt-3'>
                    <label>ติดป้ายเป็น:</label>
                    <InputText id="label" value={addressFormData.label}
                        onChange={handleAddressInputChange}
                        className='ml-3 w-10rem p-2'
                        placeholder='บ้าน, ที่ทำงาน, อื่นๆ...'
                    />
                </div>

                <div className="flex flex-column gap-4 mt-4">
                    <div className='w-full block md:flex gap-3'>
                        <FloatLabel className='w-full'>
                            <InputText id="fullName" value={addressFormData.fullName}
                                onChange={handleAddressInputChange}
                                className='w-full'
                            />
                            <label htmlFor="fullName">ชื่อ-นามสกุล</label>
                        </FloatLabel>
                        <FloatLabel className='w-full mt-4 md:mt-0'>
                            <InputText id="phoneNumber" value={addressFormData.phoneNumber}
                                onChange={handleAddressInputChange}
                                className='w-full'
                            />
                            <label htmlFor="phoneNumber">หมายเลขโทรศัพท์</label>
                        </FloatLabel>
                    </div>

                    <InputText id="addressLine" value={addressFormData.addressLine} onChange={handleAddressInputChange} className="w-full" placeholder='บ้านเลขที่, ซอย, หมู่, ถนน' />
                    <ProvinceSelection
                        addressFormData={addressFormData}
                        setAddressFormData={setAddressFormData} />
                    <div>
                        <Checkbox
                            id="isDefault"
                            checked={addressFormData.isDefault}
                            onChange={handleAddressInputChange}
                            className="mt-2"
                        />
                        <label htmlFor='isDefault' className="ml-2">ตั้งเป็นที่อยู่เริ่มต้น</label>
                    </div>

                </div>
                <div className='flex justify-content-end gap-3 mt-4'>
                    <Button onClick={() => setVisible1(false)} label='ยกเลิก' text />
                    <Button onClick={handleSubmit} label='ยืนยัน' />
                </div>
            </Dialog>

            <Dialog
                header={<h3 className="font-semibold m-0">ที่อยู่ของฉัน</h3>}
                visible={visible2}
                style={{ width: "500px" }}
                onHide={() => setVisible2(false)}
                closable={false}
            >
                <div className="w-full flex align-items-start pt-4 border-bottom-1 surface-border">
                    <RadioButton
                        inputId={`address`}
                        name="shippingAddress"
                    />
                    <div className='w-full ml-3 flex justify-content-between align-items-start'>
                        <div>
                            <p className="mt-0">ชื่อ ซากุระโกะ ฟุบุกิ</p>
                            <p>เบอร์โทร 055 555 5555</p>
                            <p>ที่อยู่ สันติธรรม ชัยเหมี่ยง ประเทศไทย</p>
                            <p className='w-fit px-1 border-1 border-round border-primary'>ค่าเริ่มต้น</p>
                        </div>
                        <div className='text-right'>
                            <div className='flex gap-2 justify-content-end'>
                                <p className='text-blue-500 cursor-pointer m-0'
                                    onClick={() => {
                                        //  setSelectedAddressId(address.id);
                                        setVisible1(true);
                                    }}
                                >แก้ไข</p>
                            </div>
                        </div>
                    </div>
                </div>


                {/* {addresses.map((address, index) => (
                <div key={index} className='flex justify-content-between align-items-center border-bottom-1 surface-border'>
                    <div className="flex align-items-center">
                        
                        <RadioButton
                            inputId={`address${index}`}
                            name="shippingAddress"
                            value={address.id} 
                            checked={selectedShippingAddressId === address.id}
                            onChange={() => setSelectedShippingAddressId(address.id)}
                        />
                        <label htmlFor={`address${index}`} className="ml-2">
                            <p>{address.fullName}</p>
                            <p>เบอร์โทร {address.phoneNumber}</p>
                            <p>{address.addressLine}, {address.tambon}, {address.amphure}, {address.province}</p>
                            <p className={address.isDefault ? 'w-fit px-1 border-1 border-round border-primary' : ''}>{address.isDefault ? 'ค่าเริ่มต้น' : ''}</p>
                        </label>
                    </div>
                    <div className='text-right'>
                        <div className='flex gap-2 justify-content-end'>
                            <p className='text-blue-500' onClick={() => { setSelectedShippingAddressId(address.id); setVisible1(true); }}>แก้ไข</p>
                            <p className='text-blue-500 cursor-pointer' onClick={() => { setSelectedShippingAddressId(address.id); setVisible2(true); }}>ลบ</p>
                        </div>
                        <Button label='ตั้งเป็นค่าเริ่มต้น' outlined className='px-2 py-1 text-900 border-primary' />
                    </div>
                </div>
            ))} */}

                <div className='flex justify-content-end gap-3 mt-4'>
                    <Button onClick={() => setVisible2(false)} label='ยกเลิก' className="text-900 border-primary" outlined />
                    <Button label='ยืนยัน' />

                </div>
            </Dialog>
        </div>


    )
}

export default CheckoutPage