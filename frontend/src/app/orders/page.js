'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { Package, Clock, MapPin, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';

export default function MyOrdersPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useEffect(() => {
        // Auth loading na haoa porjonto apekkha
        if (authLoading) return;

        // Logged in na thakle login page-e pathiyedao
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const res = await orderService.getUserOrders();
                // Backend JSON structure (res.data, res.orders, ba direct res) handle kora
                const orderList = Array.isArray(res) ? res : res?.data || res?.orders || [];
                setOrders(orderList);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
                setError('Failed to load your order history.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, authLoading, router]);

    const toggleExpand = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const getStatusBadge = (status) => {
        const s = status?.toLowerCase() || 'pending';
        if (s === 'completed' || s === 'delivered') {
            return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold capitalize">Delivered</span>;
        }
        if (s === 'processing') {
            return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold capitalize">Processing</span>;
        }
        if (s === 'cancelled') {
            return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold capitalize">Cancelled</span>;
        }
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold capitalize">Pending</span>;
    };

    if (authLoading || loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-16 text-center">
                <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm font-semibold text-slate-600">Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <Package className="w-7 h-7 text-teal-600" /> My Orders
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Logged in as <span className="font-bold text-slate-700">{user?.name || user?.email}</span>
                    </p>
                </div>
            </div>

            {error && (
                <div className="p-4 mb-6 bg-red-50 text-red-700 text-xs font-semibold rounded-2xl border border-red-200">
                    {error}
                </div>
            )}

            {/* Empty State */}
            {orders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
                    <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 mb-1">No Orders Found</h3>
                    <p className="text-xs text-slate-500 mb-6">You haven&apos;t placed any cat food orders yet!</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-3 px-6 rounded-xl transition-all cursor-pointer"
                    >
                        Start Shopping Now
                    </button>
                </div>
            ) : (
                /* Orders List */
                <div className="space-y-4">
                    {orders.map((order) => {
                        const isExpanded = expandedOrderId === order.id;
                        const items = order.items || order.order_items || [];

                        return (
                            <div
                                key={order.id}
                                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all hover:border-teal-200"
                            >
                                {/* Order Summary Row */}
                                <div
                                    onClick={() => toggleExpand(order.id)}
                                    className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer bg-white hover:bg-slate-50/50 transition-colors"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="font-extrabold text-sm text-slate-800">
                                                Order #{order.id}
                                            </span>
                                            {getStatusBadge(order.status)}
                                        </div>
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            {new Date(order.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Amount</p>
                                            <p className="text-sm font-extrabold text-teal-700">
                                                ৳{order.total_amount || order.grand_total}
                                            </p>
                                        </div>

                                        <button className="text-slate-400 hover:text-slate-600 p-1">
                                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="border-t border-slate-100 bg-slate-50/60 p-5 space-y-4 text-xs">
                                        {/* Shipping Address Details */}
                                        <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-start gap-2.5">
                                            <MapPin className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-bold text-slate-800">
                                                    {order.shipping_name} ({order.phone})
                                                </p>
                                                <p className="text-slate-600 mt-0.5">
                                                    {order.shipping_address || order.address}, {order.city}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Items List */}
                                        <div>
                                            <p className="font-bold text-slate-700 mb-2">Ordered Items ({items.length})</p>
                                            <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-100">
                                                {items.map((item, idx) => (
                                                    <div key={item.id || idx} className="p-3 flex justify-between items-center">
                                                        <div>
                                                            <p className="font-bold text-slate-800">
                                                                {item.product?.name || item.product_name || `Product ID: ${item.product_id}`}
                                                            </p>
                                                            <p className="text-slate-500 text-[11px]">
                                                                Qty: {item.quantity} × ৳{item.price}
                                                            </p>
                                                        </div>
                                                        <p className="font-bold text-slate-800">
                                                            ৳{Number(item.price) * Number(item.quantity)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}