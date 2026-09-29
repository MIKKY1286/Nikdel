import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import productService from "../services/product.service";
import { ShoppingCart, Heart, Share2, ArrowRightLeft, ShieldCheck, CreditCard, Plus, Minus, Star, MessageCircle } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useSettings } from "../context/SettingsContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { addToCart, cart, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();
  const { formatPrice } = useSettings();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [adding, setAdding] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 81, hours: 6, mins: 50, secs: 2 });
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    // Fetch product details
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productService.getProductById(id);
        const found = res.data || res;
        setProduct(found);
        
        // Fetch related products by category
        if (found && found.category) {
          const relatedRes = await productService.getAllProducts({ category: found.category, limit: 5 });
          const allProducts = relatedRes.products || relatedRes.data || relatedRes || [];
          setRelatedProducts(allProducts.filter(p => p.id !== found.id && p._id !== found._id).slice(0, 4));
        }

        // Fetch reviews
        try {
          const reviewsRes = await productService.getProductReviews(found._id || found.id);
          setReviews(reviewsRes.data || []);
        } catch (err) {
          console.error("Failed to fetch reviews", err);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const productId = product?._id || product?.id;
  const cartItem = cart?.find(item => item.id === productId);
  const cartIndex = cart?.findIndex(item => item.id === productId);

  const [prevCartItemQty, setPrevCartItemQty] = useState(cartItem?.quantity);
  if (cartItem?.quantity !== prevCartItemQty) {
    setPrevCartItemQty(cartItem?.quantity);
    if (cartItem && quantity !== cartItem.quantity) {
      setQuantity(cartItem.quantity);
    } else if (!cartItem && quantity !== 1) {
      setQuantity(1);
    }
  }

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        if (secs > 0) secs--;
        else {
          secs = 59;
          if (mins > 0) mins--;
          else {
            mins = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleQuantityChange = (newQty) => {
    if (cartItem) {
        if (newQty < 1) {
            removeFromCart(cartIndex);
        } else {
            updateQuantity(cartIndex, newQty);
        }
    } else {
        setQuantity(Math.max(1, newQty));
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await productService.addProductReview(product._id || product.id, reviewForm);
      showToast("Review submitted successfully!", "success");
      setReviews([res.data, ...reviews]);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || err.message || "Failed to submit review", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
        <p className="text-slate-500 font-medium animate-pulse">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500">The product you're looking for doesn't exist or there was a network error loading it.</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold mt-4 hover:bg-brand-600 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link to={`/shop?category=${product.category?.slug || product.category}`} className="hover:text-brand-600">{product.category?.name || product.category}</Link>
        <span>›</span>
        <span className="text-slate-800 font-semibold">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 flex items-center justify-center relative">
            {/* Badges */}
            <div className="absolute top-6 left-6 space-y-2">
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md block w-max">
                68%
              </span>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 w-max">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                ORGANIC
              </span>
            </div>
            {(() => {
              const productImages = Array.isArray(product.images) && product.images.length > 0 
                ? product.images 
                : (product.image ? [product.image] : ['https://via.placeholder.com/500']);
              
              return (
                <img src={productImages[selectedImage] || productImages[0]} alt={product.name} className="w-full max-w-md object-contain aspect-square mix-blend-multiply" />
              );
            })()}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {(() => {
              const productImages = Array.isArray(product.images) && product.images.length > 0 
                ? product.images 
                : (product.image ? [product.image] : ['https://via.placeholder.com/150']);
              
              return productImages.map((thumb, idx) => (
                <div key={idx} onClick={() => setSelectedImage(idx)} className={`w-20 h-20 shrink-0 border-2 rounded-xl p-2 cursor-pointer transition-colors ${idx === selectedImage ? 'border-brand-500' : 'border-slate-100 hover:border-slate-300'}`}>
                  <img src={thumb} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} className={star <= (product.averageRating || 5) ? "fill-current" : "text-slate-200"} />
                ))}
                <span className="text-slate-700 font-bold ml-2">{(product.averageRating || 5).toFixed(1)}</span>
                <span className="text-slate-400 ml-1">({reviews.length || product.numOfReviews || 0})</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
              <span className="text-slate-500">SKU: <span className="font-bold text-slate-700">{product.SKU || productId}</span></span>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {product.shortDescription || product.description?.substring(0, 150) + "..." || "No description available."}
          </p>

          <div className="flex items-end gap-3">
            <span className="text-4xl font-extrabold text-red-600">{formatPrice(product.price || 0)}</span>
            <span className="text-lg text-slate-400 line-through font-semibold mb-1">{formatPrice((product.price || 0) * 1.5)}</span>
          </div>

          <div>
            <a href={`https://wa.me/1234567890?text=${encodeURIComponent(`Hello, I would like to order: ${product.name} (SKU: ${product.SKU || productId})`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-6 py-2.5 rounded-full items-center gap-2 transition-colors">
              <MessageCircle size={16} /> Order on WhatsApp
            </a>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-orange-600 font-bold">Special Offer :</span>
              <div className="flex items-center gap-1 text-orange-700 font-bold bg-white px-2 py-1 rounded shadow-sm">
                <span>{timeLeft.days.toString().padStart(2, '0')}</span>:
                <span>{timeLeft.hours.toString().padStart(2, '0')}</span>:
                <span>{timeLeft.mins.toString().padStart(2, '0')}</span>:
                <span>{timeLeft.secs.toString().padStart(2, '0')}</span>
              </div>
            </div>
            <span className="text-xs text-orange-600/70">Remains until the end of the offer</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
              <button onClick={() => handleQuantityChange(quantity - 1)} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"><Minus size={16} /></button>
              <span className="w-10 text-center font-bold text-slate-800">{quantity}</span>
              <button onClick={() => handleQuantityChange(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"><Plus size={16} /></button>
            </div>
            
            <button 
              onClick={async () => {
                if (!currentUser) {
                  navigate("/login");
                  return;
                }
                if (cartItem) {
                  navigate("/cart");
                  return;
                }
                setAdding(true);
                await addToCart({
                  id: productId,
                  title: product.name,
                  price: product.price,
                  image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : (product.image || 'https://via.placeholder.com/150'),
                  category: product.category?.name || product.category || 'Uncategorized'
                }, quantity);
                setAdding(false);
              }}
              disabled={adding}
              className={`flex-1 font-bold h-12 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-75 ${cartItem ? 'bg-slate-100 text-slate-800 hover:bg-slate-200' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
            >
              {adding ? (
                <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <ShoppingCart size={18} />
              )}
              {adding ? "Processing..." : cartItem ? "View in Cart" : "Add to cart"}
            </button>
            
            <button 
              onClick={async () => {
                if (!currentUser) {
                  navigate("/login");
                  return;
                }
                if (!cartItem) {
                  setAdding(true);
                  await addToCart({
                    id: productId,
                    title: product.name,
                    price: product.price,
                    image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : (product.image || 'https://via.placeholder.com/150'),
                    category: product.category?.name || product.category || 'Uncategorized'
                  }, quantity);
                  setAdding(false);
                }
                navigate("/checkout");
              }}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-xl transition-all shadow-sm"
            >
              Buy Now
            </button>
          </div>

          <div className="space-y-3 pt-4">
            <div className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <CreditCard size={20} className="text-slate-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">Payment.</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Payment upon receipt of goods, Payment by card in the department, Google Pay, Online card, -5% discount in case of payment</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <ShieldCheck size={20} className="text-slate-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">Warranty.</h4>
                <p className="text-xs text-slate-500 leading-relaxed">The Consumer Protection Act does not provide for the return of this product of proper quality.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-sm font-semibold text-slate-600">
            <button onClick={() => showToast("Added to Wishlist", "success")} className="flex items-center gap-2 hover:text-brand-600 transition-colors"><Heart size={16} /> Add to wishlist</button>
            <button onClick={() => showToast("Link Copied to Clipboard", "success")} className="flex items-center gap-2 hover:text-brand-600 transition-colors"><Share2 size={16} /> Share this Product</button>
            <button onClick={() => showToast("Added to Compare list", "success")} className="flex items-center gap-2 hover:text-brand-600 transition-colors"><ArrowRightLeft size={16} /> Compare</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-slate-200 pt-8 mt-12">
        <div className="flex items-center gap-8 border-b border-slate-200 pb-px">
          <button 
            onClick={() => setActiveTab("description")}
            className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "description" ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Description
          </button>
          <button 
            onClick={() => setActiveTab("reviews")}
            className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "reviews" ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Reviews ({reviews.length})
          </button>
        </div>
        
        <div className="py-8 text-sm text-slate-600 leading-relaxed space-y-8">
          {activeTab === "description" ? (
            <p className="whitespace-pre-line">{product.description || "No detailed description available for this product."}</p>
          ) : (
            <div className="space-y-10">
              {/* Review List */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900">Customer Reviews</h3>
                {reviews.length === 0 ? (
                  <p className="text-slate-500">No reviews yet. Be the first to review this product!</p>
                ) : (
                  <div className="grid gap-6">
                    {reviews.map((review) => (
                      <div key={review._id || review.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex gap-4">
                        <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center text-slate-600 font-bold text-lg overflow-hidden">
                          {review.user?.avatar && review.user.avatar !== 'no-photo.jpg' ? (
                            <img src={review.user.avatar} alt={review.user?.name || 'User'} className="w-full h-full object-cover" />
                          ) : (
                            (review.user?.name?.[0] || 'U').toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-slate-900">{review.user?.name || 'User'}</h4>
                              <span className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex text-amber-400">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={14} className={star <= review.rating ? "fill-current" : "text-slate-200"} />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-600">{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Review Form */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Write a Review</h3>
                {!currentUser ? (
                  <div className="bg-brand-50 text-brand-700 p-4 rounded-xl flex items-center justify-between">
                    <p className="font-semibold">Please sign in to leave a review.</p>
                    <button onClick={() => navigate("/login")} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-bold transition-colors">Sign In</button>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 block">Rating</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star size={28} className={star <= reviewForm.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 block">Your Review</label>
                      <textarea
                        required
                        rows="4"
                        placeholder="What did you like or dislike?"
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-slate-900 hover:bg-brand-600 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md disabled:bg-slate-400 flex items-center gap-2"
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="pt-12 border-t border-slate-200 space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Related products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {relatedProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
}
