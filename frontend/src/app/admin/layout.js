'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, ClipboardList, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useAuth();

    const isAuthorized = user?.role === 'admin';

    useEffect(() => {
        if (!loading && !isAuthorized) {
            const timer = setTimeout(() => router.push('/'), 1500);
            return () => clearTimeout(timer);
        }
    }, [loading, isAuthorized, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs text-slate-500 font-semibold">Verifying Admin Access...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="max-w-md bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-lg space-y-4">
                    <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
                    <h2 className="text-xl font-bold text-slate-800">Access Denied!</h2>
                    <p className="text-xs text-slate-500">You must be logged in as an Admin/Owner to access this area. Redirecting to home...</p>
                </div>
            </div>
        );
    }

    const navItems = [
        { href: '/admin', label: 'Overview', icon: LayoutDashboard },
        { href: '/admin/products', label: 'Products List', icon: ShoppingBag },
        { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
    ];

    return (
        <div className="min-h-screen flex bg-slate-50">
            <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col justify-between hidden md:flex">
                <div className="space-y-8">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🐾</span>
                        <span className="font-black text-lg tracking-wider text-teal-400">Pawbazar Admin</span>
                    </div>
                    <nav className="space-y-2">
                        {navItems.map(({ href, label, icon: Icon }) => {
                            const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${isActive
                                        ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
                                        : 'font-semibold text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-all">
                    <ArrowLeft className="w-4 h-4" /> Back to Storefront
                </Link>
            </aside>
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}