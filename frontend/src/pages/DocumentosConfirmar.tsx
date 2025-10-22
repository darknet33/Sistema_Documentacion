import { useState, useMemo } from "react";
import { LoadingScreen } from "../components";
import { PageLayout } from "../layout/PageLayout";
import { API_BASE_URL } from "../config/api";
import { useDocumentoEstudianteAll } from "../hooks/useDocumentoEstudianteAdmin";

export default function DocumentosConfirmar() {
  const {
    documentosPorConfirmar,
    aprobarDocumento,
    rechazarDocumento,
    loading,
    error,
  } = useDocumentoEstudianteAll();

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

  // --- Filtrado por código y curso ---
  const documentosFiltrados = useMemo(() => {
    return documentosPorConfirmar.filter((doc) => {
      const codigoMatch = busquedaCodigo
        ? doc.estudiante?.cedula_identidad?.includes(busquedaCodigo)
        : true;

      const cursoMatch = cursoSeleccionado
        ? `${doc.estudiante?.curso?.nombre}-${doc.estudiante?.curso?.nivel}` === cursoSeleccionado
        : true;

      return codigoMatch && cursoMatch;
    });
  }, [documentosPorConfirmar, busquedaCodigo, cursoSeleccionado]);

  // --- Lista de cursos disponibles para chips ---
  const cursosDisponibles = useMemo(() => {
    const cursosSet = new Set<string>();
    documentosPorConfirmar.forEach((doc) => {
      if (doc.estudiante?.curso) {
        cursosSet.add(`${doc.estudiante.curso.nombre}-${doc.estudiante.curso.nivel}`);
      }
    });
    return Array.from(cursosSet);
  }, [documentosPorConfirmar]);

  return (
    <PageLayout title="Documentos Enviados por Confirmar">
      <main className="p-4 flex flex-col gap-4">
        {loading && <LoadingScreen />}
        {error && <p className="text-red-500">{error}</p>}

        {/* --- Filtros --- */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por código de estudiante..."
            value={busquedaCodigo}
            onChange={(e) => setBusquedaCodigo(e.target.value)}
            className="border rounded p-2 w-full md:w-64"
          />
          <div className="flex flex-wrap gap-2">
            {cursosDisponibles.map((curso) => (
              <button
                key={curso}
                onClick={() => setCursoSeleccionado(curso === cursoSeleccionado ? null : curso)}
                className={`px-3 py-1 rounded-full border ${curso === cursoSeleccionado
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                  }`}
              >
                {curso}
              </button>
            ))}
          </div>
        </div>

        {!loading && documentosFiltrados.length === 0 && (
          <p className="text-gray-500">No hay documentos pendientes de confirmar.</p>
        )}

        {documentosFiltrados.map((doc) => (
          <div
            key={doc.id}
            className="border border-gray-300 rounded-lg shadow-sm p-4 flex flex-col gap-3 bg-white"
          >
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <p><strong>Documento:</strong> {doc.catalogo_documento?.nombre}</p>
                <p><strong>Estudiante:</strong> {doc.estudiante?.nombres} {doc.estudiante?.apellidos}</p>
                <p><strong>Código:</strong> {doc.estudiante?.cedula_identidad}</p>
                <p><strong>Curso:</strong> {doc.estudiante?.curso?.nombre} ({doc.estudiante?.curso?.nivel}) </p>
                <p><strong>Entregado:</strong> {doc.entregado ? "Sí" : "No"}</p>
                <p><strong>Fecha de Envío:</strong> {doc.fecha_entrega}</p>
                <p><strong>Observaciones:</strong> {doc.observaciones}</p>
              </div>
              {doc.archivo_digital && (
                <a
                  href={`${API_BASE_URL}${doc.archivo_digital}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Ver documento
                </a>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedDoc(doc.id);
                  setShowAprobarModal(true);
                }}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Aprobar
              </button>
              <button
                onClick={() => {
                  setSelectedDoc(doc.id);
                  setShowRechazarModal(true);
                }}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Rechazar
              </button>
            </div>
          </div>
        ))}


        {/* --- MODAL APROBAR --- */}
        {showAprobarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-lg font-semibold mb-3">Aprobar documento</h2>

              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={usarFecha}
                  onChange={(e) => setUsarFecha(e.target.checked)}
                />
                <span>Asignar fecha de vencimiento</span>
              </label>

              {usarFecha && (
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium">
                    Fecha de vencimiento:
                  </label>
                  <input
                    type="date"
                    value={fechaVencimiento}
                    onChange={(e) => setFechaVencimiento(e.target.value)}
                    className="border rounded w-full p-2"
                    required
                  />
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAprobarModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAprobar}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL RECHAZAR --- */}
        {showRechazarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-lg font-semibold mb-3">Rechazar documento</h2>

              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">
                  Observación (obligatoria):
                </label>
                <textarea
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  className="border rounded w-full p-2"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRechazarModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRechazar}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </PageLayout>
  );
}

