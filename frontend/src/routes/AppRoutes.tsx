import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Signin from '../pages/SignIn';
import ProtectedRoute from './ProtectedRoute';
import { LoadingScreen } from '../components/';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import Curse from '../pages/Curse';
import Document from '../pages/Document';
import Estudiantes from '../pages/Estudiantes';
import VincularEstudiante from '../pages/VincularEstudiante';
import RelacionesPendientes from '../pages/RelacionesPendientes';

const AppRoutes = () => {
    const { isAuthenticated, user } = useAuth();

    // Muestra loading mientras se determina el estado inicial
    if (user === undefined) return <LoadingScreen />;

    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/*" element={<NotFound />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/usuarios"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <Users />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/perfil"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <Profile  />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/cursos"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <Curse />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/documentos"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <Document />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/estudiantes"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <Estudiantes />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/vincular-estudiante"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <VincularEstudiante />
                    </ProtectedRoute>
                }
            />
            
            <Route
                path="/relaciones-pendientes"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RelacionesPendientes />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;