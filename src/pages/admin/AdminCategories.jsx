import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import AdminCategoryForm from "../../components/admin/AdminCategoryForm";
import categoryService from "../../services/category.service";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";

export default function AdminCategories() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAllCategories();
      setCategories(res.data || res);
    } catch (err) {
      console.error("Failed to load categories", err);
      showToast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await categoryService.deleteCategory(id);
        fetchCategories();
        showToast("Category deleted successfully!", "success");
      } catch (err) {
        console.error("Failed to delete category", err);
        const msg = err.response?.data?.message || "Failed to delete category";
        showToast(msg, "error");
      }
    }
  };

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenForm = (category = null) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleSaveCategory = async (categoryData) => {
    setIsSaving(true);
    try {
      if (editingCategory) {
        const id = editingCategory._id || editingCategory.id;
        await categoryService.updateCategory(id, categoryData);
      } else {
        await categoryService.createCategory(categoryData);
      }
      fetchCategories();
      setIsFormOpen(false);
      showToast("Category saved successfully!", "success");
    } catch (err) {
      console.error("Failed to save category", err);
      const msg = err.response?.data?.message || "Failed to save category";
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Categories</h1>
          <p className="text-sm text-slate-500 mt-1">Organize your products into categories.</p>
        </div>
        <button onClick={() => handleOpenForm()} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-sm">
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
          />
        </div>
      </div>

      {/* Data Grid */}
      {loading ? (
        <div className="py-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(category => (
            <div 
              key={category._id || category.id} 
              onClick={() => navigate(`/admin/products?category=${category._id || category.id}`)}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative cursor-pointer"
            >
              <div className="h-32 w-full bg-slate-100 relative">
                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-extrabold text-xl">{category.name}</h3>
                  <p className="text-xs font-semibold text-slate-300">{category.productCount} Products</p>
                </div>
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleOpenForm(category); }} 
                    className="p-1.5 bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 rounded-lg transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(category._id || category.id); }} 
                    className="p-1.5 bg-rose-500/80 backdrop-blur-sm text-white hover:bg-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between border-t border-slate-50">
                <span className="text-xs font-semibold text-slate-500">
                  {category.productCount || 0} Products
                </span>
                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  category.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {category.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <div className="py-12 text-center text-slate-500 bg-white border border-slate-100 rounded-2xl">
          No categories found.
        </div>
      )}

      {/* Form Modal */}
      <AdminCategoryForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveCategory} 
        editingCategory={editingCategory} 
        isSaving={isSaving}
      />
    </div>
  );
}
