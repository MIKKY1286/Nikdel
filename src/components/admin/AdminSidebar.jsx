import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Tags, 
  Users, 
  BarChart2, 
  Ticket, 
  BookOpen, 
  Settings
} from "lucide-react";

export default function AdminSidebar() {
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Categories", path: "/admin/categories", icon: Tags },
    { name: "Customers", path: "/admin/customers", icon: Users },
    { name: "Reports", path: "/admin/reports", icon: BarChart2 },
    { name: "Coupons", path: "/admin/coupons", icon: Ticket },
    { name: "Knowledge Base", path: "/admin/knowledge-base", icon: BookOpen },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 shrink-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
            N
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            Nikdel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                isActive
                  ? "bg-brand-600 text-white shadow-sm"
                  : "hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Settings / Bottom Links */}
      <div className="p-3 border-t border-slate-800">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
              isActive
                ? "bg-slate-800 text-white"
                : "hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <Settings size={18} />
          Personal Settings
        </NavLink>
      </div>
    </aside>
  );
}
