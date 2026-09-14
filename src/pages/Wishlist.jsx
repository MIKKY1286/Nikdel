import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useWishlist } from "../context/WishlistContext";

export default function Wishlist() {
  const { wishlist, loadingWishlist } = useWishlist();

  if (loadingWishlist) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900">Your Wishlist</h1>
        <span className="text-slate-500 bg-slate-100 px-3 py-1 rounded-full text-sm font-semibold">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {wishlist.map(item => (
          <ProductCard key={item.id || item._id} product={item.product || item} />
        ))}
      </div>
    </div>
  );
}
