'use client';

import Link from 'next/link';
import { ShoppingCart, User, LogOut, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();

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
                            className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-teal-600 transition-all"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    </div>

                    {/* Actions: Cart & User Account */}
                    <div className="flex items-center gap-4">

                        {/* Cart Button */}
                        <Link
                            href="/cart"
                            className="relative p-2 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute top-0 right-0 bg-teal-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                0
                            </span>
                        </Link>

                        {/* Dynamic Auth Section */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100">
                                <div className="flex items-center gap-1.5">
                                    <User className="w-4 h-4 text-teal-700" />
                                    <span className="text-xs font-bold text-teal-800 line-clamp-1">
                                        {user?.name || 'Customer'}
                                    </span>
                                </div>
                                <button
                                    onClick={logout}
                                    title="Logout"
                                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
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