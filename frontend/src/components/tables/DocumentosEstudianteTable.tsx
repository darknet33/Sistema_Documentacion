import type { DocumentoCombinado } from "../../types/docEstudiante";
import { API_BASE_URL } from "../../config/api";

interface Props {
  documentos: DocumentoCombinado[];
  onEntregar: (docId: number) => void;
  onDelete: (docId: number) => void;
  onReenviar: (id: number) => void;
}

function tdBoolean(value: boolean) {
  return (
    <td className="p-2 border-b text-center">
      {value === true || value ? (
        <span className="text-green-600 font-semibold">Sí</span>
      ) : (
        <span className="text-red-600 font-semibold">No</span>
      )}
    </td>
  );
}

export function DocumentosEstudianteTable({ documentos, onEntregar, onDelete, onReenviar }: Props) {
  return (
    <>
      {/* Tabla para pantallas grandes */}
      <table className="min-w-full border border-gray-300 rounded-lg shadow-sm hidden lg:table">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border-b text-left">Documento</th>
            <th className="p-2 border-b text-left">Descripción</th>
            <th className="p-2 border-b text-center">Obligatorio</th>
            <th className="p-2 border-b text-center text-red-400">Fecha límite</th>
            <th className="p-2 border-b text-center">Verificado</th>
            <th className="p-2 border-b text-center text-indigo-600">Fecha de entrega</th>
            <th className="p-2 border-b text-center">Fecha de vencimiento</th>
            <th className="p-2 border-b text-center">Observaciones</th>
            <th className="p-2 border-b text-center">Vencido?</th>
            <th className="p-2 border-b text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          {documentos.map((doc) => (
            <tr key={doc.id} className="hover:bg-gray-50">
              <td className="p-2 border-b">{doc.catalogo_documento.nombre}</td>
              <td className="p-2 border-b">{doc.catalogo_documento.descripcion || "-"}</td>
              {tdBoolean(doc.catalogo_documento.es_obligatorio)}
              <td className="p-2 border-b text-center">{doc.fecha_limite ? new Date(doc.fecha_limite).toLocaleDateString() : "-"}</td>
              {tdBoolean(doc.entregado)}
              <td className="p-2 border-b text-center">{doc.documento?.fecha_entrega ? new Date(doc.documento.fecha_entrega).toLocaleDateString() : "-"}</td>
              <td className="p-2 border-b text-center">{doc.documento?.fecha_vencimiento ? new Date(doc.documento.fecha_vencimiento).toLocaleDateString() : "-"}</td>
              <td className="p-2 border-b text-center">{doc.documento?.observaciones || "-"}</td>
              <td className="p-2 border-b text-center">{doc.documento?.estadoVencimiento || "-"}</td>
              <td className="p-2 border-b text-center">
                <div className="flex justify-center gap-2 flex-wrap">
                  {/* 1. Verificar si existe un archivo digital (doc.documento?.archivo_digital tiene contenido) */}
                  {doc.documento?.archivo_digital ? (
                    // RAMA 1: Sí hay archivo entregado
                    <div className="flex flex-col gap-2">
                      <a
                        href={`${API_BASE_URL}${doc.documento.archivo_digital}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-center" // Mejor estética
                      >
                        Ver Documento
                      </a>

                      {/* 2. Botón Borrar: Usamos `doc.documento.id` ya que la existencia de `archivo_digital`
          implica la existencia del `documento` y su `id`. */}
                      <button
                        onClick={() => onDelete(doc.documento!.id)} // Usamos ! para afirmar la existencia si el ternario pasa
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Borrar Entrega
                      </button>
                    </div>
                  ) : (
                    // RAMA 2: No hay archivo entregado (el archivo_digital es "", null, o undefined)
                    // Mostramos Entregar o Reenviar, basado en si hay una observación de rechazo.

                    // Si la OBSERVACIÓN está VACÍA, asumimos que nunca se ha entregado o fue borrado.
                    doc.documento?.observaciones === "" || !doc.documento ? (
                      <button
                        onClick={() => onEntregar(doc.catalogo_documento_id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Entregar
                      </button>
                    ) : (
                      // Si hay OBSERVACIÓN (ej: "Rechazado"), mostramos Reenviar.
                      <button
                        onClick={() => doc.documento?.id && onReenviar(doc.documento.id)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Reenviar
                      </button>
                    )
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cards para pantallas pequeñas */}
      <div className="flex flex-col gap-4 lg:hidden">
        {documentos.map((doc) => (
          <div key={doc.id} className="border border-gray-300 rounded-lg shadow p-4 bg-white flex flex-col gap-2">
            <div><strong>Nombre:</strong> {doc.catalogo_documento.nombre}</div>
            <div><strong>Descripción:</strong> {doc.catalogo_documento.descripcion || "-"}</div>
            <div><strong>Obligatorio:</strong> {doc.catalogo_documento.es_obligatorio ? "Sí" : "No"}</div>
            <div><strong>Fecha límite:</strong> {doc.fecha_limite ? new Date(doc.fecha_limite).toLocaleDateString() : "-"}</div>
            <div><strong>Entregado:</strong> {doc.entregado ? "Sí" : "No"}</div>
            <div><strong>Fecha entrega:</strong> {doc.documento?.fecha_entrega ? new Date(doc.documento.fecha_entrega).toLocaleDateString() : "-"}</div>
            <div><strong>Fecha vencimiento:</strong> {doc.documento?.fecha_vencimiento ? new Date(doc.documento.fecha_vencimiento).toLocaleDateString() : "-"}</div>
            <div><strong>Observaciones:</strong> {doc.documento?.observaciones || "-"}</div>

            <div className="flex flex-wrap gap-2 mt-2">
              {doc.documento?.archivo_digital && (
                <a href={`${API_BASE_URL}${doc.documento.archivo_digital}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ver documento</a>
              )}
              {doc.entregado ? (
                doc.documento?.observaciones !== "Recepcionado y Verificado" ? (
                  <button onClick={() => doc.documento?.id && onDelete(doc.documento.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Borrar entrega</button>
                ) : (
                  <button onClick={() => doc.documento?.id && onReenviar(doc.documento.id)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Reenviar</button>
                )
              ) : (
                <button onClick={() => onEntregar(doc.catalogo_documento_id)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Entregar</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
