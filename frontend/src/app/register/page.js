'use client';

import { useState } from 'react';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/common/Button';

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.register(formData);
            router.push('/login');
        } catch (err) {
            setError(err?.response?.data?.message || 'Registration failed. Check inputs!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Create Account 🐾</h1>
                <p className="text-slate-500 text-sm mt-1">Join Pawbazar for exclusive cat food deals</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

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

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                    <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
                        value={formData.password_confirmation}
                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    />
                </div>

                <Button type="submit" className="w-full mt-2" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Register'}
                </Button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-teal-600 font-bold hover:underline">
                    Sign In
                </Link>
            </p>
        </div>
    );
}