import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to load the current user from backend using the token
  const loadUser = async () => {
    try {
      const token = localStorage.getItem("nikdel_token");
      if (token) {
        const response = await api.get("/users/me");
        setCurrentUser(response.data.user || response.data.data);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Failed to load user", error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Initialize Auth state
  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    loadUser();

    // Listen for unauthorized events to clear user state
    const handleUnauthorized = () => {
      setCurrentUser(null);
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  // SignUp function
  const signup = async (email, password, name = "", role = "customer") => {
    const response = await api.post("/auth/register", { email, password, name, role });
    const payload = response.data.data || response.data;
    const token = payload.token;
    const userData = payload; // the payload itself is the user data
    
    if (token) {
      localStorage.setItem("nikdel_token", token);
    }
    if (userData) {
      localStorage.setItem("nikdel_user", JSON.stringify(userData));
      setCurrentUser(userData);
    }
    return userData;
  };

  // Login function
  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const payload = response.data.data || response.data;
    const token = payload.token;
    const userData = payload; // the payload itself is the user data
    
    if (token) {
      localStorage.setItem("nikdel_token", token);
    }
    if (userData) {
      localStorage.setItem("nikdel_user", JSON.stringify(userData));
      setCurrentUser(userData);
    }
    return userData;
  };

  // Logout function
  const logout = async () => {
    // Backend API call removed since we use JWTs and client state clearing is sufficient
    localStorage.removeItem("nikdel_token");
    localStorage.removeItem("nikdel_user");
    setCurrentUser(null);
  };

  // Google Login function
  const loginWithGoogle = async () => {
    try {
      // 1. Trigger Firebase Google Sign-In popup
      const result = await signInWithPopup(auth, googleProvider);
      
      // 2. Get the Firebase ID token
      const idToken = await result.user.getIdToken();
      
      // 3. Send the token to the backend to authenticate and get our custom JWT
      const response = await api.post("/auth/google", { token: idToken });
      
      const payload = response.data.data || response.data;
      const token = payload.token;
      const userData = payload;
      
      if (token) {
        localStorage.setItem("nikdel_token", token);
      }
      if (userData) {
        localStorage.setItem("nikdel_user", JSON.stringify(userData));
        setCurrentUser(userData);
      }
      return userData;
    } catch (error) {
      console.error("Google login failed", error);
      throw error;
    }
  };

  // Forgot Password function
  const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgotpassword", { email });
    return response.data;
  };

  // Submit Reset Password function
  const submitResetPassword = async (token, password) => {
    const response = await api.put(`/auth/resetpassword/${token}`, { password });
    const payload = response.data.data || response.data;
    const jwtToken = payload.token;
    
    if (jwtToken) {
      localStorage.setItem("nikdel_token", jwtToken);
    }
    if (payload) {
      localStorage.setItem("nikdel_user", JSON.stringify(payload));
      setCurrentUser(payload);
    }
    return payload;
  };

  // Address Management
  const addAddress = async (addressData) => {
    const response = await api.post("/users/me/addresses", addressData);
    const updatedAddresses = response.data.data;
    const updatedUser = { ...currentUser, addresses: updatedAddresses };
    setCurrentUser(updatedUser);
    localStorage.setItem("nikdel_user", JSON.stringify(updatedUser));
    return updatedAddresses;
  };

  const updateAddress = async (addressId, addressData) => {
    const response = await api.patch(`/users/me/addresses/${addressId}`, addressData);
    const updatedAddresses = response.data.data;
    const updatedUser = { ...currentUser, addresses: updatedAddresses };
    setCurrentUser(updatedUser);
    localStorage.setItem("nikdel_user", JSON.stringify(updatedUser));
    return updatedAddresses;
  };

  const deleteAddress = async (addressId) => {
    const response = await api.delete(`/users/me/addresses/${addressId}`);
    const updatedAddresses = response.data.data;
    const updatedUser = { ...currentUser, addresses: updatedAddresses };
    setCurrentUser(updatedUser);
    localStorage.setItem("nikdel_user", JSON.stringify(updatedUser));
    return updatedAddresses;
  };

  const setDefaultAddress = async (addressId) => {
    return await updateAddress(addressId, { isDefault: true });
  };

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    forgotPassword,
    submitResetPassword,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
