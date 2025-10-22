// src/routes/ProtectedRoute.tsx
import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { PadreEstudianteProvider } from '../context/PadreEstudianteContext';
import { DocumentoEstudianteProvider } from '../context/DocumentoEstudianteContext';

interface ProtectedRouteProps {
    isAuthenticated: boolean;
    redirectPath?: string;
    children: ReactNode; // <-- importante
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, redirectPath = '/login', children }) => {
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    return (
        <PadreEstudianteProvider> 
             <DocumentoEstudianteProvider>
                {children}
            </DocumentoEstudianteProvider>
        </PadreEstudianteProvider>
    )

};

export default ProtectedRoute;
