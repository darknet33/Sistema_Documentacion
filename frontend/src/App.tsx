// src/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';
import { PadreEstudianteProvider } from './context/PadreEstudianteContext';

const App: React.FC = () => (
    <AuthProvider>
        <NotificationProvider>
            <PadreEstudianteProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </PadreEstudianteProvider>
        </NotificationProvider>
    </AuthProvider>
);

export default App;
