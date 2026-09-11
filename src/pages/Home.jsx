import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { 
  Wrench,
  HardHat,
  PaintBucket,
  Tractor
} from "lucide-react";
import { motion } from "framer-motion";
import productService from "../services/product.service";

export default function Home() {
  const [bestSelling, setBestSelling] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { currentUser } = useAuth();
  const [claimed, setClaimed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 12, mins: 45, secs: 30 });

  const heroSlides = [
    {
      title: "Construction & Heavy Machinery",
      desc: "Get the best deals on heavy-duty power tools, cement mixers, and construction equipment from top brands.",
      badge: "Mega Sale",
      price: "$199.99",
      oldPrice: "$250.00",
      image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1000"
    },
    {
      title: "Premium Finishing & Decor Options",
      desc: "Showcase your home with premium quality paints from Value Paint, tiles, doors, and flooring options.",
      badge: "Top Picks",
      price: "$45.99",
      oldPrice: "$65.00",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1000"
    },
    {
      title: "Jubaili Agrotec Farming Essentials",
      desc: "Top quality sprayers, farm chemicals, insecticides, and wheelbarrows for all your agricultural needs.",
      badge: "Agro Deals",
      price: "$89.99",
      oldPrice: "$120.00",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1000"
    },
    {
      title: "Durable Roofing & Canopies",
      desc: "Protect your property with our premium durable roofing solutions, structural timber, and outdoor canopies.",
      badge: "New Arrival",
      price: "$299.99",
      oldPrice: "$400.00",
      image: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&q=80&w=1000"
    },
    {
      title: "Premium Upholstery & Furniture Materials",
      desc: "High-quality leather materials for chair making, chair castors, and furniture fittings.",
      badge: "Best Sellers",
      price: "$15.99",
      oldPrice: "$25.00",
      image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1000"
    },
    {
      title: "Hardware, Adhesives & Fasteners",
      desc: "Essential carpentry glue (Top Bond), hand tools, nails, plumbing, and electrical fittings.",
      badge: "Essentials",
      price: "$9.99",
      oldPrice: "$15.00",
      image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=1000"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, mins, secs } = prev;
        if (secs > 0) secs--;
        else {
          secs = 59;
          if (mins > 0) mins--;
          else {
            mins = 59;
            if (hours > 0) hours--;
            else {
              hours = 23; // Loop for demo purposes
            }
          }
        }
        return { hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const response = await productService.getAllProducts({ limit: 12 });
        const data = response.products || response.data || response || [];
        
        setFeaturedProducts(data.slice(0, 4));
        setNewArrivals(data.slice().reverse().slice(0, 4));
        setBestSelling(data.length > 2 ? [data[1], data[2], data[0], data[3]].filter(Boolean) : data.slice(0,4));
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Could not load featured products. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const categories = [
    { name: "Power Tools", query: "power-tools", icon: Wrench, color: "bg-blue-50 text-blue-600 border-blue-100" },
    { name: "Building Materials", query: "building-materials", icon: HardHat, color: "bg-orange-50 text-orange-600 border-orange-100" },
    { name: "Agriculture", query: "agriculture", icon: Tractor, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { name: "Paints & Finishes", query: "paints", icon: PaintBucket, color: "bg-purple-50 text-purple-600 border-purple-100" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="space-y-16"
    >
      {/* Top Layout: Categories Sidebar + Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block w-[260px] shrink-0 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200 font-bold text-slate-900 flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>
              All Categories
            </div>
            <div className="flex flex-col text-[13px] text-slate-700">
              {['Power & Hand Tools', 'Building Materials', 'Paints & Finishes', 'Plumbing & Electrical', 'Hardware & Fasteners', 'Upholstery & Furniture Fittings', 'Agricultural Tools', 'Farm Chemicals & Insecticides', 'Doors, Windows & Flooring', 'Canopies & Tents'].map((item, idx) => (
                <Link key={idx} to={`/shop?category=${item.toLowerCase().replace(/ & /g, '-').replace(/, /g, '-').replace(/ /g, '-')}`} className="px-5 py-3 border-b border-slate-100 hover:text-brand-600 flex items-center justify-between transition-colors font-medium">
                  <div className="flex items-center gap-3">
                    {/* Minimal placeholder icons matching the mockup style */}
                    <div className="w-4 h-4 rounded-full border border-slate-300 opacity-60"></div>
                    {item}
                  </div>
                  <span className="text-slate-400 font-serif text-lg leading-none">&rsaquo;</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Hero Banner Carousel */}
          <div className="flex-1 bg-[#f0eee9] rounded-xl overflow-hidden relative flex items-center border border-slate-200/50 shadow-sm min-h-[400px]">
            {heroSlides.map((slide, idx) => (
              <div 
                key={idx} 
                className={`absolute inset-0 flex items-center transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
              >
                <div className="relative z-10 max-w-[420px] space-y-5 p-8 sm:p-12 lg:p-14">
                  <span className="inline-block bg-brand-500 text-white text-[11px] uppercase tracking-wide font-bold px-3 py-1.5 rounded-md shadow-sm">
                    {slide.badge}
                  </span>
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
                    {slide.title}
                  </h1>
                  <p className="text-slate-600 text-[15px] leading-relaxed">
                    {slide.desc}
                  </p>
                  
                  <div className="flex items-center gap-5 pt-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                      <Link to="/shop" className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-8 py-3.5 rounded-lg shadow-md shadow-brand-600/20 transition-all">
                        Shop Now
                      </Link>
                    </motion.div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-extrabold text-brand-600 tracking-tight">{slide.price}</span>
                        <span className="text-sm font-bold text-slate-400 line-through">{slide.oldPrice}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Don't miss this limited time offer.</span>
                    </div>
                  </div>
                </div>
                
                {/* Banner Image Right */}
                <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[55%]">
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover mix-blend-multiply opacity-90 object-right" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f0eee9] via-[#f0eee9]/40 to-transparent"></div>
                </div>
              </div>
            ))}
            
            {/* Carousel dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              {heroSlides.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === currentSlide ? 'bg-brand-600' : 'bg-slate-300 hover:bg-slate-400'}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Icons Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-8">
          {[
            { title: "Payment only online", desc: "Tasigforsamhet beteendedesign. Mobile checkout. Ylig kärrtorpa.", icon: "bg-amber-100 border-amber-300" },
            { title: "New stocks and sales", desc: "Tasigforsamhet beteendedesign. Mobile checkout. Ylig kärrtorpa.", icon: "bg-blue-100 border-blue-300" },
            { title: "Quality assurance", desc: "Tasigforsamhet beteendedesign. Mobile checkout. Ylig kärrtorpa.", icon: "bg-orange-100 border-orange-300" },
            { title: "Delivery from 1 hour", desc: "Tasigforsamhet beteendedesign. Mobile checkout. Ylig kärrtorpa.", icon: "bg-emerald-100 border-emerald-300" }
          ].map((feat, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="w-10 h-10 shrink-0 relative mt-1">
                 <div className={`absolute -bottom-1 -left-1 w-8 h-8 rounded-full ${feat.icon} opacity-50`}></div>
                 <div className="relative w-8 h-8 border-2 border-slate-800 rounded text-slate-800 flex items-center justify-center font-bold text-xs bg-white">
                   {index + 1}
                 </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-[13px] mb-1.5">{feat.title}</h4>
                <p className="text-[11px] text-slate-500 leading-[1.6]">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promotional Banners & Cards */}
      <motion.section 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/shop?category=power-tools" className="relative h-48 sm:h-64 rounded-2xl overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800" alt="Power Tools" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
              <span className="text-brand-400 font-bold text-sm mb-2 uppercase tracking-wider">Mega Construction Sale</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">Up to 40% Off<br/>On Power Tools</h3>
              <span className="text-sm font-semibold underline underline-offset-4">Shop Now</span>
            </div>
          </Link>
          <Link to="/shop?category=agriculture" className="relative h-48 sm:h-64 rounded-2xl overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=800" alt="Agriculture" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-900/80 to-transparent"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
              <span className="text-amber-300 font-bold text-sm mb-2 uppercase tracking-wider">Agro Store</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">Farming Essentials<br/>& Chemicals</h3>
              <span className="text-sm font-semibold underline underline-offset-4">Explore</span>
            </div>
          </Link>
        </div>
      </motion.section>

      {/* New Arrivals */}
      <motion.section 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        <div className="flex items-end justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">New Arrivals</h2>
            <p className="text-sm text-slate-400 mt-1">Don't miss the latest additions to our catalog.</p>
          </div>
          <Link to="/shop" className="text-brand-600 hover:text-brand-700 text-sm font-bold flex items-center gap-1 transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 animate-pulse">
                <div className="aspect-square bg-slate-150 rounded-xl"></div>
                <div className="h-4 bg-slate-150 rounded w-2/3"></div>
                <div className="h-10 bg-slate-150 rounded-xl mt-4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500 font-semibold">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </motion.section>

      {/* Categories Grid */}
      <motion.section 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Shop by Department</h2>
            <p className="text-sm text-slate-400 mt-1">Explore curated products across our major categories.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, index) => (
            <motion.div key={index} whileHover={{ y: -5 }}>
              <Link
                to={`/shop?category=${cat.query}`}
                className="group flex flex-col items-center p-8 bg-white rounded-2xl border border-slate-100 hover:border-brand-500/10 hover:shadow-xl transition-all duration-300 h-full"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border mb-5 transition-transform duration-300 group-hover:scale-110 ${cat.color}`}>
                  <cat.icon size={24} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-brand-600 transition-colors text-center">
                  {cat.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Best Selling Products */}
      <motion.section 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        <div className="flex items-end justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Best Selling</h2>
            <p className="text-sm text-slate-400 mt-1">Top-rated items loved by our customers.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
                <div className="aspect-square bg-slate-150 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500 font-semibold">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSelling.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </motion.section>

      {/* Deal of the Day */}
      <motion.section 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col md:flex-row shadow-sm">
          <div className="md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6">
            <span className="inline-block bg-red-100 text-red-600 font-bold text-xs px-3 py-1 rounded-full w-max uppercase tracking-wider">
              Limited Time Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Professional Power Tool & Hardware Combo Kit
            </h2>
            <p className="text-slate-500 leading-relaxed text-sm">
              Get all your essential building tools in one bundle. Trusted by professionals and sourced directly from top brands.
            </p>
            <div className="flex items-center gap-4 text-center pb-2">
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 min-w-[70px]">
                <span className="block text-2xl font-black text-slate-800">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-[10px] uppercase text-slate-400 font-bold">Hours</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 min-w-[70px]">
                <span className="block text-2xl font-black text-slate-800">{timeLeft.mins.toString().padStart(2, '0')}</span>
                <span className="text-[10px] uppercase text-slate-400 font-bold">Mins</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 min-w-[70px]">
                <span className="block text-2xl font-black text-slate-800">{timeLeft.secs.toString().padStart(2, '0')}</span>
                <span className="text-[10px] uppercase text-slate-400 font-bold">Secs</span>
              </div>
            </div>
            <div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Link to="/shop" className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md">
                  Claim Offer - $349.99
                </Link>
              </motion.div>
            </div>
          </div>
          <div className="md:w-1/2 bg-slate-50">
            <img src="https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=800" alt="Tool Deal" className="w-full h-full object-cover mix-blend-multiply" />
          </div>
        </div>
      </motion.section>

      {/* Brands Carousel */}
      <motion.section 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight text-center">Featured Brands</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          <div className="h-24 flex items-center justify-center p-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <img src="/total_brand_logo.png" alt="TOTAL" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="h-24 flex items-center justify-center p-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <img src="/bosch_brand_logo.png" alt="BOSCH" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="h-24 flex items-center justify-center p-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <img src="/maxmech_brand_logo.png" alt="MAXMECH" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="h-24 flex items-center justify-center p-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <img src="/dewalt_brand_logo.png" alt="DEWALT" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="h-24 flex items-center justify-center p-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <img src="/topbond_brand_logo.png" alt="TOP BOND" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="h-24 flex items-center justify-center p-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <img src="/jubaili_brand_logo.png" alt="JUBAILI AGROTEC" className="max-h-full max-w-full object-contain" />
          </div>
        </div>
      </motion.section>

      {/* Premium CTA banner */}
      <motion.section 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
      >
        {claimed ? (
          <div className="bg-emerald-50 rounded-3xl p-8 sm:p-12 border border-emerald-100 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-2xl font-extrabold text-emerald-900">Voucher Claimed!</h3>
            <p className="text-emerald-700">Your 10% discount has been applied to your account and is ready for your next checkout.</p>
          </div>
        ) : (
          <div className="bg-brand-50 rounded-3xl p-8 sm:p-12 lg:p-16 border border-brand-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-brand-100/50 blur-3xl"></div>
            <div className="space-y-4 relative max-w-xl">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-950 tracking-tight leading-tight">
                Get an extra 10% discount on your first checkout purchase
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {currentUser ? "Claim your first welcome voucher now. Fast shipping, secure transaction." : "Create an account with Nikdel store today and claim your first welcome voucher. Fast shipping, secure transaction."}
              </p>
            </div>
            <div className="relative shrink-0">
              {currentUser ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setClaimed(true)}
                  className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-7 py-4 rounded-xl transition-all shadow-lg shadow-brand-600/15"
                >
                  Claim Voucher
                </motion.button>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-7 py-4 rounded-xl transition-all shadow-lg shadow-brand-600/15"
                  >
                    Create Account
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}
