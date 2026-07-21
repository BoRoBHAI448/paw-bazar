'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authService } from '@/services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load User Profile from Backend
    const loadUser = async () => {
        const token = Cookies.get('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await authService.getProfile();
            setUser(res.data || res);
        } catch (err) {
            console.error('Failed to load user:', err);
            Cookies.remove('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    // Login Handler
    const login = async (credentials) => {
        const res = await authService.login(credentials);
        const token = res?.access_token || res?.token || res?.data?.access_token;

        if (token) {
            Cookies.set('token', token, { expires: 7 });
            await loadUser(); // Instant fetch updated user name
        }
        return res;
    };

    // Logout Handler
    const logout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.error(err);
        } finally {
            Cookies.remove('token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user, refreshUser: loadUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);