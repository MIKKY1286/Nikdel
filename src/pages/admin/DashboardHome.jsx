import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Users
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import adminService from "../../services/admin.service";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);

  // Load stats
  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        if (active && data) {
          setStats({
            totalSales: data.totalSales || 0,
            totalOrders: data.totalOrders || 0,
            avgOrderValue: data.avgOrderValue || 0,
            totalCustomers: data.totalCustomers || 0
          });
        }
      } catch (err) {
        console.error("Admin dashboard API error:", err);
        // Fallback or show error
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchStats();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-time shop manager (Production API)
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-600"></div>
        </div>
      ) : (
        /* Analytics Stats Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Metric 1 */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center font-bold">
              <DollarSign size={24} />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Total Revenue</span>
              <span className="text-xl font-extrabold text-slate-900">${stats.totalSales.toFixed(2)}</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <ShoppingBag size={24} />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Total Orders</span>
              <span className="text-xl font-extrabold text-slate-900">{stats.totalOrders}</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
              <TrendingUp size={24} />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Average Value</span>
              <span className="text-xl font-extrabold text-slate-900">${stats.avgOrderValue.toFixed(2)}</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users size={24} />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Active Customers</span>
              <span className="text-xl font-extrabold text-slate-900">{stats.totalCustomers}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
