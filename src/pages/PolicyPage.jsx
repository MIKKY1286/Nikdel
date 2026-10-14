import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, FileText, Settings } from "lucide-react";

export default function PolicyPage({ type }) {
  const content = {
    terms: {
      title: "Terms of Service",
      icon: <FileText size={32} className="text-brand-600" />,
      date: " 2026",
      text: [
        "Welcome to NIKDEL. By accessing our platform or placing an order, you agree to comply with and be bound by these Terms of Service.",
        "Product Authenticity & Pricing: All building supplies, power tools, paints, and agricultural materials listed are verified authentic products from certified manufacturers. Prices are clearly confirmed at checkout.",
        "Order Fulfillment & Delivery: Deliveries within Ibadan, Oyo State, and across Nigerian states are conducted through verified logistics partners. Delivery tracking updates are communicated directly to your phone and email.",
        "Return & Inspection Policy: Customers are entitled to inspect goods upon receipt. Any defect or discrepancy must be reported within 7 days of delivery for prompt replacement or resolution.",
        "Intellectual Property: All branding, technical specs, imagery, and catalog content on this website are the proprietary assets of NIKDEL E-Commerce."
      ]
    },
    privacy: {
      title: "Privacy Policy",
      icon: <ShieldCheck size={32} className="text-brand-600" />,
      date: "January 2026",
      text: [
        "At NIKDEL, protecting your personal data and commercial information is our highest priority.",
        "Information Collected: We collect standard contact and delivery credentials (name, delivery address, phone number, and email) solely to process orders, communicate tracking updates, and provide after-sales support.",
        "Secure Transactions: Financial transactions are processed via bank-grade encrypted gateways including Paystack. NIKDEL never stores your raw card numbers or CVV codes on our servers.",
        "Data Confidentiality: We do not sell, rent, or trade your personal details with third-party advertisers. Data is shared exclusively with our verified courier services for delivery purposes."
      ]
    },
    cookie: {
      title: "Cookie & Preference Policy",
      icon: <Settings size={32} className="text-brand-600" />,
      date: "January 2026",
      text: [
        "NIKDEL uses lightweight cookies and local browser storage to keep you securely signed in, preserve your shopping cart across sessions, and recall your regional delivery preferences.",
        "Performance & Analytics: We utilize anonymous telemetry to understand catalog browsing performance and optimize page loading speeds across mobile and desktop devices.",
        "User Control: You can adjust cookie preferences or clear your local storage at any time through your browser settings without losing access to basic browsing."
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
