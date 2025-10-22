import type React from "react";
import { useDashboardData } from "../../hooks/useDashboardData";
import { LoadingScreen } from "./LoadingScreen";
import { Link } from "react-router-dom";

// Componente principal del Dashboard
export function DashboardAdmin() {
    const {
        loading,
        totalEstudiantes,
        totalDocsRequeridos,
        totalDocsEntregados,
        cursos,
        error,
        documentosPorConfirmar,
        documentosAprobados,
        documentosPorVencer,
    } = useDashboardData();

    // Calcular porcentajes y totales
    const totalCursos = cursos?.length || 0;
    const totalPorConfirmar = documentosPorConfirmar?.length || 0;
    const totalAprobados = documentosAprobados?.length || 0;
    const totalPorVencer = documentosPorVencer?.length || 0;
    const porcentajeEntrega = totalDocsRequeridos > 0
        ? Math.round((totalDocsEntregados / totalDocsRequeridos) * 100)
        : 0;

    // Lógica de carga y error
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

    // ----------------------------------------------------------------
    // 1. Componentes reutilizables (Métricas Primarias)
    // ----------------------------------------------------------------

    // Componente auxiliar para la barra de progreso

    const ProgressBar: React.FC<{ valor: number }> = ({ valor }) => {
        const color = valor >= 80 ? 'bg-green-500' :
            valor >= 50 ? 'bg-yellow-500' : 'bg-red-500';

        return (
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${valor}%` }}
                ></div>
            </div>
        );
    };

    // Componente auxiliar para el contenido de la métrica
    function Metricas({ icon, titulo, valor, porcentaje = false }: { icon: string, titulo: string, valor: number, porcentaje?: boolean }) {
        return (
            <>
                <div className="text-blue-600 text-2xl mr-4">{icon}</div>
                <div>
                    <p className="text-sm text-gray-600 font-medium">{titulo}</p>
                    <p className="text-3xl font-bold text-gray-900">{valor} {porcentaje && "%"}</p>
                    {porcentaje && <ProgressBar valor={valor} />}
                </div>
            </>
        )
    }

    // Componente de envoltura para métricas principales
    function CardMetrica({ path = "/dashboard", children }: { path?: string, children: React.ReactNode }) {
        return (
            <Link to={path} className="flex-1 min-w-0">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 h-full">
                    <div className="flex items-center">
                        {children}
                    </div>
                </div>
            </Link>
        )
    }

    // ----------------------------------------------------------------
    // 2. Componente para Métricas de Estado de Documentos (NUEVO)
    // ----------------------------------------------------------------

    interface CardEstadoProps {
        titulo: string;
        valor: number;
        path: string;
        emoji: string;
        descripcion: string;
        color: 'orange' | 'lime' | 'red';
    }

    function CardMetricaDocumentoEstado({ titulo, valor, path, emoji, descripcion, color }: CardEstadoProps) {
        const colorClasses = {
            orange: `bg-orange-50 border-orange-200 text-orange-600 text-orange-500 hover:border-orange-500`,
            lime: `bg-lime-50 border-lime-200 text-lime-600 text-lime-500 hover:border-lime-500`,
            red: `bg-red-50 border-red-200 text-red-600 text-red-500 hover:border-red-500`,
        };

        const currentClasses = colorClasses[color];
        const [bgClass, borderClass, emojiClass, descClass] = currentClasses.split(' ').filter(c => c.includes(color));

        return (
            <Link to={path} className="block hover:shadow-lg transition-shadow duration-220">
                <div className={`rounded-2xl shadow-sm border p-6 h-full ${bgClass} ${borderClass}`}>
                    <div className="flex items-center justify-between">
                        <div className={`${emojiClass} text-4xl mr-4`}>{emoji}</div>
                        <div>
                            <p className="text-sm text-gray-600 font-medium">{titulo}</p>
                            <p className="text-3xl font-bold text-gray-900">{valor}</p>
                            <p className={`text-xs mt-1 ${descClass}`}>{descripcion}</p>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    // ----------------------------------------------------------------
    // 3. Componente para Resumen por Curso (NUEVO)
    // ----------------------------------------------------------------

    // Asumimos que el tipo CursoDashboard es: { id: number, nombre: string, nivel: string, totalEstudiantes: number, totalDocsRequeridos: number, totalDocsEntregados: number }
    interface CursoDashboard {
        id: number; nombre: string; nivel: string; totalEstudiantes: number; totalDocsRequeridos: number; totalDocsEntregados: number;
    }


    function CursoResumen({ curso }: { curso: CursoDashboard }) {
        const porcentajeCurso = curso.totalDocsRequeridos > 0
            ? Math.round((curso.totalDocsEntregados / curso.totalDocsRequeridos) * 100)
            : 0;


        return (
            <div key={curso.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{curso.nombre}</h3>
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

                <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progreso</span>
                        <span>{porcentajeCurso}%</span>
                    </div>
                    <ProgressBar valor={porcentajeCurso} />
                </div>
            </div>
        );
    }

    // ----------------------------------------------------------------
    // RENDERIZADO PRINCIPAL
    // ----------------------------------------------------------------

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Administrativo</h1>
                <p className="text-gray-600">
                    Resumen general de estudiantes y documentos del sistema
                </p>
            </div>

            {/* Tarjetas de métricas principales */}
            <div className="flex justify-between gap-6">
                <CardMetrica path="/cursos">
                    <Metricas icon="🏫" titulo="Cursos Asignados" valor={totalCursos} />
                </CardMetrica>

                <CardMetrica path="/estudiantes">
                    <Metricas icon="👨‍🎓" titulo="Estudiantes Inscritos" valor={totalEstudiantes} />
                </CardMetrica>

                <CardMetrica path="/documentos">
                    <Metricas icon="📋" titulo="Documentos Requeridos" valor={totalDocsRequeridos} />
                </CardMetrica>

                <CardMetrica>
                    <Metricas
                        icon="📊"
                        titulo="Tasa de Entrega"
                        valor={porcentajeEntrega}
                        porcentaje={true}
                    />
                </CardMetrica>
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


            {/* --- NUEVA SECCIÓN: DOCUMENTOS POR ESTADO --- */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                Gestión de Documentos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Tarjeta Por Confirmar */}
                <CardMetricaDocumentoEstado
                    titulo="Por Confirmar"
                    valor={totalPorConfirmar}
                    path="/documentos-por-confirmar"
                    emoji="🔔"
                    descripcion="Requiere tu revisión."
                    color="orange"
                />

                {/* Tarjeta Aprobados */}
                <CardMetricaDocumentoEstado
                    titulo="Documentos Aprobados"
                    valor={totalAprobados}
                    path="/documentos-aprobados"
                    emoji="👍"
                    descripcion="Documentación verificada."
                    color="lime"
                />

                {/* Tarjeta Por Vencer */}
                <CardMetricaDocumentoEstado
                    titulo="Por Vencer / Vencidos"
                    valor={totalPorVencer}
                    path="/documentos-por-vencer"
                    emoji="⚠️"
                    descripcion="Atención inmediata requerida."
                    color="red"
                />
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
                            {cursos.map(curso => (
                                <CursoResumen key={curso.id} curso={curso} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}