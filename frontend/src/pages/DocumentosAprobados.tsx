import { useState, useMemo } from "react";
import { LoadingScreen } from "../components";
import { PageLayout } from "../layout/PageLayout";
import { API_BASE_URL } from "../config/api";
import { useDocumentoEstudiante } from "../context/DocumentoEstudianteContext";
import { Search, Filter, FileText, Eye, User, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import type { DocumentoEstudianteOut } from "../types/docEstudiante";

interface GrupoEstudiante {
  estudiante: {
    id: number;
    nombres: string;
    apellidos: string;
    cedula_identidad: string;
    curso?: { nombre: string; nivel: string };
  };
  documentos: DocumentoEstudianteOut[];
}

export default function DocumentosAprobados() {
  const {
    documentosFiltrados,
    loading,
    error,
  } = useDocumentoEstudiante();

  // Estados para UI
  const [expandedEstudiantes, setExpandedEstudiantes] = useState<Set<number>>(new Set());
  const [busquedaCodigo, setBusquedaCodigo] = useState("");
  const [cursoSeleccionado, setCursoSeleccionado] = useState<string | null>(null);

  // Agrupar documentos por estudiante
  const documentosPorEstudiante = useMemo(() => {
    const agrupados: { [key: number]: GrupoEstudiante } = {};
    
    documentosFiltrados.documentosAprobados?.forEach((doc) => {
      if (doc.estudiante?.id) {
        const estudianteId = doc.estudiante.id;
        
        if (!agrupados[estudianteId]) {
          agrupados[estudianteId] = {
            estudiante: {
              id: estudianteId,
              nombres: doc.estudiante.nombres || '',
              apellidos: doc.estudiante.apellidos || '',
              cedula_identidad: doc.estudiante.cedula_identidad || '',
              curso: doc.estudiante.curso
            },
            documentos: []
          };
        }
        agrupados[estudianteId].documentos.push(doc);
      }
    });
    
    return Object.values(agrupados);
  }, [documentosFiltrados.documentosAprobados]);

  // Filtrar estudiantes
  const estudiantesFiltrados = useMemo(() => {
    return documentosPorEstudiante.filter(grupo => {
      const matchCodigo = grupo.estudiante.cedula_identidad?.toLowerCase().includes(busquedaCodigo.toLowerCase());
      const matchCurso = !cursoSeleccionado || 
        `${grupo.estudiante.curso?.nombre}-${grupo.estudiante.curso?.nivel}` === cursoSeleccionado;
      
      return matchCodigo && matchCurso;
    });
  }, [documentosPorEstudiante, busquedaCodigo, cursoSeleccionado]);

  // --- Lista de cursos disponibles para chips ---
  const cursosDisponibles = useMemo(() => {
    const cursosSet = new Set<string>();
    documentosFiltrados.documentosAprobados?.forEach((doc) => {
      if (doc.estudiante?.curso) {
        cursosSet.add(`${doc.estudiante.curso.nombre}-${doc.estudiante.curso.nivel}`);
      }
    });
    return Array.from(cursosSet);
  }, [documentosFiltrados.documentosAprobados]);

  // Toggle expandir/contraer estudiante
  const toggleEstudiante = (estudianteId: number) => {
    const nuevosExpandidos = new Set(expandedEstudiantes);
    if (nuevosExpandidos.has(estudianteId)) {
      nuevosExpandidos.delete(estudianteId);
    } else {
      nuevosExpandidos.add(estudianteId);
    }
    setExpandedEstudiantes(nuevosExpandidos);
  };

  // Expandir/contraer todos
  const toggleTodos = () => {
    if (expandedEstudiantes.size === estudiantesFiltrados.length) {
      setExpandedEstudiantes(new Set());
    } else {
      const todosIds = new Set(estudiantesFiltrados.map(grupo => grupo.estudiante.id));
      setExpandedEstudiantes(todosIds);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <PageLayout title="Documentos Aprobados">
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

        {/* Contador y controles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">
              {estudiantesFiltrados.length} estudiante(s) con documentos aprobados
            </p>
            {estudiantesFiltrados.length > 0 && (
              <button
                onClick={toggleTodos}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {expandedEstudiantes.size === estudiantesFiltrados.length ? 'Contraer todos' : 'Expandir todos'}
              </button>
            )}
          </div>
          
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

        {/* Lista de estudiantes con documentos */}
        {estudiantesFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No hay documentos aprobados</p>
            <p className="text-gray-400 text-sm mt-1">
              {busquedaCodigo || cursoSeleccionado 
                ? "Intenta con otros filtros" 
                : "Los documentos aprobados aparecerán aquí"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {estudiantesFiltrados.map((grupo) => (
              <div
                key={grupo.estudiante.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Header del estudiante */}
                <div 
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => toggleEstudiante(grupo.estudiante.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {grupo.estudiante.nombres} {grupo.estudiante.apellidos}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                          <span><strong>Cédula:</strong> {grupo.estudiante.cedula_identidad}</span>
                          <span><strong>Curso:</strong> {grupo.estudiante.curso?.nombre} ({grupo.estudiante.curso?.nivel})</span>
                          <span><strong>Documentos:</strong> {grupo.documentos.length} aprobado(s)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {expandedEstudiantes.has(grupo.estudiante.id) ? 'Ocultar' : 'Mostrar'} documentos
                      </span>
                      {expandedEstudiantes.has(grupo.estudiante.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Lista de documentos (expandible) */}
                {expandedEstudiantes.has(grupo.estudiante.id) && grupo.documentos.length > 0 && (
                  <div className="border-t border-gray-200">
                    <div className="p-4 space-y-3">
                      {grupo.documentos.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                              <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900">
                                {doc.catalogo_documento?.nombre || 'Documento sin nombre'}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-gray-600 mt-1">
                                <div>
                                  <span className="font-medium">Aprobado:</span> {doc.fecha_entrega || 'Fecha no disponible'}
                                </div>
                                {doc.fecha_vencimiento && (
                                  <div>
                                    <span className="font-medium">Vence:</span> {doc.fecha_vencimiento}
                                  </div>
                                )}
                                {doc.observaciones && (
                                  <div className="md:col-span-2">
                                    <span className="font-medium">Observaciones:</span> {doc.observaciones}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Acción: Ver documento */}
                          {doc.archivo_digital && (
                            <a
                              href={`${API_BASE_URL}${doc.archivo_digital}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex-shrink-0"
                            >
                              <Eye className="h-4 w-4" />
                              Ver documento
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}