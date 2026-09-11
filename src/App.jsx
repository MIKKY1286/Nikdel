import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProductDetail from "./pages/ProductDetail";
import UserSettings from "./pages/UserSettings";
import AccountLayout from "./layouts/AccountLayout";
import AccountPlaceholder from "./pages/AccountPlaceholder";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Trending from "./pages/Trending";
import Sale from "./pages/Sale";
import Wishlist from "./pages/Wishlist";
import PolicyPage from "./pages/PolicyPage";

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import AdminLayout from "./components/admin/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminReports from "./pages/admin/AdminReports";
import AdminKnowledgeBase from "./pages/admin/AdminKnowledgeBase";
import AdminSettings from "./pages/admin/AdminSettings";

// Layout components
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const MainLayout = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex-grow py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

const AuthLayout = () => (
  <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
    <main className="flex-grow py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex items-center justify-center">
      <Outlet />
    </main>
  </div>
);

const AdminProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const UserProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Main App Routes (with Header and Footer) */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                
                {/* New Pages */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/sale" element={<Sale />} />
                <Route path="/terms" element={<PolicyPage type="terms" />} />
                <Route path="/privacy" element={<PolicyPage type="privacy" />} />
                <Route path="/cookie" element={<PolicyPage type="cookie" />} />

                <Route element={<UserProtectedRoute><Outlet /></UserProtectedRoute>}>
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/account" element={<AccountLayout />}>
                    <Route index element={<AccountPlaceholder title="Dashboard" />} />
                    <Route path="settings" element={<UserSettings />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="downloads" element={<AccountPlaceholder title="Downloads" />} />
                    <Route path="addresses" element={<AccountPlaceholder title="Addresses" />} />
                    <Route path="details" element={<AccountPlaceholder title="Account Details" />} />
                    <Route path="compare" element={<AccountPlaceholder title="Compare Products" />} />
                  </Route>
                </Route>
              </Route>

              {/* Auth Routes (no Header and Footer) */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/admin/login" element={<Login isAdmin={true} />} />
                <Route path="/admin/signup" element={<SignUp isAdmin={true} />} />
              </Route>

              {/* Protected Admin Route */}
              <Route path="/admin" element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }>
                <Route index element={<DashboardHome />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="knowledge-base" element={<AdminKnowledgeBase />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
