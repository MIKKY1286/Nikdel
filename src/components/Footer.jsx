import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Send, MapPin, Phone, Mail, Award, CheckCircle } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 mt-20 pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xl">
                N
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Nikdel
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Your premium destination for multi-purpose items, curated for style, performance, and everyday convenience. Elevate your shopping experience today.
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
                <Link to="/shop" className="hover:text-white transition-colors">Our Catalog</Link>
              </li>
              <li>
                <Link to="/shop?category=power-tools" className="hover:text-white transition-colors">Power Tools</Link>
              </li>
              <li>
                <Link to="/shop?category=agriculture" className="hover:text-white transition-colors">Agriculture & Farming</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Support Hub</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-500 shrink-0 mt-0.5" />
                <span>123 Commerce Avenue, Suite 400, New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-500 shrink-0" />
                <span>+1 (800) 555-0199</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-500 shrink-0" />
                <a href="mailto:support@nikdel.com" className="hover:text-white transition-colors">support@nikdel.com</a>
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
              <form onSubmit={handleSubscribe} className="relative flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 w-10 bg-brand-600 hover:bg-brand-500 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-900 pt-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Nikdel E-Commerce. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/cookie" className="hover:text-white transition-colors">Cookie Preferences</Link>
          </div>
          {/* Payment Methods */}
          <div className="flex gap-2">
            {["Visa", "Mastercard", "Amex", "PayPal", "ApplePay"].map((pay) => (
              <span
                key={pay}
                className="bg-slate-900 px-2.5 py-1 rounded text-[10px] font-semibold text-slate-400 border border-slate-800"
              >
                {pay}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
