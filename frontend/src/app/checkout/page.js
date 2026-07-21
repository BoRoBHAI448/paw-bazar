'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { ShoppingBag, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
    const router = useRouter();

    const cartContext = useCart();
    const authContext = useAuth();

    // Handle both `cart` and `cartItems` naming from CartContext
    const cart = cartContext?.cart || cartContext?.cartItems || [];
    const totalPrice = cartContext?.totalPrice || 0;
    const clearCart = cartContext?.clearCart || (() => { });

    const user = authContext?.user;

    const [formData, setFormData] = useState({
        shipping_name: '',
        phone: '',
        address: '',
        city: 'Dhaka',
        payment_method: 'cod',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                shipping_name: user?.name || user?.full_name || prev.shipping_name,
            }));
        }
    }, [user]);

    const shippingCost = 60;
    const grandTotal = totalPrice + (cart.length > 0 ? shippingCost : 0);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (cart.length === 0) {
            const msg = 'Your cart is empty! Please add products before checking out.';
            setError(msg);
            alert(msg);
            return;
        }

        try {
            setLoading(true);

            const payload = {
                shipping_name: formData.shipping_name?.trim() || '',
                phone: formData.phone?.trim() || '',
                shipping_address: formData.address?.trim() || '',   // 👈 address থেকে shipping_address
                city: formData.city || 'Dhaka',
                payment_method: formData.payment_method || 'cod',
                total_amount: Number(grandTotal),
                items: cart.map((item) => ({
                    product_id: Number(item.id || item.product_id || item._id),
                    quantity: Number(item.quantity || 1),
                    price: Number(item.price || 0),
                })),
            };

            console.log('>>> Order Payload being sent:', payload);

            const res = await orderService.createOrder(payload);
            console.log('>>> Order Success:', res);

            setSuccess(true);
            clearCart();

            setTimeout(() => {
                router.push('/');
            }, 3000);

        } catch (err) {
            console.error('>>> Order Creation Failed:', err);

            if (err.response && err.response.status === 422) {
                const validationErrors = err.response?.data?.errors;
                console.log('>>> Validation Errors details:', validationErrors);

                if (validationErrors) {
                    const formattedError = Object.entries(validationErrors)
                        .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
                        .join('\n');

                    alert(`❌ Validation Error:\n\n${formattedError}`);
                    setError(`Validation Error: ${Object.keys(validationErrors).join(', ')}`);
                } else {
                    const msg = err.response?.data?.message || 'Invalid Data';
                    alert('❌ Validation Error: ' + msg);
                    setError(msg);
                }
            } else {
                const backendErr = err.response?.data?.message || err.message || 'Failed to place order.';
                setError(backendErr);
                alert('Order Submit Failed: ' + backendErr);
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-teal-100 shadow-sm text-center">
                <CheckCircle2 className="w-16 h-16 text-teal-600 mx-auto mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Placed Successfully! 🎉</h2>
                <p className="text-slate-600 text-sm mb-6">
                    Thank you for shopping at Pawbazar. Redirecting to home...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-2xl font-extrabold text-slate-800 mb-8 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-teal-600" /> Checkout
            </h1>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Shipping Form */}
                <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-teal-600" /> Shipping Information
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                            <input
                                type="text"
                                name="shipping_name"
                                required
                                value={formData.shipping_name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="e.g. 01712345678"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Full Delivery Address *</label>
                            <textarea
                                name="address"
                                required
                                rows="3"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="House, Road, Block, Area..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">City / Division</label>
                            <select
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                            >
                                <option value="Dhaka">Dhaka</option>
                                <option value="Chittagong">Chittagong</option>
                                <option value="Sylhet">Sylhet</option>
                                <option value="Rajshahi">Rajshahi</option>
                                <option value="Khulna">Khulna</option>
                                <option value="Barisal">Barisal</option>
                                <option value="Rangpur">Rangpur</option>
                                <option value="Mymensingh">Mymensingh</option>
                            </select>
                        </div>

                        <div className="pt-4">
                            <label className="block text-xs font-bold text-slate-700 mb-2">Payment Method</label>
                            <div className="p-4 border border-teal-500 bg-teal-50/50 rounded-2xl flex items-center justify-between">
                                <span className="text-xs font-bold text-teal-800">Cash on Delivery (COD)</span>
                                <span className="text-[10px] font-semibold bg-teal-600 text-white px-2 py-0.5 rounded-full">Selected</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-all disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? 'Processing Order...' : `Confirm Order (৳${grandTotal})`}
                        </button>
                    </form>
                </div>

                {/* Right: Order Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Order Summary ({cart.length} items)</h2>

                        {cart.length === 0 ? (
                            <p className="text-xs text-slate-500 py-4 text-center">No items in your cart.</p>
                        ) : (
                            <div className="divide-y divide-slate-200 max-h-80 overflow-y-auto mb-4">
                                {cart.map((item, index) => (
                                    <div key={item.id || item.product_id || index} className="py-3 flex justify-between items-center text-xs">
                                        <div>
                                            <p className="font-bold text-slate-800">{item.name || item.title || 'Product'}</p>
                                            <p className="text-slate-500">Qty: {item.quantity} × ৳{item.price}</p>
                                        </div>
                                        <p className="font-bold text-slate-800">৳{Number(item.price) * Number(item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span>৳{totalPrice}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Delivery Charge</span>
                                <span>৳{shippingCost}</span>
                            </div>
                            <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-200">
                                <span>Total Amount</span>
                                <span className="text-teal-700">৳{grandTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}