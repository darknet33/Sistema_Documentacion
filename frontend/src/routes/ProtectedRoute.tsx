// src/routes/ProtectedRoute.tsx
import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    isAuthenticated: boolean;
    redirectPath?: string;
    children: ReactNode; // <-- importante
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, redirectPath = '/login', children }) => {
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>; // renderiza los hijos
};

export default ProtectedRoute;
