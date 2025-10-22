import { useState, useEffect } from "react";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../config/constants";
import { loginApi, logoutApi, getProfileApi } from "../api/auth";
import type { UserOut } from "../types/users";
import type { AuthContextType, LoginSuccess } from "../types/auths";

export const useAuth = () : AuthContextType => {
  const [user, setUser] = useState<UserOut | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY));
  
  const loadUser = async () => {
    if (token) {
      try {
        const userData = await getProfileApi(token);
        setUser(userData);
      } catch {
        logout();
      }
    }
  };
  
  const login = async (email: string, password: string ) => {
    const res: LoginSuccess = await loginApi(email, password);
      localStorage.setItem(ACCESS_TOKEN_KEY, res.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, res.refresh_token);
      setToken(res.access_token);

      const userData = await getProfileApi(res.access_token);
      setUser(userData);

      return res
  };

  const logout = async () => {
    if (token) await logoutApi(token);
    localStorage.clear();
    setUser(null);
    setToken(null);
  };
  
  useEffect(() => {
    loadUser();
  }, [token]);
  
  return { user, token, login, logout, isAuthenticated: !!token };
};
