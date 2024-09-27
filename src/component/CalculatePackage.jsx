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