'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import Button from '@/components/common/Button';

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
    const defaultImage = 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&q=80';

    if (cartItems.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Shopping Cart is Empty</h2>
                <p className="text-slate-500 text-sm mb-6">Looks like you haven't added any cat food to your cart yet.</p>
                <Link href="/">
                    <Button variant="primary">Explore Products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <h1 className="text-2xl font-bold text-slate-900">Your Shopping Cart 🛒</h1>
                <button
                    onClick={clearCart}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
                        >
                            <img
                                src={item?.image || defaultImage}
                                alt={item?.name}
                                className="w-20 h-20 object-cover rounded-xl bg-slate-50"
                            />

                            <div className="flex-1">
                                <h3 className="font-semibold text-slate-800 text-sm sm:text-base line-clamp-1">{item.name}</h3>
                                <span className="text-teal-700 font-bold text-sm block mt-0.5">৳{item.price}</span>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 text-slate-600 hover:bg-white rounded-lg transition-all"
                                >
                                    <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-bold text-slate-800 w-6 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 text-slate-600 hover:bg-white rounded-lg transition-all"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Subtotal & Delete */}
                            <div className="text-right">
                                <span className="font-bold text-slate-900 text-sm sm:text-base block">
                                    ৳{(Number(item.price) * item.quantity).toFixed(2)}
                                </span>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-400 hover:text-red-600 p-1 transition-colors mt-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit space-y-6">
                    <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Order Summary</h2>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span className="font-semibold text-slate-800">৳{totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Delivery Charge</span>
                            <span className="font-semibold text-emerald-600">৳60.00</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-100">
                            <span>Total Amount</span>
                            <span className="text-teal-700">৳{(totalPrice + 60).toFixed(2)}</span>
                        </div>
                    </div>

                    <Link href="/checkout" className="block">
                        <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                            Proceed to Checkout <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>

            </div>

        </div>
    );
}