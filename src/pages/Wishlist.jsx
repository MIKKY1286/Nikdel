import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";

export default function Wishlist() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm min-h-[500px] flex flex-col items-center justify-center">
      <div className="w-20 h-20 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Heart size={40} className="fill-brand-500" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900">Your Wishlist is Empty</h1>
      <p className="text-slate-500 max-w-md mx-auto">
        You haven't saved any items yet. Browse our catalog and click the heart icon on any product to save it for later.
      </p>
      <Link to="/shop" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-md mt-4">
        <ShoppingBag size={20} />
        Start Shopping
      </Link>
    </div>
  );
}
