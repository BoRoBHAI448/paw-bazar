'use client';

import Link from 'next/link';
import { ShoppingBag, Search, User, Heart } from 'lucide-react';

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-teal-600 tracking-tight">
                        <span>Pawbazar</span>
                        <span className="text-xl">🐾</span>
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md relative">
                        <input
                            type="text"
                            placeholder="Search cat food, treats, toys..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                        />
                        <button className="absolute right-3 top-2.5 text-slate-400 hover:text-teal-600">
                            <Search className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
                        <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
                        <Link href="/products" className="hover:text-teal-600 transition-colors">All Foods</Link>
                        <Link href="/categories" className="hover:text-teal-600 transition-colors">Categories</Link>
                    </nav>

                    {/* Right Action Icons */}
                    <div className="flex items-center gap-4">
                        {/* Wishlist */}
                        <button className="text-slate-600 hover:text-teal-600 relative p-1">
                            <Heart className="w-6 h-6" />
                        </button>

                        {/* Cart Icon with Badge */}
                        <Link href="/cart" className="text-slate-600 hover:text-teal-600 relative p-1">
                            <ShoppingBag className="w-6 h-6" />
                            <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                0
                            </span>
                        </Link>

                        {/* User Account / Login */}
                        <Link
                            href="/login"
                            className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full font-medium text-sm hover:bg-teal-100 transition-all"
                        >
                            <User className="w-4 h-4" />
                            <span>Login</span>
                        </Link>
                    </div>

                </div>
            </div>
        </header>
    );
}