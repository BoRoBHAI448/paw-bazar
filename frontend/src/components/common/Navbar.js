'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, LogOut, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const { totalItems } = useCart();

    // Client-side rendering sync ensure korar jonyo
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Mounted hobar por dynamic name extract korbe
    const displayName = user?.name || user?.full_name || (user?.email ? user.email.split('@')[0] : 'User');
    const displayInitial = displayName !== 'User' ? displayName.charAt(0).toUpperCase() : 'U';

    return (
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">🐾</span>
                        <span className="font-extrabold text-xl text-teal-800 tracking-tight">
                            Paw<span className="text-teal-600">bazar</span>
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md relative">
                        <input
                            type="text"
                            placeholder="Search cat food, treats, accessories..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-teal-500 focus:bg-white transition-all text-slate-800"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">

                        {/* Cart Icon */}
                        <Link href="/cart" className="relative p-2 text-slate-600 hover:text-teal-600 transition-colors">
                            <ShoppingCart className="w-6 h-6" />
                            {isMounted && totalItems > 0 && (
                                <span className="absolute top-0 right-0 bg-amber-500 text-white font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* User Profile / Auth Links */}
                        {!isMounted ? (
                            <div className="w-20 h-8 bg-slate-100 animate-pulse rounded-full"></div>
                        ) : isAuthenticated ? (
                            <div className="flex items-center gap-3 bg-teal-50/70 border border-teal-100 pl-3 pr-2 py-1.5 rounded-full">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-teal-600 text-white font-bold text-xs rounded-full flex items-center justify-center uppercase">
                                        {displayInitial}
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs font-bold text-slate-800 leading-none capitalize">
                                            {displayName}
                                        </span>
                                        {user?.role && (
                                            <span className="text-[10px] font-medium text-teal-600 capitalize leading-tight">
                                                {user.role}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    title="Logout"
                                    className="p-1 text-slate-400 hover:text-red-600 transition-colors ml-1"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="text-xs font-bold text-teal-700 hover:bg-teal-50 px-3 py-2 rounded-full transition-all"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full transition-all shadow-sm"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </header>
    );
}