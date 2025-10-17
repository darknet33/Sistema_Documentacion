import type { DocumentoCombinado } from "../../types/docEstudiante";

interface Props {
  documentos: DocumentoCombinado[];
  onEntregar: (docId: number) => void;
}

export function DocumentosEstudianteTable({ documentos, onEntregar }: Props) {
  return (
    <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border-b text-left">Nombre</th>
          <th className="p-2 border-b text-left">Descripción</th>
          <th className="p-2 border-b text-center">Obligatorio</th>
          <th className="p-2 border-b text-center">Fecha límite</th>
          <th className="p-2 border-b text-center">Entregado</th>
          <th className="p-2 border-b text-center">Fecha de entrega</th>
          <th className="p-2 border-b text-center">Acción</th>
        </tr>
      </thead>
      <tbody>
        {documentos.map((doc) => (
          <tr key={doc.id} className="hover:bg-gray-50">
            <td className="p-2 border-b">{doc.catalogo_documento.nombre}</td>
            <td className="p-2 border-b">{doc.catalogo_documento.descripcion || "-"}</td>
            <td className="p-2 border-b text-center">
              {doc.catalogo_documento.es_obligatorio ? "Sí" : "No"}
            </td>
            <td className="p-2 border-b text-center">
              {doc.fecha_limite ? new Date(doc.fecha_limite).toLocaleDateString() : "-"}
            </td>
            <td className="p-2 border-b text-center">
              {doc.entregado ? (
                <span className="text-green-600 font-medium">Sí</span>
              ) : (
                <span className="text-red-600 font-medium">No</span>
              )}
            </td>
            <td className="p-2 border-b text-center">
              {doc.documento?.fecha_entrega ? new Date(doc.documento?.fecha_entrega).toLocaleDateString() : "-"}
            </td>
            <td className="p-2 border-b text-center">
              {doc.entregado && doc.documento?.url_documento ? (
                <a
                  href={doc.documento?.url_documento || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Ver documento
                </a>
              ) : (
                <button
                  onClick={() => onEntregar(doc.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Entregar
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
