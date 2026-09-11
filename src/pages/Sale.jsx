import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import productService from "../services/product.service";
import { Tag } from "lucide-react";

export default function Sale() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await productService.getAllProducts();
        const data = response.products || response.data || response || [];
        const saleItems = [...data].reverse().slice(0, 8); 
        setProducts(saleItems);
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
      <div className="bg-red-600 rounded-3xl p-12 text-white relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10 space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-3 py-1 rounded-full text-sm">
            <Tag size={16} /> Almost Finished
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold">Final Clearance Sale</h1>
          <p className="text-red-100">Up to 70% off on selected items. Shop now before they're gone forever.</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-600/80 to-transparent z-0"></div>
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/2 z-0 opacity-40 mix-blend-multiply">
            <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=60" alt="Sale" className="w-full h-full object-cover" />
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
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
