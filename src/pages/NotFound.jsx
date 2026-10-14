import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home, ShoppingBag, ArrowLeft, MessageSquare, Wrench, HardHat, Tractor } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export default function NotFound() {
  const { settings } = useSettings();
  const whatsappNumber = settings?.whatsappNumber || "2349075793786";

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
        {/* Animated Badge & Icon */}
        <div className="relative inline-block">
          <div className="w-28 h-28 sm:w-32 sm:h-32 bg-brand-50 border border-brand-200 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-brand-500/10 text-brand-600">
            <Compass size={64} className="animate-spin-slow stroke-[1.5]" />
          </div>
          
        </div>

        {/* Heading & Description */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            The catalog page or link you are looking for may have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-md group"
          >
            <Home size={18} />
            <span>Back to Homepage</span>
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-md shadow-brand-600/20 group"
          >
            <ShoppingBag size={18} />
            <span>Browse Catalog</span>
          </Link>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Nikdel, I was looking for a product or page on your webstore and couldn't find it.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-6 py-3.5 rounded-xl transition-all"
          >
            <MessageSquare size={18} className="text-emerald-600" />
            <span>Help on WhatsApp</span>
          </a>
        </div>

        {/* Popular Category Shortcuts */}
        <div className="pt-8 border-t border-slate-100 space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Explore Popular Store Sections
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {[
              { name: "Building Materials", link: "/shop?category=building-materials", icon: HardHat },
              { name: "Power Tools", link: "/shop?category=power-tools", icon: Wrench },
              { name: "Agricultural Equipment", link: "/shop?category=agricultural-tools", icon: Tractor },
              { name: "Deals & Clearance", link: "/sale", icon: ShoppingBag }
            ].map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  to={cat.link}
                  className="inline-flex items-center gap-2 bg-slate-50 hover:bg-brand-50 border border-slate-200/80 hover:border-brand-200 text-slate-700 hover:text-brand-700 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  <Icon size={14} className="text-slate-400 group-hover:text-brand-600" />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
