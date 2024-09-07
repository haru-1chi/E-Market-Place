import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLocalStorageItem, setLocalStorageItem, convertTHBtoLAK } from '../utils/DateTimeFormat';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {

  const COD_COST_RATE = 0.03;

  const statusEvents = {
    PendingPayment: { key: 1, value: 'รอชำระเงิน', icon: 'pi pi-hourglass', color: '#607D8B', tagCSS: 'bg-yellow-100 border-0 text-yellow-700' },
    pending: { key: 2, value: 'รอตรวจสอบ', icon: 'pi pi-hourglass', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
    Preparing: { key: 3, value: 'กำลังจัดเตรียมสินค้า', icon: 'pi pi-cart-arrow-down', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
    Packaged: { key: 4, value: 'กำลังแพ็คสินค้า', icon: 'pi pi-box', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
    Delivering: { key: 5, value: 'กำลังจัดส่งสินค้า', icon: 'pi pi-truck', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
    Arrival: { key: 6, value: 'ถึงจุดรับสินค้าแล้ว', icon: 'pi pi-warehouse', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
    Received: { key: 7, value: 'ลูกค้ารับสินค้าเรียบร้อยแล้ว', icon: 'pi pi-check', color: '#607D8B', tagCSS: 'bg-green-100 border-0 text-green-700' },
    Cancelled: { key: 0, value: 'ถูกยกเลิก', icon: 'pi pi-times', color: '#FF5252', tagCSS: 'bg-red-100 border-0 text-red-700' }
  };

  const [user, setUser] = useState({});
  const [cart, setCart] = useState({});
  const [cartDetails, setCartDetails] = useState({});
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedUser = getLocalStorageItem('user', null);
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (user && user._id) {
      const storedCart = getLocalStorageItem(`cart_${user._id}`, '{}');
      setCart(storedCart);
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
    const { product_partner_id, product_name, product_price, product_image, product_subimage1, product_subimage2, product_subimage3,  _id } = product;

    setCart(prevCart => {
      const partnerId = product_partner_id._id;

      const existingPartner = prevCart[partnerId] || {
        partnerName: product_partner_id.partner_name,
        products: []
      };

      const existingProduct = existingPartner.products.find(item => item.productId === _id);

      const updatedProducts = existingProduct
        ? existingPartner.products.map(item =>
          item.productId === _id
            ? { ...item, quantity: item.quantity + 1, price: product_price }
            : item
        )
        : [...existingPartner.products, { productId: _id, product_name, quantity: 1, product_price, product_image, product_subimage1, product_subimage2, product_subimage3 }];

      return {
        ...prevCart,
        [partnerId]: { ...existingPartner, products: updatedProducts }
      };
    });
  };

  const removeFromCart = (partnerId, productId) => {
    setCart(prevCart => {
      const updatedPartnerProducts = prevCart[partnerId].products.filter(product => product.productId !== productId);

      if (updatedPartnerProducts.length === 0) {
        const { [partnerId]: removedPartner, ...restCart } = prevCart;
        return restCart;
      }

      return {
        ...prevCart,
        [partnerId]: {
          ...prevCart[partnerId],
          products: updatedPartnerProducts
        }
      };
    });
  };

  const updateQuantity = (partnerId, productId, quantity) => {
    setCart((prevCart) => ({
      ...prevCart,
      [partnerId]: {
        ...prevCart[partnerId],
        products: prevCart[partnerId].products.map((product) =>
          product.productId === productId
            ? { ...product, quantity: Math.max(1, quantity) }
            : product
        )
      }
    }));
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
  };

  const clearCart = () => setCart({});
  const clearCartDetails = () => setCartDetails({});
  const clearOrder = () => setOrders([]);

  const resetCart = () => {
    setCart({});
    setCartDetails({});
    setOrders([]);
  };

  return (
    <CartContext.Provider value={{ statusEvents, user, cart, cartDetails, orders, addToCart, removeFromCart, updateQuantity, placeCartDetail, placeOrder, clearCart, clearCartDetails, clearOrder, resetCart }}>
      {children}
    </CartContext.Provider>
  );
};