'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    ShoppingBag,
    ClipboardList,
    Layers,
    Boxes,
    Users,
    Tag,
    MessageSquare,
    Settings,
    FileText,
    BarChart3,
    ShieldAlert,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Store
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout, loading } = useAuth();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const isAuthorized = user?.role === 'admin';

    useEffect(() => {
        if (!loading && !isAuthorized) {
            const timer = setTimeout(() => router.push('/'), 1500);
            return () => clearTimeout(timer);
        }
    }, [loading, isAuthorized, router]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-teal-500/30"></div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Verifying Admin Permissions...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
                <div className="max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center shadow-2xl space-y-4">
                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-black text-white">Access Restricted</h2>
                    <p className="text-xs text-slate-400">You must be authenticated as an Admin to enter the Pawbazar management suite. Redirecting to store...</p>
                </div>
            </div>
        );
    }

    const navigationGroups = [
        {
            groupTitle: 'Dashboard & Reports',
            items: [
                { href: '/admin', label: 'Overview', icon: LayoutDashboard },
                { href: '/admin/analytics', label: 'Analytics & Sales', icon: BarChart3, badge: 'New' },
            ]
        },
        {
            groupTitle: 'Catalog & Inventory',
            items: [
                { href: '/admin/products', label: 'Products', icon: ShoppingBag },
                { href: '/admin/categories', label: 'Categories', icon: Layers },
                { href: '/admin/inventory', label: 'Stock & Restock', icon: Boxes },
            ]
        },
        {
            groupTitle: 'Sales & Customers',
            items: [
                { href: '/admin/orders', label: 'Orders Management', icon: ClipboardList },
                { href: '/admin/customers', label: 'Customers List', icon: Users },
                { href: '/admin/coupons', label: 'Coupons & Promos', icon: Tag },
                { href: '/admin/reviews', label: 'Product Reviews', icon: MessageSquare },
            ]
        },
        {
            groupTitle: 'System',
            items: [
                { href: '/admin/settings', label: 'Store Settings', icon: Settings },
                { href: '/admin/logs', label: 'Activity Logs', icon: FileText },
            ]
        }
    ];

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
            {/* Sidebar Desktop */}
            <aside
                className={`hidden md:flex flex-col bg-slate-900 border-r border-slate-800/80 transition-all duration-300 relative z-20 ${
                    collapsed ? 'w-20' : 'w-72'
                }`}
            >
                {/* Brand Header */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80">
                    <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-gradient-to-tr from-teal-600 to-emerald-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-teal-500/20 shrink-0">
                            🐾
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col">
                                <span className="font-black text-base tracking-wide text-white leading-tight">Pawbazar</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Admin Control</span>
                            </div>
                        )}
                    </Link>

                    {/* Collapse Toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer hidden lg:block"
                        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
                    {navigationGroups.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-1">
                            {!collapsed && (
                                <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                                    {group.groupTitle}
                                </p>
                            )}
                            {group.items.map(({ href, label, icon: Icon, badge }) => {
                                const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        title={collapsed ? label : undefined}
                                        className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                            isActive
                                                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/25 border border-teal-500/30'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-400'}`} />
                                            {!collapsed && <span className="truncate">{label}</span>}
                                        </div>

                                        {!collapsed && badge && (
                                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                {badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Sidebar Footer */}
                <div className="p-3 border-t border-slate-800/80 bg-slate-900/50 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                    >
                        <Store className="w-4 h-4 text-teal-400 shrink-0" />
                        {!collapsed && <span>Back to Storefront</span>}
                    </Link>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-teal-600/20 border border-teal-500/30 text-teal-400 font-black text-xs flex items-center justify-center shrink-0">
                                {user?.name?.[0]?.toUpperCase() || 'A'}
                            </div>
                            {!collapsed && (
                                <div className="truncate">
                                    <p className="text-xs font-extrabold text-white truncate">{user?.name || 'Admin User'}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@pawbazar.com'}</p>
                                </div>
                            )}
                        </div>

                        {!collapsed && (
                            <button
                                onClick={handleLogout}
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Mobile Drawer Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    ></div>

                    <aside className="relative w-72 bg-slate-900 text-white flex flex-col h-full z-10 border-r border-slate-800 shadow-2xl">
                        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center text-white text-lg">
                                    🐾
                                </div>
                                <span className="font-black text-base text-white">Pawbazar Admin</span>
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
                            {navigationGroups.map((group, groupIdx) => (
                                <div key={groupIdx} className="space-y-1">
                                    <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                                        {group.groupTitle}
                                    </p>
                                    {group.items.map(({ href, label, icon: Icon, badge }) => {
                                        const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
                                        return (
                                            <Link
                                                key={href}
                                                href={href}
                                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                                    isActive
                                                        ? 'bg-teal-600 text-white shadow-md'
                                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon className="w-4 h-4" />
                                                    <span>{label}</span>
                                                </div>
                                                {badge && (
                                                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                                                        {badge}
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-slate-800 space-y-2">
                            <Link
                                href="/"
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                                <Store className="w-4 h-4 text-teal-400" />
                                <span>Back to Storefront</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Layout Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
                {/* Top Navbar */}
                <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 text-slate-400 hover:text-white md:hidden cursor-pointer"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col">
                            <h2 className="text-sm font-extrabold text-white tracking-wide">
                                Admin Control Panel
                            </h2>
                            <p className="text-[10px] text-slate-400 hidden sm:block">
                                Pawbazar E-Commerce Management Suite
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="hidden sm:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-700/60 transition-all"
                        >
                            <Store className="w-3.5 h-3.5 text-teal-400" />
                            <span>Storefront</span>
                        </Link>

                        <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 flex items-center justify-center">
                                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-teal-300 font-extrabold text-xs">
                                    {user?.name?.[0]?.toUpperCase() || 'A'}
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-200 hidden md:inline">
                                {user?.name || 'Admin'}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Main Content View */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}