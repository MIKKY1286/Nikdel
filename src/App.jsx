import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { WishlistProvider } from "./context/WishlistContext";
import { SettingsProvider } from "./context/SettingsContext";

// Core components loaded eagerly for instant first paint
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import InstallPrompt from "./components/InstallPrompt";
import Home from "./pages/Home";

import { AnimatePresence, motion } from "framer-motion";

// Lazy-loaded consumer pages for on-demand chunk loading
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Orders"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const UserSettings = lazy(() => import("./pages/UserSettings"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AccountLayout = lazy(() => import("./layouts/AccountLayout"));
const Addresses = lazy(() => import("./pages/Addresses"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPostDetail = lazy(() => import("./pages/BlogPostDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const Trending = lazy(() => import("./pages/Trending"));
const Sale = lazy(() => import("./pages/Sale"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const PolicyPage = lazy(() => import("./pages/PolicyPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy-loaded Admin dashboard pages
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const DashboardHome = lazy(() => import("./pages/admin/DashboardHome"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[45vh] py-16">
    <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mb-3"></div>
    <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Loading Nikdel</span>
  </div>
);

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
          className="flex-grow pt-4 pb-8 sm:pt-6 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
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
  const { currentUser, loading } = useAuth();
  if (loading) {
    return <PageLoader />;
  }
  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }
  if (currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

const UserProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return <PageLoader />;
  }
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <SettingsProvider>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Main App Routes (with Header and Footer) */}
                    <Route element={<MainLayout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      
                      {/* Secondary Content Pages */}
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogPostDetail />} />
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
                          <Route index element={<Navigate to="settings" replace />} />
                          <Route path="settings" element={<UserSettings />} />
                          <Route path="wishlist" element={<Wishlist />} />
                          <Route path="addresses" element={<Addresses />} />
                        </Route>
                      </Route>

                      {/* 404 Catch-All Page */}
                      <Route path="*" element={<NotFound />} />
                    </Route>

                    {/* Auth Routes (no Header and Footer) */}
                    <Route element={<AuthLayout />}>
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
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
                      <Route path="blog" element={<AdminBlog />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Route>
                  </Routes>
                </Suspense>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </SettingsProvider>
      <InstallPrompt />
    </Router>
  );
}

export default App;
