'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import { productService } from '@/services/productService';
import { Search, SlidersHorizontal, X, Loader2, PackageSearch } from 'lucide-react';

const CATEGORIES = ['All', 'Dry Food', 'Wet Food', 'Treats', 'Kitten Food', 'Senior Food', 'Supplements'];

function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');

    // ─── Build query string & navigate ─────────────
    const applyFilters = useCallback((search, category) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category && category !== 'All') params.set('category', category);
        router.replace(`/products?${params.toString()}`);
    }, [router]);

    // ─── Fetch products whenever URL params change ──
    useEffect(() => {
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';

        setSearchInput(search);
        setActiveCategory(category || 'All');

        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getProducts({ search, category });
                const list = Array.isArray(data) ? data : data?.data || [];
                setProducts(list);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters(searchInput, activeCategory);
    };

    const handleCategoryClick = (cat) => {
        setActiveCategory(cat);
        applyFilters(searchInput, cat);
    };

    const clearFilters = () => {
        setSearchInput('');
        setActiveCategory('All');
        router.replace('/products');
    };

    const hasActiveFilters = searchInput || (activeCategory && activeCategory !== 'All');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

            {/* ─── Page Header ──────────────────────────── */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Our Products 🐾</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Premium cat food and treats, handpicked for your beloved companion.
                </p>
            </div>

            {/* ─── Search + Filter Bar ─────────────────── */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search for cat food, treats..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all text-slate-800"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2"
                    >
                        <Search className="w-4 h-4" /> Search
                    </button>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-1.5"
                        >
                            <X className="w-4 h-4" /> Clear
                        </button>
                    )}
                </form>

                {/* Category Pills */}
                <div className="flex items-center gap-2 flex-wrap">
                    <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                                activeCategory === cat
                                    ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-700'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* ─── Results Info ───────────────────────── */}
            {!loading && (
                <div className="flex items-center justify-between text-sm text-slate-500">
                    <p>
                        {hasActiveFilters ? (
                            <>
                                <span className="font-bold text-slate-800">{products.length}</span> results found
                                {searchInput && <> for &ldquo;<span className="font-semibold text-teal-700">{searchInput}</span>&rdquo;</>}
                                {activeCategory !== 'All' && <> in <span className="font-semibold text-teal-700">{activeCategory}</span></>}
                            </>
                        ) : (
                            <><span className="font-bold text-slate-800">{products.length}</span> products available</>
                        )}
                    </p>
                </div>
            )}

            {/* ─── Loading State ──────────────────────── */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center space-y-3">
                        <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
                        <p className="text-xs text-slate-500 font-semibold">Loading products...</p>
                    </div>
                </div>
            )}

            {/* ─── Empty State ────────────────────────── */}
            {!loading && products.length === 0 && (
                <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center space-y-4">
                    <PackageSearch className="w-12 h-12 text-slate-300 mx-auto" />
                    <div>
                        <p className="font-bold text-slate-700">No products found</p>
                        <p className="text-sm text-slate-400 mt-1">
                            Try a different search term or category.
                        </p>
                    </div>
                    <button
                        onClick={clearFilters}
                        className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all"
                    >
                        View All Products
                    </button>
                </div>
            )}

            {/* ─── Product Grid ───────────────────────── */}
            {!loading && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
