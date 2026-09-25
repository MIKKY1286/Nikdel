import React, { useState, useEffect } from "react";
import { Save, User, Bell, Shield, Globe, CreditCard } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { useToast } from "../../context/ToastContext";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const { settings, updateSettings } = useSettings();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    storeName: "Nikdel Webstore",
    contactEmail: "admin@nikdel.com",
    storeDescription: "Premium building materials and agriculture webstore.",
    currency: "USD",
    timezone: "(GMT+00:00) London"
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || "Nikdel Webstore",
        contactEmail: settings.contactEmail || "admin@nikdel.com",
        storeDescription: settings.storeDescription || "Premium building materials and agriculture webstore.",
        currency: settings.currency || "USD",
        timezone: settings.timezone || "(GMT+00:00) London"
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const success = await updateSettings(formData);
    if (success) {
      showToast("Settings updated successfully", "success");
    } else {
      showToast("Failed to update settings", "error");
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: <Globe size={18} /> },
    { id: "account", label: "Account", icon: <User size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
    { id: "billing", label: "Billing", icon: <CreditCard size={18} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your store preferences and account settings.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id 
                  ? "bg-white text-brand-600 shadow-sm border border-slate-100" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
              }`}
            >
              <div className={`${activeTab === tab.id ? "text-brand-500" : "text-slate-400"}`}>
                {tab.icon}
              </div>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {activeTab === "general" && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-8 animate-fade-in">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-4">Store Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Store Name</label>
                    <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Contact Email</label>
                    <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Store Description</label>
                    <textarea rows="3" name="storeDescription" value={formData.storeDescription} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-none"></textarea>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-4">Currency & Format</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Store Currency</label>
                    <select name="currency" value={formData.currency} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all">
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="NGN">NGN (₦)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Timezone</label>
                    <select name="timezone" value={formData.timezone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all">
                      <option value="(GMT-08:00) Pacific Time (US & Canada)">(GMT-08:00) Pacific Time (US & Canada)</option>
                      <option value="(GMT-05:00) Eastern Time (US & Canada)">(GMT-05:00) Eastern Time (US & Canada)</option>
                      <option value="(GMT+00:00) London">(GMT+00:00) London</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "general" && (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm animate-fade-in">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {tabs.find(t => t.id === activeTab)?.icon}
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">{tabs.find(t => t.id === activeTab)?.label} Settings</h3>
              <p className="text-slate-500">This section is currently under development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
