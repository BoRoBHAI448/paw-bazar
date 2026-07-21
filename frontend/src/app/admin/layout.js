'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Package, ShoppingBag, LayoutDashboard, ArrowLeft, LogOut } from 'lucide-react';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Basic Protection Check
    if (!user) {
        router.push('/login');
        return null;
    }

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Products Management', href: '/admin/products', icon: Package },
    ];

    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-4 hidden md:flex">
                <div>
                    <div className="p-4 border-b border-slate-800 mb-6 flex items-center justify-between">
                        <span className="font-black text-xl text-white tracking-wider">PAWBAZAR <span className="text-teal-400 text-xs font-semibold px-2 py-0.5 rounded bg-teal-950 border border-teal-800">ADMIN</span></span>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${isActive
                                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50'
                                            : 'hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Store
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/40 transition-all cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}