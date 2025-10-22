// src/pages/Login.tsx
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    ArrowLeft, 
    LayoutDashboard, 
    UserPlus, 
    Home,
    Shield,
    Users,
    BookOpen,
    Sparkles
} from 'lucide-react';
import { LoginForm } from '../components';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../hooks/useUsers';

const Login = () => {
    const navigate = useNavigate();
    const { login, user } = useAuth();
    const { users } = useUsers();

    const firstUserMode = users.length === 0;

    // redirección automática si ya hay sesión
    useEffect(() => {
        if (user) navigate('/dashboard');
    }, [user, navigate]);

    const handleLogin = async (data: { email: string; password: string }) => {
        try {
            await login(data.email, data.password);
            navigate('/dashboard');
        } catch (err) {
            throw new Error(err instanceof Error ? err.message : 'Error desconocido al iniciar sesión.');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar Decorativa */}
            <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 flex flex-col justify-between p-12 text-white">
                    {/* Logo y Título */}
                    <div className="space-y-6">
                        <Link 
                            to="/" 
                            className="inline-flex items-center gap-3 text-white hover:text-yellow-300 transition-colors duration-200"
                        >
                            <Home className="h-6 w-6" />
                            <span className="font-semibold">Volver al Inicio</span>
                        </Link>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                    <LayoutDashboard className="h-6 w-6" />
                                </div>
                                <h1 className="text-2xl font-black">Sistema Documentos</h1>
                            </div>
                            <p className="text-lg text-indigo-100 max-w-md leading-relaxed">
                                Plataforma integral para la gestión y control de documentos académicos
                            </p>
                        </div>
                    </div>

                    {/* Características */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-yellow-300" />
                            Características Principales
                        </h3>
                        <div className="space-y-4">
                            {[
                                { icon: Shield, text: "Acceso seguro y encriptado" },
                                { icon: Users, text: "Gestión multi-usuario" },
                                { icon: BookOpen, text: "Control documental completo" }
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center gap-3 text-indigo-100">
                                    <feature.icon className="h-5 w-5 text-green-300" />
                                    <span>{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Sidebar */}
                    <div className="border-t border-white/20 pt-6">
                        <p className="text-sm text-indigo-200">
                            U.E. "Dr. Aniceto Arce B" - El Alto
                        </p>
                    </div>
                </div>

                {/* Elementos decorativos */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Panel de Login */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="w-full max-w-md">
                    {/* Header Móvil */}
                    <div className="lg:hidden flex items-center justify-between mb-8">
                        <Link 
                            to="/" 
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        >
                            <Home className="h-5 w-5" />
                            <span className="font-medium">Inicio</span>
                        </Link>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span>Atrás</span>
                        </button>
                    </div>

                    {/* Card de Login */}
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-10">
                        {/* Logo y Título */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
                                <LayoutDashboard className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2">
                                Iniciar Sesión
                            </h2>
                            <p className="text-gray-500">
                                Accede al sistema de gestión documental
                            </p>
                        </div>

                        {/* Componente LoginForm */}
                        <LoginForm 
                            onSubmit={handleLogin}
                        />

                        {/* Primer Usuario - Registro Admin */}
                        {firstUserMode && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                                <div className="text-center">
                                    <p className="text-sm text-green-800 mb-3 font-medium">
                                        ⭐ Primera vez en el sistema
                                    </p>
                                    <button
                                        onClick={() => navigate('/signin')}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        <UserPlus className="h-5 w-5" />
                                        Registrar Administrador Principal
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Información adicional */}
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">
                                ¿Problemas para acceder? Contacta al administrador del sistema.
                            </p>
                        </div>
                    </div>

                    {/* Footer Desktop */}
                    <div className="hidden lg:flex items-center justify-between mt-8 text-sm text-gray-500">
                        <Link 
                            to="/" 
                            className="flex items-center gap-2 hover:text-gray-700 transition-colors duration-200"
                        >
                            <Home className="h-4 w-4" />
                            Volver al sitio principal
                        </Link>
                        <span>U.E. "Dr. Aniceto Arce B"</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;