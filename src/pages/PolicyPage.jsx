import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, FileText, Settings } from "lucide-react";

export default function PolicyPage({ type }) {
  const content = {
    terms: {
      title: "Terms of Service",
      icon: <FileText size={32} className="text-brand-600" />,
      date: "August 24, 2026",
      text: [
        "Welcome to NIKDEL. By accessing our website, you agree to these Terms of Service.",
        "We reserve the right to modify these terms at any time. Changes will take effect immediately upon their posting on the website.",
        "All content, trademarks, and data on this website, including software, databases, text, graphics, icons, and hyperlinks are the property of NIKDEL.",
        "You agree to use this site for lawful purposes only and in a way that does not infringe the rights of others."
      ]
    },
    privacy: {
      title: "Privacy Policy",
      icon: <ShieldCheck size={32} className="text-brand-600" />,
      date: "August 20, 2026",
      text: [
        "At NIKDEL, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.",
        "We collect information you provide directly to us when you create an account, make a purchase, or contact support.",
        "We do not sell, trade, or rent Users personal identification information to others.",
        "We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access."
      ]
    },
    cookie: {
      title: "Cookie Preferences",
      icon: <Settings size={32} className="text-brand-600" />,
      date: "August 10, 2026",
      text: [
        "This site uses cookies – small text files that are placed on your machine to help the site provide a better user experience.",
        "In general, cookies are used to retain user preferences, store information for things like shopping carts, and provide anonymized tracking data to third party applications like Google Analytics.",
        "As a rule, cookies will make your browsing experience better. However, you may prefer to disable cookies on this site.",
        "The most effective way to do this is to disable cookies in your browser."
      ]
    }
  };

  const current = content[type] || content.terms;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center">
        <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          {current.icon}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">{current.title}</h1>
        <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Last Updated: {current.date}</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6">
        {current.text.map((paragraph, index) => (
          <p key={index} className="text-slate-600 leading-relaxed">
            {paragraph}
          </p>
        ))}
        
        <div className="border-t border-slate-100 pt-8 mt-8 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <p className="text-sm text-slate-500">
            Have questions about this policy?
          </p>
          <Link to="/contact" className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-2.5 rounded-xl transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
