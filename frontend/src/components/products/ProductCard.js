'use client';

import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const defaultImage = 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&q=80';

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group">

            {/* Product Image */}
            <div className="relative aspect-square bg-slate-50 overflow-hidden">
                <img
                    src={product?.image || defaultImage}
                    alt={product?.name || 'Cat Food'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product?.category && (
                    <span className="absolute top-3 left-3 bg-teal-600 text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full">
                        {product.category.name || product.category}
                    </span>
                )}
            </div>

            {/* Product Content */}
            <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                    <div className="flex items-center gap-1 mb-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-xs font-semibold text-slate-600">4.8</span>
                    </div>

                    <Link href={`/products/${product?.id}`}>
                        <h3 className="font-semibold text-slate-800 text-base line-clamp-1 hover:text-teal-600 transition-colors">
                            {product?.name || 'Premium Cat Food'}
                        </h3>
                    </Link>

                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                        {product?.description || 'Healthy and nutritious meal for your loving cats.'}
                    </p>
                </div>

                {/* Price & Cart Button */}
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                        <span className="text-xs text-slate-400 block">Price</span>
                        <span className="text-lg font-bold text-teal-700">
                            ৳{product?.price || '0.00'}
                        </span>
                    </div>

                    <button
                        onClick={() => addToCart(product)}
                        className="bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white p-2.5 rounded-xl transition-all duration-200 active:scale-95"
                        title="Add to Cart"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>
            </div>

        </div>
    );
}