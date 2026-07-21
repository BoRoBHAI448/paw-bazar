'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/common/Button';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await login(formData);
            const loggedUser = res?.user || res?.data?.user;

            if (loggedUser?.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Login failed. Invalid credentials!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Welcome Back 👋</h1>
                <p className="text-slate-500 text-sm mt-1">Sign in to manage your orders & account</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        required
                        placeholder="catlover@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                    <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <Button type="submit" className="w-full mt-2" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                </Button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-6">
                Don't have an account?{' '}
                <Link href="/register" className="text-teal-600 font-bold hover:underline">
                    Register Now
                </Link>
            </p>
        </div>
    );
}