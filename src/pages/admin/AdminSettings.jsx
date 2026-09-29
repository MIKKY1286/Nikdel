import React, { useState, useEffect } from "react";
import { Save, User, Bell, Shield, Globe, CreditCard, Activity, Loader, Megaphone } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { useToast } from "../../context/ToastContext";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const { settings, updateSettings } = useSettings();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    storeName: "Nikdel Webstore",
    contactEmail: "admin@nikdel.com",
    storeDescription: "Premium building materials and agriculture webstore.",
    currency: "USD",
    timezone: "(GMT+00:00) London",
    adminName: "",
    adminEmail: "",
    emailAlertsOrders: true,
    emailAlertsStock: true,
    twoFactorAuth: false,
    stripeKey: "",
    taxRate: 0,
    maintenanceMode: false,
    promotions: []
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || "Nikdel Webstore",
        contactEmail: settings.contactEmail || "admin@nikdel.com",
        storeDescription: settings.storeDescription || "Premium building materials and agriculture webstore.",
        currency: settings.currency || "USD",
        timezone: settings.timezone || "(GMT+00:00) London",
        adminName: settings.adminName || "",
        adminEmail: settings.adminEmail || "",
        emailAlertsOrders: settings.emailAlertsOrders ?? true,
        emailAlertsStock: settings.emailAlertsStock ?? true,
        twoFactorAuth: settings.twoFactorAuth ?? false,
        stripeKey: settings.stripeKey || "",
        taxRate: settings.taxRate || 0,
        maintenanceMode: settings.maintenanceMode ?? false,
        promotions: settings.promotions && settings.promotions.length > 0 
          ? settings.promotions 
          : (settings.promoTitle ? [{
              id: Date.now(),
              title: settings.promoTitle,
              desc: settings.promoDesc,
              buttonText: settings.promoButtonText,
              link: settings.promoLink,
              enabled: settings.promoEnabled
            }] : [])
      });
    }
  }, [settings]);

  const handleAddPromotion = () => {
    setFormData(prev => ({
      ...prev,
      promotions: [...prev.promotions, { id: Date.now(), title: "", desc: "", buttonText: "", link: "", enabled: true }]
    }));
  };

  const handleUpdatePromotion = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      promotions: prev.promotions.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const handleRemovePromotion = (id) => {
    setFormData(prev => ({
      ...prev,
      promotions: prev.promotions.filter(p => p.id !== id)
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateSettings(formData);
    if (success) {
      showToast("Settings updated successfully", "success");
    } else {
      showToast("Failed to update settings", "error");
    }
    setIsSaving(false);
  };

  const tabs = [
    { id: "general", label: "General", icon: <Globe size={18} /> },
    { id: "account", label: "Account", icon: <User size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
    { id: "billing", label: "Billing", icon: <CreditCard size={18} /> },
    { id: "promotions", label: "Promotions", icon: <Megaphone size={18} /> },
    { id: "system", label: "System", icon: <Activity size={18} /> },
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
          disabled={isSaving}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm"
        >
          {isSaving ? (
            <>
              <Loader size={18} className="animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
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
                      <option value="NGN">Nigerian Naira (₦)</option>
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

          {activeTab === "account" && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-8 animate-fade-in">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-4">Admin Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Admin Name</label>
                    <input type="text" name="adminName" placeholder="John Doe" value={formData.adminName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Admin Email</label>
                    <input type="email" name="adminEmail" placeholder="john@nikdel.com" value={formData.adminEmail} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-8 animate-fade-in">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                    <input type="checkbox" name="emailAlertsOrders" checked={formData.emailAlertsOrders} onChange={handleChange} className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500" />
                    <div>
                      <span className="block font-bold text-slate-800">New Order Alerts</span>
                      <span className="block text-xs text-slate-500">Receive an email when a new order is placed.</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                    <input type="checkbox" name="emailAlertsStock" checked={formData.emailAlertsStock} onChange={handleChange} className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500" />
                    <div>
                      <span className="block font-bold text-slate-800">Low Stock Alerts</span>
                      <span className="block text-xs text-slate-500">Receive an email when product inventory drops below threshold.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-8 animate-fade-in">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                    <input type="checkbox" name="twoFactorAuth" checked={formData.twoFactorAuth} onChange={handleChange} className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500" />
                    <div>
                      <span className="block font-bold text-slate-800">Two-Factor Authentication</span>
                      <span className="block text-xs text-slate-500">Require 2FA for all admin logins to secure the dashboard.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-8 animate-fade-in">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-4">Payment & Tax</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Payment Gateway Key (Stripe / Paystack)</label>
                    <input type="text" name="stripeKey" placeholder="pk_test_..." value={formData.stripeKey} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-mono" />
                  </div>
                  <div className="space-y-2 md:w-1/2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Default Tax Rate (%)</label>
                    <input type="number" name="taxRate" value={formData.taxRate} onChange={handleChange} min="0" max="100" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-8 animate-fade-in border-l-4 border-l-amber-500">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">System Status & Maintenance</h3>
                <p className="text-sm text-slate-500 mb-6">Control global website availability during updates.</p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
                  <label className="flex items-start gap-4 cursor-pointer">
                    <div className="mt-1">
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.maintenanceMode ? 'bg-amber-500' : 'bg-slate-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${formData.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                      <input type="checkbox" name="maintenanceMode" checked={formData.maintenanceMode} onChange={handleChange} className="hidden" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-900 text-lg">Enable Maintenance Mode</span>
                      <span className="block text-sm text-slate-600 mt-1 leading-relaxed">
                        When active, customers will see a maintenance banner and checkout/cart functionality will be disabled for safety while updates are being performed.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "promotions" && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-8 animate-fade-in">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-extrabold text-slate-900">Promotional Banners</h3>
                  <button 
                    onClick={handleAddPromotion}
                    className="bg-slate-900 hover:bg-brand-600 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors shadow-sm"
                  >
                    + Add Banner
                  </button>
                </div>
                <p className="text-sm text-slate-500 mb-6">Manage promotional banners displayed on the homepage.</p>
                
                <div className="space-y-8">
                  {formData.promotions.map((promo, index) => (
                    <div key={promo.id} className="p-6 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-6 relative">
                      <div className="absolute top-4 right-4 flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <span className="text-xs font-bold text-slate-600">Enabled</span>
                          <input 
                            type="checkbox" 
                            checked={promo.enabled} 
                            onChange={(e) => handleUpdatePromotion(promo.id, 'enabled', e.target.checked)}
                            className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500" 
                          />
                        </label>
                        <button 
                          onClick={() => handleRemovePromotion(promo.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold transition-colors"
                        >
                          Remove
                        </button>
                      </div>

                      <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-2">Banner #{index + 1}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Promo Title</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Special Holiday Sale" 
                            value={promo.title} 
                            onChange={(e) => handleUpdatePromotion(promo.id, 'title', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Promo Button Text</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Shop the Sale" 
                            value={promo.buttonText} 
                            onChange={(e) => handleUpdatePromotion(promo.id, 'buttonText', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Promo Description</label>
                          <textarea 
                            rows="2" 
                            placeholder="e.g. Get up to 50% off select items." 
                            value={promo.desc} 
                            onChange={(e) => handleUpdatePromotion(promo.id, 'desc', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-none"
                          ></textarea>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Button Link (URL path)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. /shop?category=sale" 
                            value={promo.link} 
                            onChange={(e) => handleUpdatePromotion(promo.id, 'link', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.promotions.length === 0 && (
                    <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                      No banners currently set. Click "Add Banner" to create one.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
