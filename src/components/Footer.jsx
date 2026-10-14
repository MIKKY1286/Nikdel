import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Send, MapPin, Phone, Mail, Award, CheckCircle, Loader, MessageCircle, Building2 } from "lucide-react";
import api from "../services/api";
import { useSettings } from "../context/SettingsContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const { settings } = useSettings();

  const storeAddress = settings?.storeAddress || "Wema Complex, Ibadan, Oyo State, Nigeria";
  const storePhone = settings?.storePhone || "+234 907 579 3786";
  const whatsappNumber = settings?.whatsappNumber || "2349075793786";
  const contactEmail = settings?.contactEmail || "support@nikdel.com";

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        setLoading(true);
        setError(null);
        await api.post('/newsletter/subscribe', { email });
        setSubscribed(true);
        setEmail("");
        setTimeout(() => setSubscribed(false), 5000);
      } catch (err) {
        console.error("Subscription error:", err);
        setError(err.response?.data?.message || "Failed to subscribe");
        setTimeout(() => setError(null), 5000);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 mt-20 pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/20">
                N
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Nikdel
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Nigeria's premier destination for heavy-duty building materials, certified power tools, agro-chemicals, and commercial hardware. Engineered for performance and durability.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold bg-slate-900 text-brand-400 px-3 py-1.5 rounded-full border border-slate-800">
                <Award size={14} />
                Quality Guaranteed
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Shop Channels</h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">Complete Catalog</Link>
              </li>
              <li>
                <Link to="/shop?category=power-tools" className="hover:text-white transition-colors">Power Tools & Machinery</Link>
              </li>
              <li>
                <Link to="/shop?category=agriculture" className="hover:text-white transition-colors">Agriculture & Farming</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Support Hub</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{storeAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-500 shrink-0" />
                <a href={`tel:${storePhone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {storePhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={18} className="text-emerald-500 shrink-0" />
                <a 
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Nikdel, I have an inquiry.")}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-400 transition-colors font-semibold"
                >
                  WhatsApp: +{whatsappNumber}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-500 shrink-0" />
                <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors">
                  {contactEmail}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Newsletter</h4>
            <p className="text-sm leading-relaxed mb-4 text-slate-400">
              Subscribe to unlock early-access discount rates, product updates, and news.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 p-3.5 rounded-xl text-sm font-semibold">
                <CheckCircle size={18} />
                Successfully subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex flex-col gap-2">
                <div className="relative flex">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1 top-1 bottom-1 w-10 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-700 text-white rounded-lg flex items-center justify-center transition-colors"
                  >
                    {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
                {error && <span className="text-red-400 text-xs mt-1">{error}</span>}
              </form>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-900 pt-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Nikdel E-Commerce. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/cookie" className="hover:text-white transition-colors">Cookie Preferences</Link>
          </div>
          {/* Payment Methods */}
          <div className="flex flex-wrap items-center gap-2 justify-center">
            {/* Paystack */}
            <div title="Secured by Paystack" className="bg-white px-2.5 py-1 rounded-md h-7 flex items-center justify-center shadow-sm border border-white/20 hover:scale-105 transition-transform cursor-default">
              <div className="flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
                  <rect x="1" y="2.5" width="14" height="2" rx="1" fill="#00C3F7"/>
                  <rect x="1" y="6.5" width="9" height="2" rx="1" fill="#00C3F7"/>
                  <rect x="1" y="10.5" width="14" height="2" rx="1" fill="#00C3F7"/>
                </svg>
                <span className="text-[11px] font-extrabold text-[#011B33] tracking-tight">paystack</span>
              </div>
            </div>

            {/* Verve */}
            <div title="Verve Card" className="bg-white px-2.5 py-1 rounded-md h-7 flex items-center justify-center shadow-sm border border-white/20 hover:scale-105 transition-transform cursor-default">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#E51B24] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <span className="text-[11px] font-black italic tracking-tight text-[#002D62]">verve</span>
              </div>
            </div>

            {/* Mastercard */}
            <div title="Mastercard" className="bg-white px-2.5 py-1 rounded-md h-7 flex items-center justify-center shadow-sm border border-white/20 hover:scale-105 transition-transform cursor-default">
              <svg viewBox="0 0 34 20" className="h-4 w-auto">
                <circle cx="11" cy="10" r="9" fill="#EB001B"/>
                <circle cx="23" cy="10" r="9" fill="#F79E1B"/>
                <path d="M17 3.8a9 9 0 000 12.4 9 9 0 000-12.4z" fill="#FF5F00"/>
              </svg>
            </div>

            {/* Visa */}
            <div title="Visa" className="bg-white px-2.5 py-1 rounded-md h-7 flex items-center justify-center shadow-sm border border-white/20 hover:scale-105 transition-transform cursor-default">
              <span className="font-black italic text-[13px] tracking-wider text-[#1A1F71] font-sans">VISA</span>
            </div>

            {/* Bank Transfer */}
            <div title="Instant Bank Transfer" className="bg-white px-2.5 py-1 rounded-md h-7 flex items-center justify-center shadow-sm border border-white/20 hover:scale-105 transition-transform cursor-default">
              <div className="flex items-center gap-1.5 text-slate-800">
                <Building2 size={13} className="text-emerald-600" />
                <span className="text-[10px] font-extrabold tracking-tight text-slate-800">Bank Transfer</span>
              </div>
            </div>

            {/* Apple Pay */}
            <div title="Apple Pay" className="bg-white px-2.5 py-1 rounded-md h-7 flex items-center justify-center shadow-sm border border-white/20 hover:scale-105 transition-transform cursor-default">
              <div className="flex items-center gap-0.5 text-black">
                <svg viewBox="0 0 170 170" className="w-3 h-3 fill-black">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.68-7.75-11.93-14.14-7.73-11.75-13.56-25.07-17.49-39.97-3.92-14.9-5.88-28.71-5.88-41.44 0-14.9 3.59-27.42 10.77-37.56 7.18-10.13 16.42-15.35 27.72-15.66 4.35 0 9.4 1.16 15.15 3.49 5.76 2.33 9.4 3.56 10.94 3.69 2.01 0 5.88-1.29 11.61-3.86 5.73-2.57 10.79-3.72 15.18-3.46 12.39.81 22.18 5.76 29.38 14.86-10.99 6.64-16.33 15.82-16.03 27.54.29 9.38 3.99 17.29 11.11 23.72 7.12 6.43 15.54 10.05 25.26 10.87-2.33 7.04-5.26 14.47-8.78 22.3zM119.22 33.56c0-7.05 2.58-13.88 7.74-20.49 5.16-6.61 11.53-11.16 19.1-13.65.73 7.05-1.58 13.85-6.94 20.39-5.36 6.54-11.99 10.97-19.9 13.75z"/>
                </svg>
                <span className="text-[11px] font-bold text-black tracking-tight leading-none">Pay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
