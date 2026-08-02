'use client';

import { X, Clock, RefreshCw, CheckCircle2, XCircle, MapPin, Phone, Mail, User } from 'lucide-react';

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
    processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: RefreshCw },
    completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

const defaultImage = 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&q=80';

function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.color} capitalize`}>
            <Icon className="w-3 h-3" />
            {config.label}
        </span>
    );
}

export default function OrderDetailsModal({ order, onClose, onStatusChange, updating }) {
    if (!order) return null;

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    const STATUS_OPTIONS = ['pending', 'processing', 'completed', 'cancelled'];

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center font-black text-sm">
                            #{order.id}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-sm">Order Details</p>
                            <p className="text-xs text-slate-400">{formatDate(order.created_at)}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Status + Total */}
                    <div className="flex items-center justify-between">
                        <StatusBadge status={order.status} />
                        <span className="font-extrabold text-teal-700 text-lg">
                            ৳{Number(order.total_amount).toLocaleString('en-BD')}
                        </span>
                    </div>

                    {/* Status Change */}
                    {onStatusChange && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Update Status</label>
                            <select
                                value={order.status}
                                disabled={updating}
                                onChange={(e) => onStatusChange(order.id, e.target.value)}
                                className="w-full text-sm font-bold px-3 py-2.5 rounded-xl border border-slate-200 cursor-pointer disabled:opacity-50 capitalize focus:outline-none focus:border-teal-500"
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s} className="capitalize">{s}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Customer Info */}
                    <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                        <p className="text-xs font-bold text-slate-500 mb-2">Customer Information</p>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="font-semibold">{order.user?.name || 'Unknown'}</span>
                        </div>
                        {order.user?.email && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span>{order.user.email}</span>
                            </div>
                        )}
                        {order.phone && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span>{order.phone}</span>
                            </div>
                        )}
                        {order.shipping_address && (
                            <div className="flex items-start gap-2 text-sm text-slate-600">
                                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                <span>{order.shipping_address}</span>
                            </div>
                        )}
                    </div>

                    {/* Items */}
                    <div>
                        <p className="text-xs font-bold text-slate-500 mb-3">Items ({order.items?.length || 0})</p>
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
                    </div>

                    {/* Total */}
                    <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-sm font-bold text-slate-700">
                        <span>Total Amount</span>
                        <span className="text-teal-700 text-lg">৳{Number(order.total_amount).toLocaleString('en-BD')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}