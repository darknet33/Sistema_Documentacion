import { useState, useMemo } from "react";
import { LoadingScreen, Modal } from "../components";
import { PageLayout } from "../layout/PageLayout";
import { API_BASE_URL } from "../config/api";
import { useDocumentoEstudiante } from "../context/DocumentoEstudianteContext";
import { Search, Filter, FileText, CheckCircle, XCircle, Eye, Calendar } from "lucide-react";

export default function DocumentosConfirmar() {
  const {
    documentosFiltrados,
    aprobarDocumento,
    rechazarDocumento,
    loading,
    error,
  } = useDocumentoEstudiante();

  // Estados para modales
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
  const [showAprobarModal, setShowAprobarModal] = useState(false);
  const [showRechazarModal, setShowRechazarModal] = useState(false);

  // Datos de los formularios
  const [usarFecha, setUsarFecha] = useState(false);
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [observacion, setObservacion] = useState("");

  // Filtros
  const [busquedaCodigo, setBusquedaCodigo] = useState("");
  const [cursoSeleccionado, setCursoSeleccionado] = useState<string | null>(null);

  // Reset modal form
  const resetForm = () => {
    setSelectedDoc(null);
    setUsarFecha(false);
    setFechaVencimiento("");
    setObservacion("");
  };

  const handleAprobar = async () => {
    if (usarFecha && !fechaVencimiento) {
      alert("Por favor, selecciona una fecha de vencimiento.");
      return;
    }
    try {
      await aprobarDocumento(selectedDoc!, usarFecha ? fechaVencimiento : undefined);
      setShowAprobarModal(false);
      resetForm();
    } catch {
      alert("Error al aprobar documento");
    }
  };

  const handleRechazar = async () => {
    if (!observacion.trim()) {
      alert("Por favor, ingresa una observación.");
      return;
    }
    try {
      await rechazarDocumento(selectedDoc!, observacion);
      setShowRechazarModal(false);
      resetForm();
    } catch {
      alert("Error al rechazar documento");
    }
  };

  // --- Lista de cursos disponibles para chips ---
  const cursosDisponibles = useMemo(() => {
    const cursosSet = new Set<string>();
    documentosFiltrados.documentosPorConfirmar.forEach((doc) => {
      if (doc.estudiante?.curso) {
        cursosSet.add(`${doc.estudiante.curso.nombre}-${doc.estudiante.curso.nivel}`);
      }
    });
    return Array.from(cursosSet);
  }, [documentosFiltrados]);

  // Filtrar documentos
  const documentosFiltradosLista = useMemo(() => {
    return documentosFiltrados.documentosPorConfirmar.filter(doc => {
      const matchCodigo = doc.estudiante?.cedula_identidad?.toLowerCase().includes(busquedaCodigo.toLowerCase());
      const matchCurso = !cursoSeleccionado || 
        `${doc.estudiante?.curso?.nombre}-${doc.estudiante?.curso?.nivel}` === cursoSeleccionado;
      
      return matchCodigo && matchCurso;
    });
  }, [documentosFiltrados.documentosPorConfirmar, busquedaCodigo, cursoSeleccionado]);

  if (loading) return <LoadingScreen />;

  return (
    <PageLayout title="Documentos por Confirmar">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* --- Filtros --- */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Búsqueda */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cédula de estudiante..."
                value={busquedaCodigo}
                onChange={(e) => setBusquedaCodigo(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            {/* Filtros de curso */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="h-4 w-4" />
                <span>Filtrar por curso:</span>
              </div>
              {cursosDisponibles.map((curso) => (
                <button
                  key={curso}
                  onClick={() => setCursoSeleccionado(curso === cursoSeleccionado ? null : curso)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    curso === cursoSeleccionado
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {curso}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {documentosFiltradosLista.length} documento(s) por confirmar
          </p>
          {(busquedaCodigo || cursoSeleccionado) && (
            <button
              onClick={() => {
                setBusquedaCodigo("");
                setCursoSeleccionado(null);
              }}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Lista de documentos */}
        {documentosFiltradosLista.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No hay documentos por confirmar</p>
            <p className="text-gray-400 text-sm mt-1">
              {busquedaCodigo || cursoSeleccionado 
                ? "Intenta con otros filtros" 
                : "Los documentos aparecerán aquí cuando los estudiantes los envíen"
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {documentosFiltradosLista.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Información del documento */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {doc.catalogo_documento?.nombre}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="space-y-1">
                            <p className="text-gray-600">
                              <span className="font-medium">Estudiante:</span> {doc.estudiante?.nombres} {doc.estudiante?.apellidos}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Cédula:</span> {doc.estudiante?.cedula_identidad}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-600">
                              <span className="font-medium">Curso:</span> {doc.estudiante?.curso?.nombre} ({doc.estudiante?.curso?.nivel})
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Enviado:</span> {doc.fecha_entrega}
                            </p>
                          </div>
                        </div>

                        {doc.observaciones && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Observaciones:</span> {doc.observaciones}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:items-end">
                    {doc.archivo_digital && (
                      <a
                        href={`${API_BASE_URL}${doc.archivo_digital}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        Ver documento
                      </a>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedDoc(doc.id);
                          setShowAprobarModal(true);
                        }}
                        className="flex-1 inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Aprobar
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDoc(doc.id);
                          setShowRechazarModal(true);
                        }}
                        className="flex-1 inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        <XCircle className="h-4 w-4" />
                        Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- MODAL APROBAR --- */}
        {showAprobarModal && (
          <Modal onClose={()=>{setShowAprobarModal(false)}}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-5 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Aprobar Documento</h2>
                    <p className="text-sm text-gray-600">Confirma la aprobación de este documento</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={usarFecha}
                      onChange={(e) => setUsarFecha(e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Asignar fecha de vencimiento</span>
                      <p className="text-sm text-gray-500">Opcional - El documento vencerá en la fecha seleccionada</p>
                    </div>
                  </label>

                  {usarFecha && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de vencimiento
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="date"
                          value={fechaVencimiento}
                          onChange={(e) => setFechaVencimiento(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowAprobarModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAprobar}
                    className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Confirmar Aprobación
                  </button>
                </div>
              </div>
            </Modal>
        )}

        {/* --- MODAL RECHAZAR --- */}
        {showRechazarModal && (
          <Modal onClose={()=>{setShowRechazarModal(false)}}>
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-5 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Rechazar Documento</h2>
                    <p className="text-sm text-gray-600">Especifica el motivo del rechazo</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observación (requerida)
                    </label>
                    <textarea
                      value={observacion}
                      onChange={(e) => setObservacion(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                      rows={3}
                      placeholder="Describe el motivo del rechazo..."
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowRechazarModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  
                  <button
                    onClick={handleRechazar}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Confirmar Rechazo
                  </button>
                </div>
              </div>
          </Modal>
        )}
      </div>
    </PageLayout>
  );
}