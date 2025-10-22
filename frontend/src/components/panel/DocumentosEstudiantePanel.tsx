import { useState } from "react";
import type { EstudianteOut } from "../../types/estudiante";
import { useDocumentosEstudiante } from "../../hooks/useDocumentoEstudiantePadres";
import { DocumentosEstudianteTable } from "../tables/DocumentosEstudianteTable";
import { EntregaDocumentoForm } from "../forms/EntregaDocumentoForm";
import { LoadingScreen } from "../ui/LoadingScreen";
import { useNotification } from "../../context/NotificationContext";

interface Props {
  estudiante: EstudianteOut;
}

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

  const handleEntregar = (docId: number) => setSelectedDoc(docId);
  const handleReenviar = (id: number) => setDocEstudiante(id);
  const handleCancelEntrega = () => { setSelectedDoc(null); setDocEstudiante(null) };
  const { setNotification } = useNotification()

  const handleSubmitEntrega = async (formData: FormData) => {
    try {
      await createDocumentoEstudiante(formData);
      setSelectedDoc(null);
      setNotification({ message: "Documento enviado Correctamente", type: "success" })
    } catch (error) {
      console.log(error)
      setNotification({ message: "Fallo al Enviar intente mas tarde", type: "error" })

    }
  };

  const handleSubmitReenviar = async (id: number, archivo: File) => {
    try {
      await forwardDocumentoEstudiante(id, archivo)
      setDocEstudiante(null);
      setNotification({ message: "Documento reenviado correctamente", type: "success" })
    } catch (error) {
      console.log(error)
      setNotification({ message: "Fallo al reenviar intente mas tarde", type: "error" })
    }
  };

  const handleDeleteEntrega = async (id: number) => {
    await deleteDocumentoEstudiante(id);
    setSelectedDoc(null);
  };

  // Estadísticas de documentos
  const documentosEntregados = documentosRequeridosPorEstudiante.filter(doc => doc.entregado);
  const documentosPendientes = documentosRequeridosPorEstudiante.filter(doc => !doc.entregado);
  const porcentajeCompletado = documentosRequeridosPorEstudiante.length > 0
    ? Math.round((documentosEntregados.length / documentosRequeridosPorEstudiante.length) * 100)
    : 0;

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header del estudiante - Versión corregida */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="w-16 h-16 bg-indigo-400 bg-opacity-25 rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
              {estudiante.nombres.charAt(0)}{estudiante.apellidos.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {estudiante.nombres} {estudiante.apellidos}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-indigo-400 bg-opacity-25 px-3 py-1.5 rounded-lg text-sm font-medium text-white backdrop-blur-sm">
                  🎓 {estudiante.curso?.nombre} ({estudiante.curso?.nivel})
                </span>
                <span className="bg-indigo-400 bg-opacity-25 px-3 py-1.5 rounded-lg text-sm font-medium text-white backdrop-blur-sm">
                  📋 CI: {estudiante.cedula_identidad}
                </span>
              </div>
            </div>
          </div>

          {/* Indicador de progreso - Versión corregida */}
          <div className="bg-indigo-500 bg-opacity-25 rounded-xl p-4 min-w-[140px] backdrop-blur-sm border border-white border-opacity-30">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{porcentajeCompletado}%</div>
              <div className="text-sm text-blue-100 mb-2">Completado</div>
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

      {/* Tarjetas de estadísticas - Versión corregida */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center">
            <div className="text-gray-600 text-2xl mr-4 bg-gray-50 p-3 rounded-xl">📚</div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Documentos</p>
              <p className="text-2xl font-bold text-gray-800">{documentosRequeridosPorEstudiante.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center">
            <div className="text-emerald-600 text-2xl mr-4 bg-emerald-50 p-3 rounded-xl">✅</div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Entregados</p>
              <p className="text-2xl font-bold text-gray-800">{documentosEntregados.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center">
            <div className="text-amber-600 text-2xl mr-4 bg-amber-50 p-3 rounded-xl">⏳</div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Pendientes</p>
              <p className="text-2xl font-bold text-gray-800">{documentosPendientes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección principal de documentos */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Documentos Requeridos</h2>
              <p className="text-sm text-gray-600 mt-1">
                Gestiona la entrega de documentos para {estudiante.nombres}
              </p>
            </div>

            {selectedDoc || docEstudiante && (
              <button
                onClick={handleCancelEntrega}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 bg-white"
              >
                ← Volver a la lista
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {selectedDoc || docEstudiante ? (
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-blue-600">📄</span>
                Entregar Documento
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

      {/* Información adicional */}
      {documentosRequeridosPorEstudiante.length === 0 && !selectedDoc && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-md border border-gray-100 mt-6">
          <div className="text-gray-300 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No hay documentos requeridos
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            No se han asignado documentos requeridos para este curso en este momento.
          </p>
        </div>
      )}
    </div>
  );
}