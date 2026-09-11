import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { SlidersHorizontal, ArrowUpDown, Search, RefreshCw, X } from "lucide-react";
import productService from "../services/product.service";
import categoryService from "../services/category.service";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filterCategories, setFilterCategories] = useState([{ name: "All Products", value: "all" }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search parameters
  const [searchParams, setSearchParams] = useSearchParams();
  const searchUrlQuery = searchParams.get("search") || "";
  const categoryUrlQuery = searchParams.get("category") || "";

  // Local filter states
  const [searchTerm, setSearchTerm] = useState(searchUrlQuery);
  const [selectedCategory, setSelectedCategory] = useState(categoryUrlQuery);
  const [priceRange, setPriceRange] = useState(500); // Max limit default
  const [sortBy, setSortBy] = useState("default");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch Categories once
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await categoryService.getAllCategories();
        const cats = response.data || response;
        if (Array.isArray(cats)) {
          setFilterCategories([
            { name: "All Products", value: "all" },
            ...cats.map(c => ({ 
              name: c.name, 
              value: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
              _id: c._id 
            }))
          ]);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }
    loadCategories();
  }, []);

  // Sync state with URL search params when they change
  useEffect(() => {
    if (searchTerm !== searchUrlQuery) {
      setSearchTerm(searchUrlQuery);
    }
    if (selectedCategory !== categoryUrlQuery) {
      setSelectedCategory(categoryUrlQuery);
    }
    // eslint-disable-next-line
  }, [searchUrlQuery, categoryUrlQuery]);

  // Fetch products based on filters
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory && selectedCategory !== "all") {
          const matchedCat = filterCategories.find(c => c.value === selectedCategory);
          if (matchedCat && matchedCat._id) {
            params.category = matchedCat._id;
          } else {
            // If category isn't loaded yet or doesn't exist, send a dummy ObjectId to prevent 400 error but return 0 results
            params.category = "000000000000000000000000";
          }
        }
        params.maxPrice = priceRange;
        if (sortBy !== "default") params.sort = sortBy;

        const response = await productService.getAllProducts(params);
        // Expecting response structure like { products: [...] } or direct array
        setProducts(response.products || response.data || response);
      } catch (err) {
        console.error("Error fetching shop products:", err);
        setError("Unable to load product list. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    // Only fetch products if categories have loaded (or if we don't have a category selected)
    if (selectedCategory === "all" || selectedCategory === "" || filterCategories.length > 1) {
      fetchProducts();
    }
  }, [searchTerm, selectedCategory, priceRange, sortBy, filterCategories]);

  // We no longer need local useMemo for filteredProducts since backend does it
  const filteredProducts = products || [];

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange(500);
    setSortBy("default");
    setSearchParams({});
  };

  const handleCategoryChange = (catName) => {
    setSelectedCategory(catName);
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (catName && catName !== "all") params.category = catName;
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory && selectedCategory !== "all") params.category = selectedCategory;
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Browse Catalog</h1>
        <p className="text-sm text-slate-400 mt-1">Discover premium selections, filtered and sorted to your preferences.</p>
      </div>

      {/* Control Bar (Search, sort, filter toggle) */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search within results..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
          <button type="submit" className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
            <Search size={16} />
          </button>
        </form>

        {/* Filters Button (Mobile) & Sort */}
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-250 text-slate-700 text-sm font-semibold px-4.5 py-2.5 rounded-xl transition-all"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>

          <div className="flex items-center gap-2 relative">
            <ArrowUpDown size={16} className="text-slate-400 absolute left-3 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="default">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="title-az">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block bg-white border border-slate-100 p-6 rounded-2xl space-y-8 sticky top-28 shadow-sm">
          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Categories</h3>
            <div className="flex flex-col gap-1.5">
              {filterCategories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`text-left text-sm py-2 px-3 rounded-xl transition-colors font-medium ${
                    (selectedCategory || "all") === cat.value
                      ? "bg-brand-500 text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-brand-600"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Max Price</h3>
              <span className="text-sm font-extrabold text-brand-600">${priceRange}</span>
            </div>
            <input
              type="range"
              min="5"
              max="1000"
              step="5"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full accent-brand-600 cursor-ew-resize"
            />
            <div className="flex justify-between text-[11px] text-slate-450 font-semibold">
              <span>$5</span>
              <span>$1000+</span>
            </div>
          </div>

          {/* Clear Button */}
          <button
            onClick={handleClearFilters}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-brand-600 text-white font-bold text-sm py-3 rounded-xl transition-colors"
          >
            <RefreshCw size={14} />
            Reset All Filters
          </button>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {loading ? (
            /* Loading grids */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 animate-pulse">
                  <div className="aspect-square bg-slate-150 rounded-xl"></div>
                  <div className="h-4 bg-slate-150 rounded w-2/3"></div>
                  <div className="h-3 bg-slate-150 rounded w-1/2"></div>
                  <div className="h-10 bg-slate-150 rounded-xl mt-4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <p className="text-red-500 font-semibold mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-xs bg-slate-900 text-white font-semibold px-4 py-2 rounded-xl"
              >
                Retry
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Empty state */
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 space-y-4">
              <h3 className="text-xl font-bold text-slate-800">No products found</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                No items match your search constraints. Try adjusting your category filters, search keywords, or pricing limit.
              </p>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-sm">
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white p-6 shadow-xl animate-slide-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-850">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1 text-slate-500 hover:text-brand-600"
              >
                <X size={22} />
              </button>
            </div>

            <div className="py-6 space-y-8">
              {/* Categories */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Categories</h3>
                <div className="flex flex-col gap-1.5">
                  {filterCategories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        handleCategoryChange(cat.value);
                        setShowMobileFilters(false);
                      }}
                      className={`text-left text-sm py-2 px-3 rounded-xl transition-colors font-medium ${
                        (selectedCategory || "all") === cat.value
                          ? "bg-brand-500 text-white"
                          : "text-slate-600 hover:bg-slate-55 hover:text-brand-600"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Max Price</h3>
                  <span className="text-sm font-extrabold text-brand-600">${priceRange}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="1000"
                  step="5"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full accent-brand-600 cursor-ew-resize"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>$5</span>
                  <span>$1000+</span>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  handleClearFilters();
                  setShowMobileFilters(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold text-sm py-3 rounded-xl"
              >
                <RefreshCw size={14} />
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
