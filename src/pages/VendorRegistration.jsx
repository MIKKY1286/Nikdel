import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function VendorRegistration() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    shopName: "",
    shopUrl: "shawonetcd2fdgf@gmail.com",
    phoneNumber: "",
    agreeTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementation to save to backend
    alert("Vendor application submitted!");
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Update account to Vendor</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800">First Name <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-400 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800">Last Name <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-400 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800">Shop Name <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            name="shopName"
            required
            value={formData.shopName}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-400 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800">Shop URL <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            name="shopUrl"
            required
            value={formData.shopUrl}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-400 transition-colors"
          />
          <p className="text-xs text-slate-500">https://grogin.com/store/</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800">Phone Number <span className="text-red-500">*</span></label>
          <input 
            type="tel" 
            name="phoneNumber"
            required
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input 
            type="checkbox" 
            name="agreeTerms"
            id="agreeTerms"
            required
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
          />
          <label htmlFor="agreeTerms" className="text-sm text-slate-700">
            I have read and agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms & Conditions</Link>.
          </label>
        </div>

        <div className="pt-2">
          <button 
            type="submit"
            className="border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm px-6 py-2.5 rounded-xl transition-colors"
          >
            Become a Vendor
          </button>
        </div>
      </form>
    </div>
  );
}
