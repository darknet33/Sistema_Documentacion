// src/api/authFetch.ts
import { FULL_API_URL } from "../config/api";
import { ACCESS_TOKEN_KEY } from "../config/constants";

const handleUnauthorized = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.location.href = "/login";
};

export const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  // Detectar si el body es FormData
  const isFormData = options.body instanceof FormData;

  // Combinar headers pasados con los nuevos
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

  // ✅ No ponemos Content-Type si es FormData (el navegador lo hace)
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...optionHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${FULL_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Manejar errores de autenticación
  if (response.status === 401) {
    handleUnauthorized();
    return;
  }

  // Manejar errores generales
  if (!response.ok) {
    const text = await response.text();
    let errorMessage = "Error en la petición";
    try {
      const json = JSON.parse(text);
      errorMessage = json.detail || errorMessage;
    } catch { }
    throw new Error(errorMessage);
  }

  // Si no hay contenido
  if (response.status === 204) return;
  return response.json();
};
