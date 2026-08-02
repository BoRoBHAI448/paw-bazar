'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, LogOut, Search, LayoutDashboard, UserCircle, PackageSearch, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const { totalItems } = useCart();
    const router = useRouter();

    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayName = user?.name || user?.full_name || (user?.email ? user.email.split('@')[0] : 'User');
    const displayInitial = displayName !== 'User' ? displayName.charAt(0).toUpperCase() : 'U';
    const isAdmin = user?.role === 'admin';

    // ─── Search Handler ──────────────────────────────
    const handleSearch = (e) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (!q) return;
        router.push(`/products?search=${encodeURIComponent(q)}`);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const handleLogout = () => {
        setDropdownOpen(false);
        logout();
    };

    return (
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-2xl">🐾</span>
                        <span className="font-extrabold text-xl text-teal-800 tracking-tight">
                            Paw<span className="text-teal-600">bazar</span>
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Search cat food, treats, accessories..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-teal-500 focus:bg-white transition-all text-slate-800"
                        />
                        <button
                            type="submit"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                            aria-label="Search"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">

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
                            <div className="w-20 h-8 bg-slate-100 animate-pulse rounded-full" />
                        ) : isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                {/* Admin Panel Quick Link */}
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-full transition-all"
                                        title="Admin Dashboard"
                                    >
                                        <LayoutDashboard className="w-3.5 h-3.5" />
                                        Admin
                                    </Link>
                                )}

                                {/* My Account Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setDropdownOpen((v) => !v)}
                                        className="flex items-center gap-2 bg-teal-50/70 hover:bg-teal-100 border border-teal-100 pl-3 pr-2 py-1.5 rounded-full transition-all"
                                    >
                                        <div className="w-7 h-7 bg-teal-600 text-white font-bold text-xs rounded-full flex items-center justify-center uppercase">
                                            {displayInitial}
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-xs font-bold text-slate-800 leading-none capitalize">
                                                {displayName}
                                            </span>
                                            {user?.role && (
                                                <span className={`text-[10px] font-medium capitalize leading-tight ${isAdmin ? 'text-purple-600' : 'text-teal-600'}`}>
                                                    {user.role}
                                                </span>
                                            )}
                                        </div>
                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden py-1.5 z-50">
                                            <Link
                                                href="/profile"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                                            >
                                                <UserCircle className="w-4 h-4" />
                                                My Profile
                                            </Link>
                                            <Link
                                                href="/orders"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                                            >
                                                <PackageSearch className="w-4 h-4" />
                                                My Orders
                                            </Link>
                                            <div className="border-t border-slate-100 my-1" />
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
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