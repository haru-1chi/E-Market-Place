//ข้อมูล Body ที่ post to {{url_dev}}/orders
//*ฝั่ง frontend ตอนนี้
// _id || code
// user_id
// createdAt
//x shipping,
// selectedDelivery, //delivery_id delivery
//x deliveryBranch,
//x paymentChannel
// line_items
// status (processing)
// items_price
// cod_price
// net_price
// ++ เพิ่ม currency
// ++ เพิ่ม dropoff_id

//ฝั่ง Backend
//x "currency": "THB",
// "_id": "66bdd66efeceb4c324bc2d70",
// "code": "MLO-670815-0001",
// "user_id": "66bdbe6c6067f1bb5f595fc0",
// "status": "processing",
// "line_items": [],
// "items_price": 2590,
// "cod_percent": 3,
// "cod_price": 77.7,
// "net_price": 2667.7,
//x "dropoff_id": "66bdd3023208ada843eb3a1c", //รายละเอียดสาขาที่รับออเดอร์/ที่สั่ง
// "delivery_id": "66bdd415203788461da41f81", //ขนส่งที่เลือก (ไอเดีย)
// "createdAt": "2024-08-15T10:20:30.386Z",
// "updatedAt": "2024-08-15T10:25:03.446Z",
// "__v": 0,
// "delivery": "ไอเดีย"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLocalStorageItem, setLocalStorageItem, convertTHBtoLAK } from '../utils/DateTimeFormat';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {

  const COD_COST_RATE = 0.03;

  // const statusEvents = {
  //   Ordered: { key: 'Ordered', value: 'ได้รับคำสั่งซื้อแล้ว', icon: 'pi pi-check', color: '#00bf26', tagCSS: 'bg-green-100 border-0 text-green-700' },
  //   PendingPayment: { key: 'PendingPayment', value: 'รอชำระเงิน', icon: 'pi pi-hourglass', color: '#607D8B', tagCSS: 'bg-yellow-100 border-0 text-yellow-700' },
  //   pending: { key: 'pendi1ng', value: 'รอตรวจสอบ', icon: 'pi pi-hourglass', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
  //   Preparing: { key: 'Preparing', value: 'กำลังจัดเตรียมสินค้า', icon: 'pi pi-cart-arrow-down', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
  //   Packaged: { key: 'Packaged', value: 'จัดเตรียมสินค้าเสร็จ', icon: 'pi pi-box', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
  //   ThaiWarehouseArrival: { key: 'ThaiWarehouseArrival', value: 'ถึงโกดังฝั่งไทยแล้ว', icon: 'pi pi-truck', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
  //   LaosWarehouseArrival: { key: 'LaosWarehouseArrival', value: 'ถึงจุดรับสินค้าที่โกดังลาวแล้ว', icon: 'pi pi-warehouse', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
  //   InTransit: { key: 'InTransit', value: 'ขนส่งรับสินค้าที่โกดังแล้ว', icon: 'pi pi-truck', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
  //   BranchArrival: { key: 'BranchArrival', value: 'ถึงจุดรับสินค้าที่สาขาขนส่งแล้ว', icon: 'pi pi-warehouse', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
  //   Received: { key: 'Received', value: 'ลูกค้ารับสินค้าเรียบร้อยแล้ว', icon: 'pi pi-check', color: '#607D8B', tagCSS: 'bg-green-100 border-0 text-green-700' },
  //   Cancelled: { key: 'Cancelled', value: 'ถูกยกเลิก', icon: 'pi pi-times', color: '#FF5252', tagCSS: 'bg-red-100 border-0 text-red-700' }
  // };

  const statusEvents = {
    // Ordered: { key: 1, value: 'ได้รับคำสั่งซื้อแล้ว', icon: 'pi pi-check', color: '#00bf26', tagCSS: 'bg-green-100 border-0 text-green-700' },
    PendingPayment: { key: 1, value: 'รอชำระเงิน', icon: 'pi pi-hourglass', color: '#607D8B', tagCSS: 'bg-yellow-100 border-0 text-yellow-700' },
    pending: { key: 2, value: 'รอตรวจสอบ', icon: 'pi pi-hourglass', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
    Preparing: { key: 3, value: 'กำลังจัดเตรียมสินค้า', icon: 'pi pi-cart-arrow-down', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
    Packaged: { key: 4, value: 'กำลังแพ็คสินค้า', icon: 'pi pi-box', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
    Delivering: { key: 5, value: 'กำลังจัดส่งสินค้า', icon: 'pi pi-truck', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
    // LaosWarehouseArrival: { key: 5, value: 'ถึงจุดรับสินค้าที่โกดังลาวแล้ว', icon: 'pi pi-warehouse', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
    // InTransit: { key: 5, value: 'ขนส่งรับสินค้าที่โกดังแล้ว', icon: 'pi pi-truck', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
    Arrival: { key: 6, value: 'ถึงจุดรับสินค้าแล้ว', icon: 'pi pi-warehouse', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
    Received: { key: 7, value: 'ลูกค้ารับสินค้าเรียบร้อยแล้ว', icon: 'pi pi-check', color: '#607D8B', tagCSS: 'bg-green-100 border-0 text-green-700' },
    Cancelled: { key: 0, value: 'ถูกยกเลิก', icon: 'pi pi-times', color: '#FF5252', tagCSS: 'bg-red-100 border-0 text-red-700' }
  };

  const [user, setUser] = useState({});

  const [cart, setCart] = useState([]);
  const [cartDetails, setCartDetails] = useState({});
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedUser = getLocalStorageItem('user', null);
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (user && user._id) {
      const storedCart = getLocalStorageItem(`cart_${user._id}`, '[]');
      setCart(Array.isArray(storedCart) ? storedCart : []);
      const storedCartDetails = getLocalStorageItem(`cartDetails_${user._id}`, '{}');
      setCartDetails(storedCartDetails);
      const storedOrders = getLocalStorageItem(`orders_${user._id}`, '[]');
      setOrders(Array.isArray(storedOrders) ? storedOrders : []);
    }
  }, [user]);

  useEffect(() => {
    if (user && user._id) {
      setLocalStorageItem(`cart_${user._id}`, cart);
    }
  }, [cart, user]);

  useEffect(() => {
    if (user && user._id) {
      setLocalStorageItem(`cartDetails_${user._id}`, cartDetails);
    }
  }, [cartDetails, user]);

  useEffect(() => {
    if (user && user._id) {
      setLocalStorageItem(`orders_${user._id}`, orders);
    }
  }, [orders, user]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.product_id === product.product_id);

      return existingProduct
        ? prevCart.map(item =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1, ppu: product.product_price }
            : item
        )
        : [...prevCart, { ...product, quantity: 1, ppu: product.product_price }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(product => product.product_id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart(cart.map(product =>
      product.product_id === productId ? { ...product, quantity: Math.max(1, quantity) } : product
    ));
  };

  const placeCartDetail = (details) => {
    const newCartDetails = {
      id: `${Date.now()}`,
      ...details
    };
    setCartDetails(newCartDetails);
  };

  const placeOrder = (orderDetails) => {
    const totalBeforeDiscount = convertTHBtoLAK(cart.reduce((total, product) => total + product.product_price * product.quantity, 0));
    const CODCost = totalBeforeDiscount * COD_COST_RATE;
    const totalPayable = totalBeforeDiscount + CODCost;

    const status = orderDetails.PaymentChannel === "bankCounter"
      ? 'PendingPayment'
      : 'pending';

    const newOrder = {
      id: `ORD-${Date.now()}`,
      user,
      date: new Date(),
      ...orderDetails,
      items: [...cart],
      status,
      totalBeforeDiscount,
      CODCost,
      totalPayable: totalPayable,
    };

    // const newOrder = { for endpoint
    //   code: user.code,
    //   user_id: user._id,
    //   date: new Date(),
    //   ...orderDetails,
    //   items: [...cart],
    //   status,
    //   items_price: totalBeforeDiscount,
    //   cod_price: CODCost,
    //   net_price: totalPayable,
    // };

    // setOrders(prevOrders => [...prevOrders, newOrder]);
    // clearCart();
    // clearCartDetails();
  };

  const clearCart = () => setCart([]);
  const clearCartDetails = () => setCartDetails([]);
  const clearOrder = () => setOrders([]);

  const resetCart = () => {
    setCart([]);
    setCartDetails({});
    setOrders([]);
  };

  return (
    <CartContext.Provider value={{ statusEvents, user, cart, cartDetails, orders, addToCart, removeFromCart, updateQuantity, placeCartDetail, placeOrder, clearCart, clearCartDetails, clearOrder, resetCart }}>
      {children}
    </CartContext.Provider>
  );
};