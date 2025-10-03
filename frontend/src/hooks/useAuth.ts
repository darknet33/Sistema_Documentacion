// src/hooks/useAuth.ts
import { useState } from 'react';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY } from '../config/constants';
import { loginApi, logoutApi } from '../api/auth';
import { type UserOut } from '../types/users';
import type { LoginSuccess } from '../types/auths';

export const useAuth = () => {
    const [user, setUser] = useState<UserOut | null>(
        JSON.parse(localStorage.getItem(USER_DATA_KEY) || 'null')
    );

    const [token, setToken] = useState<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY));

    const login = async (email: string, password: string) => {
        const res: LoginSuccess = await loginApi(email, password);
        localStorage.setItem(ACCESS_TOKEN_KEY, res.access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, res.refresh_token);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(res.user_data));
        setUser(res.user_data);
        setToken(res.access_token);
        return res; // <-- devuelvo datos
    };

    const logout = async () => {
        if (token) await logoutApi(token);
        localStorage.clear();
        setUser(null);
        setToken(null);
    };

    const getAuthHeaders = () => {
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    return { user, token, getAuthHeaders, login, logout, isAuthenticated: !!token };
};
