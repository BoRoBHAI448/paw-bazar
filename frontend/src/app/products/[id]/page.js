import { productService } from '@/services/productService';
import { Star, ShieldCheck, Truck, RotateCcw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import AddToCartButton from '@/components/products/AddToCartButton';

// Backend থেকে single product data fetch
async function getSingleProduct(id) {
    try {
        const data = await productService.getProductById(id);
        return data?.data || data || null;
    } catch (error) {
        console.error('Failed to fetch product details:', error);
        return null;
    }
}

export default async function ProductDetailPage({ params }) {
    const { id } = await params;
    const product = await getSingleProduct(id);

    const defaultImage = 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&q=80';

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Product Not Found!</h2>
                <p className="text-slate-500 mb-6">The product you are looking for does not exist or has been removed.</p>
                <Link
                    href="/products"
                    className="bg-teal-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-teal-700 transition-all"
                >
                    Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Back Button */}
            <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Products
            </Link>

            {/* Main Product Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">

                {/* Left: Product Image */}
                <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center">
                    <img
                        src={product?.image || defaultImage}
                        alt={product?.name || 'Cat Food Detail'}
                        className="w-full h-full object-cover"
                    />
                    {product?.category && (
                        <span className="absolute top-4 left-4 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {product.category.name || product.category}
                        </span>
                    )}
                </div>

                {/* Right: Product Details & Actions */}
                <div className="flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                                ))}
                            </div>
                            <span className="text-xs font-bold text-slate-700">(4.9 / 5.0)</span>
                            <span className="text-xs text-slate-400">• 24 Customer Reviews</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {product?.name || 'Premium Cat Food'}
                        </h1>

                        {/* Price & Stock */}
                        <div className="flex items-baseline gap-4 pt-2">
                            <span className="text-3xl font-extrabold text-teal-700">
                                ৳{product?.price || '0.00'}
                            </span>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                                product?.stock > 0
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-red-50 text-red-600 border-red-200'
                            }`}>
                                {product?.stock > 0
                                    ? `In Stock (${product.stock} available)`
                                    : 'Out of Stock'
                                }
                            </span>
                        </div>

                        {/* Description */}
                        <div className="pt-4 border-t border-slate-100">
                            <h3 className="text-sm font-bold text-slate-800 mb-2">Product Description</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {product?.description ||
                                    'Provides balanced nutrition for adult cats. Formulated with high-quality protein to support lean muscles and essential vitamins for a healthy immune system.'}
                            </p>
                        </div>
                    </div>

                    {/* Actions: Add to Cart (Client Component) */}
                    <div className="space-y-4 pt-6 border-t border-slate-100">
                        {/* ✅ Client Component handles cart interaction */}
                        <AddToCartButton product={product} />

                        {/* Delivery & Assurance Guarantees */}
                        <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                            <div className="p-3 bg-slate-50 rounded-xl flex flex-col items-center gap-1">
                                <Truck className="w-5 h-5 text-teal-600" />
                                <span className="text-[11px] font-medium text-slate-600">Fast Shipping</span>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl flex flex-col items-center gap-1">
                                <ShieldCheck className="w-5 h-5 text-teal-600" />
                                <span className="text-[11px] font-medium text-slate-600">100% Genuine</span>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl flex flex-col items-center gap-1">
                                <RotateCcw className="w-5 h-5 text-teal-600" />
                                <span className="text-[11px] font-medium text-slate-600">Easy Return</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}