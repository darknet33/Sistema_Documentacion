import { useDashboardData } from "../../hooks/useDashboardData";
import { LoadingScreen } from "./LoadingScreen";

export function DashboardAdmin() {
    const { loading, totalEstudiantes, totalDocsRequeridos, totalDocsEntregados, cursos, error } = useDashboardData();

    // Calcular porcentaje de entrega
    const porcentajeEntrega = totalDocsRequeridos > 0 
        ? Math.round((totalDocsEntregados / totalDocsRequeridos) * 100)
        : 0;

    if (loading) return <LoadingScreen message="Cargando Datos del Dashboard" />;
    if (error) return (
        <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">❌</div>
                <p className="text-xl font-semibold text-red-600 mb-2">Error al cargar datos</p>
                <p className="text-gray-600">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Dashboard Administrativo
                    </h1>
                    <p className="text-gray-600">
                        Resumen general de estudiantes y documentos del sistema
                    </p>
                </div>

                {/* Tarjetas de métricas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="text-indigo-600 text-2xl mr-4">👨‍🎓</div>
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Total Estudiantes</p>
                                <p className="text-3xl font-bold text-gray-900">{totalEstudiantes}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="text-blue-600 text-2xl mr-4">📋</div>
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Documentos Requeridos</p>
                                <p className="text-3xl font-bold text-gray-900">{totalDocsRequeridos}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="text-green-600 text-2xl mr-4">✅</div>
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Documentos Entregados</p>
                                <p className="text-3xl font-bold text-gray-900">{totalDocsEntregados}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                            <div className="text-purple-600 text-2xl mr-4">📊</div>
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Tasa de Entrega</p>
                                <p className="text-3xl font-bold text-gray-900">{porcentajeEntrega}%</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div 
                                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${porcentajeEntrega}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resumen por cursos */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Resumen por Curso</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Distribución de estudiantes y documentos por curso
                        </p>
                    </div>

                    <div className="p-6">
                        {cursos.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">🎓</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No hay cursos con documentos asignados
                                </h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    Los cursos aparecerán aquí una vez que se asignen documentos requeridos.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cursos.map(curso => {
                                    const porcentajeCurso = curso.totalDocsRequeridos > 0
                                        ? Math.round((curso.totalDocsEntregados / curso.totalDocsRequeridos) * 100)
                                        : 0;
                                    
                                    return (
                                        <div key={curso.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                        {curso.nombre}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">{curso.nivel}</p>
                                                </div>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    {curso.totalEstudiantes} estudiantes
                                                </span>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Documentos requeridos:</span>
                                                    <span className="font-semibold text-gray-900">{curso.totalDocsRequeridos}</span>
                                                </div>
                                                
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Documentos entregados:</span>
                                                    <span className="font-semibold text-green-600">{curso.totalDocsEntregados}</span>
                                                </div>
                                                
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Tasa de entrega:</span>
                                                    <span className="font-semibold text-purple-600">{porcentajeCurso}%</span>
                                                </div>
                                            </div>
                                            
                                            {/* Barra de progreso del curso */}
                                            <div className="mt-4">
                                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                    <span>Progreso</span>
                                                    <span>{porcentajeCurso}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full transition-all duration-500 ${
                                                            porcentajeCurso >= 80 ? 'bg-green-500' :
                                                            porcentajeCurso >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                        style={{ width: `${porcentajeCurso}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Métricas adicionales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-indigo-100 text-sm font-medium">Eficiencia del Sistema</p>
                                <p className="text-2xl font-bold mt-1">{porcentajeEntrega}%</p>
                                <p className="text-indigo-200 text-sm mt-2">
                                    {porcentajeEntrega >= 80 ? 'Excelente rendimiento' :
                                     porcentajeEntrega >= 60 ? 'Buen progreso' :
                                     'Necesita mejora'}
                                </p>
                            </div>
                            <div className="text-4xl">🎯</div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Documentos Pendientes</p>
                                <p className="text-2xl font-bold mt-1">{totalDocsRequeridos - totalDocsEntregados}</p>
                                <p className="text-green-200 text-sm mt-2">
                                    Por entregar del total requerido
                                </p>
                            </div>
                            <div className="text-4xl">⏳</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}