import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Search, 
  LogOut,
  MapPin,
  Heart
} from "lucide-react";

import { useSettings } from "../context/SettingsContext";

export default function Header() {
  const { currentUser, logout } = useAuth();
  const { cartItemCount } = useCart();
  const { wishlist } = useWishlist();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? "text-brand-600 font-semibold" : "text-slate-700 hover:text-brand-600 font-bold";
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      {settings?.maintenanceMode && (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-xs sm:text-sm font-bold flex justify-center items-center gap-2">
          <span>⚠️ Site is currently undergoing maintenance. Checkout is disabled for safety.</span>
        </div>
      )}
      {/* Top Row: Logo, Search, Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* Logo & Location */}
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src="/favicon.jpg" 
                alt="Nikdel Logo" 
                className="w-10 h-10 rounded-xl object-cover shadow-md transform transition-transform group-hover:scale-105" 
              />
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                NIKDEL
              </span>
            </Link>

            <Link 
              to={currentUser ? "/account/addresses" : "/contact"} 
              className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-100"
              title="Delivery destination"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 group-hover:scale-105 transition-transform">
                <MapPin size={16} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Deliver to</span>
                <span className="text-xs font-extrabold text-slate-800 leading-none mt-1 truncate max-w-[150px] group-hover:text-brand-600 transition-colors">
                  {currentUser?.addresses?.length > 0
                    ? (currentUser.addresses.find(a => a.isDefault) || currentUser.addresses[0]).city || "Ibadan, Nigeria"
                    : "Ibadan, Nigeria"}
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search for products, categories or brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/70 border-none rounded-full py-3 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-slate-400 font-medium"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-brand-600 transition-colors"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            
            {/* User Account */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link to="/account/settings" className="flex items-center gap-3 hover:text-brand-600 transition-colors cursor-pointer">
                  {currentUser.avatar && currentUser.avatar !== 'no-photo.jpg' ? (
                    <img src={currentUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                  ) : (
                    <User size={24} className="text-slate-600" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-semibold leading-none">Account</span>
                    <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate leading-none mt-1">
                      {currentUser.name || currentUser.email}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="p-1 text-slate-400 hover:text-red-600 transition-colors ml-2"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-3 hover:text-brand-600 transition-colors">
                <User size={24} className="text-slate-700" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-semibold leading-none">Sign In</span>
                  <span className="text-xs font-bold text-slate-700 leading-none mt-1">Account</span>
                </div>
              </Link>
            )}

            {/* Wishlist Icon */}
            <Link to="/account/wishlist" className="relative text-slate-700 hover:text-brand-600 transition-colors group flex items-center">
              <Heart size={26} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
              {wishlist?.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="relative text-slate-700 hover:text-brand-600 transition-colors group flex items-center">
              <ShoppingBag size={26} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            </Link>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <Link to="/cart" className="relative p-2 text-slate-600 hover:text-brand-600">
              <ShoppingBag size={24} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-brand-600 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Nav Row (Desktop) */}
      <div className="hidden lg:block border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            
            {/* Nav Links */}
            <nav className="flex space-x-8 text-[13px]">
              <Link to="/" className={`flex items-center border-b-2 py-3.5 transition-colors ${location.pathname === '/' ? 'border-brand-600 text-brand-600 font-extrabold' : 'border-transparent text-slate-800 font-bold hover:text-brand-600'}`}>
                Home
              </Link>
              <Link to="/shop" className={`flex items-center border-b-2 py-3.5 transition-colors ${location.pathname === '/shop' ? 'border-brand-600 text-brand-600 font-extrabold' : 'border-transparent text-slate-800 font-bold hover:text-brand-600'}`}>
                Shop
              </Link>
              <Link to="/shop?category=building-materials" className="flex items-center border-b-2 border-transparent py-3.5 text-slate-800 font-bold hover:text-brand-600 transition-colors">
                Building Materials
              </Link>
              <Link to="/shop?category=power-tools" className="flex items-center border-b-2 border-transparent py-3.5 text-slate-800 font-bold hover:text-brand-600 transition-colors">
                Power Tools
              </Link>
              <Link to="/blog" className={`flex items-center border-b-2 py-3.5 transition-colors ${location.pathname.startsWith('/blog') ? 'border-brand-600 text-brand-600 font-extrabold' : 'border-transparent text-slate-800 font-bold hover:text-brand-600'}`}>
                Blog
              </Link>
              <Link to="/contact" className={`flex items-center border-b-2 py-3.5 transition-colors ${location.pathname === '/contact' ? 'border-brand-600 text-brand-600 font-extrabold' : 'border-transparent text-slate-800 font-bold hover:text-brand-600'}`}>
                Contact
              </Link>
            </nav>

            {/* Nav Right */}
            <div className="flex items-center space-x-6 text-[13px]">
              <Link to="/trending" className={`flex items-center transition-colors ${location.pathname === '/trending' ? 'text-brand-600 font-extrabold' : 'text-slate-800 font-bold hover:text-brand-600'}`}>
                Trending Products
              </Link>
              <Link to="/sale" className="flex items-center gap-2 text-rose-600 font-bold hover:text-rose-700 transition-colors">
                Almost Finished <span className="bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wide shadow-sm">SALE</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-4 pb-6 space-y-4 shadow-inner absolute w-full top-full">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Mobile Links */}
          <div className="flex flex-col space-y-3 font-medium">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`text-base py-1 ${isActive("/")}`}>Home</Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className={`text-base py-1 ${isActive("/shop")}`}>Shop</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className={`text-base py-1 ${isActive("/contact")}`}>Contact</Link>
            {currentUser && (
              <>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className={`text-base py-1 ${isActive("/orders")}`}>Orders</Link>
                <Link to="/account/settings" onClick={() => setMobileMenuOpen(false)} className={`text-base py-1 ${isActive("/account/settings")}`}>Profile</Link>
              </>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Account</span>
                  <span className="text-sm font-semibold text-slate-700 truncate max-w-[200px]">
                    {currentUser.name || currentUser.email}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate("/login");
                  }}
                  className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-semibold py-2 px-3 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white text-sm font-semibold py-3 rounded-full hover:bg-brand-600 transition-colors shadow-sm">
                <User size={16} />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
