// src/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => (
    <AuthProvider>
        <NotificationProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </NotificationProvider>
    </AuthProvider>
);

export default App;
