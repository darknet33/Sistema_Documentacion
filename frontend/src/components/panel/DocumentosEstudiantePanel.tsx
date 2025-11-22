import { useState, useMemo } from "react";
import type { EstudianteOut } from "../../types/estudiante";
import { useDocumentosEstudiante } from "../../hooks/useDocumentoEstudiantePadres";
import { DocumentosEstudianteTable } from "../tables/DocumentosEstudianteTable";
import { EntregaDocumentoForm } from "../forms/EntregaDocumentoForm";
import { LoadingScreen } from "../ui/LoadingScreen";
import { useNotification } from "../../context/NotificationContext";

interface Props {
  estudiante: EstudianteOut;
}

// ----------------------------------------------------------------
// Componentes Auxiliares
// ----------------------------------------------------------------

// Header del Estudiante
function EstudianteHeader({ 
  estudiante, 
  porcentajeCompletado 
}: { 
  estudiante: EstudianteOut;
  porcentajeCompletado: number;
}) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4 sm:p-6 mb-6 text-white shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-400 bg-opacity-25 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold shadow-md flex-shrink-0">
            {estudiante.nombres.charAt(0)}{estudiante.apellidos.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2 truncate">
              {estudiante.nombres} {estudiante.apellidos}
            </h1>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <span className="bg-indigo-400 bg-opacity-25 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium text-white backdrop-blur-sm truncate">
                🎓 {estudiante.curso?.nombre} ({estudiante.curso?.nivel})
              </span>
              <span className="bg-indigo-400 bg-opacity-25 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium text-white backdrop-blur-sm">
                📋 CI: {estudiante.cedula_identidad}
              </span>
            </div>
          </div>
        </div>

        {/* Indicador de progreso */}
        <div className="bg-indigo-500 bg-opacity-25 rounded-xl p-3 sm:p-4 min-w-[120px] sm:min-w-[140px] backdrop-blur-sm border border-white border-opacity-30">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-white">{porcentajeCompletado}%</div>
            <div className="text-xs sm:text-sm text-blue-100 mb-2">Completado</div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
              <div
                className="bg-emerald-300 h-2 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${porcentajeCompletado}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tarjeta de Estadística
function StatCard({ 
  icon, 
  label, 
  value, 
  color = "gray" 
}: { 
  icon: string; 
  label: string; 
  value: number;
  color?: "gray" | "emerald" | "amber";
}) {
  const colorClasses = {
    gray: { icon: "text-gray-600", bg: "bg-gray-50" },
    emerald: { icon: "text-emerald-600", bg: "bg-emerald-50" },
    amber: { icon: "text-amber-600", bg: "bg-amber-50" }
  };

  const { icon: iconColor, bg } = colorClasses[color];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center">
        <div className={`text-2xl mr-3 sm:mr-4 ${bg} p-2 sm:p-3 rounded-xl ${iconColor}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-gray-600 font-medium truncate">{label}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Sección de Estadísticas
function EstadisticasSection({ 
  total, 
  entregados, 
  pendientes 
}: { 
  total: number;
  entregados: number;
  pendientes: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <StatCard icon="📚" label="Total Documentos" value={total} color="gray" />
      <StatCard icon="✅" label="Entregados" value={entregados} color="emerald" />
      <StatCard icon="⏳" label="Pendientes" value={pendientes} color="amber" />
    </div>
  );
}

// Header de Documentos
function DocumentosHeader({ 
  estudiante, 
  showBackButton, 
  onBack 
}: { 
  estudiante: EstudianteOut;
  showBackButton: boolean;
  onBack: () => void;
}) {
  return (
    <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Documentos Requeridos</h2>
          <p className="text-sm text-gray-600 mt-1 truncate">
            Gestiona la entrega de documentos para {estudiante.nombres}
          </p>
        </div>

        {showBackButton && (
          <button
            onClick={onBack}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 bg-white"
          >
            ← Volver a la lista
          </button>
        )}
      </div>
    </div>
  );
}

// Estado Vacío
function EmptyState() {
  return (
    <div className="text-center py-8 sm:py-12 bg-white rounded-2xl shadow-sm border border-gray-100 mt-6">
      <div className="text-gray-300 text-5xl sm:text-6xl mb-4">📋</div>
      <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">
        No hay documentos requeridos
      </h3>
      <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base">
        No se han asignado documentos requeridos para este curso en este momento.
      </p>
    </div>
  );
}

// ----------------------------------------------------------------
// Componente Principal
// ----------------------------------------------------------------

export function DocumentosEstudiantePanel({ estudiante }: Props) {
  const {
    documentosRequeridosPorEstudiante,
    createDocumentoEstudiante,
    deleteDocumentoEstudiante,
    forwardDocumentoEstudiante,
    loading,
  } = useDocumentosEstudiante(estudiante.id, estudiante.curso_id);

  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
  const [docEstudiante, setDocEstudiante] = useState<number | null>(null);
  const { setNotification } = useNotification();

  // Memoizar cálculos de estadísticas
  const { documentosEntregados, documentosPendientes, porcentajeCompletado } = useMemo(() => {
    const entregados = documentosRequeridosPorEstudiante.filter(doc => doc.entregado);
    const pendientes = documentosRequeridosPorEstudiante.filter(doc => !doc.entregado);
    const porcentaje = documentosRequeridosPorEstudiante.length > 0
      ? Math.round((entregados.length / documentosRequeridosPorEstudiante.length) * 100)
      : 0;

    return { documentosEntregados: entregados, documentosPendientes: pendientes, porcentajeCompletado: porcentaje };
  }, [documentosRequeridosPorEstudiante]);

  // Manejo de estados de formulario
  const isFormActive = selectedDoc !== null || docEstudiante !== null;

  const handleEntregar = (docId: number) => setSelectedDoc(docId);
  const handleReenviar = (id: number) => setDocEstudiante(id);
  
  const handleCancelEntrega = () => {
    setSelectedDoc(null);
    setDocEstudiante(null);
  };

  // Manejo de envíos
  const handleSubmitEntrega = async (formData: FormData) => {
    try {
      await createDocumentoEstudiante(formData);
      setSelectedDoc(null);
      setNotification({ 
        message: "Documento enviado correctamente", 
        type: "success" 
      });
    } catch (error) {
      console.error("Error al enviar documento:", error);
      setNotification({ 
        message: "Fallo al enviar. Intente más tarde", 
        type: "error" 
      });
    }
  };

  const handleSubmitReenviar = async (id: number, archivo: File) => {
    try {
      await forwardDocumentoEstudiante(id, archivo);
      setDocEstudiante(null);
      setNotification({ 
        message: "Documento reenviado correctamente", 
        type: "success" 
      });
    } catch (error) {
      console.error("Error al reenviar documento:", error);
      setNotification({ 
        message: "Fallo al reenviar. Intente más tarde", 
        type: "error" 
      });
    }
  };

  const handleDeleteEntrega = async (id: number) => {
    try {
      await deleteDocumentoEstudiante(id);
      setNotification({
        message: "Documento eliminado correctamente",
        type: "success"
      });
    } catch (error) {
      console.error("Error al eliminar documento:", error);
      setNotification({
        message: "Error al eliminar documento",
        type: "error"
      });
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4">
      {/* Header del estudiante */}
      <EstudianteHeader 
        estudiante={estudiante}
        porcentajeCompletado={porcentajeCompletado}
      />

      {/* Estadísticas */}
      <EstadisticasSection 
        total={documentosRequeridosPorEstudiante.length}
        entregados={documentosEntregados.length}
        pendientes={documentosPendientes.length}
      />

      {/* Sección principal de documentos */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <DocumentosHeader 
          estudiante={estudiante}
          showBackButton={isFormActive}
          onBack={handleCancelEntrega}
        />

        <div className="p-4 sm:p-6">
          {isFormActive ? (
            <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-blue-600">📄</span>
                {docEstudiante ? "Reenviar Documento" : "Entregar Documento"}
              </h3>
              <EntregaDocumentoForm
                docEstudianteId={docEstudiante}
                estudianteId={estudiante.id}
                catalogoDocumentoId={selectedDoc !== null ? selectedDoc : 0}
                onSubmit={handleSubmitEntrega}
                onForeward={handleSubmitReenviar}
              />
            </div>
          ) : (
            <DocumentosEstudianteTable
              documentos={documentosRequeridosPorEstudiante}
              onEntregar={handleEntregar}
              onDelete={handleDeleteEntrega}
              onReenviar={handleReenviar}
            />
          )}
        </div>
      </div>

      {/* Estado vacío */}
      {documentosRequeridosPorEstudiante.length === 0 && !isFormActive && (
        <EmptyState />
      )}
    </div>
  );
}