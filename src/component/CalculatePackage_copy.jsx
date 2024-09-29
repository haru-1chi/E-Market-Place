import React, { useEffect, useState } from 'react';
import { useCart } from '../router/CartContext';
import axios from "axios";

function CalculatePackageCopy({ productQty, selectedOption }) {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_PLATFORM;
    const [user, setUser] = useState(null);
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allPackageOptions, setAllPackageOptions] = useState({});
    const [allPackageDeliveries, setAllPackageDeliveries] = useState({});
    const { selectedItemsCart } = useCart();

    const apiProductUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;

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
                        name: address?.customer_name || `${user?.firstname} ${user?.lastname}`,
                        address: address?.customer_address || address?.address,
                        district: address?.customer_tambon?.name_th || address?.subdistrict,
                        state: address?.customer_amphure?.name_th || address?.district,
                        province: address?.customer_province?.name_th || address?.province,
                        postcode: address?.customer_zipcode || address?.postcode,
                        tel: address?.customer_telephone || user?.tel,
                    },
                    parcel: {
                        name: `สินค้าชิ้นที่ ${productId}`,
                        weight: packageOption.package_weight,
                        width: packageOption.package_width,
                        length: packageOption.package_length,
                        height: packageOption.package_height,
                    },
                };

                const token = localStorage.getItem("token");
                const response = await axios.post(`${apiUrl}/e-market/express/price`, packageDetails, {
                    headers: { "auth-token": token }
                });
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
                                    courier_name: deliveryOptions[0].courier_name,
                                    price: deliveryOptions[0].price
                                }
                            }
                        }
                    }));
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const calculatePackageDistribution = () => {
        let remainingQty = productQty;
        const distribution = [];

        if (selectedOption) {
            Object.keys(allPackageDeliveries).forEach(partnerId => {
                Object.keys(allPackageDeliveries[partnerId]).forEach(productId => {
                    const packageOptions = allPackageDeliveries[partnerId][productId];
                    const selectedPackage = Object.values(packageOptions).find(pkg => pkg._id === selectedOption);
                    if (selectedPackage) {
                        const selectedCount = Math.floor(remainingQty / selectedPackage.package_qty);
                        if (selectedCount > 0) {
                            distribution.push({
                                _id: selectedPackage._id,
                                qty: selectedCount,
                                courier_name: selectedPackage.courier_name,
                                package_qty: selectedPackage.package_qty,
                                price: selectedPackage.price
                            });
                            remainingQty -= selectedCount * selectedPackage.package_qty;
                        }
                    }
                });
            });
        }

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
                                qty: count,
                                courier_name: pkg.courier_name,
                                package_qty: pkg.package_qty,
                                price: pkg.price
                            });
                            remainingQty -= count * pkg.package_qty;
                        }
                    }
                }
            });
        });

        return distribution;
    };

    const calculateTotalCost = () => {
        const distribution = calculatePackageDistribution();
        let totalCost = 0;

        distribution.forEach(({ price, qty }) => {
            totalCost += price * qty;
        });
        setTest(totalCost);
        return totalCost;
    };

    // Return only the total cost instead of any view
    return calculateTotalCost();
}

export default CalculatePackageCopy;