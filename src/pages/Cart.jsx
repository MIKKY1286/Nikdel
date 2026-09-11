import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, Ticket, Check } from "lucide-react";

export default function Cart() {
  const { currentUser } = useAuth();
  const { cart, removeFromCart, updateQuantity, cartTotal, orders } = useCart();
  const navigate = useNavigate();

  // Promo code states
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    
    if (orders && orders.length > 0) {
      setPromoError("Discount codes are only valid on your first order!");
      return;
    }

    const code = promoCode.trim().toUpperCase();
    if (code === "WELCOME10" || code === "NIKDEL10") {
      setDiscountPercent(10);
      setAppliedPromo(code);
      setPromoCode("");
    } else {
      setPromoError("Invalid discount code. Try WELCOME10!");
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 text-center bg-white border border-slate-100 p-8 rounded-2xl shadow-sm space-y-6">
        <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
          <ShoppingBag size={28} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Your shopping bag is locked</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Please log in or create an account with Nikdel store to manage items and place orders.
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

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 text-center bg-white border border-slate-100 p-8 rounded-2xl shadow-sm space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-450 flex items-center justify-center mx-auto">
          <ShoppingBag size={28} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
          <p className="text-sm text-slate-405 leading-relaxed font-medium">
            Looks like you haven't added any products to your cart yet. Let's find some!
          </p>
        </div>
        <Link
          to="/shop"
          className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
        >
          Browse Shop Catalog
        </Link>
      </div>
    );
  }

  // Cost calculations
  const discountAmount = cartTotal * (discountPercent / 100);
  const subtotal = cartTotal - discountAmount;
  const tax = subtotal * 0.08;
  
  const hasPreviousOrders = orders && orders.length > 0;
  const shipping = !hasPreviousOrders ? 0 : (subtotal > 150 ? 0 : 10 + cart.length * 2);
  
  const total = subtotal + tax + shipping;

  const handleCheckoutRedirect = () => {
    // Navigate to checkout and pass discount info if any via router state
    navigate("/checkout", { 
      state: { 
        discountPercent, 
        appliedPromo, 
        discountAmount 
      } 
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Cart</h1>
        <p className="text-sm text-slate-400 mt-1">Review the selections in your bag before proceeding.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {cart.map((item, index) => (
                <div key={item.id + "-" + index} className="p-6 flex gap-4 sm:gap-6 flex-col sm:flex-row items-start sm:items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-50 border border-slate-100 shrink-0"
                    crossOrigin="anonymous"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm truncate hover:text-brand-600 cursor-pointer">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                      {item.category}
                    </p>
                    <p className="text-sm font-semibold text-slate-750 mt-2 sm:hidden">
                      ${parseFloat(item.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Desktop Price */}
                  <div className="hidden sm:block text-right shrink-0">
                    <span className="text-sm font-bold text-slate-800">
                      ${parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center border border-slate-200 rounded-lg p-1 shrink-0 bg-slate-50">
                    <button
                      onClick={() => updateQuantity(index, (item.quantity || 1) - 1)}
                      className="p-1 hover:text-brand-600 rounded hover:bg-white text-slate-400 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-xs font-bold text-slate-700 px-3 min-w-[24px] text-center">
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => updateQuantity(index, (item.quantity || 1) + 1)}
                      className="p-1 hover:text-brand-600 rounded hover:bg-white text-slate-400 transition-colors"
                      title="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(index)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors shrink-0 self-end sm:self-auto"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick shop fallback */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-500 font-bold transition-all"
          >
            ← Continue shopping for items
          </Link>
        </div>

        {/* Pricing / Checkout Summary */}
        <div className="space-y-6">
          {/* Promo code */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-850 text-sm">Discount Voucher</h3>
            {appliedPromo ? (
              <div className="flex items-center justify-between bg-emerald-50 text-emerald-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-1.5">
                  <Check size={16} />
                  <span>Promo {appliedPromo} applied ({discountPercent}% Off)</span>
                </div>
                <button
                  onClick={() => {
                    setDiscountPercent(0);
                    setAppliedPromo("");
                  }}
                  className="text-emerald-800 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="WELCOME10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 uppercase"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5"
                >
                  <Ticket size={14} />
                  Apply
                </button>
              </form>
            )}
            {promoError && <p className="text-[11px] text-red-500 font-semibold">{promoError}</p>}
          </div>

          {/* Checkout Totals */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-850 text-sm pb-3 border-b border-slate-100">Order Summary</h3>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Estimated Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Shipping Cost</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-bold">
                      {!hasPreviousOrders ? "FREE (1st Order)" : "FREE"}
                    </span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-slate-400 font-semibold">
                  Add ${(150 - subtotal).toFixed(2)} more to unlock free shipping!
                </p>
              )}
              
              <div className="border-t border-slate-100 pt-4 flex justify-between font-extrabold text-slate-900 text-base">
                <span>Grand Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutRedirect}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-brand-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-slate-900/10 hover:shadow-brand-500/20 group"
            >
              Proceed to Checkout
              <ArrowRight size={16} className="transform transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
