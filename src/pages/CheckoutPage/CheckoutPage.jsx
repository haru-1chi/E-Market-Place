import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from '../../router/CartContext';
import { RadioButton } from 'primereact/radiobutton';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { Dialog } from "primereact/dialog";
import { Checkbox } from 'primereact/checkbox';
import Footer from "../../component/Footer";
import ProvinceSelection from "../../component/ProvinceSelection";
// import CalculatePackage from "../../component/CalculatePackage";
// import CalculatePackageCopy from "../../component/CalculatePackageCopy";
import img_placeholder from '../../assets/img_placeholder.png';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';

function CheckoutPage() {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_PLATFORM;
    const apiProductUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;
    const [user, setUser] = useState(null);
    const [address, setAddress] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingState, setLoadingState] = useState({});
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const { selectedItemsCart, placeCartDetail } = useCart();
    const [error, setError] = useState(false);
    const [test, setTest] = useState([]);
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.post(`${apiUrl}/me`, null, {
                    headers: { "auth-token": token }
                });
                setUser(res.data.data);
                setAddress(res.data.data.current_address);
            } catch (err) {
                console.error("Error fetching user data", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [apiUrl]);

    //vที่อยู่จัดส่ง
    const [addressFormData, setAddressFormData] = useState({
        label: '',
        customer_name: '',
        customer_telephone: '',
        customer_address: '',
        customer_province: '',
        customer_amphure: '',
        customer_tambon: '',
        customer_zipcode: '',
        isDefault: false
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [isUsingNewAddress, setIsUsingNewAddress] = useState(false);

    const handleAddressInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        setAddressFormData({
            ...addressFormData,
            [id]: type === 'checkbox' ? checked : value
        });
    };

    const validateForm = () => {
        const errors = {};
        if (!addressFormData.customer_name) errors.customer_name = 'กรุณากรอกชื่อ-นามสกุล';
        if (!addressFormData.customer_telephone) errors.customer_telephone = 'กรุณากรอกหมายเลขโทรศัพท์';
        if (!addressFormData.customer_address) errors.customer_address = 'กรุณากรอกที่อยู่';
        if (!addressFormData.customer_province) errors.customer_province = 'กรุณาเลือกจังหวัด';
        if (!addressFormData.customer_amphure) errors.customer_amphure = 'กรุณาเลือกอำเภอ';
        if (!addressFormData.customer_tambon) errors.customer_tambon = 'กรุณาเลือกตำบล';
        if (!addressFormData.customer_zipcode) errors.customer_zipcode = 'กรุณากรอกรหัสไปรษณีย์';

        return errors;
    };

    const handleConfirmNewAddress = () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        setAddress({
            ...addressFormData,
        });
        setIsUsingNewAddress(true);
        setVisible1(false);
    };
    //^ที่อยู่จัดส่ง

    //vตัวเลือกขนาดพัสดุ checkPoint1
    const [allPackageOptions, setAllPackageOptions] = useState({});
    const [allPackageDeliveries, setAllPackageDeliveries] = useState({});
    const [sumTotalDeliveries, setSumTotalDeliveries] = useState({});
    //^ตัวเลือกขนาดพัสดุ checkPoint1

    //v map สินค้า และคำนวณสินค้า
    const [totalProductPrice, setTotalProductPrice] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [totalVat, setTotalVat] = useState(0);
    const [totalDeliveryPrice, setTotalDeliveryPrice] = useState(0);
    const [totalPayable, setTotalPayable] = useState(0);

    useEffect(() => {
        if (Object.keys(selectedItemsCart).length > 0) {
            let totalProductPrice = 0;
            let totalPayable = 0;
            let totalDiscount = 0;
            let totalVat = 0;
            let totalDeliveryPrice = 0;

            Object.values(selectedItemsCart).forEach(partner => {
                const totalPartnerPrice = partner.products.reduce((sum, product) => {
                    return sum + (product.product_price * product.product_qty);
                }, 0);

                const partnerDiscount = 0;
                const partnerVat = totalPartnerPrice * 7 / 107;

                totalProductPrice += totalPartnerPrice
                totalPayable += totalPartnerPrice;
                totalDiscount += partnerDiscount;
                totalVat += partnerVat;
            });

            if (sumTotalDeliveries && Object.keys(sumTotalDeliveries).length > 0) {
                totalDeliveryPrice = Object.values(sumTotalDeliveries).reduce((sum, partner) => {
                    return sum + Object.values(partner).reduce((innerSum, product) => {
                        return innerSum + Object.values(product).reduce((deliverySum, deliveryDetail) => {
                            return deliverySum + (deliveryDetail.total_price || 0);
                        }, 0);
                    }, 0);
                }, 0);
            }
            totalPayable += totalDeliveryPrice
            setTotalProductPrice(totalProductPrice);
            setTotalPayable(totalPayable);
            setTotalDiscount(totalDiscount);
            setTotalVat(totalVat);
            setTotalDeliveryPrice(totalDeliveryPrice);
        }
    }, [selectedItemsCart, sumTotalDeliveries, address]);

    const groupByPartner = useMemo(() => {
        return Object.keys(selectedItemsCart).reduce((result, key) => {
            const partner = selectedItemsCart[key];
            const partner_id = partner.partner_id;
            const partner_name = partner.partner_name;

            if (!result[partner_id]) {
                result[partner_id] = {
                    partner_name: partner_name,
                    products: []
                };
            }

            partner.products.forEach(product => {
                const product_id = product.product_id;
                const deliveryCompanies = allPackageDeliveries?.[partner_id]?.[product_id]?.options || [];

                result[partner_id].products.push({
                    ...product,
                    deliveryCompanies,
                });
            });

            return result;
        }, {});
    }, [selectedItemsCart, allPackageDeliveries]);
    //^ map สินค้า

    //vตัวเลือกขนาดพัสดุ checkPoint2
    useEffect(() => {
        if (Object.keys(selectedItemsCart).length > 0) {
            let allPackageOptions = {};

            Object.values(selectedItemsCart).forEach(partner => {
                const partnerId = partner.partner_id;
                partner.products.forEach(product => {
                    const productId = product.product_id;
                    const packageOptions = product.product_package_options || [];
                    allPackageOptions = {
                        ...allPackageOptions,
                        [partnerId]: {
                            ...allPackageOptions[partnerId],
                            [productId]: {
                                product_package_options: packageOptions
                            }
                        }
                    };
                });
            });

            setAllPackageOptions(prevState => ({
                ...prevState,
                ...allPackageOptions
            }));
        }
        localStorage.setItem('allPackageOptions', JSON.stringify(allPackageOptions));
        localStorage.setItem('allPackageDeliveries', JSON.stringify(allPackageDeliveries));
        localStorage.setItem('sumTotalDeliveries', JSON.stringify(sumTotalDeliveries));

    }, [setAllPackageOptions]);



    useEffect(() => {

        if (loading || !user || !address) return;

        let activeRequests = 0;
        const selectedPartners = Object.keys(allPackageOptions);

        if (selectedPartners.length === 0) return;

        setLoading(true);
        selectedPartners.forEach(partnerId => {
            const selectedProducts = Object.keys(allPackageOptions[partnerId]);
            selectedProducts.forEach(async productId => {
                const packageOption = allPackageOptions[partnerId][productId]?.product_package_options;
                if (packageOption) {
                    activeRequests++;
                    try {
                        await handleCheckDeliveryCost(partnerId, productId, allPackageOptions[partnerId][productId]);
                    } finally {
                        activeRequests--;
                        if (activeRequests === 0) {
                            setLoading(false);
                        }
                    }
                }
            });
        });
    }, [allPackageOptions, user, address]);

    const handleCheckDeliveryCost = async (partner_id, productId, product) => {
        try {
            const res = await axios.get(`${apiProductUrl}/partner/byid/${partner_id}`);
            const partner = res.data.data;

            if (!partner) {
                throw new Error("Partner data not found");
            }

            if (!user || !address) {
                console.error("User or address data is not yet available.");
                return;
            }

            // Iterate through package options
            for (const packageId of Object.keys(product.product_package_options)) {
                const packageOption = product.product_package_options[packageId];

                const packageDetails = {
                    from: {
                        name: partner.partner_name,
                        address: partner.partner_address,
                        district: partner.partner_district,
                        state: partner.partner_amphure,
                        province: partner.partner_province,
                        postcode: partner.partner_postcode,
                        tel: partner.partner_phone,
                    },
                    to: {
                        name: address?.customer_name || `${user?.fristname} ${user?.lastname}`,
                        address: address?.customer_address || address?.address,
                        district: address?.customer_tambon?.name_th || address?.subdistrict,
                        state: address?.customer_amphure?.name_th || address?.district,
                        province: address?.customer_province?.name_th || address?.province,
                        postcode: address?.customer_zipcode || address?.postcode,
                        tel: address?.customer_telephone || user?.tel
                    },
                    parcel: {
                        name: `สินค้าชิ้นที่ ${productId}`,
                        weight: packageOption.package_weight,
                        width: packageOption.package_width,
                        length: packageOption.package_length,
                        height: packageOption.package_height,
                    },
                };
                console.log(packageDetails)
                const token = localStorage.getItem("token");
                const response = await axios.post(`${apiUrl}/e-market/express/price`, packageDetails, {
                    headers: { "auth-token": token }
                });
                console.log(response.data)
                if (response.data && response.data.status) {
                    const deliveryOptions = response.data.new;
                    setAllPackageDeliveries(prevState => ({
                        ...prevState,
                        [partner_id]: {
                            ...prevState[partner_id],
                            [productId]: {
                                ...prevState[partner_id]?.[productId],
                                [packageId]: {
                                    ...packageOption,
                                    courier_code: deliveryOptions[0].courier_code,
                                    price: deliveryOptions[0].price
                                }
                            }
                        }
                    }));
                    setError(null);
                } else {
                    setError(response.data.message || "Order failed");
                }
            }
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        Object.keys(groupByPartner).forEach((partner_id) => {
            const partner = groupByPartner[partner_id];
            const { products } = partner;

            products.forEach((product) => {
                const distribution = calculatePackageDistribution(product.product_qty);

                setSumTotalDeliveries(prevState => ({
                    ...prevState,
                    [partner_id]: {
                        ...prevState[partner_id],
                        [product.product_id]: {
                            ...prevState[partner_id]?.[product.product_id],
                            ...distribution
                        }
                    }
                }));
            });
        });
        localStorage.setItem('sumTotalDeliveries', JSON.stringify(sumTotalDeliveries)); //ไว้เช็ต data structure
    }, [groupByPartner, address, user]);

    const calculatePackageDistribution = (product_qty) => {
        let remainingQty = product_qty;
        const distribution = [];

        Object.keys(allPackageDeliveries).forEach(partnerId => {
            Object.keys(allPackageDeliveries[partnerId]).forEach(productId => {
                const packageOptions = allPackageDeliveries[partnerId][productId];
                const sortedPackages = Object.values(packageOptions).sort((a, b) => b.package_qty - a.package_qty);

                for (const pkg of sortedPackages) {
                    if (remainingQty >= pkg.package_qty) {
                        const count = Math.floor(remainingQty / pkg.package_qty);
                        if (count > 0) {
                            distribution.push({
                                _id: pkg._id,
                                amount: count,
                                delivery_company: pkg.courier_code,
                                package_qty: pkg.package_qty,
                                package_weight: pkg.package_weight,
                                package_width: pkg.package_width,
                                package_length: pkg.package_length,
                                package_height: pkg.package_height,
                                delivery_price: pkg.price,
                                total_price: pkg.price * count
                            });
                            remainingQty -= count * pkg.package_qty;
                        }
                    }
                }
            });
        });
        return distribution;
    };

    const calculateTotalCost = (partner_id, product_id, product_qty) => {
        const distribution = calculatePackageDistribution(partner_id, product_id, product_qty);
        let totalCost = 0;

        distribution.forEach(({ delivery_price, amount }) => {
            totalCost += delivery_price * amount;
        });

        return totalCost;
    };

    const getBreakdownMessage = (product_qty) => {
        const distribution = calculatePackageDistribution(product_qty);
        // calculateTotalCost(product_qty)
        if (distribution.length === 0) return <p>ยังไม่ได้เลือกกล่องพัสดุของทางร้าน</p>;
        console.log(distribution)
        return (
            <div className='flex justify-content-end'>
                <div>
                    {distribution.map(({ package_qty, amount, delivery_company, delivery_price }, index) => (
                        <div className="w-20rem mt-2" key={index}>
                            <div className=" grid grid-nogutter justify-content-end align-items-center">
                                <p className=" col m-0 text-right bg-primary-200 border-none border-round-lg border-noround-right border-noround-bottom">ใช้กล่องขนาดบรรจุ {package_qty} ชิ้น</p>
                                <p className=" col-4 m-0 text-right bg-primary-100  border-none border-round-lg border-noround-left border-noround-bottom">x{amount}</p>
                            </div>
                            <div className="grid grid-nogutter justify-content-end align-items-center">
                                <p className="col m-0 text-right bg-primary-100">จัดส่งโดย {delivery_company}</p>
                                <p className="col-4 m-0 font-semibold text-right bg-primary-100">รวม ฿{delivery_price * amount}</p>
                            </div>
                        </div>
                    ))}
                    <p className="m-0 mt-2 font-semibold text-right">รวมค่าจัดส่งทั้งหมดของสินค้านี้ ฿{calculateTotalCost(product_qty)}</p>
                </div>
            </div>
        );
    };

    //ConfirmPayment
    const handleConfirmPayment = () => {
        const deliveryDetails = Object.entries(sumTotalDeliveries).map(([partnerId, products]) => {
            return {
                partner_id: partnerId,
                byproducts_detail: Object.entries(products).map(([productId, deliveries]) => {
                    return {
                        product_id: productId,
                        packages: Object.values(deliveries).map(delivery => ({
                            package_qty: delivery.package_qty,
                            package_weight: delivery.package_weight,
                            package_width: delivery.package_width,
                            package_length: delivery.package_length,
                            package_height: delivery.package_height,
                            delivery_company: delivery.delivery_company,
                            delivery_price: delivery.delivery_price,
                            delivery_totalprice: delivery.total_price,
                            amount: delivery.amount,
                        }))
                    };
                })
            };
        });

        const orderDetails = {
            // partner_id: selectedItemsCart,
            amountPayment: totalPayable, // Total payable for all bills
            customer_id: user._id,
            customer_name: address?.customer_name || user?.fristname + " " + user?.lastname,
            customer_address: address?.customer_address || address?.address,
            customer_tambon: address?.customer_tambon?.name_th || address?.subdistrict,
            customer_amphure: address?.customer_amphure?.name_th || address?.district,
            customer_province: address?.customer_province?.name_th || address?.province,
            customer_zipcode: address?.customer_zipcode || address?.postcode,
            customer_telephone: address?.customer_telephone || user.tel,
            delivery_detail: deliveryDetails
        };

        console.log(orderDetails);

        placeCartDetail(orderDetails);
        navigate("/PaymentPage");
    };


    return (

        <div className="min-h-screen flex flex-column justify-content-between w-full">
            <div className="mx-2 sm:px-2 md:px-4 lg:px-6 xl:px-8 mb-3">
                <h1 className='flex font-semibold m-0 p-0 py-2'>ทำการสั่งซื้อ</h1>
                <div className='w-full gap-4 lg:flex justify-content-between'>
                    <div className='w-full lg:w-9 flex flex-column gap-2'>

                        {/* ที่อยู่จัดส่ง */}
                        <div className='address p-3 border-1 surface-border border-round bg-white border-round-mb flex flex-column justify-content-center'>
                            <div className='flex justify-content-between mb-2'>
                                <div className='flex align-items-center mb-2'>
                                    <i className="m-0 mr-2 pi pi-map-marker"></i>
                                    <h2 className='m-0 font-semibold'>ที่อยู่สำหรับจัดส่ง</h2>
                                </div>
                                <div>
                                    <p className='text-blue-500 cursor-pointer' onClick={() => { setVisible1(true); }}>ใช้ที่อยู่ใหม่</p>
                                </div>
                            </div>

                            {user && address && (
                                <div className="flex justify-content-between">
                                    <div>
                                        <p className='m-0'>ชื่อ: {address.customer_name || (user.fristname + ' ' + user.lastname)}</p>
                                        <p className='m-0'>เบอร์โทร: {address.customer_telephone || user.tel}</p>
                                        <p className='m-0'>ที่อยู่: {`${address.customer_address || address?.address}, ${address.customer_tambon?.name_th || address?.subdistrict}, ${address.customer_amphure?.name_th || address?.district}, ${address.customer_province?.name_th || address?.province}, ${address.customer_zipcode || address?.postcode}`}</p>
                                        {!isUsingNewAddress ? <p className='w-fit px-1 border-1 border-round border-primary'>ค่าเริ่มต้น</p> : <p className='w-fit px-1 border-1 border-round border-primary'>ใช้ที่อยู่ใหม่</p>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* map สินค้า และตัวเลือกขนาดพัสดุ */}
                        {Object.keys(groupByPartner).map((partner_id, index) => {
                            const partner = groupByPartner[partner_id];
                            const { partner_name, products } = partner;
                            const totalItems = products.reduce((acc, product) => acc + product.product_qty, 0);
                            const totalPrice = products.reduce((acc, product) => acc + product.product_price * product.product_qty, 0);
                            const totalPriceBeforeVat = (totalPrice * 100) / 107;
                            const discount = 0;
                            const vat = (totalPrice * 7) / 107;
                            const summaryPrice = totalPriceBeforeVat - discount + vat;

                            const totalDeliveryPrice = Object.values(sumTotalDeliveries?.[partner_id] || {}).reduce((acc, product) => {
                                return acc + Object.values(product).reduce((productAcc, deliveryDetail) => {
                                    return productAcc + (deliveryDetail.total_price || 0); // Sum total_price
                                }, 0);
                            }, 0);
                            const netTotalPrice = totalPrice + totalDeliveryPrice;

                            return (
                                <div key={index} className='flex flex-column p-3 border-1 surface-border border-round bg-white border-round-mb justify-content-center'>
                                    <div className='w-full'>
                                        <Link to={`/ShopPage/${partner_id}`} className="no-underline text-900">
                                            <div className='flex align-items-center mb-2'>
                                                <i className="pi pi-shop mr-1"></i>
                                                <h4 className='m-0 font-semibold'>ผู้ขาย {partner_name}</h4>
                                            </div>
                                        </Link>
                                        {products.map((product, idx) => (
                                            <div key={idx} className="cart-items align-items-center py-2 border-bottom-2 border-yellow-400">
                                                <div className="w-full flex align-items-center">
                                                    <img
                                                        src={`${product.product_image ? apiProductUrl + product.product_image : product.product_subimage1 ? apiProductUrl + product.product_subimage1 : product.product_subimage2 ? apiProductUrl + product.product_subimage2 : product.product_subimage3 ? apiProductUrl + product.product_subimage3 : img_placeholder}`}
                                                        alt={product.product_name}
                                                        width={50}
                                                        height={50}
                                                        className="border-1 border-round-lg surface-border"
                                                        onError={(e) => { e.target.src = img_placeholder; }}
                                                    />
                                                    <div className="w-full flex flex-column ml-3">
                                                        <span className="mb-1 font-normal">{product.product_name}</span>
                                                        <div className="flex justify-content-between">
                                                            <span>฿{Number(product.product_price).toLocaleString('en-US')}</span>
                                                            <span>x{product.product_qty}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ตัวเลือกขนาดพัสดุ */}
                                                {
                                                    product.product_package_options.length > 0 && (
                                                        <>
                                                            <div className=" pt-3">
                                                                <p className="p-0 m-0">กรุณาเลือกขนาดกล่องพัสดุของทางร้าน</p>
                                                                <div className="grid grid-nogutter gap-2 ml-5 mr-2 mt-3">
                                                                    <label className="col text-xs font-medium text-gray-700 text-center">จำนวนสินค้าสูงสุดต่อกล่อง(ชิ้น)</label>
                                                                    <label className="col text-xs font-medium text-gray-700 text-center">น้ำหนักสินค้า(กรัม)</label>
                                                                    <label className="col text-xs font-medium text-gray-700 text-center">ความกว้างของกล่อง(ซม.)</label>
                                                                    <label className="col text-xs font-medium text-gray-700 text-center">ความยาวของกล่อง(ซม.)</label>
                                                                    <label className="col text-xs font-medium text-gray-700 text-center">ความสูงของกล่อง(ซม.)</label>
                                                                </div>
                                                                {product.product_package_options
                                                                    .filter((option) => {
                                                                        if (product.product_package_options.length === 1) {
                                                                            return true;
                                                                        }
                                                                        return (
                                                                            product.product_qty === option.package_qty ||
                                                                            product.product_package_options.every((po) => product.product_qty !== po.package_qty)
                                                                        );
                                                                    })
                                                                    .map((option) => (
                                                                        <div key={option._id} className="flex align-items-center p-2 border-1 surface-border border-round mb-2">
                                                                            <div htmlFor={option._id} className="w-full grid grid-nogutter gap-2">
                                                                                <label className="col text-md font-medium text-gray-700 text-center">{option.package_qty}</label>
                                                                                <label className="col text-md font-medium text-gray-700 text-center">{option.package_weight}</label>
                                                                                <label className="col text-md font-medium text-gray-700 text-center">{option.package_width}</label>
                                                                                <label className="col text-md font-medium text-gray-700 text-center">{option.package_length}</label>
                                                                                <label className="col text-md font-medium text-gray-700 text-center">{option.package_height}</label>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                            </div>

                                                            {getBreakdownMessage(product.product_qty)}

                                                        </>
                                                    )}
                                            </div>
                                        ))}
                                        <div className="border-top-1 surface-border pt-3">
                                            <div className="flex justify-content-between">
                                                <p className="p-0 m-0">ราคาสินค้าทั้งหมด ({totalItems} ชิ้น):</p>
                                                <p className="p-0 m-0 font-semibold">฿{totalPriceBeforeVat.toLocaleString('en-US')}</p>
                                            </div>
                                            <div className="flex justify-content-between">
                                                <p className="p-0 m-0">ส่วนลดร้านค้า:</p>
                                                <p className="p-0 m-0 font-semibold">-฿{discount}</p>
                                            </div>
                                            <div className="flex justify-content-between">
                                                <p className="p-0 m-0">vat 7%:</p>
                                                <p className="p-0 m-0 font-semibold">฿{vat.toLocaleString('en-US')}</p>
                                            </div>
                                            <div className="flex justify-content-between">
                                                <p className="p-0 m-0">รวม:</p>
                                                <p className="p-0 m-0 font-semibold">฿{summaryPrice.toLocaleString('en-US')}</p>
                                            </div>
                                            <div className="flex justify-content-between">
                                                <p className="p-0 m-0">ค่าขนส่ง:</p>
                                                <p className="p-0 m-0 font-semibold">฿{totalDeliveryPrice}</p>
                                            </div>
                                            <div className="flex justify-content-between">
                                                <p className="p-0 m-0">ราคาสุทธิ:</p>
                                                <p className="p-0 m-0 font-semibold">฿{netTotalPrice.toLocaleString('en-US')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>

                    <div className='mt-2 lg:mt-0 w-full lg:w-4 h-fit flex flex-column border-1 surface-border border-round py-3 px-3 bg-white border-round-mb mb-2'>
                        <h3 className="m-0 p-0 pb-2 font-semibold">ข้อมูลการชำระเงิน</h3>
                        <div className="flex justify-content-between py-1">
                            <p className='m-0'>ส่วนลดร้านค้าทั้งหมด</p>
                            <p className='m-0 text-right'>-฿{Number(totalDiscount.toFixed(2)).toLocaleString('en-US')}</p>
                        </div>
                        <div className="flex justify-content-between py-1">
                            <p className='m-0'>ราคาสินค้าทั้งหมด (รวม vat 7%)</p>
                            <p className='m-0 text-right'>฿{Number(totalProductPrice.toFixed(2)).toLocaleString('en-US')}</p>
                        </div>
                        <div className="flex justify-content-between py-1">
                            <p className='m-0'>ค่าขนส่งทั้งหมด</p>
                            <p className='m-0 text-right'>฿{Number(totalDeliveryPrice.toFixed(2)).toLocaleString('en-US')}</p>
                        </div>
                        <div className="flex justify-content-between py-1">
                            <p className='m-0'>ยอดชำระ</p>
                            <p className='m-0 text-right'>฿{Number(totalPayable.toFixed(2)).toLocaleString('en-US')}</p>
                        </div>
                        <Button className="w-full mt-2" label="ไปหน้าชำระสินค้า" size="small" rounded onClick={handleConfirmPayment} />
                    </div>

                </div >
            </div>


            <Footer />

            {/* ที่อยู่จัดส่ง */}
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
                            <InputText id="customer_name" value={addressFormData.customer_name}
                                onChange={handleAddressInputChange}
                                className='w-full'
                            />
                            <label htmlFor="customer_name">ชื่อ-นามสกุล</label>
                            {validationErrors.customer_name && <small className="p-error">{validationErrors.customer_name}</small>}
                        </FloatLabel>


                        <FloatLabel className='w-full mt-4 md:mt-0'>
                            <InputText id="customer_telephone" value={addressFormData.customer_telephone}
                                onChange={handleAddressInputChange}
                                className='w-full'
                            />
                            <label htmlFor="customer_telephone">หมายเลขโทรศัพท์</label>
                            {validationErrors.customer_telephone && <small className="p-error">{validationErrors.customer_telephone}</small>}
                        </FloatLabel>

                    </div>
                    <div>
                        <InputText id="customer_address" value={addressFormData.customer_address} onChange={handleAddressInputChange} className="w-full" placeholder='บ้านเลขที่, ซอย, หมู่, ถนน' />
                        {validationErrors.customer_address && <small className="p-error">{validationErrors.customer_address}</small>}
                    </div>

                    <ProvinceSelection
                        addressFormData={addressFormData}
                        setAddressFormData={setAddressFormData}
                        validationErrors={validationErrors}
                    />

                    <div className="hidden">
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
                    <Button label='ยืนยัน' onClick={handleConfirmNewAddress} />
                </div>
            </Dialog>

        </div>


    )
}

export default CheckoutPage