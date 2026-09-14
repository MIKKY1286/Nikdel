import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import api from "../services/api";

const WishlistContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  
  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  // Load wishlist when user state changes
  useEffect(() => {
    let active = true;

    async function loadData() {
      if (!currentUser) {
        setWishlist([]);
        setLoadingWishlist(false);
        return;
      }

      setLoadingWishlist(true);

      try {
        const res = await api.get("/wishlist");
        if (active) {
          const data = res.data?.data || res.data || {};
          setWishlist(data.items || []);
        }
      } catch (error) {
        console.error("Error loading wishlist from API:", error);
      } finally {
        if (active) setLoadingWishlist(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [currentUser]);

  // Add to Wishlist
  const addToWishlist = async (product) => {
    if (!currentUser) {
      showToast("Please sign in to add items to your wishlist!", "warning");
      return false;
    }

    const productId = product.id || product._id;

    try {
      const response = await api.post(`/wishlist/${productId}`);
      const updatedWishlist = response.data?.data || response.data;
      
      setWishlist(updatedWishlist.items || []);
      showToast(`Added to wishlist!`, "success");
      return true;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      showToast("Failed to add to wishlist.", "error");
      return false;
    }
  };

  // Remove from Wishlist
  const removeFromWishlist = async (productId) => {
    if (!currentUser) return false;

    try {
      const response = await api.delete(`/wishlist/${productId}`);
      const updatedWishlist = response.data?.data || response.data;
      
      setWishlist(updatedWishlist.items || []);
      showToast(`Removed from wishlist.`, "success");
      return true;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      showToast("Failed to remove from wishlist.", "error");
      return false;
    }
  };

  const toggleWishlist = async (product) => {
    const productId = product.id || product._id;
    const exists = wishlist.find(item => {
      const id = item.product?.id || item.product?._id || item.product || item;
      return id === productId;
    });

    if (exists) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(product);
    }
  };

  const value = {
    wishlist,
    loadingWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}
