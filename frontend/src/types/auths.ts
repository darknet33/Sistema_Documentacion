// src/types/auths.ts
import { type UserOut } from "./users";

export interface LoginSuccess {
    access_token: string;
    refresh_token: string;
    user_data: UserOut;
}

export interface AuthProps{
    userData: UserOut;
    onLogout: () => void;
}

export interface AuthContextType {
    user: UserOut | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<LoginSuccess>;
    logout: () => Promise<void>;
}