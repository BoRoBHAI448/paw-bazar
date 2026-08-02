'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { orderService } from '@/services/orderService';
import { useAuth } from '@/context/AuthContext';
import {
    Loader2,
    PackageSearch,
    ShoppingBag,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Clock,
    XCircle,
    RefreshCw,
} from 'lucide-react';

const STATUS_CONFIG = {
    pending:    { label: 'Pending',    color: 'bg-amber-100 text-amber-700 border-amber-200',      icon: Clock },
    processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700 border-blue-200',         icon: RefreshCw },
    completed:  { label: 'Completed',  color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    cancelled:  { label: 'Cancelled',  color: 'bg-red-100 text-red-700 border-red-200',            icon: XCircle },
};

const defaultImage = 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&q=80';

function OrderStatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.color} capitalize`}>
            <Icon className="w-3 h-3" />
            {config.label}
        </span>
    );
}

function OrderCard({ order }) {
    const [expanded, setExpanded] = useState(false);

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Order Header */}
            <div
                className="p-5 flex items-center justify-between cursor-pointer select-none"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center font-black text-sm">
                        #{order.id}
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 text-sm">
                            {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{formatDate(order.created_at)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <OrderStatusBadge status={order.status} />
                    <span className="font-extrabold text-teal-700 text-base">
                        ৳{Number(order.total_amount).toLocaleString('en-BD')}
                    </span>
                    {expanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                </div>
            </div>

            {/* Expanded: Order Items */}
            {expanded && (
                <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-4">
                    {/* Shipping Info */}
                    {(order.shipping_address || order.phone) && (
                        <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 space-y-1">
                            {order.shipping_address && (
                                <p><span className="font-bold text-slate-700">Address:</span> {order.shipping_address}</p>
                            )}
                            {order.phone && (
                                <p><span className="font-bold text-slate-700">Phone:</span> {order.phone}</p>
                            )}
                        </div>
                    )}

                    {/* Items */}
                    <div className="space-y-3">
                        {order.items?.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                                <img
                                    src={item.product?.image || defaultImage}
                                    alt={item.product?.name || 'Product'}
                                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 text-sm truncate">
                                        {item.product?.name || `Product #${item.product_id}`}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {item.quantity} × ৳{Number(item.price).toLocaleString()}
                                    </p>
                                </div>
                                <span className="font-bold text-slate-700 text-sm flex-shrink-0">
                                    ৳{(Number(item.price) * Number(item.quantity)).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Total Summary */}
                    <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm font-bold text-slate-700">
                        <span>Total Paid</span>
                        <span className="text-teal-700 text-base">৳{Number(order.total_amount).toLocaleString('en-BD')}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function UserOrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Auth Guard — লগইন না থাকলে লগইন পেজে পাঠাও
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/orders');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (authLoading || !user) return;

        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await orderService.getUserOrders();
                setOrders(data?.orders || []);
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load your orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, authLoading]);

    if (authLoading || (!user && !error)) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-teal-600" /> My Orders
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Track all your Pawbazar purchases in one place.
                </p>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-16">
                    <div className="text-center space-y-2">
                        <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
                        <p className="text-xs text-slate-500 font-semibold">Fetching your orders...</p>
                    </div>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && orders.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
                    <PackageSearch className="w-12 h-12 text-slate-300 mx-auto" />
                    <div>
                        <p className="font-bold text-slate-700">No orders yet!</p>
                        <p className="text-sm text-slate-400 mt-1">Start shopping and your orders will appear here.</p>
                    </div>
                    <Link
                        href="/products"
                        className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all"
                    >
                        Browse Products
                    </Link>
                </div>
            )}

            {/* Order Cards */}
            {!loading && !error && orders.length > 0 && (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
}