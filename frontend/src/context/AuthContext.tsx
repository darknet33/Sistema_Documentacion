// src/context/AuthContext.tsx
import React, { createContext, useContext } from 'react';
import { useAuth as useAuthHook } from '../hooks/useAuth';
import type { AuthContextType } from '../types/auths';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useAuthHook();

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return context;
};
