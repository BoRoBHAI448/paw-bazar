'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { ShoppingBag, Package, DollarSign, Users, RefreshCw } from 'lucide-react';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setLoading(true);
                // Fetch products count
                const productsRes = await adminService.getProducts();
                const productsList = Array.isArray(productsRes) ? productsRes : productsRes?.data || [];

                // Calculate basic stats
                setStats({
                    totalProducts: productsList.length,
                    totalOrders: 12, // Example dynamic placeholder or fetch from backend /admin/orders
                    totalRevenue: 15400, // Example placeholder
                });
            } catch (err) {
                console.error('Failed to load stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
        );
    }

    const statCards = [
        { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-500' },
        { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-teal-500' },
        { title: 'Total Revenue', value: `৳${stats.totalRevenue}`, icon: DollarSign, color: 'bg-emerald-500' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-800">Admin Overview</h1>
                <p className="text-xs text-slate-500 mt-1">Welcome back, Super Admin! Here is what is happening with Pawbazar today.</p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {statCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
                                <h3 className="text-2xl font-black text-slate-800 mt-1">{card.value}</h3>
                            </div>
                            <div className={`${card.color} text-white p-3.5 rounded-2xl shadow-md`}>
                                <Icon className="w-6 h-6" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Action Info */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="font-extrabold text-base">Super Admin Access Granted 🛡️</h3>
                    <p className="text-xs text-slate-400 mt-1">You can add new cat food inventory, update prices, or manage store settings.</p>
                </div>
            </div>
        </div>
    );
}