// src/api/authFetch.ts
import { FULL_API_URL } from "../config/api";
import { ACCESS_TOKEN_KEY } from "../config/constants";

export const authFetch = async (
    endpoint: string,
    options: RequestInit = {}
) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    let optionHeaders: Record<string, string> = {};
    if (options.headers) {
        if (options.headers instanceof Headers) {
            options.headers.forEach((value, key) => {
                optionHeaders[key] = value;
            });
        } else {
            optionHeaders = options.headers as Record<string, string>;
        }
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...optionHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${FULL_API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const text = await response.text();
        let errorMessage = "Error en la petición";
        try {
            const json = JSON.parse(text);
            errorMessage = json.detail || errorMessage;
        } catch {}
        throw new Error(errorMessage);
    }

    if (response.status === 204) return;
    return response.json();
};
