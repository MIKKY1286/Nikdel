import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Package, ChevronDown, ChevronUp, Calendar, MapPin, Clock } from "lucide-react";

export default function Orders() {
  const { currentUser } = useAuth();
  const { orders, loadingCart } = useCart();
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleOrderExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusColor = (status) => {
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

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 text-center bg-white border border-slate-100 p-8 rounded-2xl shadow-sm space-y-6">
        <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
          <Package size={28} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Your orders are locked</h2>
          <p className="text-sm text-slate-405 leading-relaxed">
            Please log in or register with Nikdel store to track purchases and view your order history.
          </p>
        </div>
        <Link
          to="/login"
          className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
        >
          Sign In to Account
        </Link>
      </div>
    );
  }

  if (loadingCart) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-650 mx-auto"></div>
        <p className="text-xs text-slate-400 mt-4 font-semibold">Retrieving your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 text-center bg-white border border-slate-100 p-8 rounded-2xl shadow-sm space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
          <Package size={28} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">No orders placed yet</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            You haven't made any purchases with Nikdel yet. Browse our catalog to get started!
          </p>
        </div>
        <Link
          to="/shop"
          className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
        >
          Explore Products Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Orders</h1>
        <p className="text-sm text-slate-400 mt-1">Review the history and tracking state of your purchases.</p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order.id;
          const orderDateString = order.date ? new Date(order.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }) : "Date Unknown";

          return (
            <div
              key={order.id}
              className="bg-white border border-slate-105 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Order Header Summary */}
              <div
                onClick={() => toggleOrderExpand(order.id)}
                className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-extrabold text-slate-900 text-sm truncate max-w-[180px]">
                      ID: {order.id}
                    </span>
                    <span className={`inline-flex items-center border px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status || "Processing"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                    <Calendar size={13} />
                    <span>{orderDateString}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 self-stretch sm:self-auto justify-between border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-450 block font-semibold">Total Cost</span>
                    <span className="text-base font-extrabold text-slate-900">
                      ${parseFloat(order.total).toFixed(2)}
                    </span>
                  </div>
                  <div className="p-1 rounded-full bg-slate-50 text-slate-450">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </div>

              {/* Order Expanded Details */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-6 bg-slate-50/30 space-y-8 animate-slide-down">
                  {/* Status Progress Stepper */}
                  <div className="space-y-6 bg-white p-5 rounded-2xl border border-slate-100/50 shadow-sm">
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
                      Real-Time Tracking Status
                    </h4>
                    
                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 mt-4">
                      {/* Connection Line (Desktop) */}
                      <div className="absolute top-[18px] left-[20px] right-[20px] h-0.5 bg-slate-100 hidden md:block z-0">
                        <div 
                          className="h-full bg-brand-500 transition-all duration-500" 
                          style={{
                            width: order.status?.toLowerCase() === "delivered" ? "100%" : order.status?.toLowerCase() === "shipped" ? "50%" : "0%"
                          }}
                        ></div>
                      </div>
                      
                      {/* Connection Line (Mobile - Vertical) */}
                      <div className="absolute left-[18px] top-[20px] bottom-[20px] w-0.5 bg-slate-100 md:hidden z-0">
                        <div 
                          className="w-full bg-brand-500 transition-all duration-500" 
                          style={{
                            height: order.status?.toLowerCase() === "delivered" ? "100%" : order.status?.toLowerCase() === "shipped" ? "50%" : "0%"
                          }}
                        ></div>
                      </div>

                      {/* Step 1: Processing */}
                      <div className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2.5 flex-1 w-full">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 ${
                          order.status ? "bg-brand-500 text-white border-4 border-brand-100" : "bg-slate-100 text-slate-400"
                        }`}>
                          ✓
                        </div>
                        <div className="text-left md:text-center">
                          <p className="text-xs font-extrabold text-slate-800">Order Placed & Processing</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            {orderDateString}
                          </p>
                        </div>
                      </div>

                      {/* Step 2: Shipped */}
                      <div className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2.5 flex-1 w-full">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 ${
                          order.status?.toLowerCase() === "shipped" || order.status?.toLowerCase() === "delivered" 
                            ? "bg-brand-500 text-white border-4 border-brand-100" 
                            : order.status?.toLowerCase() === "processing" 
                            ? "bg-white text-brand-600 border-4 border-brand-500 animate-pulse"
                            : "bg-slate-100 text-slate-400 border-4 border-white"
                        }`}>
                          {order.status?.toLowerCase() === "shipped" || order.status?.toLowerCase() === "delivered" ? "✓" : "2"}
                        </div>
                        <div className="text-left md:text-center">
                          <p className="text-xs font-extrabold text-slate-800">Shipped & In Transit</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            {order.status?.toLowerCase() === "shipped" || order.status?.toLowerCase() === "delivered" 
                              ? (order.date ? new Date(new Date(order.date).getTime() + 15000).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "In transit")
                              : order.status?.toLowerCase() === "processing"
                              ? "Awaiting shipment"
                              : "Pending"}
                          </p>
                        </div>
                      </div>

                      {/* Step 3: Delivered */}
                      <div className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2.5 flex-1 w-full">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 ${
                          order.status?.toLowerCase() === "delivered" 
                            ? "bg-brand-500 text-white border-4 border-brand-100" 
                            : order.status?.toLowerCase() === "shipped"
                            ? "bg-white text-brand-600 border-4 border-brand-500 animate-pulse"
                            : "bg-slate-100 text-slate-400 border-4 border-white"
                        }`}>
                          {order.status?.toLowerCase() === "delivered" ? "✓" : "3"}
                        </div>
                        <div className="text-left md:text-center">
                          <p className="text-xs font-extrabold text-slate-850">Delivered</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            {order.status?.toLowerCase() === "delivered" 
                              ? (order.date ? new Date(new Date(order.date).getTime() + 30000).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "Delivered")
                              : order.status?.toLowerCase() === "shipped"
                              ? "Out for delivery"
                              : "Pending"}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Items Purchased */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Items Summary</h4>
                      <div className="divide-y divide-slate-100 bg-white border border-slate-100 rounded-xl p-4 space-y-3 max-h-64 overflow-y-auto">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex gap-4 items-center py-2 text-xs">
                            <img
                              src={item.image}
                              alt=""
                              className="w-10 h-10 object-cover rounded bg-slate-50 border border-slate-100"
                              crossOrigin="anonymous"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="font-bold text-slate-850 block truncate">{item.title}</span>
                              <span className="text-[10px] text-slate-400 mt-0.5 block uppercase tracking-wider font-semibold">
                                {item.category}
                              </span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-semibold text-slate-800 block">
                                ${parseFloat(item.price).toFixed(2)}
                              </span>
                              <span className="text-[10px] text-slate-400 block font-bold">
                                Qty: {item.quantity || 1}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address & Cost details */}
                    <div className="space-y-6">
                      <div className="space-y-3.5">
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Delivery Details</h4>
                        <div className="bg-white border border-slate-100 rounded-xl p-4.5 space-y-3.5 text-xs text-slate-600">
                          <div className="flex gap-2.5">
                            <MapPin size={16} className="text-brand-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-slate-800 block mb-1">
                                {order.shippingDetails?.fullName}
                              </span>
                              <span>{order.shippingDetails?.address}</span>
                              <span className="block mt-0.5">
                                {order.shippingDetails?.city}, {order.shippingDetails?.zipCode},{" "}
                                {order.shippingDetails?.country}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2.5 items-center border-t border-slate-50 pt-2.5">
                            <Clock size={16} className="text-brand-500 shrink-0" />
                            <span>Phone: {order.shippingDetails?.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Cost detail summary */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Receipt Breakdown</h4>
                        <div className="bg-white border border-slate-100 rounded-xl p-4.5 space-y-2.5 text-xs font-semibold text-slate-500">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="text-slate-800">${parseFloat(order.subtotal || order.total * 0.9).toFixed(2)}</span>
                          </div>
                          {order.subtotal && order.subtotal > order.total && (
                            <div className="flex justify-between text-emerald-600">
                              <span>Promo Discount</span>
                              <span>-${parseFloat(order.subtotal - order.total + (order.tax || 0) + (order.shipping || 0)).toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Sales Tax (8%)</span>
                            <span className="text-slate-800">${parseFloat(order.tax || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-slate-800">
                              {order.shipping === 0 ? "FREE" : `$${parseFloat(order.shipping || 0).toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-900 font-extrabold text-sm border-t border-slate-100 pt-3 mt-1.5">
                            <span>Total Charge</span>
                            <span>${parseFloat(order.total).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
