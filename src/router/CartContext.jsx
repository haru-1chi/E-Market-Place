import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/DateTimeFormat';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {

  const statusEvents = {
    Packaged: { key: 1, value: 'กำลังเตรียมจัดส่ง', icon: 'pi pi-box', color: '#607D8B', tagCSS: 'text-blue-600' },
    Delivering: { key: 2, value: 'จัดส่งแล้ว', icon: 'pi pi-truck', color: '#607D8B', tagCSS: 'text-blue-700' },
    Received: { key: 3, value: 'รับสินค้าแล้ว', icon: 'pi pi-check', color: '#607D8B', tagCSS: 'text-green-700' },
    Cancelled: { key: 0, value: 'ยกเลิกออเดอร์', icon: 'pi pi-times', color: '#FF5252', tagCSS: 'text-red-500' }
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
      const storedCartDetails = getLocalStorageItem(`cartDetails_${user._id}`, {});
      const storedOrders = getLocalStorageItem(`orders_${user._id}`, []);
      const storedSelectedItemsCart = getLocalStorageItem(`selectedCart_${user._id}`, {});

      setCart(storedCart);
      setCartDetails(storedCartDetails);
      setOrders(Array.isArray(storedOrders) ? storedOrders : []);
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
    const {
      product_partner_id,
      product_name,
      product_price,
      product_stock,
      product_image,
      product_subimage1,
      product_subimage2,
      product_subimage3,
      product_package_options,
      _id
    } = product;

    setCart((prevCart) => {
      const partner_id = product_partner_id._id;

      const existingPartner = prevCart[partner_id] || {
        partner_id: product_partner_id._id,
        partner_name: product_partner_id.partner_name,
        products: []
      };

      const existingProduct = existingPartner.products.find((item) => item.product_id === _id);

      if (existingProduct) {
        const newQuantity = existingProduct.product_qty + 1;
        if (newQuantity > product_stock) {
          alert('สินค้าถูกเพิ่มถึงจำนวนสูงสุดแล้ว');
          return prevCart;
        }
      }

      const updatedProducts = existingProduct
        ? existingPartner.products.map((item) =>
          item.product_id === _id
            ? { ...item, product_qty: item.product_qty + 1, product_price: product_price }
            : item
        )
        : [
          ...existingPartner.products,
          {
            product_id: _id,
            product_name,
            product_qty: 1,
            product_price,
            product_stock,
            product_image,
            product_subimage1,
            product_subimage2,
            product_subimage3,
            product_package_options
          }
        ];

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
    setCart((prevCart) => {
      const partner = prevCart[partner_id];
      const product = partner.products.find(p => p.product_id === product_id);
      if (product) {
        const maxQuantity = Math.min(product_qty, product.product_stock);
        if (product_qty > product.product_stock) {
          alert('สินค้าถูกเพิ่มถึงจำนวนสูงสุดแล้ว');
        }
        return {
          ...prevCart,
          [partner_id]: {
            ...partner,
            products: partner.products.map(p =>
              p.product_id === product_id
                ? { ...p, product_qty: Math.max(1, maxQuantity) }
                : p
            )
          }
        };
      }

      return prevCart;
    });
  };

  const placeCartDetail = (details) => {
    const newCartDetails = {
      id: `${Date.now()}`,
      ...details
    };
    setCartDetails(newCartDetails);
  };

  const placeOrder = (orderDetails) => {

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