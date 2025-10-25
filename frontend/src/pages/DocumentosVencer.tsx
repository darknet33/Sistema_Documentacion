import { useMemo, useState } from "react";
import { Search, Filter, FileText, MessageSquare } from "lucide-react";
import { LoadingScreen } from "../components"
import { useDocumentoEstudianteAll } from "../hooks/useDocumentoEstudianteAdmin"
import { PageLayout } from "../layout/PageLayout"
import { useNotification } from "../context/NotificationContext";
import { VerDocumentoDocumentoModal } from "../components";


export default function DocumentosVencer() {


  const { documentosFiltrados, notificarDocumentoVencido, loading, error } = useDocumentoEstudianteAll()
  const { setNotification } = useNotification()

  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);

  // Filtros
  const [busquedaCodigo, setBusquedaCodigo] = useState("");
  const [cursoSeleccionado, setCursoSeleccionado] = useState<string | null>(null);

  // Reset modal form
  const resetForm = () => {
    setSelectedDoc(null);
  };

  const handleNotificar = async (observacion: string) => {
    try {
      if (selectedDoc) await notificarDocumentoVencido(selectedDoc, observacion)
      resetForm();
      setNotification({message:"se envio la notificacion",type:"success"})
  } catch (error) {
      setNotification({message:"Ocurrio un error",type:"error"})
    }

  }


  // --- Lista de cursos disponibles para chips ---
  const cursosDisponibles = useMemo(() => {
    const cursosSet = new Set<string>();
    documentosFiltrados.documentosPorVencer.forEach((doc) => {
      if (doc.estudiante?.curso) {
        cursosSet.add(`${doc.estudiante.curso.nombre}-${doc.estudiante.curso.nivel}`);
      }
    });
    return Array.from(cursosSet);
  }, [documentosFiltrados]);

  // Filtrar documentos
  const documentosFiltradosLista = useMemo(() => {
    return documentosFiltrados.documentosPorVencer.filter(doc => {
      const matchCodigo = doc.estudiante?.cedula_identidad?.toLowerCase().includes(busquedaCodigo.toLowerCase());
      const matchCurso = !cursoSeleccionado ||
        `${doc.estudiante?.curso?.nombre}-${doc.estudiante?.curso?.nivel}` === cursoSeleccionado;

      return matchCodigo && matchCurso;
    });
  }, [documentosFiltrados.documentosPorVencer, busquedaCodigo, cursoSeleccionado]);


  { loading && (<LoadingScreen />) }
  return (
    <PageLayout title="Documentos Por Vencidos">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}
      </div>


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
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${curso === cursoSeleccionado
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
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Observaciones:</span> {doc.observaciones}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Estado:</span> {doc.estadoVencimiento} el {doc.fecha_vencimiento}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:items-end">
                  {doc.archivo_digital && 
                    <VerDocumentoDocumentoModal archivo={doc.archivo_digital} />
                  }
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedDoc(doc.id);
                        if (doc.estadoVencimiento) handleNotificar(doc.estadoVencimiento);
                      }}
                      className="flex-1 inline-flex items-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Notificar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  )
}