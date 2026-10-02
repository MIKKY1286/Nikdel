import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, MapPin, User, Heart, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AccountLayout() {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  
  const menuItems = [
    { name: "Dashboard", path: "/account", icon: LayoutDashboard },
    { name: "Orders", path: "/orders", icon: ShoppingBag },
    { name: "Addresses", path: "/account/addresses", icon: MapPin },
    { name: "Settings", path: "/account/settings", icon: User },
    { name: "Wishlist", path: "/account/wishlist", icon: Heart },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb or simple greeting */}
      <div className="flex items-center gap-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl px-6">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden">
          {currentUser?.avatar && currentUser.avatar !== 'no-photo.jpg' ? (
            <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User size={24} />
          )}
        </div>
        <div>
          <p className="text-xs text-slate-500">Welcome back,</p>
          <p className="font-bold text-slate-900">{currentUser?.email || "name@gmail.com"}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-5 py-4 text-sm font-semibold transition-colors ${
                  isActive 
                    ? "bg-white text-slate-900 border-l-2 border-slate-900 shadow-sm" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-2 border-transparent"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-slate-900" : "text-slate-400"} />
                {item.name}
              </Link>
            )
          })}
          
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-5 py-4 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-red-600 border-l-2 border-transparent transition-colors mt-4"
          >
            <LogOut size={18} className="text-slate-400" />
            Log out
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
