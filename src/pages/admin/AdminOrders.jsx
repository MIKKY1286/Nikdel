import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Loader, 
  ChevronDown, 
  ChevronUp, 
  Search,
  MapPin,
  Clock
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import adminService from "../../services/admin.service";

export default function AdminOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      const data = await adminService.getAllOrders();
      const loadedOrders = Array.isArray(data) ? data : (data.data || data.orders || []);
      // Sort by date descending
      loadedOrders.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
      setOrders(loadedOrders);
    } catch (error) {
      console.error("Admin dashboard API error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load orders
  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const handleUpdateStatus = async (orderId, userId, currentStatus, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to "${newStatus}"!`, "success");
      fetchOrders();
    } catch (err) {
      console.error(err);
      showToast("Failed to update status. Try again.", "error");
    }
  };

  // Filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.userEmail || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.shippingDetails?.fullName || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "processing":
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-time shop manager (Production Mode)
          </p>
        </div>
      </div>



      {/* Filter and search bar layout */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search size={16} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order ID, Customer, Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {["all", "processing", "shipped", "delivered"].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                statusFilter === status 
                  ? "bg-slate-900 text-white border-slate-900" 
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Management Table */}
      {loading ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Loader size={36} className="animate-spin text-brand-600 mx-auto" />
          <p className="text-xs text-slate-400 mt-4 font-semibold">Synchronizing orders data...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <ShoppingBag size={44} className="text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No orders matched criteria</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Try adjusting your search criteria, clearing filter settings, or seeding mock demo orders above.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-450 tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4">Order Details</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Total Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Update Actions</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOrders.map(order => {
                  const isExpanded = expandedOrderId === order.id;
                  const formattedDate = order.date ? new Date(order.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  }) : "Unknown Date";

                  return (
                    <React.Fragment key={order.id}>
                      {/* Normal Row */}
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold font-mono text-slate-850">
                          {order.id}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800 block">
                            {order.shippingDetails?.fullName || "Guest Customer"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {order.userEmail || "anonymous"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-semibold">
                          {formattedDate}
                        </td>
                        <td className="px-6 py-4 text-right font-extrabold text-slate-900">
                          ${parseFloat(order.total).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center border px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                            {order.status || "Processing"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-1.5">
                            <button
                              onClick={() => handleUpdateStatus(order.id, order.userId, order.status, "Processing")}
                              disabled={order.status?.toLowerCase() === "processing"}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-extrabold text-[10px] rounded-lg transition-all border border-amber-200/50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Process
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order.id, order.userId, order.status, "Shipped")}
                              disabled={order.status?.toLowerCase() === "shipped"}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-[10px] rounded-lg transition-all border border-blue-200/50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Ship
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order.id, order.userId, order.status, "Delivered")}
                              disabled={order.status?.toLowerCase() === "delivered"}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-[10px] rounded-lg transition-all border border-emerald-200/50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Deliver
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                            className="p-1 rounded-full bg-slate-50 text-slate-450 hover:text-brand-600 transition-colors cursor-pointer"
                            title="Expand order details"
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/40">
                          <td colSpan="7" className="px-6 py-5 border-b border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-600">
                              {/* Shipping address & payment details */}
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <h4 className="font-extrabold text-slate-800 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                                    <MapPin size={13} className="text-brand-500" />
                                    Delivery Coordinates
                                  </h4>
                                  <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-2">
                                    <p className="font-bold text-slate-800">{order.shippingDetails?.fullName}</p>
                                    <p>{order.shippingDetails?.address}</p>
                                    <p>{order.shippingDetails?.city}, {order.shippingDetails?.zipCode}, {order.shippingDetails?.country}</p>
                                    <p className="text-[10px] font-semibold text-slate-400">Phone: {order.shippingDetails?.phone}</p>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h4 className="font-extrabold text-slate-800 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                                    <Clock size={13} className="text-brand-500" />
                                    Gateway Verification
                                  </h4>
                                  <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-2.5 font-mono text-[10px] text-slate-500">
                                    <div className="flex justify-between border-b border-slate-50 pb-1">
                                      <span>Paystack Ref:</span>
                                      <span className="font-bold text-slate-800 select-all">{order.paymentReference || "Mock Simulation"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Customer UID:</span>
                                      <span className="font-semibold text-slate-600 select-all">{order.userId}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Items Breakdown list */}
                              <div className="space-y-3">
                                <h4 className="font-extrabold text-slate-800 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                                  <ShoppingBag size={13} className="text-brand-500" />
                                  Ordered Products ({order.items?.length || 0})
                                </h4>
                                <div className="divide-y divide-slate-100 bg-white border border-slate-100 rounded-xl p-4 space-y-3">
                                  {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex gap-3 items-center py-1">
                                      <img
                                        src={item.image}
                                        alt=""
                                        className="w-8 h-8 object-cover rounded bg-slate-50 shrink-0 border border-slate-100"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <span className="font-bold text-slate-800 block truncate">{item.title}</span>
                                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">{item.category}</span>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <span className="font-bold text-slate-800 block">${parseFloat(item.price).toFixed(2)}</span>
                                        <span className="text-[9px] font-bold text-slate-400">Qty: {item.quantity || 1}</span>
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {/* Order pricing summaries */}
                                  <div className="border-t border-slate-100 pt-3 mt-2 space-y-1.5 font-semibold text-slate-500 text-[10px]">
                                    <div className="flex justify-between">
                                      <span>Subtotal</span>
                                      <span className="text-slate-800">${parseFloat(order.subtotal || order.total).toFixed(2)}</span>
                                    </div>
                                    {order.discountAmount > 0 && (
                                      <div className="flex justify-between text-emerald-600">
                                        <span>Promo ({order.appliedPromo})</span>
                                        <span>-${parseFloat(order.discountAmount).toFixed(2)}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <span>Tax (8%)</span>
                                      <span className="text-slate-800">${parseFloat(order.tax || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Shipping Fee</span>
                                      <span className="text-slate-800">{order.shipping === 0 ? "FREE" : `$${parseFloat(order.shipping).toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between font-extrabold text-slate-900 border-t border-slate-100 pt-2 text-xs">
                                      <span>Grand Total</span>
                                      <span>${parseFloat(order.total).toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
