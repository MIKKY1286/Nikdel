import React, { useState, useEffect, useCallback } from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Users,
  RefreshCw
} from "lucide-react";
import adminService from "../../services/admin.service";
import { useSettings } from "../../context/SettingsContext";

export default function DashboardHome() {
  const { formatPrice } = useSettings();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const response = await adminService.getDashboardStats();
      const data = response?.data || response;

      if (data) {
        const totalSales = Number(data.totalSales ?? data.totalRevenue ?? 0);
        const totalOrders = Number(data.totalOrders ?? 0);
        const avgOrderValue = Number(
          data.avgOrderValue ?? (totalOrders > 0 ? Math.round((totalSales / totalOrders) * 100) / 100 : 0)
        );
        const totalCustomers = Number(
          data.totalCustomers ?? data.totalUsers ?? 0
        );

        setStats({
          totalSales,
          totalOrders,
          avgOrderValue,
          totalCustomers
        });
      }
    } catch (err) {
      console.error("Admin dashboard API error:", err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  }, []);

  // Initial load and periodic sync every 20 seconds
  useEffect(() => {
    fetchStats();

    const interval = setInterval(() => {
      fetchStats();
    }, 20000);

    const handleFocus = () => fetchStats();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchStats]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-time shop manager (Live Sync)
          </p>
        </div>
        <div>
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin text-brand-600" : "text-slate-400"} />
            <span>{refreshing ? "Syncing..." : "Sync Metrics"}</span>
          </button>
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
              <span className="text-xl font-extrabold text-slate-900">{formatPrice(stats.totalSales)}</span>
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
              <span className="text-xl font-extrabold text-slate-900">{formatPrice(stats.avgOrderValue)}</span>
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
