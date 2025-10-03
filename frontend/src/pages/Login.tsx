// src/pages/Login.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, UserPlus } from 'lucide-react';
import { LoginForm } from '../components';
import { useAuth } from '../hooks/AuthContext';
import { useUsers } from '../hooks/useUsers';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { login, user } = useAuth();
    const { users } = useUsers();

    const firstUserMode = users.length === 0;

    // redireccion automática si ya hay sesión
    useEffect(() => {
        if (user) navigate('/dashboard');
    }, [user, navigate]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, password);  // login usando el context
            navigate('/dashboard');        // redirige al dashboard
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido al iniciar sesión.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-2xl border border-gray-100">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Atrás
                </button>

                <div className="flex justify-center mb-6">
                    <LayoutDashboard className="h-10 w-10 text-indigo-600" />
                </div>

                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">Inicia Sesión</h2>
                <p className="text-center text-sm text-gray-500 mb-8">Sistema de Control de Documentos</p>

                <LoginForm
                    email={email}
                    password={password}
                    loading={loading}
                    error={error}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    onSubmit={handleLogin}
                />

                {firstUserMode && (
                    <div className="my-4 text-center">
                        <button
                            onClick={() => navigate('/signin')} // ir a registrar el primer administrador
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-green-600 hover:bg-green-700 transition duration-200"
                        >
                            <UserPlus className="h-5 w-5" />
                            Registrar Administrador
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
