import React, { useEffect, useState } from 'react';

function CalculatePackage() {
    const [productQty, setProductQty] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');

    const packageGroup = [
        { id: 1, package_qty: 1 },
        { id: 2, package_qty: 2 },
        { id: 3, package_qty: 3 },
        { id: 4, package_qty: 9 },
        { id: 5, package_qty: 18 },
    ];

    const deliveryGroup = [
        { id: 1, packageGroup_id: 1, delivery_price: 50 },
        { id: 2, packageGroup_id: 2, delivery_price: 80 },
        { id: 3, packageGroup_id: 3, delivery_price: 120 },
        { id: 4, packageGroup_id: 4, delivery_price: 250 },
        { id: 5, packageGroup_id: 5, delivery_price: 450 },
    ];

    const calculatePackageDistribution = () => {
        let remainingQty = productQty;
        const distribution = [];
        const selectedPackage = selectedOption ? packageGroup.find(pkg => pkg.id === Number(selectedOption)) : null;

        if (selectedPackage) {
            const selectedCount = Math.floor(remainingQty / selectedPackage.package_qty);
            if (selectedCount > 0) {
                distribution.push({ id: selectedPackage.id, qty: selectedCount });
                remainingQty -= selectedCount * selectedPackage.package_qty;
            } else if (remainingQty < selectedPackage.package_qty) {
                distribution.push({ id: selectedPackage.id, qty: 1 });
                remainingQty = 0;
            }
        }

        const sortedPackages = [...packageGroup].sort((a, b) => b.package_qty - a.package_qty);
        for (const pkg of sortedPackages) {
            if (remainingQty >= pkg.package_qty) {
                const count = Math.floor(remainingQty / pkg.package_qty);
                distribution.push({ id: pkg.id, qty: count });
                remainingQty -= count * pkg.package_qty;
            }
        }

        return distribution;
    };

    const calculateTotalCost = () => {
        const distribution = calculatePackageDistribution();
        let totalCost = 0;

        for (const { id, qty } of distribution) {
            const deliveryPrice = deliveryGroup.find(del => del.packageGroup_id === id)?.delivery_price || 0;
            totalCost += deliveryPrice * qty;
        }

        return totalCost;
    };

    const getBreakdownMessage = () => {
        const distribution = calculatePackageDistribution();
        if (distribution.length === 0) return 'No packages selected or quantity is zero.';

        const breakdown = distribution
            .map(({ id, qty }) => `Package ID ${id}: ${qty} unit(s)`)
            .join(', ');

        return `For a total of ${productQty} products: ${breakdown}. Total Cost: ${calculateTotalCost()}฿`;
    };
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>Packaging Cost Calculator</h2>
            <div>
                <label>Enter Product Quantity: </label>
                <input
                    type="number"
                    value={productQty}
                    onChange={(e) => setProductQty(Math.max(0, Number(e.target.value)))}
                    min="0"
                    placeholder="Enter quantity"
                />
            </div>

            <div style={{ marginTop: '20px' }}>
                <h4>Select Package Option:</h4>
                {packageGroup.map(pkg => (
                    <div key={pkg.id}>
                        <label>
                            <input
                                type="radio"
                                value={pkg.id}
                                checked={selectedOption === String(pkg.id)}
                                onChange={(e) => setSelectedOption(e.target.value)}
                            />
                            Package for {pkg.package_qty} product(s) (Delivery Cost: {deliveryGroup.find(del => del.packageGroup_id === pkg.id)?.delivery_price}฿)
                        </label>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '20px' }}>
                {productQty > 0 && (
                    <div>
                        <h3>{getBreakdownMessage()}</h3>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CalculatePackage

// in checkout page
// if product_qty = 7
// option
// - 1. package_qty_1 = 33฿ //package for 1 product_qty
// - 2. package_qty_5 = 501฿ //package for 5 product_qty
// if user selected for first option 
// will calculate cost by product_qty(7) * package_qty_1(33) = 7*33 = 231฿ //7 of package_qty_1 for 7 of product_qty. //เอา product_qty มาคูณกับ price เลย
// if user selected for second option 
// will calculate cost by product_qty(1)(that have 5 product_qty to put in package_qty_5) * package_qty_5(501) + product_qty(2) * package_qty_1(33) = 501 + 2(33) = 567฿
// //เอา product_qty ไป mod กับ package_qty แล้ว product_qty ที่เหลือ ให้ คำนวณ package_qty ที่เหมาะสมแล้วยิง api get price มาคำนวณ
// import React, { useEffect, useState } from 'react';
// import { useCart } from '../router/CartContext';
// import axios from "axios";

// function CalculatePackage({ productQty, selectedOption }) {
//     const apiUrl = import.meta.env.VITE_REACT_APP_API_PLATFORM;
//     const [user, setUser] = useState(null);
//     const [address, setAddress] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [loadingState, setLoadingState] = useState({});
//     const [error, setError] = useState(false);
//     const { selectedItemsCart, placeCartDetail } = useCart();

//     const [allPackageOptions, setAllPackageOptions] = useState({});
//     const [allPackageDeliveries, setAllPackageDeliveries] = useState({});

//     const apiProductUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;
//     useEffect(() => {
//         const fetchUserData = async () => {
//             const token = localStorage.getItem("token");
//             try {
//                 const res = await axios.post(`${apiUrl}/me`, null, {
//                     headers: { "auth-token": token }
//                 });
//                 setUser(res.data.data);
//                 setAddress(res.data.data.current_address);
//             } catch (err) {
//                 console.error("Error fetching user data", err.response?.data || err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchUserData();
//     }, [apiUrl]);

//     useEffect(() => {
//         if (Object.keys(selectedItemsCart).length > 0) {
//             let allPackageOptions = {};

//             Object.values(selectedItemsCart).forEach(partner => {
//                 const partnerId = partner.partner_id;
//                 partner.products.forEach(product => {
//                     const productId = product.product_id;
//                     const packageOptions = product.product_package_options || [];
//                     allPackageOptions = {
//                         ...allPackageOptions,
//                         [partnerId]: {
//                             ...allPackageOptions[partnerId],
//                             [productId]: {
//                                 product_package_options: packageOptions
//                             }
//                         }
//                     };
//                 });
//             });

//             setAllPackageOptions(prevState => ({
//                 ...prevState,
//                 ...allPackageOptions
//             }));
//         }
//     }, [setAllPackageOptions]);

//     useEffect(() => {
//         if (loading || !user || !address) return;

//         let activeRequests = 0;
//         const selectedPartners = Object.keys(allPackageOptions);

//         if (selectedPartners.length === 0) return;

//         setLoading(true);
//         selectedPartners.forEach(partnerId => {
//             const selectedProducts = Object.keys(allPackageOptions[partnerId]);
//             selectedProducts.forEach(async productId => {
//                 const packageOption = allPackageOptions[partnerId][productId]?.product_package_options;
//                 if (packageOption) {
//                     activeRequests++;
//                     try {
//                         await handleCheckDeliveryCost(partnerId, productId, allPackageOptions[partnerId][productId]);
//                     } finally {
//                         activeRequests--;
//                         if (activeRequests === 0) {
//                             setLoading(false);
//                         }
//                     }
//                 }
//             });
//         });
//     }, [allPackageOptions, user, address]);

//     const handleCheckDeliveryCost = async (partner_id, productId, product) => {
//         try {
//             const res = await axios.get(`${apiProductUrl}/partner/byid/${partner_id}`);
//             const partner = res.data.data;

//             if (!partner) {
//                 throw new Error("Partner data not found");
//             }

//             if (!user || !address) {
//                 console.error("User or address data is not yet available.");
//                 return;
//             }

//             // Iterate through package options
//             for (const packageId of Object.keys(product.product_package_options)) {
//                 const packageOption = product.product_package_options[packageId];

//                 const packageDetails = {
//                     from: {
//                         name: partner.partner_name,
//                         address: partner.partner_address,
//                         district: partner.partner_district,
//                         state: partner.partner_amphure,
//                         province: partner.partner_province,
//                         postcode: partner.partner_postcode,
//                         tel: partner.partner_phone,
//                     },
//                     to: {
//                         name: address?.customer_name || `${user?.firstname} ${user?.lastname}`,
//                         address: address?.customer_address || address?.address,
//                         district: address?.customer_tambon?.name_th || address?.subdistrict,
//                         state: address?.customer_amphure?.name_th || address?.district,
//                         province: address?.customer_province?.name_th || address?.province,
//                         postcode: address?.customer_zipcode || address?.postcode,
//                         tel: address?.customer_telephone || user?.tel,
//                     },
//                     parcel: {
//                         name: `สินค้าชิ้นที่ ${productId}`,
//                         weight: packageOption.package_weight,
//                         width: packageOption.package_width,
//                         length: packageOption.package_length,
//                         height: packageOption.package_height,
//                     },
//                 };

//                 const token = localStorage.getItem("token");
//                 const response = await axios.post(`${apiUrl}/e-market/express/price`, packageDetails, {
//                     headers: { "auth-token": token }
//                 });
//                 if (response.data && response.data.status) {
//                     const deliveryOptions = response.data.new;
//                     setAllPackageDeliveries(prevState => ({
//                         ...prevState,
//                         [partner_id]: {
//                             ...prevState[partner_id],
//                             [productId]: {
//                                 ...prevState[partner_id]?.[productId],
//                                 [packageId]: {
//                                     ...packageOption,
//                                     courier_code: deliveryOptions[0].courier_code,
//                                     price: deliveryOptions[0].price
//                                 }
//                             }
//                         }
//                     }));
//                     setError(null);
//                 } else {
//                     setError(response.data.message || "Order failed");
//                 }
//             }
//             // console.log('allPackageOptions', allPackageOptions)
//             // console.log('allPackageDeliveries', allPackageDeliveries)
//         } catch (error) {
//             console.log(error)
//         }
//     };

//     const calculatePackageDistribution = () => {
//         let remainingQty = productQty;
//         const distribution = [];

//         // Find the selected package by its ID
//         Object.keys(allPackageDeliveries).forEach(partnerId => {
//             Object.keys(allPackageDeliveries[partnerId]).forEach(productId => {
//                 const packageOptions = allPackageDeliveries[partnerId][productId];

//                 Object.values(packageOptions).forEach(pkg => {
//                     const count = Math.floor(remainingQty / pkg.package_qty);
//                     if (count > 0) {
//                         distribution.push({
//                             _id: pkg._id,
//                             qty: count,
//                             courier_code: pkg.courier_code,
//                             package_qty: pkg.package_qty,
//                             price: pkg.price
//                         });
//                         remainingQty -= count * pkg.package_qty;
//                     }
//                 });
//             });
//         });

//         // Handle any remaining items that don't fit into a full package
//         if (remainingQty > 0) {
//             Object.keys(allPackageDeliveries).forEach(partnerId => {
//                 Object.keys(allPackageDeliveries[partnerId]).forEach(productId => {
//                     const packageOptions = allPackageDeliveries[partnerId][productId];
//                     const availablePackages = Object.values(packageOptions);

//                     for (const pkg of availablePackages) {
//                         if (remainingQty >= pkg.package_qty) {
//                             distribution.push({
//                                 _id: pkg._id,
//                                 qty: 1, // For the remaining item, we can only add one
//                                 courier_code: pkg.courier_code,
//                                 package_qty: pkg.package_qty,
//                                 price: pkg.price
//                             });
//                             remainingQty = 0; // All remaining items accounted for
//                             break;
//                         }
//                     }
//                 });
//             });
//         }
//         return distribution;
//     };

//     const calculateTotalCost = () => {
//         const distribution = calculatePackageDistribution();
//         let totalCost = 0;

//         distribution.forEach(({ _id, qty }) => {
//             let packagePrice = 0;

//             Object.keys(allPackageDeliveries).forEach(partnerId => {
//                 Object.keys(allPackageDeliveries[partnerId]).forEach(productId => {
//                     const packageOptions = allPackageDeliveries[partnerId][productId];

//                     const selectedPackage = Object.values(packageOptions).find(pkg => pkg._id === _id);

//                     if (selectedPackage) {
//                         packagePrice = selectedPackage.price;
//                     }
//                 });
//             });

//             totalCost += packagePrice * qty;
//         });

//         return totalCost;
//     };

//     const getBreakdownMessage = () => {
//         const distribution = calculatePackageDistribution();
//         if (distribution.length === 0) return null;

//         const totalCost = calculateTotalCost();
//         return (
//             <div>
//                 {distribution.map(({ _id, qty, courier_code, package_qty, price }) => {
//                     return (
//                         <div className="mt-3" key={_id}>
//                             <div className="flex justify-content-between">
//                                 <p className="m-0">ใช้กล่องขนาดบรรจุ {package_qty} ชิ้น</p>
//                                 <p className="m-0">x{qty}</p>
//                             </div>
//                             <div className="flex justify-content-between">
//                                 <p className="m-0">จัดส่งโดย {courier_code}</p>
//                                 <p className="m-0 font-semibold">รวม ฿{price * qty}</p>
//                             </div>
//                         </div>
//                     );
//                 })}
//                 <p className="text-right font-semibold">รวมค่าจัดส่งทั้งหมดของสินค้านี้ ฿{totalCost}</p>
//             </div>
//         );
//     };

//     return (
//         <div style={{ padding: '20px', fontFamily: 'Arial' }}>
//             <h2>Packaging Cost Calculator</h2>
//             <p>{selectedOption}</p>
//             <div style={{ marginTop: '20px' }}>
//                 {productQty > 0 && (
//                     <div>
//                         <h3>{getBreakdownMessage()}</h3>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default CalculatePackage

// in checkout page
// if product_qty = 7
// option
// - 1. package_qty_1 = 33฿ //package for 1 product_qty
// - 2. package_qty_5 = 501฿ //package for 5 product_qty
// if user selected for first option
// will calculate cost by product_qty(7) * package_qty_1(33) = 7*33 = 231฿ //7 of package_qty_1 for 7 of product_qty. //เอา product_qty มาคูณกับ price เลย
// if user selected for second option
// will calculate cost by product_qty(1)(that have 5 product_qty to put in package_qty_5) * package_qty_5(501) + product_qty(2) * package_qty_1(33) = 501 + 2(33) = 567฿
// //เอา product_qty ไป mod กับ package_qty แล้ว product_qty ที่เหลือ ให้ คำนวณ package_qty ที่เหมาะสมแล้วยิง api get price มาคำนวณ