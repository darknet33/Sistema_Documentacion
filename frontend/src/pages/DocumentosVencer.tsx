import { useMemo, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";
import { Search, Filter, FileText, Eye, MessageSquare } from "lucide-react";
import { LoadingScreen } from "../components";
import { useDocumentoEstudianteAll } from "../hooks/useDocumentoEstudianteAdmin";
import { PageLayout } from "../layout/PageLayout";
import { useNotification } from "../context/NotificationContext";

export default function DocumentosVencer() {
  const {
    documentosFiltrados = { documentosPorVencer: [] },
    notificarDocumentoVencido,
    loading,
    error,
  } = useDocumentoEstudianteAll();

  const { setNotification } = useNotification();

  const [docToNotify, setDocToNotify] = useState<{
    id: number;
    estado: string;
  } | null>(null);

  // Filtros
  const [busquedaCodigo, setBusquedaCodigo] = useState("");
  const [cursoSeleccionado, setCursoSeleccionado] = useState<string | null>(null);

  // 🔥 Notificación automática
  useEffect(() => {
    if (!docToNotify) return;

    const notificar = async () => {
      try {
        await notificarDocumentoVencido(
          docToNotify.id,
          docToNotify.estado
        );
        setNotification({
          message: "Se envió la notificación",
          type: "success",
        });
      } catch (error) {
        setNotification({
          message: "Ocurrió un error",
          type: "error",
        });
      } finally {
        setDocToNotify(null);
      }
    };

    notificar();
  }, [docToNotify, notificarDocumentoVencido, setNotification]);

  const handleNotificar = (docId: number, estadoVencimiento: string) => {
    if (!estadoVencimiento) return;
    setDocToNotify({ id: docId, estado: estadoVencimiento });
  };

  // Cursos disponibles
  const cursosDisponibles = useMemo(() => {
    const cursosSet = new Set<string>();

    documentosFiltrados.documentosPorVencer?.forEach((doc) => {
      if (doc.estudiante?.curso) {
        cursosSet.add(
          `${doc.estudiante.curso.nombre}-${doc.estudiante.curso.nivel}`
        );
      }
    });

    return Array.from(cursosSet);
  }, [documentosFiltrados.documentosPorVencer]);

  // Filtrar documentos
  const documentosFiltradosLista = useMemo(() => {
    return (documentosFiltrados.documentosPorVencer || []).filter((doc) => {
      const matchCodigo = doc.estudiante?.cedula_identidad
        ?.toLowerCase()
        .includes(busquedaCodigo.toLowerCase());

      const matchCurso =
        !cursoSeleccionado ||
        `${doc.estudiante?.curso?.nombre}-${doc.estudiante?.curso?.nivel}` ===
          cursoSeleccionado;

      return matchCodigo && matchCurso;
    });
  }, [
    documentosFiltrados.documentosPorVencer,
    busquedaCodigo,
    cursoSeleccionado,
  ]);

  if (loading) return <LoadingScreen />;

  return (
    <PageLayout title="Documentos Por Vencer">
      <div className="space-y-6">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Filtros */}
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

            {/* Cursos */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="h-4 w-4" />
                <span>Filtrar por curso:</span>
              </div>

              {cursosDisponibles.map((curso) => (
                <button
                  key={curso}
                  onClick={() =>
                    setCursoSeleccionado(
                      curso === cursoSeleccionado ? null : curso
                    )
                  }
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

        {/* Contador */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {documentosFiltradosLista.length} documento(s) por vencer
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

        {/* Lista */}
        {documentosFiltradosLista.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              No hay documentos por vencer
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {busquedaCodigo || cursoSeleccionado
                ? "Intenta con otros filtros"
                : "No hay documentos próximos a vencer o vencidos"}
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
                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {doc.catalogo_documento?.nombre}
                        </h3>

                        <p className="text-sm">
                          {doc.estudiante?.nombres}{" "}
                          {doc.estudiante?.apellidos}
                        </p>
                        <p className="text-sm text-gray-600">
                          CI: {doc.estudiante?.cedula_identidad}
                        </p>

                        <p className="text-sm text-gray-600">
                          Curso: {doc.estudiante?.curso?.nombre} (
                          {doc.estudiante?.curso?.nivel})
                        </p>

                        <p className="text-sm text-gray-600">
                          Estado: {doc.estadoVencimiento}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2">
                    {doc.archivo_digital && (
                      <a
                        href={`${API_BASE_URL}${doc.archivo_digital}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                    )}

                    <button
                      onClick={() =>
                        handleNotificar(doc.id, doc.estadoVencimiento || "")
                      }
                      disabled={!doc.estadoVencimiento}
                      className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-yellow-300"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}