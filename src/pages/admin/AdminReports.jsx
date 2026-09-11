import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Download, Activity } from "lucide-react";
import adminService from "../../services/admin.service";

export default function AdminReports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await adminService.getAdvancedReports();
        setReportData(data.data);
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500 gap-3">
        <Activity className="animate-spin" size={24} />
        Loading reports...
      </div>
    );
  }

  // Fallback defaults
  const data = reportData || {
    revenue: { current: 0, growth: 0 },
    orders: { current: 0, growth: 0 },
    customers: { current: 0, growth: 0 },
    conversion: { current: 0, growth: 0 }
  };
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analytics & Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Detailed insights into your store's performance.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold transition-colors shadow-sm">
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">${data.revenue.current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
              <DollarSign size={24} />
            </div>
          </div>
          <div className={`mt-4 flex items-center text-sm font-semibold ${data.revenue.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {data.revenue.growth >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            {data.revenue.growth > 0 ? '+' : ''}{data.revenue.growth.toFixed(1)}% from last month
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Orders</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{data.orders.current.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <BarChart3 size={24} />
            </div>
          </div>
          <div className={`mt-4 flex items-center text-sm font-semibold ${data.orders.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {data.orders.growth >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            {data.orders.growth > 0 ? '+' : ''}{data.orders.growth.toFixed(1)}% from last month
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">New Customers</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{data.customers.current.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <Users size={24} />
            </div>
          </div>
          <div className={`mt-4 flex items-center text-sm font-semibold ${data.customers.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {data.customers.growth >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            {data.customers.growth > 0 ? '+' : ''}{data.customers.growth.toFixed(1)}% from last month
          </div>
        </div>
        
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Conversion Rate</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{data.conversion.current.toFixed(1)}%</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className={`mt-4 flex items-center text-sm font-semibold ${data.conversion.growth > 0 ? 'text-emerald-600' : data.conversion.growth < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
            {data.conversion.growth > 0 ? <TrendingUp size={16} className="mr-1" /> : data.conversion.growth < 0 ? <TrendingDown size={16} className="mr-1" /> : null}
            {data.conversion.growth === 0 ? 'No change from last month' : `${data.conversion.growth > 0 ? '+' : ''}${data.conversion.growth.toFixed(1)}% from last month`}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <BarChart3 size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">Detailed Analytics Chart</h3>
          <p className="text-sm text-slate-500 mt-2">Interactive charts would be rendered here.</p>
        </div>
      </div>
    </div>
  );
}
