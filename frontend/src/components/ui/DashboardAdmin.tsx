import type React from "react";
import { useDashboardData } from "../../hooks/useDashboardData";
import { LoadingScreen } from "./LoadingScreen";
import { Link } from "react-router-dom";

// ----------------------------------------------------------------
// 1. Interfaces y Tipos
// ----------------------------------------------------------------

interface CursoDashboard {
  id: number;
  nombre: string;
  nivel: string;
  totalEstudiantes: number;
  totalDocsRequeridos: number;
  totalDocsEntregados: number;
}

interface MetricasProps {
  icon: string;
  titulo: string;
  valor: number;
  porcentaje?: boolean;
}

interface CardEstadoProps {
  titulo: string;
  valor: number;
  path: string;
  emoji: string;
  descripcion: string;
  color: 'orange' | 'lime' | 'red';
}

// ----------------------------------------------------------------
// 2. Componentes Reutilizables
// ----------------------------------------------------------------

const ProgressBar: React.FC<{ valor: number }> = ({ valor }) => {
  const color = valor >= 80 ? 'bg-green-500' :
                valor >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(valor, 100)}%` }}
      ></div>
    </div>
  );
};

function Metricas({ icon, titulo, valor, porcentaje = false }: MetricasProps) {
  return (
    <>
      <div className="text-blue-600 text-2xl mr-4">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-600 font-medium truncate">{titulo}</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
          {valor}{porcentaje && "%"}
        </p>
        {porcentaje && <ProgressBar valor={valor} />}
      </div>
    </>
  );
}

function CardMetrica({ path = "/dashboard", children }: { path?: string; children: React.ReactNode }) {
  return (
    <Link to={path} className="block flex-1 min-w-0">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 h-full">
        <div className="flex items-center">
          {children}
        </div>
      </div>
    </Link>
  );
}

function CardMetricaDocumentoEstado({ titulo, valor, path, emoji, descripcion, color }: CardEstadoProps) {
  const colorConfig = {
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-600',
      hover: 'hover:border-orange-300'
    },
    lime: {
      bg: 'bg-lime-50', 
      border: 'border-lime-200',
      text: 'text-lime-600',
      hover: 'hover:border-lime-300'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-600',
      hover: 'hover:border-red-300'
    }
  };

  const config = colorConfig[color];

  return (
    <Link to={path} className="block h-full">
      <div className={`rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 h-full transition-all duration-200 ${config.bg} ${config.border} ${config.hover} hover:shadow-lg`}>
        <div className="flex items-center justify-between">
          <div className={`text-3xl sm:text-4xl mr-3 sm:mr-4`}>{emoji}</div>
          <div className="text-right min-w-0 flex-1">
            <p className="text-sm text-gray-600 font-medium truncate">{titulo}</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{valor}</p>
            <p className={`text-xs mt-1 ${config.text} truncate`}>{descripcion}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CursoResumen({ curso }: { curso: CursoDashboard }) {
  const porcentajeCurso = curso.totalDocsRequeridos > 0
    ? Math.round((curso.totalDocsEntregados / curso.totalDocsRequeridos) * 100)
    : 0;

  return (
    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 h-full">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="min-w-0 flex-1 mr-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate mb-1">
            {curso.nombre}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 truncate">{curso.nivel}</p>
        </div>
        <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
          {curso.totalEstudiantes} est.
        </span>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-gray-600">Requeridos:</span>
          <span className="font-semibold text-gray-900">{curso.totalDocsRequeridos}</span>
        </div>
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-gray-600">Entregados:</span>
          <span className="font-semibold text-green-600">{curso.totalDocsEntregados}</span>
        </div>
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-gray-600">Tasa de entrega:</span>
          <span className="font-semibold text-purple-600">{porcentajeCurso}%</span>
        </div>
      </div>

      <div className="mt-3 sm:mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progreso</span>
          <span>{porcentajeCurso}%</span>
        </div>
        <ProgressBar valor={porcentajeCurso} />
      </div>
    </div>
  );
}

function MetricasEficiencia({ porcentajeEntrega, pendientes }: { porcentajeEntrega: number; pendientes: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-indigo-100 text-xs sm:text-sm font-medium">Eficiencia del Sistema</p>
            <p className="text-xl sm:text-2xl font-bold mt-1">{porcentajeEntrega}%</p>
            <p className="text-indigo-200 text-xs sm:text-sm mt-2 truncate">
              {porcentajeEntrega >= 80 ? 'Excelente rendimiento' :
               porcentajeEntrega >= 60 ? 'Buen progreso' : 'Necesita mejora'}
            </p>
          </div>
          <div className="text-3xl sm:text-4xl ml-3">🎯</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-green-100 text-xs sm:text-sm font-medium">Documentos Pendientes</p>
            <p className="text-xl sm:text-2xl font-bold mt-1">{pendientes}</p>
            <p className="text-green-200 text-xs sm:text-sm mt-2 truncate">
              Por entregar del total requerido
            </p>
          </div>
          <div className="text-3xl sm:text-4xl ml-3">⏳</div>
        </div>
      </div>
    </div>
  );
}

function EmptyStateCursos() {
  return (
    <div className="text-center py-8 sm:py-12">
      <div className="text-gray-400 text-5xl sm:text-6xl mb-3 sm:mb-4">🎓</div>
      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
        No hay cursos con documentos asignados
      </h3>
      <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base">
        Los cursos aparecerán aquí una vez que se asignen documentos requeridos.
      </p>
    </div>
  );
}

// ----------------------------------------------------------------
// 3. Componente Principal
// ----------------------------------------------------------------

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
  const documentosPendientes = totalDocsRequeridos - totalDocsEntregados;

  // Estados de carga y error
  if (loading) return <LoadingScreen message="Cargando Datos del Dashboard" />;
  
  if (error) return (
    <div className="flex items-center justify-center min-h-96 p-6">
      <div className="text-center">
        <div className="text-red-500 text-5xl sm:text-6xl mb-4">❌</div>
        <p className="text-lg sm:text-xl font-semibold text-red-600 mb-2">Error al cargar datos</p>
        <p className="text-gray-600 text-sm sm:text-base">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">        
        <p className="text-gray-600 text-sm sm:text-base">
          Resumen general de estudiantes y documentos del sistema
        </p>
      </div>


      {/* Gestión de Documentos */}
      <section className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          Gestión de Documentos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <CardMetricaDocumentoEstado
            titulo="Por Confirmar"
            valor={totalPorConfirmar}
            path="/documentos-por-confirmar"
            emoji="🔔"
            descripcion="Requiere tu revisión"
            color="orange"
          />

          <CardMetricaDocumentoEstado
            titulo="Documentos Aprobados"
            valor={totalAprobados}
            path="/documentos-aprobados"
            emoji="👍"
            descripcion="Documentación verificada"
            color="lime"
          />

          <CardMetricaDocumentoEstado
            titulo="Por Vencer / Vencidos"
            valor={totalPorVencer}
            path="/documentos-por-vencer"
            emoji="⚠️"
            descripcion="Atención inmediata requerida"
            color="red"
          />
        </div>
      </section>

      {/* Tarjetas de métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
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

      {/* Métricas de eficiencia */}
      <div className="mb-6 sm:mb-8">
        <MetricasEficiencia 
          porcentajeEntrega={porcentajeEntrega}
          pendientes={documentosPendientes}
        />
      </div>


      {/* Resumen por cursos */}
      <section>
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Resumen por Curso</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Distribución de estudiantes y documentos por curso
            </p>
          </div>

          <div className="p-4 sm:p-6">
            {cursos.length === 0 ? (
              <EmptyStateCursos />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {cursos.map(curso => (
                  <CursoResumen key={curso.id} curso={curso} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}