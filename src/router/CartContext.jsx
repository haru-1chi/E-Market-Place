import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLocalStorageItem, setLocalStorageItem, convertTHBtoLAK } from '../utils/DateTimeFormat';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {

  // const statusEvents = {
  //   PendingPayment: { key: 1, value: 'รอชำระเงิน', icon: 'pi pi-hourglass', color: '#607D8B', tagCSS: 'bg-yellow-100 border-0 text-yellow-700' },
  //   pending: { key: 2, value: 'รอตรวจสอบ', icon: 'pi pi-hourglass', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
  //   Preparing: { key: 3, value: 'กำลังจัดเตรียมสินค้า', icon: 'pi pi-cart-arrow-down', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
  //   Packaged: { key: 4, value: 'กำลังแพ็คสินค้า', icon: 'pi pi-box', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
  //   Delivering: { key: 5, value: 'กำลังจัดส่งสินค้า', icon: 'pi pi-truck', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
  //   Arrival: { key: 6, value: 'ถึงจุดรับสินค้าแล้ว', icon: 'pi pi-warehouse', color: '#607D8B', tagCSS: 'bg-blue-100 border-0 text-blue-700' },
  //   Received: { key: 7, value: 'ลูกค้ารับสินค้าเรียบร้อยแล้ว', icon: 'pi pi-check', color: '#607D8B', tagCSS: 'bg-green-100 border-0 text-green-700' },
  //   Cancelled: { key: 0, value: 'ถูกยกเลิก', icon: 'pi pi-times', color: '#FF5252', tagCSS: 'bg-red-100 border-0 text-red-700' }
  // };

  const statusEvents = {
    Packaged: { key: 1, value: 'กำลังเตรียมจัดส่ง', icon: 'pi pi-box', color: '#607D8B', tagCSS: 'text-blue-700' },
    Delivering: { key: 2, value: 'จัดส่งแล้ว', icon: 'pi pi-truck', color: '#607D8B', tagCSS: 'text-blue-700' },
    Received: { key: 3, value: 'รับสินค้าแล้ว', icon: 'pi pi-check', color: '#607D8B', tagCSS: 'text-green-700' },
    Cancelled: { key: 0, value: 'ยกเลิกออเดอร์', icon: 'pi pi-times', color: '#FF5252', tagCSS: 'text-red-700' }
  };

  const [user, setUser] = useState({});
  const [cart, setCart] = useState({});
  const [cartDetails, setCartDetails] = useState({});
  const [orders, setOrders] = useState([]);
  const [selectedItemsCart, setSelectedItemsCart] = useState({});

  useEffect(() => {
    const storedUser = getLocalStorageItem('user', null);
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (user && user._id) {
      const storedCart = getLocalStorageItem(`cart_${user._id}`, {});
      setCart(storedCart);
      const storedCartDetails = getLocalStorageItem(`cartDetails_${user._id}`, {});
      setCartDetails(storedCartDetails);
      const storedOrders = getLocalStorageItem(`orders_${user._id}`, '[]');
      setOrders(Array.isArray(storedOrders) ? storedOrders : []);
      const storedSelectedItemsCart = getLocalStorageItem(`selectedCart_${user._id}`, {});
      setSelectedItemsCart(storedSelectedItemsCart);
    }
  }, [user]);

  useEffect(() => {
    if (user && user._id) {
      setLocalStorageItem(`selectedCart_${user._id}`, selectedItemsCart);
    }
  }, [selectedItemsCart, user]);

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
    const { product_partner_id, product_name, product_price, product_image, product_subimage1, product_subimage2, product_subimage3, _id } = product;

    setCart(prevCart => {
      const partner_id = product_partner_id._id;

      const existingPartner = prevCart[partner_id] || {
        partner_id: product_partner_id._id,
        partner_name: product_partner_id.partner_name,
        products: []
      };

      const existingProduct = existingPartner.products.find(item => item.product_id === _id);

      const updatedProducts = existingProduct
        ? existingPartner.products.map(item =>
          item.product_id === _id
            ? { ...item, product_qty: item.product_qty + 1, price: product_price }
            : item
        )
        : [...existingPartner.products, { product_id: _id, product_name, product_qty: 1, product_price, product_image, product_subimage1, product_subimage2, product_subimage3 }];

      return {
        ...prevCart,
        [partner_id]: { ...existingPartner, products: updatedProducts }
      };
    });
  };

  const removeFromCart = (partner_id, product_id) => {
    setCart(prevCart => {
      const updatedPartnerProducts = prevCart[partner_id].products.filter(product => product.product_id !== product_id);

      if (updatedPartnerProducts.length === 0) {
        const { [partner_id]: removedPartner, ...restCart } = prevCart;
        return restCart;
      }

      return {
        ...prevCart,
        [partner_id]: {
          ...prevCart[partner_id],
          products: updatedPartnerProducts
        }
      };
    });
  };

  const updateQuantity = (partner_id, product_id, product_qty) => {
    setCart((prevCart) => ({
      ...prevCart,
      [partner_id]: {
        ...prevCart[partner_id],
        products: prevCart[partner_id].products.map((product) =>
          product.product_id === product_id
            ? { ...product, product_qty: Math.max(1, product_qty) }
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
    // const totalBeforeDiscount = convertTHBtoLAK(cart.reduce((total, product) => total + product.product_price * product.product_qty, 0));
    // const CODCost = totalBeforeDiscount * COD_COST_RATE;
    // const totalPayable = totalBeforeDiscount + CODCost;

    const status = orderDetails.PaymentChannel === "บัญชีธนาคาร"
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
      // CODCost,
      totalPayable: totalPayable,
    };
  };

  const clearCart = (cart, selectedItemsCart) => {
    const updatedCart = { ...cart }; // Create a shallow copy of the cart

    // Iterate over each partner in SelectedItemsCart
    for (const selectedPartnerId in selectedItemsCart) {
      const selectedPartner = selectedItemsCart[selectedPartnerId];

      // If the partner exists in the cart
      if (updatedCart[selectedPartnerId]) {
        const updatedProducts = updatedCart[selectedPartnerId].products.filter(cartProduct => {
          // Check if the product exists in the selectedItemsCart for that partner
          return !selectedPartner.products.some(selectedProduct => selectedProduct.product_id === cartProduct.product_id);
        });

        // If no products are left for that partner, remove the partner from the cart
        if (updatedProducts.length === 0) {
          delete updatedCart[selectedPartnerId];
        } else {
          // Otherwise, update the products list for that partner
          updatedCart[selectedPartnerId].products = updatedProducts;
        }
      }
    }

    setCart(updatedCart); // Set the updated cart
  };

  const clearCartDetails = () => setCartDetails({});
  const clearOrder = () => setOrders([]);
  const clearSelectedItemsCart = () => setSelectedItemsCart({});

  const resetCart = () => {
    setCart({});
    setCartDetails({});
    setOrders([]);
  };

  return (
    <CartContext.Provider value={{ statusEvents, user, cart, selectedItemsCart, cartDetails, orders, addToCart, removeFromCart, updateQuantity, setSelectedItemsCart, placeCartDetail, placeOrder, clearCart, clearCartDetails, clearOrder, clearSelectedItemsCart, resetCart }}>
      {children}
    </CartContext.Provider>
  );
};