import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Ticket } from "lucide-react";
import adminService from "../../services/admin.service";
import AdminCouponForm from "../../components/admin/AdminCouponForm";
import { useToast } from "../../context/ToastContext";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllCoupons();
      setCoupons(data.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch coupons", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await adminService.deleteCoupon(id);
        setCoupons(coupons.filter(c => (c._id || c.id) !== id));
        showToast("Coupon deleted successfully", "success");
      } catch (err) {
        console.error(err);
        showToast("Failed to delete coupon", "error");
      }
    }
  };

  const filtered = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenForm = (coupon = null) => {
    setEditingCoupon(coupon);
    setIsFormOpen(true);
  };

  const handleSaveCoupon = async (couponData) => {
    try {
      if (editingCoupon) {
        await adminService.updateCoupon(editingCoupon._id || editingCoupon.id, couponData);
        showToast("Coupon updated successfully", "success");
      } else {
        await adminService.createCoupon(couponData);
        showToast("Coupon created successfully", "success");
      }
      setIsFormOpen(false);
      fetchCoupons();
    } catch (err) {
      console.error(err);
      showToast("Failed to save coupon", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Coupons</h1>
          <p className="text-sm text-slate-500 mt-1">Create and manage discount codes.</p>
        </div>
        <button onClick={() => handleOpenForm()} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-sm">
          <Plus size={18} />
          Create Coupon
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search coupon codes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-100">
                <th className="px-6 py-4">Coupon Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Uses</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map(coupon => (
                <tr key={coupon._id || coupon.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Ticket size={20} />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-800 tracking-wider">{coupon.code}</p>
                        <p className="text-xs text-slate-400 font-mono">{coupon._id || coupon.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {coupon.type === 'percentage' ? `${coupon.value}% Off` : 
                     coupon.type === 'fixed' ? `$${coupon.value.toFixed(2)} Off` : 
                     'Free Shipping'}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-semibold">{coupon.usageCount}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      coupon.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenForm(coupon)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(coupon._id || coupon.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No coupons found matching your search.
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    Loading coupons...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <AdminCouponForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveCoupon} 
        editingCoupon={editingCoupon} 
      />
    </div>
  );
}
