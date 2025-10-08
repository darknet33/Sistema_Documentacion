import { useState, useEffect } from "react";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../config/constants";
import { loginApi, logoutApi, getProfileApi } from "../api/auth";
import type { UserOut } from "../types/users";
import type { LoginSuccess } from "../types/auths";

export const useAuth = () => {
  const [user, setUser] = useState<UserOut | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );

  // 🔒 Al montar, validamos token con backend
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await getProfileApi(token); // endpoint protegido
          setUser(userData);
        } catch {
          logout();
        }
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res: LoginSuccess = await loginApi(email, password);
    localStorage.setItem(ACCESS_TOKEN_KEY, res.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, res.refresh_token);
    setToken(res.access_token);

    // ✅ Siempre obtener el perfil del backend, no del localStorage
    const userData = await getProfileApi(res.access_token);
    setUser(userData);

    return userData;
  };

  const logout = async () => {
    if (token) await logoutApi(token);
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  const getAuthHeaders = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return { user, token, getAuthHeaders, login, logout, isAuthenticated: !!token };
};
