import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import productService from "../services/product.service";
import { TrendingUp } from "lucide-react";

export default function Trending() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await productService.getAllProducts();
        const data = response.products || response.data || response || [];
        const trending = [...data].sort((a, b) => (b.price - a.price)).slice(0, 8); 
        setProducts(trending);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 rounded-3xl p-12 text-white relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10 space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 font-bold px-3 py-1 rounded-full text-sm">
            <TrendingUp size={16} /> Hot Right Now
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Trending Products</h1>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            Top-demanded power tools, building supplies, and agricultural machinery trusted by contractors and builders this week.
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-transparent z-0"></div>
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/2 z-0 opacity-60">
            <img 
              src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1000&auto=format&fit=crop&q=80" 
              alt="Power Tools & Industrial Equipment" 
              className="w-full h-full object-cover object-center mix-blend-luminosity" 
            />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 animate-pulse">
              <div className="aspect-square bg-slate-150 rounded-xl"></div>
              <div className="h-4 bg-slate-150 rounded w-2/3"></div>
              <div className="h-10 bg-slate-150 rounded-xl mt-4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product._id || product.id || index} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
