import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import productService from "../services/product.service";
import { ShoppingCart, Heart, Share2, ArrowRightLeft, ShieldCheck, CreditCard, Plus, Minus, Star, MessageCircle } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { addToCart, cart, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [adding, setAdding] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 81, hours: 6, mins: 50, secs: 2 });

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

  useEffect(() => {
    if (cartItem && quantity !== cartItem.quantity) {
      setQuantity(cartItem.quantity);
    } else if (!cartItem && quantity !== 1) {
      setQuantity(1);
    }
  }, [cartItem]);

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

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
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
            <img src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : (product.image || 'https://via.placeholder.com/500')} alt={product.name} className="w-full max-w-md object-contain aspect-square mix-blend-multiply" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1,2,3].map((thumb, idx) => (
              <div key={idx} className={`w-20 h-20 shrink-0 border-2 rounded-xl p-2 cursor-pointer ${idx === 0 ? 'border-brand-500' : 'border-slate-100'}`}>
                <img src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : (product.image || 'https://via.placeholder.com/150')} alt="" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
            ))}
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
                <Star size={16} className="fill-current" />
                <Star size={16} className="fill-current" />
                <Star size={16} className="fill-current" />
                <Star size={16} className="fill-current" />
                <Star size={16} className="text-slate-200" />
                <span className="text-slate-700 font-bold ml-2">4.00</span>
                <span className="text-slate-400 ml-1">(2)</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
              <span className="text-slate-500">SKU: <span className="font-bold text-slate-700">{product.SKU || productId}</span></span>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada tincidunt. Class aptent taciti
            sociosqu ad litora torquent Vivamus adipiscing nisl ut dolor dignissim semper.
          </p>

          <div className="flex items-end gap-3">
            <span className="text-4xl font-extrabold text-red-600">${(product.price || 0).toFixed(2)}</span>
            <span className="text-lg text-slate-400 line-through font-semibold mb-1">${((product.price || 0) * 1.5).toFixed(2)}</span>
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
            
            <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-xl transition-all shadow-sm">
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
            Reviews (2)
          </button>
        </div>
        
        <div className="py-8 text-sm text-slate-600 leading-relaxed space-y-4">
          {activeTab === "description" ? (
            <>
              <p>Quisque varius diam vel metus mattis, id aliquam diam rhoncus. Proin vitae magna in dui finibus malesuada et at nulla. Morbi elit ex, viverra vitae ante vel, blandit feugiat ligula. Fusce fermentum iaculis nibh, at sodales leo maximus a. Nullam ultricies sodales nunc, in pellentesque lorem mattis quis. Cras imperdiet est in nunc tristique lacinia. Nullam aliquam mauris eu accumsan tincidunt. Suspendisse velit ex, aliquet vel ornare vel, dignissim a tortor.</p>
              <p>Morbi ut sapien vitae odio accumsan gravida. Morbi vitae erat auctor, eleifend nunc a, lobortis neque. Praesent aliquam dignissim viverra. Maecenas lacus odio, feugiat eu nunc sit amet, maximus sagittis dolor. Vivamus nisi sapien, elementum sit amet eros sit amet, ultricies cursus ipsum. Sed consequat luctus ligula. Curabitur laoreet rhoncus blandit. Aenean vel diam ut arcu pharetra dignissim ut sed leo. Vivamus faucibus, ipsum in vestibulum vulputate, lorem orci convallis quam, sit amet consequat nulla felis pharetra lacus. Duis semper erat mauris, sed egestas purus commodo vel.</p>
            </>
          ) : (
            <p>No reviews yet.</p>
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
