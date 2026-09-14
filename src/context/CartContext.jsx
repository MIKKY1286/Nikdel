import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import api from "../services/api";

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);
  
  const [orders, setOrders] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  // Load cart and orders when user state changes
  useEffect(() => {
    let active = true;

    async function loadData() {
      if (!currentUser) {
        setCart([]);
        setCartTotal(0);
        setCartItemCount(0);
        setOrders([]);
        setLoadingCart(false);
        return;
      }

      setLoadingCart(true);

      try {
        // Fetch Cart
        const cartRes = await api.get("/cart");
        if (active) {
          const cartData = cartRes.data?.data || cartRes.data || {};
          const items = cartData.items || [];
          setCart(items);
          setCartTotal(cartData.subtotal || cartData.total || 0);
          setCartItemCount(cartData.itemCount || items.reduce((acc, item) => acc + item.quantity, 0));
        }

        // Fetch Orders
        const ordersRes = await api.get("/orders");
        if (active) {
          const ordersData = ordersRes.data?.data || ordersRes.data || [];
          setOrders(ordersData);
        }
      } catch (error) {
        console.error("Error loading cart/orders from API:", error);
      } finally {
        if (active) setLoadingCart(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [currentUser]);

  // Add to Cart
  const addToCart = async (product) => {
    if (!currentUser) {
      showToast("Please sign in to add items to your cart!", "warning");
      return false;
    }

    try {
      const response = await api.post("/cart/items", { 
        productId: product.id || product._id, 
        quantity: 1 
      });
      const updatedCart = response.data?.data || response.data;
      
      const items = updatedCart.items || [];
      setCart(items);
      setCartTotal(updatedCart.subtotal || updatedCart.total || 0);
      setCartItemCount(updatedCart.itemCount || items.reduce((acc, item) => acc + item.quantity, 0));
      
      showToast(`Added "${product.title}" to cart!`, "success");
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast("Failed to add item to cart.", "error");
      return false;
    }
  };

  // Remove from Cart
  const removeFromCart = async (index) => {
    if (!currentUser) return;
    
    const item = cart[index];
    if (!item) return;

    const productId = item.product?.id || item.product?._id || item.productId || item.id;

    try {
      const response = await api.delete(`/cart/items/${productId}`);
      const updatedCart = response.data?.data || response.data;
      
      const items = updatedCart.items || [];
      setCart(items);
      setCartTotal(updatedCart.subtotal || updatedCart.total || 0);
      setCartItemCount(updatedCart.itemCount || items.reduce((acc, item) => acc + item.quantity, 0));
      
      showToast(`Removed from cart.`, "success");
    } catch (error) {
      console.error("Error removing from cart:", error);
      showToast("Failed to remove item.", "error");
    }
  };

  // Update item quantity
  const updateQuantity = async (index, quantity) => {
    if (!currentUser || quantity < 1) return;

    const item = cart[index];
    if (!item) return;

    const productId = item.product?.id || item.product?._id || item.productId || item.id;

    try {
      const response = await api.patch(`/cart/items/${productId}`, { quantity });
      const updatedCart = response.data?.data || response.data;
      
      const items = updatedCart.items || [];
      setCart(items);
      setCartTotal(updatedCart.subtotal || updatedCart.total || 0);
      setCartItemCount(updatedCart.itemCount || items.reduce((acc, item) => acc + item.quantity, 0));
    } catch (error) {
      console.error("Error updating quantity:", error);
      showToast("Failed to update quantity.", "error");
    }
  };

  // Place Order (Checkout)
  const placeOrder = async (shippingDetails, paymentReference, discountAmount = 0, appliedPromo = "") => {
    if (!currentUser || cart.length === 0) return null;

    try {
      const response = await api.post("/orders", {
        shippingDetails,
        paymentReference,
        discountAmount,
        appliedPromo
      });
      
      const createdOrder = response.data?.data || response.data;
      
      // Update local orders
      setOrders(prev => [createdOrder, ...prev]);
      
      // Clear local cart state because the backend should have cleared it
      setCart([]);
      setCartTotal(0);
      setCartItemCount(0);
      
      return createdOrder;
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    }
  };

  const value = {
    cart,
    orders,
    loadingCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    placeOrder,
    cartTotal,
    cartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

