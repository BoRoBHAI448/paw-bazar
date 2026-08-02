'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { Loader2, UserCircle, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export default function ProfilePage() {
    const { user, loading: authLoading, refreshUser } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '', password_confirmation: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Auth Guard
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/profile');
        }
    }, [user, authLoading, router]);

    // Populate form once user loads
    useEffect(() => {
        if (user) {
            setForm((prev) => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (form.password && form.password !== form.password_confirmation) {
            setError('Passwords do not match.');
            return;
        }

        setSaving(true);
        try {
            const payload = { name: form.name, email: form.email, phone: form.phone, address: form.address };
            if (form.password) payload.password = form.password;

            await authService.updateProfile(payload);
            await refreshUser();

            setSuccess('Profile updated successfully!');
            setForm((prev) => ({ ...prev, password: '', password_confirmation: '' }));
        } catch (err) {
            const errors = err?.response?.data?.errors;
            const firstError = errors ? Object.values(errors)[0]?.[0] : null;
            setError(firstError || err?.response?.data?.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                    <UserCircle className="w-6 h-6 text-teal-600" /> My Profile
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Manage your account information.
                </p>
            </div>

            {/* Form Card */}
            <form
                onSubmit={handleSubmit}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm"
            >
                {/* Role badge */}
                <div className="flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full w-fit capitalize">
                    {user.role || 'user'} account
                </div>

                {/* Name */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-all"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-all"
                    />
                </div>
                {/* Phone */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="e.g. 01712345678"
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-all"
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Delivery Address</label>
                    <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        rows={3}
                        placeholder="House, Road, Area, City"
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-all resize-none"
                    />
                </div>
                <div className="border-t border-slate-100 pt-4">
                    <p className="text-xs font-bold text-slate-500 mb-3">Change Password (optional)</p>

                    {/* New Password */}
                    <div className="mb-3">
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">New Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Leave blank to keep current password"
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-all"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Confirm New Password</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            placeholder="Re-enter new password"
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-all"
                        />
                    </div>
                </div>

                {/* Error / Success */}
                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl">
                        <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                    </div>
                )}
                {success && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-3 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl transition-all"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}