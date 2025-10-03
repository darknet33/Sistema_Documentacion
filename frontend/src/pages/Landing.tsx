// src/pages/Landing.tsx
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <a className='flex items-center gap-4' href="">
                        <img src="/logo.jpg" alt="Logo Colegio" className="h-16 w-auto" />
                        <strong className='font-black text-3xl text-indigo-900 '>U.E. “Dr. Aniceto Arce B”</strong>
                    </a>
                    <nav>
                        <Link to="/login" className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
                            Login
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center h-96 flex items-center justify-center text-white"
                style={{ backgroundImage: "url('https://www.elaltodigital.com/wp-content/uploads/2017/07/el-2Balto-1024x576.jpg')" }}
            >
                <div className="bg-black bg-opacity-50 p-8 rounded-xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">U.E. “Dr. Aniceto Arce B”</h1>
                    <p className="text-lg md:text-xl">Educando con excelencia y valores para la comunidad de El Alto</p>
                </div>
            </section>

            {/* Información General */}
            <section className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Datos Generales</h2>
                    <ul className="space-y-2 text-gray-700">
                        <li><strong>Departamento:</strong> La Paz</li>
                        <li><strong>Provincia:</strong> Murillo</li>
                        <li><strong>Sección Municipal:</strong> Cuarta (El Alto)</li>
                        <li><strong>Cantón:</strong> Ciudad de El Alto</li>
                        <li><strong>Localidad:</strong> El Alto – Ciudad El Alto</li>
                        <li><strong>Nº de Red:</strong> 202</li>
                        <li><strong>Distrito Educativo:</strong> El Alto – 2</li>
                        <li><strong>Fecha de Fundación:</strong> 12/09/2013</li>
                        <li><strong>Dependencia:</strong> Fiscal</li>
                        <li><strong>Turno:</strong> Tarde</li>
                        <li><strong>Niveles:</strong> Secundaria</li>
                        <li><strong>Alumnos:</strong> 296</li>
                        <li><strong>Docentes:</strong> 26</li>
                        <li><strong>Administrativos:</strong> 4</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4">Ubicación y Antecedentes</h2>
                    <p className="text-gray-700 mb-2">
                        La Unidad Educativa “Dr. Aniceto Arce” se encuentra en Villa Aroma, El Alto. Fundada inicialmente como “Ginger Guillen de Quiroga” en 1998, cambió al nombre actual en 2001.
                    </p>
                    <p className="text-gray-700">
                        Desde 2011 funciona en el turno tarde con nivel secundario bajo resolución ministerial, brindando educación de calidad a la comunidad.
                    </p>
                </div>
            </section>

            {/* Misión, Visión y Objetivos */}
            <section className="bg-indigo-50 py-12">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-gray-800">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-bold mb-2">Misión</h3>
                        <p>Formar alumnos críticos y reflexivos, integrando conocimiento, cultura, valores y habilidades para desenvolverse eficazmente en la sociedad.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-bold mb-2">Visión</h3>
                        <p>Ser líder en educación de calidad con personal calificado, promoviendo desarrollo integral y participación activa en la comunidad.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-bold mb-2">Objetivos</h3>
                        <p>Fortalecer la gestión institucional, optimizando recursos y ofreciendo educación de calidad y equidad para toda la comunidad educativa.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6 text-center">
                <p>© 2025 U.E. “Dr. Aniceto Arce B” - Todos los derechos reservados</p>
            </footer>
        </div>
    );
};

export default Landing;
