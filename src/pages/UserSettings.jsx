import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Save, User, Upload, Loader } from "lucide-react";
import api from "../services/api";

export default function UserSettings() {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    avatar: ""
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      // eslint-disable-next-line
      setFormData({
        name: currentUser.name || currentUser.firstName || "",
        phone: currentUser.phone || "",
        avatar: currentUser.avatar && currentUser.avatar !== 'no-photo.jpg' ? currentUser.avatar : ""
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('avatar', file);

    setIsUploading(true);
    try {
      const response = await api.post('/uploads/avatar', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data?.success) {
        setFormData(prev => ({ ...prev, avatar: response.data.data.url }));
        showToast("Avatar uploaded successfully!", "success");
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Failed to upload avatar", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(formData);
      showToast("Profile updated successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSavingPassword(true);
    try {
      await api.patch('/users/me/password', passwordData);
      showToast("Password updated successfully!", "success");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Failed to update password", "error");
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Profile Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account details and preferences.</p>
      </div>

      <form className="space-y-6" onSubmit={handleProfileSubmit}>
        {/* Avatar Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Profile Picture</h2>
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center shrink-0 relative group">
              {isUploading ? (
                <Loader size={24} className="text-brand-600 animate-spin" />
              ) : formData.avatar ? (
                <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-slate-300" />
              )}
            </div>
            <div className="space-y-3 flex-1 w-full">
              <div className="flex flex-wrap items-center gap-3">
                <label className="cursor-pointer bg-slate-900 text-white hover:bg-brand-600 font-semibold py-2.5 px-5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-sm shadow-slate-900/10 hover:shadow-brand-500/20">
                  {isUploading ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
                  {isUploading ? 'Uploading...' : 'Upload from Device'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                </label>
                
                {formData.avatar && (
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: "" })}
                    className="text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="pt-2">
                <details className="group">
                  <summary className="text-sm font-semibold text-brand-600 hover:text-brand-700 cursor-pointer list-none flex items-center gap-1 transition-colors">
                    <span className="group-open:hidden">+ Or paste a direct image link</span>
                    <span className="hidden group-open:inline">- Hide image link</span>
                  </summary>
                  <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <input 
                      type="url" 
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                      placeholder="https://example.com/my-photo.jpg" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-600 text-ellipsis" 
                    />
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Personal Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <input type="email" disabled defaultValue={currentUser?.email || ""} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed" />
            <p className="text-[11px] text-slate-400">Email address cannot be changed. Contact support if needed.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" 
            />
          </div>
        </div>

        <div className="pt-2 pb-6">
          <button 
            type="submit" 
            disabled={isSaving}
            className="bg-slate-900 hover:bg-brand-600 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            <Save size={18} /> {isSaving ? "Saving Profile..." : "Save Profile"}
          </button>
        </div>
      </form>

      {/* Password Form */}
      <form className="space-y-6 pt-4 border-t border-slate-100" onSubmit={handlePasswordSubmit}>
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Security</h2>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Current Password</label>
            <input 
              type="password" 
              name="currentPassword"
              required
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">New Password</label>
            <input 
              type="password" 
              name="newPassword"
              required
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" 
            />
          </div>
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isSavingPassword}
            className="bg-slate-900 hover:bg-brand-600 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            <Save size={18} /> {isSavingPassword ? "Updating Password..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
