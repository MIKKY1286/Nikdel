import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Search, 
  LogOut,
  MapPin,
  Heart,
  ChevronDown
} from "lucide-react";

export default function Header() {
  const { currentUser, logout } = useAuth();
  const { cartItemCount } = useCart();
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
      {/* Top Row: Logo, Search, Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* Logo & Location */}
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-md transform transition-transform group-hover:scale-105">
                <span className="font-bold text-xl">N</span>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                NIKDEL
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-2">
              <MapPin size={18} className="text-slate-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-semibold leading-none">Deliver to</span>
                <span className="text-xs font-bold text-slate-800 leading-none mt-1">all</span>
              </div>
            </div>
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
                  <User size={24} className="text-slate-600" />
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
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
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
              <Link to="/" className={`flex items-center gap-1 border-b-2 py-3.5 ${location.pathname === '/' ? 'border-[#6f56a3] text-[#6f56a3] font-bold' : 'border-transparent text-slate-800 font-bold hover:text-[#6f56a3]'}`}>
                Home <ChevronDown size={14} className="text-slate-400" />
              </Link>
              <Link to="/shop" className={`flex items-center gap-1 border-b-2 py-3.5 ${location.pathname.startsWith('/shop') ? 'border-[#6f56a3] text-[#6f56a3] font-bold' : 'border-transparent text-slate-800 font-bold hover:text-[#6f56a3]'}`}>
                Shop <ChevronDown size={14} className="text-slate-400" />
              </Link>
              <Link to="/shop?category=building-materials" className="flex items-center border-b-2 border-transparent py-3.5 text-slate-800 font-bold hover:text-[#6f56a3]">
                Building Materials
              </Link>
              <Link to="/shop?category=power-tools" className="flex items-center border-b-2 border-transparent py-3.5 text-slate-800 font-bold hover:text-[#6f56a3]">
                Power Tools
              </Link>
              <Link to="/blog" className="flex items-center border-b-2 border-transparent py-3.5 text-slate-800 font-bold hover:text-[#6f56a3]">
                Blog
              </Link>
              <Link to="/contact" className="flex items-center border-b-2 border-transparent py-3.5 text-slate-800 font-bold hover:text-[#6f56a3]">
                Contact
              </Link>
            </nav>

            {/* Nav Right */}
            <div className="flex items-center space-x-6 text-[13px]">
              <Link to="/trending" className="flex items-center gap-1 text-slate-800 font-bold hover:text-[#6f56a3]">
                Trending Products <ChevronDown size={14} className="text-slate-400" />
              </Link>
              <Link to="/sale" className="flex items-center gap-2 text-red-500 font-bold hover:text-red-600">
                Almost Finished <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded tracking-wide">SALE</span> <ChevronDown size={14} className="text-slate-400" />
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
            <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className={`text-base py-1 ${isActive("/orders")}`}>Orders</Link>
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
