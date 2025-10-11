// src/components/DocumentTable.tsx
import { type DocumentTableProps } from '../../types/document';

export function DocumentTable({
  documentos,
  onEdit,
  onToggleObligatorio,
  onToggleActivo,
  onDelete,
}: DocumentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Descripción</th>
            <th className="px-4 py-2 text-center">Obligatorio</th>
            <th className="px-4 py-2 text-center">Activo</th>
            <th className="px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {documentos.map(doc => (
            <tr
              key={doc.id}
              className="border-t border-gray-200 hover:bg-gray-50 transition"
            >
              <td className="px-4 py-2 font-medium text-gray-800">{doc.nombre}</td>
              <td className="px-4 py-2 text-gray-700">{doc.descripcion || '-'}</td>

              {/* Obligatorio */}
              <td className="px-4 py-2 text-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={doc.es_obligatorio}
                    onChange={() => onToggleObligatorio(doc)}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-orange-500 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></div>
                </label>
              </td>

              {/* Activo */}
              <td className="px-4 py-2 text-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={doc.activo}
                    onChange={() => onToggleActivo(doc)}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></div>
                </label>
              </td>

              <td className="px-4 py-2 flex justify-center space-x-2">
                <button
                  onClick={() => onEdit(doc)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(doc)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
