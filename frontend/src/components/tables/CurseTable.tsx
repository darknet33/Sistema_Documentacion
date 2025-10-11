import { type CurseTableProps } from '../../types/curse';

export function CurseTable({ curser, onEdit, onToggle, onDelete, onPanel }: CurseTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Nivel</th>
            <th className="px-4 py-2 text-center">Activo</th>
            <th className="px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {curser.map(curse => (
            <tr
              key={curse.id}
              className="border-t border-gray-200 hover:bg-gray-50 transition"
            >
              {/* Nombre */}
              <td className="px-4 py-2 font-medium text-gray-800">
                {curse.nombre}
              </td>

              {/* Nivel */}
              <td className="px-4 py-2 font-medium text-gray-800">
                {curse.nivel}
              </td>

              {/* Toggle de activación */}
              <td className="px-4 py-2 text-center">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={curse.activo}
                    onChange={() => onToggle(curse)}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300 transition-all"></div>
                  <div className="absolute ml-1 w-4 h-4 bg-white rounded-full transform transition-transform peer-checked:translate-x-5"></div>
                </label>
              </td>

              {/* Acciones */}
              <td className="px-4 py-2 flex justify-center space-x-2">
                <button
                  onClick={() => onEdit(curse)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(curse)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Eliminar
                </button>

                <button
                 onClick={() => onPanel(curse)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                >
                  Doc. Requeridos
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
