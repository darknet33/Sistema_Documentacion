// src/pages/Landing.tsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoutButton } from '../components';
import { MapPin, Users, BookOpen, Award, Clock, Calendar } from 'lucide-react';

const Landing = () => {
    const { token } = useAuth();

    const datosGenerales = [
                                { icon: MapPin, label: "Ubicación", value: "El Alto - Villa Aroma" },
                                { icon: Users, label: "Estudiantes", value: "296" },
                                { icon: BookOpen, label: "Niveles", value: "Secundaria" },
                                { icon: Award, label: "Dependencia", value: "Fiscal" },
                                { icon: Clock, label: "Turno", value: "Tarde" },
                                { icon: Calendar, label: "Fundación", value: "12/09/2013" },
                                { icon: Users, label: "Docentes", value: "26" },
                                { icon: Users, label: "Administrativos", value: "4" }
                            ];

    const filosofiaItems = [
                            {
                                title: "Misión",
                                description: "Formar alumnos críticos y reflexivos, integrando conocimiento, cultura, valores y habilidades para desenvolverse eficazmente en la sociedad.",
                                icon: "🎯",
                                gradient: "from-blue-500 to-cyan-500"
                            },
                            {
                                title: "Visión",
                                description: "Ser líder en educación de calidad con personal calificado, promoviendo desarrollo integral y participación activa en la comunidad.",
                                icon: "🚀",
                                gradient: "from-purple-500 to-pink-500"
                            },
                            {
                                title: "Objetivos",
                                description: "Fortalecer la gestión institucional, optimizando recursos y ofreciendo educación de calidad y equidad para toda la comunidad educativa.",
                                icon: "⭐",
                                gradient: "from-amber-500 to-orange-500"
                            }
                        ];

    function Encabezado() {
        return (
            <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between flex-col sm:flex-row gap-3 sm:gap-0">
                    <div className="flex items-center gap-3 text-center sm:text-left">
                        <img
                            src="/logo.jpg"
                            alt="Logo Colegio"
                            className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl shadow-md object-cover"
                        />
                        <div>
                            <h1 className="text-lg sm:text-2xl bg-gradient-to-r from-indigo-900 to-purple-800 bg-clip-text text-transparent font-bold">
                                U.E. "Dr. Aniceto Arce B"
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600">Excelencia Educativa en El Alto</p>
                        </div>
                    </div>

                    <nav className="w-full sm:w-auto">
                        {!token ? (
                            <Link
                                to="/login"
                                className="w-full sm:w-auto inline-flex justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold hover:scale-105 text-sm sm:text-base"
                            >
                                Inicia Sesión
                            </Link>
                        ) : (
                            <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 items-center w-full sm:w-auto'>
                                <Link
                                    to="/dashboard"
                                    className="w-full sm:w-auto inline-flex justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold hover:scale-105 text-sm sm:text-base"
                                >
                                    Ir al Dashboard
                                </Link>
                                <div className="w-full sm:w-auto">
                                    <LogoutButton variant="default" />
                                </div>
                            </div>
                        )}
                    </nav>
                </div>
            </header>
        )
    }

    function Footer() {
        return (
            <footer className="bg-gray-900 text-white py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <img
                            src="/logo.jpg"
                            alt="Logo Colegio"
                            className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl object-cover"
                        />
                        <div>
                            <h3 className="text-xl sm:text-2xl font-black">U.E. "Dr. Aniceto Arce B"</h3>
                            <p className="text-gray-400 text-sm sm:text-base">Excelencia Educativa en El Alto</p>
                        </div>
                    </div>
                    <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                        Villa Aroma, El Alto - La Paz, Bolivia
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm">
                        © 2025 U.E. "Dr. Aniceto Arce B" - Todos los derechos reservados
                    </p>
                </div>
            </footer>
        )
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Encabezado />

            {/* Hero Section - Optimizado para móvil */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-0">
                {/* Background con overlay gradient */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-fixed"
                    style={{
                        backgroundImage: "url('https://www.elaltodigital.com/wp-content/uploads/2017/07/el-2Balto-1024x576.jpg')"
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-purple-900/70"></div>
                </div>

                {/* Contenido Hero */}
                <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-6xl mx-auto w-full">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/20 shadow-2xl mx-2">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight">
                            U.E. <span className="block text-transparent bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-2xl sm:text-4xl md:text-5xl lg:text-7xl">
                                "Dr. Aniceto Arce B"
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-100 max-w-3xl mx-auto leading-relaxed">
                            Formando líderes del mañana con excelencia académica y valores sólidos
                            en la comunidad de El Alto
                        </p>

                        {/* Stats en tiempo real - Mejor responsive */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 max-w-2xl mx-auto">
                            {[
                                { number: "296", label: "Estudiantes" },
                                { number: "26", label: "Docentes" },
                                { number: "12+", label: "Años" },
                                { number: "100%", label: "Compromiso" }
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300">{stat.number}</div>
                                    <div className="text-xs sm:text-sm text-gray-200">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {!token && (
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 rounded-xl sm:rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold text-base sm:text-lg hover:scale-105"
                            >
                                Comenzar Ahora
                            </Link>
                        )}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white rounded-full flex justify-center">
                        <div className="w-1 h-2 sm:h-3 bg-white rounded-full mt-2"></div>
                    </div>
                </div>
            </section>

            {/* Información General - Optimizado para móvil */}
            <section className="py-12 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                            Nuestra <span className="text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">Institución</span>
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Comprometidos con la excelencia educativa en la ciudad de El Alto
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start">
                        {/* Datos Generales en Grid - Mejor responsive */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {datosGenerales.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 group"
                                >
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <item.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.label}</h3>
                                            <p className="text-base sm:text-lg font-bold text-indigo-600 truncate">{item.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Historia y Antecedentes - Mejor responsive */}
                        <div className="space-y-6 sm:space-y-8">
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3">
                                    <div className="w-2 h-6 sm:h-8 bg-indigo-500 rounded-full"></div>
                                    Nuestra Historia
                                </h3>
                                <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
                                    <p>
                                        La Unidad Educativa <strong>"Dr. Aniceto Arce"</strong> se encuentra estratégicamente ubicada en Villa Aroma,
                                        corazón de la ciudad de El Alto.
                                    </p>
                                    <p>
                                        En el año 2001, mediante un proceso de transformación y renovación, adoptamos el nombre que nos identifica
                                        actualmente, honrando la memoria del destacado <strong>Dr. Aniceto Arce</strong>.
                                    </p>
                                    <p>
                                        Desde el año 2011, hemos estado funcionando en el turno tarde con nivel secundario, operando bajo resolución
                                        ministerial que avala nuestra calidad educativa.
                                    </p>
                                </div>
                            </div>

                            {/* Información Adicional */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
                                <h4 className="font-bold text-base sm:text-lg mb-3">Información Adicional</h4>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                                    <div>
                                        <span className="text-indigo-200">Departamento:</span>
                                        <div className="font-semibold">La Paz</div>
                                    </div>
                                    <div>
                                        <span className="text-indigo-200">Distrito Educativo:</span>
                                        <div className="font-semibold">El Alto - 2</div>
                                    </div>
                                    <div>
                                        <span className="text-indigo-200">Nº de Red:</span>
                                        <div className="font-semibold">202</div>
                                    </div>
                                    <div>
                                        <span className="text-indigo-200">Provincia:</span>
                                        <div className="font-semibold">Murillo</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Misión, Visión y Objetivos - Mejor responsive */}
            <section className="py-12 sm:py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                            Nuestra <span className="text-transparent bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text">Filosofía</span>
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-indigo-200 max-w-3xl mx-auto">
                            Pilares fundamentales que guían nuestra labor educativa diaria
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {filosofiaItems.map((item, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden"
                            >
                                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 hover:border-white/40 transition-all duration-500 h-full flex flex-col">
                                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">{item.title}</h3>
                                    <p className="text-indigo-100 leading-relaxed flex-grow text-sm sm:text-base">{item.description}</p>
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Final - Mejor responsive */}
            {!token && (
                <section className="py-12 sm:py-20 bg-gradient-to-r from-gray-900 to-indigo-900">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6">
                            ¿Listo para ser parte de nuestra comunidad?
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
                            Únete a la familia de la U.E. "Dr. Aniceto Arce B" y descubre una educación que transforma vidas
                        </p>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 rounded-xl sm:rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold text-lg sm:text-xl hover:scale-105 w-full sm:w-auto justify-center"
                        >
                            Comenzar Mi Journey
                        </Link>
                    </div>
                </section>
            )}

            {/* Footer - Mejor responsive */}
            <Footer />
        </div>
    );
};

export default Landing;