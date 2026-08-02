'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal';
import { Loader2, PackageSearch, AlertCircle, RefreshCw } from 'lucide-react';

const STATUS_OPTIONS = ['pending', 'processing', 'completed', 'cancelled'];

const STATUS_STYLES = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    processing: 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await adminService.getAllOrders();
            setOrders(data.orders || []);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to load orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        const previousOrders = orders;
        // Optimistic UI update
        setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        // Keep modal in sync if open
        setSelectedOrder((prev) => (prev && prev.id === orderId ? { ...prev, status: newStatus } : prev));
        setUpdatingId(orderId);

        try {
            await adminService.updateOrderStatus(orderId, newStatus);
        } catch (err) {
            // Rollback on failure
            setOrders(previousOrders);
            setSelectedOrder((prev) => (prev && prev.id === orderId ? { ...prev, status: previousOrders.find(o => o.id === orderId)?.status } : prev));
            alert(err?.response?.data?.message || 'Failed to update order status.');
        } finally {
            setUpdatingId(null);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount) => `৳${Number(amount).toLocaleString('en-BD')}`;

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-2">
                    <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
                    <p className="text-xs text-slate-500 font-semibold">Loading all orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Orders Management</h1>
                    <p className="text-sm text-slate-500 mt-1">View and manage every order placed across Pawbazar.</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex items-center gap-2 text-xs font-bold text-teal-700 hover:bg-teal-50 px-4 py-2 rounded-xl border border-teal-200 transition-all"
                >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}

            {/* Empty State */}
            {!error && orders.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-2">
                    <PackageSearch className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-500">No orders yet.</p>
                </div>
            )}

            {/* Orders Table */}
            {!error && orders.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wide">Order</th>
                                    <th className="text-left px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wide">Customer</th>
                                    <th className="text-left px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wide">Items</th>
                                    <th className="text-left px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wide">Address</th>
                                    <th className="text-left px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wide">Total</th>
                                    <th className="text-left px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wide">Date</th>
                                    <th className="text-left px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        onClick={() => setSelectedOrder(order)}
                                        className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4 font-bold text-slate-700">#{order.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-700">{order.user?.name || 'Unknown'}</div>
                                            <div className="text-xs text-slate-400">{order.user?.email || '—'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="space-y-1 max-w-xs">
                                                {order.items?.map((item) => (
                                                    <div key={item.id} className="text-xs">
                                                        {item.product?.name || `Product #${item.product_id}`}
                                                        <span className="text-slate-400"> × {item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs max-w-[180px] truncate" title={order.shipping_address}>
                                            {order.shipping_address || '—'}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-700">{formatCurrency(order.total_amount)}</td>
                                        <td className="px-6 py-4 text-slate-500">{formatDate(order.created_at)}</td>
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                value={order.status}
                                                disabled={updatingId === order.id}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`text-xs font-bold px-3 py-2 rounded-lg border cursor-pointer disabled:opacity-50 capitalize ${STATUS_STYLES[order.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}
                                            >
                                                {STATUS_OPTIONS.map((s) => (
                                                    <option key={s} value={s} className="bg-white text-slate-700 capitalize">
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            <OrderDetailsModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onStatusChange={handleStatusChange}
                updating={updatingId === selectedOrder?.id}
            />
        </div>
    );
}