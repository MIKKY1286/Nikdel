import React, { useState, useEffect } from "react";
import { X, Upload, Save } from "lucide-react";
import uploadService from "../../services/upload.service";
import { useToast } from "../../context/ToastContext";

export default function AdminCategoryForm({ isOpen, onClose, onSave, editingCategory, isSaving }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    image: "",
    productCount: 0
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      // eslint-disable-next-line
      setFormData(editingCategory);
    } else {
      // eslint-disable-next-line
      setFormData({
        name: "",
        description: "",
        status: "active",
        image: "",
        productCount: 0
      });
    }
  }, [editingCategory, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadService.uploadImage(file);
      const imageUrl = response.data?.[0]?.url || response.url || response;
      
      if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
        setFormData(prev => ({ ...prev, image: imageUrl }));
        showToast("Image uploaded successfully!", "success");
      } else {
        throw new Error("Failed to extract image URL from server response.");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      const msg = err.response?.data?.message || err.message || "Failed to upload image. Please try again.";
      showToast(msg, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      isActive: formData.status === "active"
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 animate-fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-extrabold text-slate-900">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          <form id="categoryForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Category Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category Name</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                placeholder="e.g. Menswear"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                placeholder="Briefly describe this category..."
              ></textarea>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Image URL / Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category Image URL</label>
              <div className="flex gap-4 items-start">
                {formData.image && (
                  <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden shrink-0">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 relative space-y-3">
                  <div className="relative">
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                      placeholder="Or paste an image URL here..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                      <Upload size={16} />
                      {uploading ? "Uploading..." : "Upload from Device"}
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="categoryForm"
            disabled={isSaving}
            className={`px-5 py-2 rounded-xl font-bold text-white transition-colors flex items-center gap-2 shadow-sm ${
              isSaving ? "bg-brand-400 cursor-not-allowed" : "bg-brand-600 hover:bg-brand-700"
            }`}
          >
            <Save size={16} />
            {isSaving ? (editingCategory ? "Saving..." : "Creating category...") : (editingCategory ? "Save Changes" : "Create Category")}
          </button>
        </div>
      </div>
    </div>
  );
}
