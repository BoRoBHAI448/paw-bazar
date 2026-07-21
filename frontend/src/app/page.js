import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import { productService } from '@/services/productService';
import { ArrowRight, ShieldCheck, Truck, Headphones } from 'lucide-react';

// SSR Fetching Products
async function getProducts() {
  try {
    // productService.getProducts call kora hocche
    const data = await productService.getProducts();
    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="space-y-12 pb-16">

      {/* 🌟 HERO BANNER SECTION */}
      <section className="bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 text-white rounded-3xl mx-4 sm:mx-8 mt-4 overflow-hidden relative shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 z-10">
            <span className="bg-teal-500/30 text-teal-100 text-xs font-semibold px-3 py-1.5 rounded-full border border-teal-400/30">
              🐾 100% Organic Cat Food Available
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Give Your Furry Friend The Best Care They Deserve
            </h1>
            <p className="text-teal-100 text-sm sm:text-base max-w-lg">
              Explore premium quality dry food, delicious wet food, and healthy treats for kittens and adult cats.
            </p>
            <div className="flex gap-4">
              <Link
                href="/products"
                className="bg-white text-teal-800 hover:bg-teal-50 font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-md text-sm"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="w-64 h-64 sm:w-80 sm:h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner">
              <span className="text-8xl sm:text-9xl">🐈</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 FEATURES BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Fast Delivery</h4>
              <p className="text-xs text-slate-400">Quick delivery all over Bangladesh</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Original Quality</h4>
              <p className="text-xs text-slate-400">100% genuine imported brands</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">24/7 Support</h4>
              <p className="text-xs text-slate-400">Dedicated pet care assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* 📦 FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Featured Cat Foods</h2>
            <p className="text-slate-500 text-sm">Best choices for your beloved pets</p>
          </div>
          <Link href="/products" className="text-teal-600 font-semibold text-sm hover:underline flex items-center gap-1">
            See All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-500 text-sm">No products available right now. Make sure your Laravel Backend is running!</p>
          </div>
        )}
      </section>

    </div>
  );
}