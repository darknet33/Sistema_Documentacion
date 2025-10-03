// src/api/auth.ts
import { FULL_API_URL } from '../config/api';
import { type LoginSuccess } from "../types/auths";

export const loginApi = async (username: string, password: string): Promise<LoginSuccess> => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${FULL_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Error de autenticación";
        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.detail || errorMessage;
        } catch {}
        throw new Error(errorMessage);
    }

    return response.json();
};

export const logoutApi = async (token: string): Promise<void> => {
    const response = await fetch(`${FULL_API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) console.warn("Logout falló");
};
