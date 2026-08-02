'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ product }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const increment = () => setQuantity((q) => Math.min(q + 1, product?.stock || 99));
    const decrement = () => setQuantity((q) => Math.max(q - 1, 1));

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAdded(true);
        // Reset "added" state after 2 seconds
        setTimeout(() => setAdded(false), 2000);
    };

    const isOutOfStock = product?.stock !== undefined && product.stock <= 0;

    return (
        <div className="space-y-4">
            {/* Quantity Selector */}
            {!isOutOfStock && (
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-700">Quantity</span>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1">
                        <button
                            onClick={decrement}
                            disabled={quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-slate-800 text-sm">{quantity}</span>
                        <button
                            onClick={increment}
                            disabled={quantity >= (product?.stock || 99)}
                            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    {product?.stock !== undefined && (
                        <span className="text-xs text-slate-400">{product.stock} available</span>
                    )}
                </div>
            )}

            {/* Add to Cart Button */}
            {isOutOfStock ? (
                <div className="w-full bg-slate-100 text-slate-400 font-semibold py-3.5 px-6 rounded-2xl text-center text-sm cursor-not-allowed">
                    Out of Stock
                </div>
            ) : (
                <button
                    onClick={handleAddToCart}
                    className={`w-full font-semibold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all text-sm ${
                        added
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                >
                    {added ? (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            Added to Cart!
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-5 h-5" />
                            Add to Cart
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
