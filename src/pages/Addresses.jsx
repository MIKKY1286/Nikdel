import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { MapPin, Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";

export default function Addresses() {
  const { currentUser, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { showToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    phone: "",
    isDefault: false
  });

  const addresses = currentUser?.addresses || [];

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        fullName: address.fullName || "",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        country: address.country || "",
        zipCode: address.zipCode || "",
        phone: address.phone || "",
        isDefault: address.isDefault || false
      });
    } else {
      setEditingAddress(null);
      setFormData({
        fullName: "",
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        phone: "",
        isDefault: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, formData);
        showToast("Address updated successfully!", "success");
      } else {
        await addAddress(formData);
        showToast("New address added successfully!", "success");
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
      showToast("Failed to save address.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(id);
      showToast("Address deleted.", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete address.", "error");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      showToast("Default address updated.", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to set default address.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Your Addresses</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your saved shipping and billing addresses.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-brand-600 transition-colors"
        >
          <Plus size={16} />
          Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.length === 0 ? (
          <div className="col-span-1 md:col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-100">
            <MapPin size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">You have not saved any addresses yet.</p>
          </div>
        ) : (
          addresses.map((address) => (
            <div 
              key={address._id} 
              className={`relative bg-white border ${address.isDefault ? 'border-brand-500 shadow-sm' : 'border-slate-200'} rounded-2xl p-5 hover:border-brand-300 transition-colors`}
            >
              {address.isDefault && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2 py-1 rounded-full">
                  <CheckCircle2 size={12} />
                  Default
                </div>
              )}
              
              <div className="space-y-1 mb-4">
                <h3 className="font-extrabold text-slate-800 text-base">{address.fullName || currentUser.name}</h3>
                <p className="text-sm text-slate-600">{address.street}</p>
                <p className="text-sm text-slate-600">{address.city}, {address.state} {address.zipCode}</p>
                <p className="text-sm text-slate-600">{address.country}</p>
                <p className="text-xs text-slate-500 mt-2 font-medium">Phone: {address.phone}</p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleOpenModal(address)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(address._id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
                
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address._id)}
                    className="ml-auto text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Address Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-extrabold text-lg">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
                  <input type="text" name="street" value={formData.street} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ZIP / Postal Code</label>
                  <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                  <input type="text" name="country" value={formData.country} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
                </div>
                
                <div className="col-span-2 flex items-center gap-2 mt-2">
                  <input type="checkbox" id="isDefault" name="isDefault" checked={formData.isDefault} onChange={handleChange} className="rounded text-brand-500 focus:ring-brand-500/20" />
                  <label htmlFor="isDefault" className="text-sm font-semibold text-slate-700">Set as default shipping address</label>
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold bg-slate-900 text-white hover:bg-brand-600 rounded-xl transition-colors shadow-sm">
                  {editingAddress ? 'Save Changes' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
