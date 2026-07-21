'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authService } from '@/services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // App load hoile token ache kina check kora
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            authService.getProfile()
                .then((data) => setUser(data))
                .catch(() => Cookies.remove('token'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // Login Handler
    const login = async (credentials) => {
        const data = await authService.login(credentials);
        // Laravel response theke token save kora
        const token = data?.access_token || data?.token;
        if (token) {
            Cookies.set('token', token, { expires: 7 }); // 7 Days
            setUser(data.user || data);
        }
        return data;
    };

    // Logout Handler
    const logout = async () => {
        try {
            await authService.logout();
        } catch (e) {
            console.error(e);
        } finally {
            Cookies.remove('token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);