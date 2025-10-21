import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePadreEstudiante } from "../../hooks/usePadeEstudiante";
import { DocumentosEstudiantePanel } from "../panel/DocumentosEstudiantePanel";
import { Modal } from "../modal/Modal";
import { LoadingScreen } from "./LoadingScreen";

export function DashboardPadreFamilia() {
  const { user } = useAuth();

  const {
    relaciones: relacionesIniciales,
    reload,
    loading,
    deleteRelacion,
  } = usePadreEstudiante(user?.perfil?.id);

  const [relaciones, setRelaciones] = useState(relacionesIniciales);
  const [loadingCancel, setLoadingCancel] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<'todas' | 'pendientes' | 'aceptadas' | 'rechazadas'>('todas');

  useEffect(() => {
    reload();
  }, [user]);

  useEffect(() => {
    setRelaciones(relacionesIniciales);
  }, [relacionesIniciales]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("es-BO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleCancelarSolicitud = async (relId: number) => {
    try {
      setLoadingCancel(relId);
      await deleteRelacion(relId);
      setRelaciones((prev) => prev.filter((rel) => rel.id !== relId));
    } catch (err) {
      console.error("Error al cancelar solicitud:", err);
    } finally {
      setLoadingCancel(null);
    }
  };

  // Clasificación de relaciones
  const solicitadas = relaciones.filter(
    (rel) => !rel.estado && rel.observacion === "Solicitado"
  );
  const aceptadas = relaciones.filter((rel) => rel.estado);
  const rechazadas = relaciones.filter(
    (rel) => !rel.estado && rel.observacion !== "Solicitado"
  );

  // Relaciones filtradas según selección
  const relacionesFiltradas = {
    todas: relaciones,
    pendientes: solicitadas,
    aceptadas: aceptadas,
    rechazadas: rechazadas,
  }[activeFilter];

  const getEstadoChip = (rel: any) => {
    if (rel.estado) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
          ✅ Aceptado
        </span>
      );
    }
    
    if (rel.observacion === "Solicitado") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          ⏳ Pendiente
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
        ❌ Rechazado
      </span>
    );
  };

  const getParentescoChip = (parentesco: string) => (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
      👨‍👦 {parentesco}
    </span>
  );

  const RelCard = ({ rel }: { rel: any }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header con información principal */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {rel.estudiante.nombres.charAt(0)}{rel.estudiante.apellidos.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {rel.estudiante.nombres} {rel.estudiante.apellidos}
              </h2>
              <p className="text-sm text-gray-500">Código: {rel.estudiante.codigo_estudiante}</p>
            </div>
          </div>
        </div>
        {getEstadoChip(rel)}
      </div>

      {/* Información del estudiante */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Curso:</span>
          <span className="text-sm font-medium text-gray-900">
            {rel.estudiante.curso?.nombre} ({rel.estudiante.curso?.nivel})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Parentesco:</span>
          {getParentescoChip(rel.parentesco)}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Solicitud:</span>
          <span className="text-sm text-gray-500">{formatDate(rel.fecha_creacion)}</span>
        </div>

        {rel.fecha_actualizacion && formatDate(rel.fecha_actualizacion) !== formatDate(rel.fecha_creacion) && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Actualización:</span>
            <span className="text-sm text-gray-500">{formatDate(rel.fecha_actualizacion)}</span>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        {!rel.estado && rel.observacion === "Solicitado" && (
          <button
            onClick={() => handleCancelarSolicitud(rel.id)}
            disabled={loadingCancel === rel.id}
            className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors duration-200 border border-red-200 text-sm font-medium"
          >
            {loadingCancel === rel.id ? "Cancelando..." : "Cancelar solicitud"}
          </button>
        )}

        {rel.estado && (
          <button
            onClick={() => {
              setSelectedEstudiante(rel.estudiante);
              setShowModal(true);
            }}
            className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200 text-sm font-medium flex items-center justify-center gap-2"
          >
            <span>📄</span>
            Ver documentos
          </button>
        )}
      </div>
    </div>
  );

  const FilterChip = ({ type, label, count, active }: { type: any, label: string, count: number, active: boolean }) => (
    <button
      onClick={() => setActiveFilter(type)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
        active
          ? type === 'aceptadas' 
            ? 'bg-green-100 text-green-800 border-green-300 shadow-sm'
            : type === 'pendientes'
            ? 'bg-yellow-100 text-yellow-800 border-yellow-300 shadow-sm'
            : type === 'rechazadas'
            ? 'bg-red-100 text-red-800 border-red-300 shadow-sm'
            : 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm'
          : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
      }`}
    >
      {label} <span className="ml-1 bg-white bg-opacity-50 px-1.5 py-0.5 rounded-full text-xs">{count}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-2">
            <p className="text-gray-600">
              Administra las solicitudes de vinculación con estudiantes
            </p>
          </div>

          {/* Filtros con chips */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              <FilterChip 
                type="todas" 
                label="Todas" 
                count={relaciones.length} 
                active={activeFilter === 'todas'} 
              />
              <FilterChip 
                type="pendientes" 
                label="Pendientes" 
                count={solicitadas.length} 
                active={activeFilter === 'pendientes'} 
              />
              <FilterChip 
                type="aceptadas" 
                label="Aceptados" 
                count={aceptadas.length} 
                active={activeFilter === 'aceptadas'} 
              />
              <FilterChip 
                type="rechazadas" 
                label="Rechazados" 
                count={rechazadas.length} 
                active={activeFilter === 'rechazadas'} 
              />
            </div>
          </div>

          {/* Contenido principal */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {relacionesFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay solicitudes {activeFilter !== 'todas' && ` ${activeFilter}`}
                </h3>
                <p className="text-gray-500">
                  {activeFilter === 'todas' 
                    ? "No tienes ninguna solicitud de vinculación."
                    : `No tienes solicitudes ${activeFilter} en este momento.`
                  }
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {activeFilter === 'todas' ? 'Todas las solicitudes' :
                     activeFilter === 'pendientes' ? 'Solicitudes pendientes' :
                     activeFilter === 'aceptadas' ? 'Estudiantes aceptados' : 'Solicitudes rechazadas'}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {relacionesFiltradas.length} {relacionesFiltradas.length === 1 ? 'resultado' : 'resultados'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relacionesFiltradas.map((rel) => (
                    <RelCard key={rel.id} rel={rel} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Resumen rápido */}
          {activeFilter === 'todas' && relaciones.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-yellow-600 text-2xl mr-3">⏳</div>
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">Pendientes</p>
                    <p className="text-2xl font-bold text-yellow-900">{solicitadas.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-green-600 text-2xl mr-3">✅</div>
                  <div>
                    <p className="text-sm text-green-800 font-medium">Aceptados</p>
                    <p className="text-2xl font-bold text-green-900">{aceptadas.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-red-600 text-2xl mr-3">❌</div>
                  <div>
                    <p className="text-sm text-red-800 font-medium">Rechazados</p>
                    <p className="text-2xl font-bold text-red-900">{rechazadas.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal con Documentos del Estudiante */}
      {showModal && selectedEstudiante && (
        <Modal 
          onClose={() => setShowModal(false)} 
          title={`Documentos de ${selectedEstudiante.nombres} ${selectedEstudiante.apellidos}`}
        >
          <DocumentosEstudiantePanel estudiante={selectedEstudiante} />
        </Modal>
      )}
    </div>
  );
}