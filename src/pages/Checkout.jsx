import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { CreditCard, Truck, ClipboardList, CheckCircle, ArrowRight, Loader } from "lucide-react";
import paymentService from "../services/payment.service";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

export default function Checkout() {
  const { currentUser } = useAuth();
  const { cart, placeOrder, cartTotal, orders } = useCart();
  const location = useLocation();


  // Read promo discount details from cart page navigation state
  const discountPercent = location.state?.discountPercent || 0;
  const appliedPromo = location.state?.appliedPromo || "";
  const discountAmount = location.state?.discountAmount || 0;

  // Form states
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  // Flow states
  const [processing, setProcessing] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [error, setError] = useState("");

  if (cart.length === 0 && !successOrder) {
    return (
      <div className="max-w-md mx-auto my-12 text-center bg-white border border-slate-100 p-8 rounded-2xl shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="text-sm text-slate-400">Please add items to your cart before checking out.</p>
        <Link
          to="/shop"
          className="w-full inline-flex items-center justify-center bg-slate-900 text-white font-bold py-3.5 rounded-xl"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  // Cost calculations
  const subtotal = cartTotal - discountAmount;
  const tax = subtotal * 0.08;
  const hasPreviousOrders = orders && orders.length > 0;
  const shipping = !hasPreviousOrders ? 0 : (subtotal > 150 ? 0 : 10 + cart.length * 2);
  const total = subtotal + tax + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderPlacement = async (paymentRef) => {
    try {
      const order = await placeOrder(shippingDetails, paymentRef, discountAmount, appliedPromo);
      if (order) {
        setSuccessOrder(order);
      } else {
        throw new Error("Unable to place order. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to record order details. Please contact customer service.");
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    if (
      PAYSTACK_PUBLIC_KEY &&
      PAYSTACK_PUBLIC_KEY !== "pk_test_YOUR_PAYSTACK_KEY" &&
      PAYSTACK_PUBLIC_KEY.trim() !== ""
    ) {
      try {
        const conversionRate = 1600; // 1 USD = 1600 NGN
        const amountInKobo = Math.round(total * conversionRate * 100);
        
        // Initialize payment on backend
        const emailToUse = currentUser?.email || "customer@nikdel.com";
        const initResponse = await paymentService.initializePayment(emailToUse, amountInKobo);
        const { access_code, reference } = initResponse.data || initResponse || {};

        // Paystack inline integration
        const handler = window.PaystackPop.setup({
          key: PAYSTACK_PUBLIC_KEY,
          email: emailToUse,
          amount: amountInKobo,
          currency: "NGN",
          ref: reference || "ref_" + Date.now(),
          access_code: access_code,
          callback: (response) => {
            handleOrderPlacement(response.reference);
          },
          onClose: () => {
            setProcessing(false);
          }
        });
        handler.openIframe();
      } catch (err) {
        console.error("Paystack error:", err);
        setError("Paystack Payment initialization failed. Please try again or use a different payment method.");
        setProcessing(false);
      }
    } else {
      // Mock gateway simulation
      setTimeout(() => {
        handleOrderPlacement("mock_paystack_ref_" + Date.now());
      }, 1500);
    }
  };

  // SUCCESS STATE VIEW
  if (successOrder) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center bg-white border border-slate-100 p-10 rounded-3xl shadow-xl space-y-8 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle size={44} className="stroke-[2.5]" />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Order Placed Successfully!</h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            Thank you for shopping at Nikdel. Your transaction is complete and shipping is in preparation.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100 space-y-3.5 text-xs">
          <div className="flex justify-between font-bold border-b border-slate-200/50 pb-2">
            <span className="text-slate-500 font-semibold uppercase tracking-wider">Order ID</span>
            <span className="text-slate-900 font-mono select-all">{successOrder.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">Recipient Name</span>
            <span className="text-slate-700 font-bold">{successOrder.shippingDetails.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">Delivery Address</span>
            <span className="text-slate-700 font-bold max-w-[240px] truncate text-right" title={successOrder.shippingDetails.address}>
              {successOrder.shippingDetails.address}, {successOrder.shippingDetails.city}
            </span>
          </div>
          <div className="flex justify-between font-extrabold text-slate-950 border-t border-slate-200/50 pt-3">
            <span className="text-sm">Paid Amount</span>
            <span className="text-sm">${successOrder.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Link
            to="/orders"
            className="flex-1 bg-slate-900 hover:bg-brand-650 text-white font-bold py-4 rounded-xl transition-all shadow-md shadow-slate-900/10"
          >
            Track Order History
          </Link>
          <Link
            to="/shop"
            className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-4 rounded-xl transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checkout Order</h1>
        <p className="text-sm text-slate-400 mt-1">Complete your delivery and payment details to finalize purchase.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-650 font-semibold p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Shipping & Payment Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5">
            <h3 className="font-bold text-slate-850 text-base flex items-center gap-2 border-b border-slate-50 pb-4">
              <Truck size={18} className="text-brand-500" />
              1. Delivery Address
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">Recipient Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={shippingDetails.fullName}
                  onChange={handleInputChange}
                  required
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">Street Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Apartment, suite, unit, 123 Main St"
                  value={shippingDetails.address}
                  onChange={handleInputChange}
                  required
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="New York"
                  value={shippingDetails.city}
                  onChange={handleInputChange}
                  required
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">ZIP / Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  placeholder="10001"
                  value={shippingDetails.zipCode}
                  onChange={handleInputChange}
                  required
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">Country</label>
                <input
                  type="text"
                  name="country"
                  placeholder="United States"
                  value={shippingDetails.country}
                  onChange={handleInputChange}
                  required
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={shippingDetails.phone}
                  onChange={handleInputChange}
                  required
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          </div>

          {/* Secure Payment Gateway */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5">
            <h3 className="font-bold text-slate-850 text-base flex items-center gap-2 border-b border-slate-50 pb-4">
              <CreditCard size={18} className="text-brand-500" />
              2. Payment Method
            </h3>

            <div className="border border-brand-100 bg-brand-50/20 rounded-xl p-4.5 flex items-start gap-3 border-dashed">
              <input
                type="radio"
                id="paystack-option"
                name="paymentMethod"
                checked={true}
                readOnly
                className="mt-1 accent-brand-600"
              />
              <label htmlFor="paystack-option" className="cursor-pointer select-none">
                <span className="font-bold text-slate-900 text-sm block">Paystack Secure Checkout</span>
                <span className="text-xs text-slate-400 mt-1 block leading-relaxed">
                  Pay securely using Credit/Debit card, Bank, USSD, or Mobile Money. Amount will be processed in NGN (Rate: 1 USD = 1,600 NGN).
                </span>
              </label>
            </div>
            
            {PAYSTACK_PUBLIC_KEY === "pk_test_YOUR_PAYSTACK_KEY" && (
              <div className="bg-emerald-50 text-emerald-700 text-xs font-semibold p-4 rounded-xl border border-emerald-100/50">
                💡 <span className="font-bold">Test Mode simulation:</span> The Paystack API key in configuration is set to default. Confirming checkout will simulate a successful payment reference instantly.
              </div>
            )}
          </div>
        </div>

        {/* Order review sidebar */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
          <h3 className="font-bold text-slate-850 text-base flex items-center gap-2 border-b border-slate-50 pb-4">
            <ClipboardList size={18} className="text-brand-500" />
            3. Order Review
          </h3>

          {/* Cart items list summary */}
          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
            {cart.map((item, index) => (
              <div key={item.id + "-" + index} className="py-3 flex items-center justify-between text-xs">
                <div className="flex gap-2.5 items-center truncate pr-3">
                  <img src={item.image} alt="" className="w-8 h-8 rounded object-cover shrink-0 bg-slate-50" crossOrigin="anonymous" />
                  <span className="font-bold text-slate-700 truncate">{item.title}</span>
                  <span className="text-slate-400">x{item.quantity || 1}</span>
                </div>
                <span className="font-semibold text-slate-800 shrink-0">
                  ${(item.price * (item.quantity || 1)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing breakdowns */}
          <div className="border-t border-slate-100 pt-4 space-y-3.5 text-xs text-slate-650 font-medium">
            <div className="flex justify-between">
              <span>Cart Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promo Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Sales Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
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
            <div className="flex justify-between text-slate-900 font-extrabold text-sm border-t border-slate-100 pt-4">
              <span>Total Price</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-500/20 group disabled:bg-slate-400 disabled:shadow-none"
          >
            {processing ? (
              <>
                <Loader size={18} className="animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                Confirm & Place Order
                <ArrowRight size={16} className="transform transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
