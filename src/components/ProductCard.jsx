import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart, Star, Check, Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const { addToCart, cart, removeFromCart, updateQuantity } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const productName = product.name || product.title || "Unnamed Product";
  const productId = product._id || product.id;
  const cartItem = cart?.find(item => item.id === productId);
  const cartIndex = cart?.findIndex(item => item.id === productId);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Parse image: some APIs return an array of images, others a single string
  const imageUrl = Array.isArray(product.images) && product.images.length > 0 
    ? product.images[0] 
    : (product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60");

  // Format clean category name
  const categoryName = product.category && typeof product.category === 'object'
    ? product.category.name
    : (product.category || "Uncategorized");

  // Create a stable mock rating and reviews count based on product id
  const rating = parseFloat(((Math.abs(hashCode(productId || "")) % 15) / 10 + 3.5).toFixed(1));
  const reviewCount = (Math.abs(hashCode(productId || "")) % 120) + 12;

  function hashCode(str) {
    let hash = 0;
    const s = String(str);
    for (let i = 0; i < s.length; i++) {
      hash = s.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setAdding(true);
    const success = await addToCart({
      id: productId,
      title: productName,
      price: product.price,
      image: imageUrl,
      category: categoryName
    });
    setAdding(false);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <Link to={`/product/${productId}`} className="group bg-white rounded-2xl border border-slate-100 hover:border-brand-500/10 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Product Image Section */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={imageUrl}
          alt={productName}
          className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          crossOrigin="anonymous"
        />
        {/* Category Badge */}
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[10px] font-bold text-slate-700 px-3 py-1 rounded-full border border-slate-100 shadow-sm uppercase tracking-wider">
          {categoryName}
        </span>
      </div>

      {/* Info Content Section */}
      <div className="p-5 flex flex-col flex-1">
        {/* Ratings */}
        <div className="flex items-center gap-1 mb-2.5">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(rating) ? "fill-amber-400" : "text-slate-200"}
              />
            ))}
          </div>
          <span className="text-[11px] font-semibold text-slate-500 ml-1 mt-0.5">
            {rating} ({reviewCount})
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-800 text-sm line-clamp-2 min-h-[40px] mb-2 hover:text-brand-600 transition-colors">
          {productName}
        </h3>

        {/* Price and CTA */}
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Price</span>
            <span className="text-lg font-extrabold text-slate-900">
              ${parseFloat(product.price).toFixed(2)}
            </span>
          </div>

          {cartItem ? (
            <div className="flex items-center bg-slate-100 rounded-xl p-1 shadow-sm">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); quantity > 1 ? updateQuantity(cartIndex, quantity - 1) : removeFromCart(cartIndex); }}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 bg-white rounded-lg shadow-sm transition-colors"
              >
                {quantity > 1 ? <Minus size={14} /> : <Trash2 size={14} className="text-red-500" />}
              </button>
              <span className="w-8 text-center font-bold text-slate-800 text-sm">{quantity}</span>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(cartIndex, quantity + 1); }}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 bg-white rounded-lg shadow-sm transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={adding}
              className={`inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 shadow-sm ${
                added
                  ? "bg-emerald-500 text-white shadow-emerald-500/20"
                  : "bg-slate-900 text-white hover:bg-brand-600 shadow-slate-900/10 hover:shadow-brand-500/20"
              }`}
              title="Add to Cart"
            >
              {adding ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : added ? (
                <Check size={18} />
              ) : (
                <ShoppingCart size={18} />
              )}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
