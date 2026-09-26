import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Search, Bell, MessageSquare, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminHeader({ toggleSidebar }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Close menus when clicking outside could be added, but for now we'll just toggle
  const toggleMessages = () => {
    setShowMessages(!showMessages);
    setShowNotifications(false);
    setShowProfileMenu(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowMessages(false);
    setShowProfileMenu(false);
  };

  const toggleProfile = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowMessages(false);
    setShowNotifications(false);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shrink-0">
      {/* Left section: mobile menu toggle & search */}
      <div className="flex items-center flex-1 gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="15" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        
        <div className="hidden sm:flex relative w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right section: icons & profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Messages Dropdown */}
        <div className="relative">
          <button 
            onClick={toggleMessages}
            className={`p-2 rounded-full transition-colors relative ${showMessages ? 'text-brand-600 bg-brand-50' : 'text-slate-400 hover:text-brand-600 hover:bg-brand-50'}`}
          >
            <MessageSquare size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
          
          {showMessages && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-100 rounded-xl shadow-lg py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-800">Messages</h3>
                <span className="text-[10px] bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full">2 New</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors">
                  <p className="text-xs font-bold text-slate-800">Customer Support</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">Need help with order #12345.</p>
                  <p className="text-[9px] text-slate-400 mt-1">5 mins ago</p>
                </div>
                <div className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors">
                  <p className="text-xs font-bold text-slate-800">John Doe</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">Do you ship internationally?</p>
                  <p className="text-[9px] text-slate-400 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="px-4 py-2 mt-1 text-center">
                <button className="text-[11px] font-bold text-brand-600 hover:text-brand-700">View All Messages</button>
              </div>
            </div>
          )}
        </div>
        
        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={toggleNotifications}
            className={`p-2 rounded-full transition-colors relative ${showNotifications ? 'text-brand-600 bg-brand-50' : 'text-slate-400 hover:text-brand-600 hover:bg-brand-50'}`}
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-100 rounded-xl shadow-lg py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-800">Notifications</h3>
                <button className="text-[10px] text-brand-600 hover:underline">Mark all read</button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold">🛒</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">New Order Placed</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Order #8901 was just placed for $120.00</p>
                    <p className="text-[9px] text-slate-400 mt-1">10 mins ago</p>
                  </div>
                </div>
                <div className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold">⚠️</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Low Stock Alert</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Makita Drill is running low (3 left).</p>
                    <p className="text-[9px] text-slate-400 mt-1">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm border border-brand-200">
              {currentUser?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-700 leading-none">
                {currentUser?.email?.split('@')[0] || 'Admin'}
              </span>
              <span className="text-[10px] text-slate-400">Admin</span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-50">
                <p className="text-xs font-bold text-slate-700 truncate">{currentUser?.email}</p>
                <p className="text-[10px] text-slate-400">Administrator</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 mt-1"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
